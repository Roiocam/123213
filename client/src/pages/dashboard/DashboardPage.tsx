import { useCallback, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { Activity, AlarmClock, Eye, ListTodo, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import StatCard from '@/features/requirements/components/StatCard';
import {
  CHART_COLORS,
  PRIORITIES,
  PRIORITY_CHART_COLOR,
  PRIORITY_LABELS,
  PROJECTS,
  REQUIREMENT_STATUSES,
  REQUIREMENT_TYPES,
  STATUS_CHART_COLOR,
  STATUS_LABELS,
  TYPE_LABELS,
} from '@/features/requirements/constants';
import { useRequirements } from '@/features/requirements/requirement-store';
import type {
  Priority,
  Requirement,
  RequirementStatus,
  RequirementType,
} from '@/features/requirements/types';
import { isOverdue } from '@/features/requirements/utils';

interface DashboardStats {
  total: number;
  inProgress: number;
  review: number;
  overdue: number;
  statusCounts: Record<RequirementStatus, number>;
  priorityCounts: Record<Priority, number>;
  projectCounts: Record<string, number>;
  typeCounts: Record<RequirementType, number>;
}

const buildStats = (requirements: Requirement[]): DashboardStats => {
  const statusCounts: Record<RequirementStatus, number> = {
    backlog: 0,
    todo: 0,
    in_progress: 0,
    review: 0,
    done: 0,
  };
  const priorityCounts: Record<Priority, number> = {
    P0: 0,
    P1: 0,
    P2: 0,
    P3: 0,
  };
  const typeCounts: Record<RequirementType, number> = {
    feature: 0,
    improvement: 0,
    bug: 0,
    tech: 0,
  };
  const projectCounts: Record<string, number> = PROJECTS.reduce<
    Record<string, number>
  >((acc: Record<string, number>, project: string) => {
    acc[project] = 0;
    return acc;
  }, {});
  let overdue = 0;

  requirements.forEach((item: Requirement) => {
    statusCounts[item.status] += 1;
    priorityCounts[item.priority] += 1;
    typeCounts[item.type] += 1;
    projectCounts[item.project] = (projectCounts[item.project] ?? 0) + 1;
    if (isOverdue(item)) overdue += 1;
  });

  return {
    total: requirements.length,
    inProgress: statusCounts.in_progress,
    review: statusCounts.review,
    overdue,
    statusCounts,
    priorityCounts,
    projectCounts,
    typeCounts,
  };
};

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((index: number) => (
        <div
          key={index}
          className="rounded-lg border border-border bg-card p-4 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {[0, 1].map((index: number) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const DashboardPage = () => {
  const { requirements, loading, resetDemo } = useRequirements();

  const stats = useMemo<DashboardStats>(() => buildStats(requirements), [
    requirements,
  ]);

  const statusOption = useMemo<EChartsOption>(() => ({
    color: REQUIREMENT_STATUSES.map(
      (status: RequirementStatus) => STATUS_CHART_COLOR[status],
    ),
    tooltip: { trigger: 'item' },
    legend: { type: 'scroll', bottom: 0 },
    series: [
      {
        type: 'pie',
        name: '需求状态',
        radius: ['45%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: false } },
        data: REQUIREMENT_STATUSES.map((status: RequirementStatus) => ({
          name: STATUS_LABELS[status],
          value: stats.statusCounts[status],
        })),
      },
    ],
  }), [stats.statusCounts]);

  const priorityOption = useMemo<EChartsOption>(() => ({
    tooltip: { trigger: 'axis' },
    legend: { type: 'scroll', bottom: 0 },
    grid: {
      left: '3%',
      right: '4%',
      top: '12%',
      bottom: '20%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: PRIORITIES.map((priority: Priority) => PRIORITY_LABELS[priority]),
      axisLabel: { interval: 0 },
    },
    yAxis: { type: 'value', minInterval: 1 },
    series: [
      {
        name: '需求数量',
        type: 'bar',
        barMaxWidth: 48,
        label: { show: true, position: 'top' },
        data: PRIORITIES.map((priority: Priority) => ({
          value: stats.priorityCounts[priority],
          itemStyle: { color: PRIORITY_CHART_COLOR[priority] },
        })),
      },
    ],
  }), [stats.priorityCounts]);

  const projectOption = useMemo<EChartsOption>(() => ({
    tooltip: { trigger: 'axis' },
    legend: { type: 'scroll', bottom: 0 },
    grid: {
      left: '3%',
      right: '8%',
      top: '8%',
      bottom: '20%',
      containLabel: true,
    },
    xAxis: { type: 'value', minInterval: 1 },
    yAxis: {
      type: 'category',
      data: [...PROJECTS],
      axisLabel: { interval: 0 },
    },
    series: [
      {
        name: '需求数量',
        type: 'bar',
        barMaxWidth: 24,
        label: { show: true, position: 'right' },
        itemStyle: { color: CHART_COLORS.primary, borderRadius: [0, 4, 4, 0] },
        data: PROJECTS.map((project: string) => stats.projectCounts[project] ?? 0),
      },
    ],
  }), [stats.projectCounts]);

  const typeOption = useMemo<EChartsOption>(() => ({
    color: [
      CHART_COLORS.primary,
      CHART_COLORS.blue,
      CHART_COLORS.amber,
      CHART_COLORS.green,
    ],
    tooltip: { trigger: 'item' },
    legend: { type: 'scroll', bottom: 0 },
    series: [
      {
        type: 'pie',
        name: '需求类型',
        radius: ['45%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: false } },
        data: REQUIREMENT_TYPES.map((type: RequirementType) => ({
          name: TYPE_LABELS[type],
          value: stats.typeCounts[type],
        })),
      },
    ],
  }), [stats.typeCounts]);

  const handleReset = useCallback(() => {
    resetDemo();
    toast.success('已恢复示例数据');
  }, [resetDemo]);

  const isEmpty = !loading && requirements.length === 0;

  return (
    <div className="rise space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">工作台</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            需求整体进度、状态与优先级分布统计
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              重置示例数据
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>重置示例数据？</AlertDialogTitle>
              <AlertDialogDescription>
                当前所有需求记录将被内置示例数据覆盖，此操作不可撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>
                确认重置
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : isEmpty ? (
        <Card className="flex flex-col items-center justify-center gap-3 border-dashed py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <ListTodo className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">暂无需求数据</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              当前没有可统计的需求记录，可点击右上角「重置示例数据」恢复示例需求
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="需求总数"
              value={stats.total}
              icon={ListTodo}
              accent={CHART_COLORS.primary}
              hint="全部需求记录"
            />
            <StatCard
              label="进行中"
              value={stats.inProgress}
              icon={Activity}
              accent={CHART_COLORS.primary}
              hint="正在推进的需求"
            />
            <StatCard
              label="评审中"
              value={stats.review}
              icon={Eye}
              accent={CHART_COLORS.amber}
              hint="等待评审确认"
            />
            <StatCard
              label="已逾期"
              value={stats.overdue}
              icon={AlarmClock}
              accent={CHART_COLORS.red}
              hint="已过截止日期且未完成"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  需求状态分布
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ReactECharts
                  option={statusOption}
                  theme="ud"
                  className="h-[300px] w-full"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  优先级分布
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ReactECharts
                  option={priorityOption}
                  theme="ud"
                  className="h-[300px] w-full"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  各项目需求数量
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ReactECharts
                  option={projectOption}
                  theme="ud"
                  className="h-[300px] w-full"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  需求类型分布
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ReactECharts
                  option={typeOption}
                  theme="ud"
                  className="h-[300px] w-full"
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
