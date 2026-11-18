import dayjs from 'dayjs';

import type {
  Priority,
  Requirement,
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

const now = Date.now();
const day = (offset: number): string =>
  dayjs(now).add(offset, 'day').format('YYYY-MM-DD');
const ts = (offsetDays: number): number =>
  dayjs(now).subtract(offsetDays, 'day').valueOf();

interface SeedSeed {
  title: string;
  description: string;
  project: string;
  type: RequirementType;
  priority: Priority;
  status: RequirementStatus;
  owner: string;
  tags: string[];
  dueOffset: number | null;
  createdOffset: number;
}

const SEED: SeedSeed[] = [
  {
    title: '客户列表支持按行业和地区组合筛选',
    description: '在客户列表顶部增加行业、地区两个筛选维度，支持多选并与关键词搜索叠加，便于销售快速定位目标客户。',
    project: '客户管理平台',
    type: 'feature',
    priority: 'P1',
    status: 'in_progress',
    owner: '林晓',
    tags: ['前端', '体验'],
    dueOffset: 5,
    createdOffset: 12,
  },
  {
    title: '修复客户详情页头像加载偶发失败',
    description: '部分客户头像在弱网环境下出现裂图，需要补充加载失败兜底与重试。',
    project: '客户管理平台',
    type: 'bug',
    priority: 'P0',
    status: 'in_progress',
    owner: '陈默',
    tags: ['前端', '性能'],
    dueOffset: -2,
    createdOffset: 8,
  },
  {
    title: '移动端审批消息推送接入',
    description: 'App 端接入审批结果推送，点击通知可直接跳转到对应审批详情。',
    project: '移动端 App',
    type: 'feature',
    priority: 'P0',
    status: 'review',
    owner: '周岚',
    tags: ['后端', '安全'],
    dueOffset: 2,
    createdOffset: 20,
  },
  {
    title: '数据中台指标口径统一文档',
    description: '梳理核心经营指标的计算口径，沉淀为统一的数据字典，避免各团队统计结果不一致。',
    project: '数据中台',
    type: 'tech',
    priority: 'P2',
    status: 'todo',
    owner: '赵一帆',
    tags: ['数据', '文档'],
    dueOffset: 14,
    createdOffset: 6,
  },
  {
    title: '营销活动页打开速度优化',
    description: '活动落地页首屏加载超过 3 秒，需做资源懒加载与图片压缩，目标首屏 1.5 秒内。',
    project: '营销自动化',
    type: 'improvement',
    priority: 'P1',
    status: 'todo',
    owner: '孙可',
    tags: ['性能', '前端'],
    dueOffset: 9,
    createdOffset: 4,
  },
  {
    title: '客户标签体系一期建设',
    description: '支持手动与规则两种打标方式，为后续精细化运营提供人群圈选能力。',
    project: '客户管理平台',
    type: 'feature',
    priority: 'P2',
    status: 'backlog',
    owner: '吴迪',
    tags: ['数据', '后端'],
    dueOffset: 21,
    createdOffset: 3,
  },
  {
    title: 'App 首页信息流改版灰度方案',
    description: '新版信息流先对 10% 用户灰度，埋点对比点击率与停留时长后再全量。',
    project: '移动端 App',
    type: 'improvement',
    priority: 'P2',
    status: 'backlog',
    owner: '林晓',
    tags: ['前端', '数据'],
    dueOffset: null,
    createdOffset: 2,
  },
  {
    title: '导出报表金额合计与明细不一致',
    description: '导出的客户成交报表中，合计金额与逐行明细求和存在误差，定位为四舍五入时机问题。',
    project: '数据中台',
    type: 'bug',
    priority: 'P1',
    status: 'review',
    owner: '陈默',
    tags: ['数据', '后端'],
    dueOffset: -1,
    createdOffset: 10,
  },
  {
    title: '营销触达频控规则引擎',
    description: '同一用户在设定周期内的触达次数上限可配置，避免过度打扰。',
    project: '营销自动化',
    type: 'feature',
    priority: 'P1',
    status: 'in_progress',
    owner: '周岚',
    tags: ['后端', '安全'],
    dueOffset: 7,
    createdOffset: 15,
  },
  {
    title: '登录态续期机制重构',
    description: '将静默续期逻辑从客户端迁移到网关统一处理，降低各端重复实现成本。',
    project: '客户管理平台',
    type: 'tech',
    priority: 'P3',
    status: 'done',
    owner: '赵一帆',
    tags: ['后端', '安全'],
    dueOffset: -6,
    createdOffset: 30,
  },
  {
    title: '客户搜索支持拼音与别名',
    description: '搜索框支持客户名称拼音首字母及历史别名检索，提升查找命中率。',
    project: '客户管理平台',
    type: 'improvement',
    priority: 'P3',
    status: 'done',
    owner: '孙可',
    tags: ['前端', '体验'],
    dueOffset: -4,
    createdOffset: 25,
  },
  {
    title: '数据看板大屏适配与暗色主题',
    description: '为办公区投屏提供 16:9 大屏布局和暗色主题，关键指标实时刷新。',
    project: '数据中台',
    type: 'feature',
    priority: 'P2',
    status: 'todo',
    owner: '吴迪',
    tags: ['前端', '数据'],
    dueOffset: 18,
    createdOffset: 5,
  },
];

export const buildSeedRequirements = (): Requirement[] =>
  SEED.map((item, index) => {
    const createdAt = ts(item.createdOffset);
    return {
      id: `seed-${index + 1}`,
      title: item.title,
      description: item.description,
      project: item.project,
      type: item.type,
      priority: item.priority,
      status: item.status,
      owner: item.owner,
      tags: item.tags,
      dueDate: item.dueOffset === null ? null : day(item.dueOffset),
      createdAt,
      updatedAt: createdAt,
    };
  });
