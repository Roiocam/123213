import {
  PRIORITIES,
  REQUIREMENT_STATUSES,
  REQUIREMENT_TYPES,
  type Priority,
  type RequirementInputBody,
  type RequirementRecord,
  type RequirementStatus,
  type RequirementType,
} from '@shared/api.interface';

export {
  PRIORITIES,
  REQUIREMENT_STATUSES,
  REQUIREMENT_TYPES,
  type Priority,
  type RequirementStatus,
  type RequirementType,
};

export type Requirement = RequirementRecord;

export type RequirementInput = RequirementInputBody;

export interface RequirementFilters {
  keyword: string;
  project: string | 'all';
  type: RequirementType | 'all';
  priority: Priority | 'all';
  status: RequirementStatus | 'all';
  owner: string | 'all';
}
