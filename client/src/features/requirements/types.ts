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

export interface Requirement {
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
}

export interface RequirementInput {
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

export interface RequirementFilters {
  keyword: string;
  project: string | 'all';
  type: RequirementType | 'all';
  priority: Priority | 'all';
  status: RequirementStatus | 'all';
  owner: string | 'all';
}
