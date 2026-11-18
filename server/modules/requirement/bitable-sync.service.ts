import { Inject, Injectable, Logger } from '@nestjs/common';
import { CapabilityService } from '@lark-apaas/fullstack-nestjs-core';
import type { RequirementInputBody } from '@shared/api.interface';
import { buildBitableFields } from './requirement.mapper';

const PLUGIN_INSTANCE_ID = 'feishu_multitable_crud_analysis_1';

export interface BitableWriteResult {
  recordId: string | null;
  error: string | null;
}

interface AddRecordsOutput {
  records?: Array<{ id?: string }>;
}

@Injectable()
export class BitableSyncService {
  private readonly logger = new Logger(BitableSyncService.name);

  constructor(
    @Inject(CapabilityService)
    private readonly capabilityService: CapabilityService,
  ) {}

  async addRecord(input: RequirementInputBody): Promise<BitableWriteResult> {
    try {
      const output: unknown = await this.capabilityService
        .load(PLUGIN_INSTANCE_ID)
        .call('batchAddRecords', {
          records: [{ record: buildBitableFields(input) }],
        });
      return { recordId: this.extractRecordId(output), error: null };
    } catch (error) {
      const message = this.toMessage(error);
      this.logger.error('多维表格新增记录失败', {
        pluginInstanceId: PLUGIN_INSTANCE_ID,
        actionKey: 'batchAddRecords',
        error: message,
      });
      return { recordId: null, error: message };
    }
  }

  async updateRecord(
    recordId: string,
    patch: Partial<RequirementInputBody>,
  ): Promise<string | null> {
    try {
      await this.capabilityService
        .load(PLUGIN_INSTANCE_ID)
        .call('batchUpdateRecords', {
          records: [{ id: recordId, record: buildBitableFields(patch) }],
        });
      return null;
    } catch (error) {
      const message = this.toMessage(error);
      this.logger.error('多维表格更新记录失败', {
        pluginInstanceId: PLUGIN_INSTANCE_ID,
        actionKey: 'batchUpdateRecords',
        error: message,
      });
      return message;
    }
  }

  async deleteRecord(recordId: string): Promise<string | null> {
    try {
      await this.capabilityService
        .load(PLUGIN_INSTANCE_ID)
        .call('deleteRecords', { recordIDs: [recordId] });
      return null;
    } catch (error) {
      const message = this.toMessage(error);
      this.logger.error('多维表格删除记录失败', {
        pluginInstanceId: PLUGIN_INSTANCE_ID,
        actionKey: 'deleteRecords',
        error: message,
      });
      return message;
    }
  }

  async ping(): Promise<{ ok: boolean; message: string }> {
    try {
      await this.capabilityService
        .load(PLUGIN_INSTANCE_ID)
        .call('searchRecords', { pageSize: 1 });
      return { ok: true, message: '多维表格连接正常' };
    } catch (error) {
      return { ok: false, message: this.toMessage(error) };
    }
  }

  private extractRecordId(output: unknown): string | null {
    if (typeof output !== 'object' || output === null) return null;
    const records = (output as AddRecordsOutput).records;
    if (!Array.isArray(records) || records.length === 0) return null;
    const first = records[0];
    return typeof first?.id === 'string' ? first.id : null;
  }

  private toMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    try {
      return JSON.stringify(error);
    } catch {
      return '未知错误';
    }
  }
}
