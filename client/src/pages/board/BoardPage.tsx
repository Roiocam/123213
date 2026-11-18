import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import RequirementCard from '@/features/requirements/components/RequirementCard';
import RequirementFormDialog from '@/features/requirements/components/RequirementFormDialog';
import { STATUS_DOT_CLASS, STATUS_LABELS } from '@/features/requirements/constants';
import { useRequirements } from '@/features/requirements/requirement-store';
import {
  REQUIREMENT_STATUSES,
  type Requirement,
  type RequirementStatus,
} from '@/features/requirements/types';

const EMPTY_GROUPS = (): Record<RequirementStatus, Requirement[]> => ({
  backlog: [],
  todo: [],
  in_progress: [],
  review: [],
  done: [],
});

const CardSkeleton = () => (
  <div className="rounded-lg border border-border bg-card p-3.5 shadow-sm">
    <Skeleton className="h-3.5 w-4/5" />
    <Skeleton className="mt-2 h-3.5 w-3/5" />
    <div className="mt-3 flex items-center gap-2">
      <Skeleton className="h-4 w-12 rounded-full" />
      <Skeleton className="h-4 w-14 rounded-full" />
    </div>
    <div className="mt-3 flex items-center gap-3">
      <Skeleton className="h-3 w-14" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

const BoardPage = () => {
  const { requirements, loading, changeStatus } = useRequirements();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Requirement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const grouped = useMemo<Record<RequirementStatus, Requirement[]>>(() => {
    const next = EMPTY_GROUPS();
    requirements.forEach((item: Requirement) => {
      next[item.status].push(item);
    });
    return next;
  }, [requirements]);

  const openCreate = useCallback((): void => {
    setEditing(null);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((requirement: Requirement): void => {
    setEditing(requirement);
    setDialogOpen(true);
  }, []);

  const moveTo = useCallback(
    (requirement: Requirement, target: RequirementStatus): void => {
      changeStatus(requirement.id, target);
      toast.success(`已移动到「${STATUS_LABELS[target]}」`);
    },
    [changeStatus],
  );

  return (
    <div className="rise space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">需求看板</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            按状态分列展示需求，用卡片底部的翻页按钮推进或回退流转
          </p>
        </div>
        <Button onClick={openCreate} className="shrink-0">
          <Plus className="h-4 w-4" />
          新建需求
        </Button>
      </header>

      <div className="flex snap-x gap-4 overflow-x-auto pb-3">
        {REQUIREMENT_STATUSES.map((status: RequirementStatus) => {
          const items: Requirement[] = grouped[status];
          const index = REQUIREMENT_STATUSES.indexOf(status);
          const prevStatus =
            index > 0 ? REQUIREMENT_STATUSES[index - 1] : undefined;
          const nextStatus =
            index < REQUIREMENT_STATUSES.length - 1
              ? REQUIREMENT_STATUSES[index + 1]
              : undefined;

          return (
            <section
              key={status}
              aria-label={`${STATUS_LABELS[status]}列`}
              className="flex w-[272px] shrink-0 snap-start flex-col rounded-lg border border-border/70 bg-muted/60 lg:w-auto lg:min-w-0 lg:flex-1 lg:shrink"
            >
              <div className="flex items-center gap-2 border-b border-border/70 px-3 py-2.5">
                <span
                  aria-hidden="true"
                  className={cn('h-2 w-2 shrink-0 rounded-full', STATUS_DOT_CLASS[status])}
                />
                <h2 className="text-sm font-semibold text-foreground">
                  {STATUS_LABELS[status]}
                </h2>
                <span className="tnum ml-auto rounded-full bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {loading ? '—' : items.length}
                </span>
              </div>

              <div className="flex min-h-[220px] flex-1 flex-col gap-3 p-3">
                {loading ? (
                  Array.from({ length: 2 }).map((_: unknown, i: number) => (
                    <CardSkeleton key={`skeleton-${status}-${i}`} />
                  ))
                ) : items.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center py-10">
                    <p className="text-xs text-muted-foreground">暂无需求</p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {items.map((requirement: Requirement) => (
                      <motion.div
                        key={requirement.id}
                        layout
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <RequirementCard requirement={requirement} onClick={openEdit}>
                          <div className="mt-3 flex items-center gap-2 border-t border-border/70 pt-2">
                            {prevStatus && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  moveTo(requirement, prevStatus);
                                }}
                              >
                                <ChevronLeft className="h-3.5 w-3.5" />
                                上一状态
                              </Button>
                            )}
                            {nextStatus ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-auto text-muted-foreground hover:text-primary"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  moveTo(requirement, nextStatus);
                                }}
                              >
                                下一状态
                                <ChevronRight className="h-3.5 w-3.5" />
                              </Button>
                            ) : (
                              <span className="ml-auto text-[11px] text-muted-foreground">
                                已交付
                              </span>
                            )}
                          </div>
                        </RequirementCard>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <RequirementFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
      />
    </div>
  );
};

export default BoardPage;
