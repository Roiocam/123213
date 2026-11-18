import {
  type RequirementInputBody,
  type RequirementRecord,
  type RequirementStatus,
  type RequirementType,
} from '@shared/api.interface';
import type { requirement } from '../../database/schema';

type RequirementRow = typeof requirement.$inferSelect;

const TYPE_LABELS: Record<RequirementType, string> = {
  feature: '新功能',
  improvement: '优化改进',
  bug: '缺陷修复',
  tech: '技术需求',
};

const BITABLE_STATUS_MAP: Record<RequirementStatus, string> = {
  backlog: '未开始',
  todo: '未开始',
  in_progress: '进行中',
  review: '进行中',
  done: '已完成',
};

export const mapRowToRecord = (row: RequirementRow): RequirementRecord => ({
  id: row.id,
  title: row.title,
  description: row.description,
  project: row.project,
  type: row.type as RequirementRecord['type'],
  priority: row.priority as RequirementRecord['priority'],
  status: row.status as RequirementRecord['status'],
  owner: row.owner,
  tags: row.tags ?? [],
  dueDate: row.dueDate,
  createdAt: row.createdAt.getTime(),
  updatedAt: row.updatedAt.getTime(),
  bitableRecordId: row.bitableRecordId,
  bitableSyncStatus: row.bitableSyncStatus as RequirementRecord['bitableSyncStatus'],
  bitableSyncError: row.bitableSyncError,
});

export const mapRowToInput = (
  row: RequirementRow,
): RequirementInputBody => ({
  title: row.title,
  description: row.description,
  project: row.project,
  type: row.type as RequirementInputBody['type'],
  priority: row.priority as RequirementInputBody['priority'],
  status: row.status as RequirementInputBody['status'],
  owner: row.owner,
  tags: row.tags ?? [],
  dueDate: row.dueDate,
});

type BitableFields = Record<string, unknown>;

export const buildBitableFields = (
  input: RequirementInputBody | Partial<RequirementInputBody>,
): BitableFields => {
  const fields: BitableFields = {};

  if (input.title !== undefined) {
    fields['项目名称'] = input.title;
  }
  if (input.status !== undefined) {
    fields['项目状态'] = BITABLE_STATUS_MAP[input.status];
  }

  const insightParts: string[] = [];
  if (input.project !== undefined) insightParts.push(`项目：${input.project}`);
  if (input.priority !== undefined)
    insightParts.push(`优先级：${input.priority}`);
  if (input.type !== undefined)
    insightParts.push(`类型：${TYPE_LABELS[input.type]}`);
  if (input.tags !== undefined)
    insightParts.push(`标签：${input.tags.length ? input.tags.join('、') : '无'}`);
  if (input.owner !== undefined) insightParts.push(`负责人：${input.owner}`);
  insightParts.push(`截止：${input.dueDate ?? '未设置'}`);
  if (input.description !== undefined) insightParts.push(`\n${input.description}`);

  if (insightParts.length > 0) {
    fields['财务洞察'] = insightParts.join('｜').replace('｜\n', '\n');
  }

  return fields;
};
