/* 前后端共享的类型写在这里 */

export const REQUIREMENT_STATUSES = [
  'backlog',
  'todo',
  'in_progress',
  'review',
  'done',
] as const;

export type RequirementStatus = (typeof REQUIREMENT_STATUSES)[number];

export const PRIORITIES = ['P0', 'P1', 'P2', 'P3'] as const;

export type Priority = (typeof PRIORITIES)[number];

export const REQUIREMENT_TYPES = [
  'feature',
  'improvement',
  'bug',
  'tech',
] as const;

export type RequirementType = (typeof REQUIREMENT_TYPES)[number];

export const isRequirementStatus = (v: string): v is RequirementStatus =>
  (REQUIREMENT_STATUSES as readonly string[]).includes(v);

export const isPriority = (v: string): v is Priority =>
  (PRIORITIES as readonly string[]).includes(v);

export const isRequirementType = (v: string): v is RequirementType =>
  (REQUIREMENT_TYPES as readonly string[]).includes(v);

export const BITABLE_SYNC_STATUSES = [
  'synced',
  'pending',
  'failed',
] as const;

export type BitableSyncStatus = (typeof BITABLE_SYNC_STATUSES)[number];

export interface RequirementRecord {
  id: string;
  title: string;
  description: string;
  project: string;
  type: RequirementType;
  priority: Priority;
  status: RequirementStatus;
  owner: string;
  tags: string[];
  dueDate: string | null;
  createdAt: number;
  updatedAt: number;
  bitableRecordId: string | null;
  bitableSyncStatus: BitableSyncStatus;
  bitableSyncError: string | null;
}

export interface RequirementInputBody {
  title: string;
  description: string;
  project: string;
  type: RequirementType;
  priority: Priority;
  status: RequirementStatus;
  owner: string;
  tags: string[];
  dueDate: string | null;
}

export type CreateRequirementRequest = RequirementInputBody;

export type UpdateRequirementRequest = Partial<RequirementInputBody>;

export interface UpdateRequirementStatusRequest {
  status: RequirementStatus;
}

export interface RequirementListQuery {
  keyword?: string;
  project?: string;
  type?: string;
  priority?: string;
  status?: string;
  owner?: string;
}

export interface RequirementListResponse {
  items: RequirementRecord[];
  total: number;
}

export interface BitableSyncInfo {
  configured: boolean;
  total: number;
  synced: number;
  pending: number;
  failed: number;
}

export interface SeedResponse {
  inserted: number;
}
