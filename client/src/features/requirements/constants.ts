import type {
  Priority,
  RequirementStatus,
  RequirementType,
} from './types';
import {
  PRIORITIES,
  REQUIREMENT_STATUSES,
  REQUIREMENT_TYPES,
} from './types';

export const STATUS_LABELS: Record<RequirementStatus, string> = {
  backlog: '待规划',
  todo: '待处理',
  in_progress: '进行中',
  review: '评审中',
  done: '已完成',
};

export const STATUS_BADGE_CLASS: Record<RequirementStatus, string> = {
  backlog: 'bg-status-backlog-soft text-status-backlog',
  todo: 'bg-status-todo-soft text-status-todo',
  in_progress: 'bg-status-in_progress-soft text-status-in_progress',
  review: 'bg-status-review-soft text-status-review',
  done: 'bg-status-done-soft text-status-done',
};

export const STATUS_DOT_CLASS: Record<RequirementStatus, string> = {
  backlog: 'bg-status-backlog',
  todo: 'bg-status-todo',
  in_progress: 'bg-status-in_progress',
  review: 'bg-status-review',
  done: 'bg-status-done',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  P0: 'P0 紧急',
  P1: 'P1 高',
  P2: 'P2 中',
  P3: 'P3 低',
};

export const PRIORITY_BADGE_CLASS: Record<Priority, string> = {
  P0: 'bg-priority-P0-soft text-priority-P0',
  P1: 'bg-priority-P1-soft text-priority-P1',
  P2: 'bg-priority-P2-soft text-priority-P2',
  P3: 'bg-priority-P3-soft text-priority-P3',
};

export const PRIORITY_BAR_CLASS: Record<Priority, string> = {
  P0: 'bg-priority-P0',
  P1: 'bg-priority-P1',
  P2: 'bg-priority-P2',
  P3: 'bg-priority-P3',
};

export const TYPE_LABELS: Record<RequirementType, string> = {
  feature: '新功能',
  improvement: '优化改进',
  bug: '缺陷修复',
  tech: '技术需求',
};

export const PROJECTS = [
  '客户管理平台',
  '移动端 App',
  '数据中台',
  '营销自动化',
] as const;

export const TEAM_MEMBERS = [
  '林晓',
  '陈默',
  '周岚',
  '赵一帆',
  '孙可',
  '吴迪',
] as const;

export const TAG_OPTIONS = [
  '前端',
  '后端',
  '设计',
  '数据',
  '体验',
  '安全',
  '性能',
  '文档',
] as const;

export const CHART_COLORS: Record<string, string> = {
  primary: '#1a8a94',
  blue: '#3b82e8',
  amber: '#e08a12',
  green: '#29a368',
  purple: '#8b6fd6',
  red: '#d94141',
  gray: '#8a909c',
};

export const STATUS_CHART_COLOR: Record<RequirementStatus, string> = {
  backlog: '#8a909c',
  todo: '#3b82e8',
  in_progress: '#1a8a94',
  review: '#d98a12',
  done: '#29a368',
};

export const PRIORITY_CHART_COLOR: Record<Priority, string> = {
  P0: '#d94141',
  P1: '#e8781f',
  P2: '#d99612',
  P3: '#8a909c',
};

export { PRIORITIES, REQUIREMENT_STATUSES, REQUIREMENT_TYPES };
