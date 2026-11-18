import {
  DRIZZLE_DATABASE,
  type PostgresJsDatabase,
} from '@lark-apaas/fullstack-nestjs-core';
import {
  and,
  count,
  desc,
  eq,
  ilike,
  isNull,
  or,
  sql,
  type SQL,
} from 'drizzle-orm';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type {
  BitableSyncInfo,
  CreateRequirementRequest,
  RequirementInputBody,
  RequirementListQuery,
  RequirementRecord,
  UpdateRequirementRequest,
} from '@shared/api.interface';
import { requirement } from '../../database/schema';
import { BitableSyncService } from './bitable-sync.service';
import { mapRowToInput, mapRowToRecord } from './requirement.mapper';
import { buildSeedInputs } from './requirement.seed';

type RequirementInsert = typeof requirement.$inferInsert;
const LIST_LIMIT = 500;

@Injectable()
export class RequirementService {
  private readonly logger = new Logger(RequirementService.name);

  constructor(
    @Inject(DRIZZLE_DATABASE)
    private readonly db: PostgresJsDatabase,
    private readonly bitable: BitableSyncService,
  ) {}

  async list(query: RequirementListQuery): Promise<{
    items: RequirementRecord[];
    total: number;
  }> {
    const conditions: SQL[] = [];
    const keyword = query.keyword?.trim();
    if (keyword) {
      const like = `%${keyword}%`;
      conditions.push(
        or(
          ilike(requirement.title, like),
          ilike(requirement.description, like),
          ilike(requirement.project, like),
          ilike(requirement.owner, like),
          sql`${requirement.tags}::text ILIKE ${like}`,
        )!,
      );
    }
    if (query.project && query.project !== 'all') {
      conditions.push(eq(requirement.project, query.project));
    }
    if (query.type && query.type !== 'all') {
      conditions.push(eq(requirement.type, query.type));
    }
    if (query.priority && query.priority !== 'all') {
      conditions.push(eq(requirement.priority, query.priority));
    }
    if (query.status && query.status !== 'all') {
      conditions.push(eq(requirement.status, query.status));
    }
    if (query.owner && query.owner !== 'all') {
      conditions.push(eq(requirement.owner, query.owner));
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalRows] = await Promise.all([
      this.db
        .select()
        .from(requirement)
        .where(where)
        .orderBy(desc(requirement.createdAt))
        .limit(LIST_LIMIT),
      this.db.select({ value: count() }).from(requirement).where(where),
    ]);

    return {
      items: rows.map(mapRowToRecord),
      total: totalRows[0]?.value ?? 0,
    };
  }

  async create(input: CreateRequirementRequest): Promise<RequirementRecord> {
    return this.createWithBitable(input);
  }

  async update(
    id: string,
    patch: UpdateRequirementRequest,
    userId: string,
  ): Promise<RequirementRecord> {
    const existing = await this.getRowOrThrow(id);

    const values: Partial<RequirementInsert> = {
      updatedAt: new Date(),
      updatedBy: userId,
    };
    if (patch.title !== undefined) values.title = patch.title;
    if (patch.description !== undefined) values.description = patch.description;
    if (patch.project !== undefined) values.project = patch.project;
    if (patch.type !== undefined) values.type = patch.type;
    if (patch.priority !== undefined) values.priority = patch.priority;
    if (patch.status !== undefined) values.status = patch.status;
    if (patch.owner !== undefined) values.owner = patch.owner;
    if (patch.tags !== undefined) values.tags = patch.tags;
    if (patch.dueDate !== undefined) values.dueDate = patch.dueDate;

    const updated = await this.db
      .update(requirement)
      .set(values)
      .where(eq(requirement.id, id))
      .returning();
    if (updated.length === 0) {
      throw new NotFoundException('需求不存在');
    }

    await this.syncBitableAfterChange(existing, updated[0], patch);
    const refreshed = await this.getRowOrThrow(id);
    return mapRowToRecord(refreshed);
  }

  async changeStatus(
    id: string,
    status: RequirementInputBody['status'],
    userId: string,
  ): Promise<RequirementRecord> {
    return this.update(id, { status }, userId);
  }

  async remove(id: string): Promise<{ id: string }> {
    const existing = await this.getRowOrThrow(id);
    const deleted = await this.db
      .delete(requirement)
      .where(eq(requirement.id, id))
      .returning({ id: requirement.id });
    if (deleted.length === 0) {
      throw new NotFoundException('需求不存在');
    }
    if (existing.bitableRecordId) {
      const error = await this.bitable.deleteRecord(existing.bitableRecordId);
      if (error) {
        this.logger.warn(`多维表格删除失败，PG 已删除：${error}`);
      }
    }
    return { id };
  }

  async resetToSeed(): Promise<{ inserted: number }> {
    const oldRows = await this.db
      .select({ recordId: requirement.bitableRecordId })
      .from(requirement);
    for (const row of oldRows) {
      if (row.recordId) {
        await this.bitable.deleteRecord(row.recordId);
      }
    }

    await this.db.delete(requirement);

    const inputs = buildSeedInputs();
    for (const input of inputs) {
      await this.createWithBitable(input);
    }
    return { inserted: inputs.length };
  }

  async syncPending(): Promise<BitableSyncInfo> {
    const pendingRows = await this.db
      .select()
      .from(requirement)
      .where(isNull(requirement.bitableRecordId))
      .limit(LIST_LIMIT);

    for (const row of pendingRows) {
      const result = await this.bitable.addRecord(mapRowToInput(row));
      await this.db
        .update(requirement)
        .set({
          bitableRecordId: result.recordId,
          bitableSyncStatus: result.recordId ? 'synced' : 'failed',
          bitableSyncError: result.error,
          updatedAt: new Date(),
        })
        .where(eq(requirement.id, row.id));
    }
    return this.getSyncInfo();
  }

  async getSyncInfo(): Promise<BitableSyncInfo> {
    const rows = await this.db
      .select({ status: requirement.bitableSyncStatus })
      .from(requirement)
      .limit(LIST_LIMIT);

    const info: BitableSyncInfo = {
      configured: true,
      total: rows.length,
      synced: 0,
      pending: 0,
      failed: 0,
    };
    for (const row of rows) {
      if (row.status === 'synced') info.synced += 1;
      else if (row.status === 'failed') info.failed += 1;
      else info.pending += 1;
    }
    return info;
  }

  async pingBitable(): Promise<{ ok: boolean; message: string }> {
    return this.bitable.ping();
  }

  private async createWithBitable(
    input: RequirementInputBody,
  ): Promise<RequirementRecord> {
    const result = await this.bitable.addRecord(input);
    const inserted = await this.db
      .insert(requirement)
      .values({
        ...input,
        bitableRecordId: result.recordId,
        bitableSyncStatus: result.recordId ? 'synced' : 'failed',
        bitableSyncError: result.error,
      })
      .returning();
    return mapRowToRecord(inserted[0]);
  }

  private async syncBitableAfterChange(
    previous: typeof requirement.$inferSelect,
    current: typeof requirement.$inferSelect,
    patch: UpdateRequirementRequest,
  ): Promise<void> {
    if (previous.bitableRecordId) {
      const error = await this.bitable.updateRecord(
        previous.bitableRecordId,
        patch,
      );
      await this.db
        .update(requirement)
        .set({
          bitableSyncStatus: error ? 'failed' : 'synced',
          bitableSyncError: error,
          updatedAt: new Date(),
        })
        .where(eq(requirement.id, current.id));
      return;
    }

    const result = await this.bitable.addRecord(mapRowToInput(current));
    await this.db
      .update(requirement)
      .set({
        bitableRecordId: result.recordId,
        bitableSyncStatus: result.recordId ? 'synced' : 'failed',
        bitableSyncError: result.error,
        updatedAt: new Date(),
      })
      .where(eq(requirement.id, current.id));
  }

  private async getRowOrThrow(id: string) {
    const rows = await this.db
      .select()
      .from(requirement)
      .where(eq(requirement.id, id))
      .limit(1);
    if (rows.length === 0) {
      throw new NotFoundException('需求不存在');
    }
    return rows[0];
  }
}
