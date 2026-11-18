import { useCallback, useMemo, useState, type ChangeEvent } from 'react';
import { Pencil, Plus, RotateCcw, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Table, type TableColumnsType } from '@lark-apaas/client-toolkit/antd-table';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import {
  PriorityBadge,
  StatusBadge,
  TypeBadge,
} from '@/features/requirements/components/badges';
import RequirementFormDialog from '@/features/requirements/components/RequirementFormDialog';
import QueryErrorState from '@/features/requirements/components/QueryErrorState';
import {
  PRIORITIES,
  PRIORITY_LABELS,
  PROJECTS,
  REQUIREMENT_STATUSES,
  REQUIREMENT_TYPES,
  STATUS_LABELS,
  TEAM_MEMBERS,
  TYPE_LABELS,
} from '@/features/requirements/constants';
import { useRequirements } from '@/features/requirements/requirement-store';
import type {
  Requirement,
  RequirementFilters,
  RequirementStatus,
  RequirementType,
  Priority,
} from '@/features/requirements/types';
import {
  emptyFilters,
  filterRequirements,
  formatDate,
  isOverdue,
} from '@/features/requirements/utils';

const PAGE_SIZE = 10;

const matchRequirementType = (value: string): RequirementType | 'all' =>
  REQUIREMENT_TYPES.find((type) => type === value) ?? 'all';

const matchPriority = (value: string): Priority | 'all' =>
  PRIORITIES.find((priority) => priority === value) ?? 'all';

const matchStatus = (value: string): RequirementStatus | 'all' =>
  REQUIREMENT_STATUSES.find((status) => status === value) ?? 'all';

const TableSkeleton = () => (
  <div className="space-y-3" aria-hidden="true">
    {Array.from({ length: 5 }).map((_item: unknown, index: number) => (
      <div
        key={index}
        className="flex items-center gap-4 rounded-md border border-border/60 px-4 py-3"
      >
        <Skeleton className="h-4 w-44" />
        <Skeleton className="hidden h-4 w-24 sm:block" />
        <Skeleton className="hidden h-5 w-16 rounded-full sm:block" />
        <Skeleton className="hidden h-5 w-16 rounded-full md:block" />
        <Skeleton className="hidden h-5 w-16 rounded-full md:block" />
        <Skeleton className="ml-auto h-4 w-20" />
      </div>
    ))}
  </div>
);

interface FilterOption {
  value: string;
  label: string;
}

interface FilterFieldProps {
  id: string;
  label: string;
  value: string;
  allLabel: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

const FilterField = ({
  id,
  label,
  value,
  allLabel,
  options,
  onChange,
}: FilterFieldProps) => (
  <div className="flex w-full flex-col gap-1.5 sm:w-[150px]">
    <Label htmlFor={id} className="text-xs text-muted-foreground">
      {label}
    </Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} aria-label={`按${label}筛选`} className="w-full">
        <SelectValue placeholder={allLabel} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((option: FilterOption) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const RequirementListPage = () => {
  const {
    requirements,
    loading,
    error,
    refetch,
    removeRequirement,
  } = useRequirements();

  const [filters, setFilters] = useState<RequirementFilters>({ ...emptyFilters });
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Requirement | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Requirement | null>(null);

  const filtered = useMemo(
    () => filterRequirements(requirements, filters),
    [requirements, filters],
  );

  const resetFilters = useCallback((): void => {
    setFilters({ ...emptyFilters });
    setPage(1);
  }, []);

  const openCreate = useCallback((): void => {
    setEditing(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((item: Requirement): void => {
    setEditing(item);
    setFormOpen(true);
  }, []);

  const requestDelete = useCallback((item: Requirement): void => {
    setPendingDelete(item);
  }, []);

  const confirmDelete = useCallback((): void => {
    if (!pendingDelete) return;
    removeRequirement(pendingDelete.id, () => toast.success('需求已删除'));
    setPendingDelete(null);
  }, [pendingDelete, removeRequirement]);

  const handleKeywordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const { value } = event.target;
      setPage(1);
      setFilters((prev) => ({ ...prev, keyword: value }));
    },
    [],
  );

  const handleProjectChange = useCallback((value: string): void => {
    setPage(1);
    setFilters((prev) => ({ ...prev, project: value }));
  }, []);

  const handleTypeChange = useCallback((value: string): void => {
    setPage(1);
    setFilters((prev) => ({ ...prev, type: matchRequirementType(value) }));
  }, []);

  const handlePriorityChange = useCallback((value: string): void => {
    setPage(1);
    setFilters((prev) => ({ ...prev, priority: matchPriority(value) }));
  }, []);

  const handleStatusChange = useCallback((value: string): void => {
    setPage(1);
    setFilters((prev) => ({ ...prev, status: matchStatus(value) }));
  }, []);

  const handleOwnerChange = useCallback((value: string): void => {
    setPage(1);
    setFilters((prev) => ({ ...prev, owner: value }));
  }, []);

  const columns = useMemo<TableColumnsType<Requirement>>(
    () => [
      {
        title: '需求标题',
        dataIndex: 'title',
        key: 'title',
        width: 240,
        fixed: 'left',
        render: (_value: unknown, record: Requirement) => (
          <div className="min-w-0">
            <p className="line-clamp-1 text-sm font-medium text-foreground">
              {record.title}
            </p>
            {record.tags.length > 0 && (
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                {record.tags
                  .slice(0, 2)
                  .map((tag: string) => `#${tag}`)
                  .join(' ')}
              </p>
            )}
          </div>
        ),
      },
      {
        title: '所属项目',
        dataIndex: 'project',
        key: 'project',
        width: 140,
        render: (value: string) => (
          <span className="text-sm text-muted-foreground">{value}</span>
        ),
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 100,
        render: (value: RequirementType) => <TypeBadge type={value} />,
      },
      {
        title: '优先级',
        dataIndex: 'priority',
        key: 'priority',
        width: 110,
        render: (value: Priority) => <PriorityBadge priority={value} />,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 110,
        render: (value: RequirementStatus) => <StatusBadge status={value} />,
      },
      {
        title: '负责人',
        dataIndex: 'owner',
        key: 'owner',
        width: 100,
        render: (value: string) => (
          <span className="text-sm text-foreground">{value}</span>
        ),
      },
      {
        title: '截止日期',
        dataIndex: 'dueDate',
        key: 'dueDate',
        width: 130,
        render: (_value: unknown, record: Requirement) => {
          const overdue = isOverdue(record);
          return (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span
                className={cn(
                  'tnum text-xs',
                  overdue
                    ? 'font-semibold text-overdue'
                    : 'text-muted-foreground',
                )}
              >
                {formatDate(record.dueDate)}
              </span>
              {overdue && (
                <span className="text-[11px] font-medium text-overdue">
                  逾期
                </span>
              )}
            </span>
          );
        },
      },
      {
        title: '操作',
        key: 'actions',
        width: 140,
        fixed: 'right',
        render: (_value: unknown, record: Requirement) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 px-2"
              aria-label={`编辑 ${record.title}`}
              onClick={() => openEdit(record)}
            >
              <Pencil className="h-3.5 w-3.5" />
              编辑
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 px-2 text-destructive hover:text-destructive"
              aria-label={`删除 ${record.title}`}
              onClick={() => requestDelete(record)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              删除
            </Button>
          </div>
        ),
      },
    ],
    [openEdit, requestDelete],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  const emptyText =
    requirements.length === 0 ? (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm font-medium text-foreground">还没有任何需求</p>
        <p className="text-xs text-muted-foreground">
          可以前往需求看板或工作台重置示例数据，也可以直接新建一条需求
        </p>
        <Button variant="outline" size="sm" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5" />
          新建需求
        </Button>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm font-medium text-foreground">没有符合条件的需求</p>
        <p className="text-xs text-muted-foreground">
          试试更换关键词，或清空当前的筛选条件
        </p>
        <Button variant="outline" size="sm" onClick={resetFilters}>
          <RotateCcw className="h-3.5 w-3.5" />
          重置筛选
        </Button>
      </div>
    );

  return (
    <div className="rise space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            需求列表
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            浏览、搜索、筛选全部需求，并进行新增、编辑与删除
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          新建需求
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex w-full flex-col gap-1.5 sm:w-auto sm:flex-1 sm:basis-[240px]">
            <Label htmlFor="filter-keyword" className="text-xs text-muted-foreground">
              关键词
            </Label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="filter-keyword"
                aria-label="搜索需求"
                placeholder="搜索标题、描述、项目、负责人或标签"
                className="pl-8"
                value={filters.keyword}
                onChange={handleKeywordChange}
              />
            </div>
          </div>

          <FilterField
            id="filter-project"
            label="项目"
            value={filters.project}
            allLabel="全部项目"
            options={PROJECTS.map((project: string) => ({
              value: project,
              label: project,
            }))}
            onChange={handleProjectChange}
          />
          <FilterField
            id="filter-type"
            label="类型"
            value={filters.type}
            allLabel="全部类型"
            options={REQUIREMENT_TYPES.map((type: RequirementType) => ({
              value: type,
              label: TYPE_LABELS[type],
            }))}
            onChange={handleTypeChange}
          />
          <FilterField
            id="filter-priority"
            label="优先级"
            value={filters.priority}
            allLabel="全部优先级"
            options={PRIORITIES.map((priority: Priority) => ({
              value: priority,
              label: PRIORITY_LABELS[priority],
            }))}
            onChange={handlePriorityChange}
          />
          <FilterField
            id="filter-status"
            label="状态"
            value={filters.status}
            allLabel="全部状态"
            options={REQUIREMENT_STATUSES.map((status: RequirementStatus) => ({
              value: status,
              label: STATUS_LABELS[status],
            }))}
            onChange={handleStatusChange}
          />
          <FilterField
            id="filter-owner"
            label="负责人"
            value={filters.owner}
            allLabel="全部负责人"
            options={TEAM_MEMBERS.map((member: string) => ({
              value: member,
              label: member,
            }))}
            onChange={handleOwnerChange}
          />

          <Button
            variant="ghost"
            className="gap-1.5 text-muted-foreground"
            onClick={resetFilters}
          >
            <RotateCcw className="h-4 w-4" />
            重置筛选
          </Button>
        </div>
      </Card>

      <Card className="min-w-0 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            共{' '}
            <span className="tnum font-semibold text-foreground">
              {filtered.length}
            </span>{' '}
            条
          </p>
          {filtered.length !== requirements.length && (
            <p className="text-xs text-muted-foreground">
              已按条件筛选，全部 <span className="tnum">{requirements.length}</span> 条
            </p>
          )}
        </div>

        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <QueryErrorState message={error} onRetry={refetch} />
        ) : (
          <Table<Requirement>
            columns={columns}
            dataSource={filtered}
            rowKey={(record: Requirement) => record.id}
            size="middle"
            scroll={{ x: 1100, y: 500 }}
            locale={{ emptyText }}
            pagination={{
              current: currentPage,
              pageSize: PAGE_SIZE,
              showSizeChanger: false,
              showTotal: (total: number) => `共 ${total} 条`,
              onChange: (nextPage: number) => setPage(nextPage),
            }}
          />
        )}
      </Card>

      <RequirementFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
      />

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open: boolean) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              删除这条需求？
            </AlertDialogTitle>
            <AlertDialogDescription>
              「{pendingDelete?.title ?? ''}」删除后不可恢复，确认继续吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground border-destructive-border"
              onClick={confirmDelete}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RequirementListPage;
