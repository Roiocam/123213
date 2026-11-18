import { CalendarDays, User } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  PRIORITY_BAR_CLASS,
  TYPE_LABELS,
} from '../constants';
import { isOverdue } from '../utils';
import type { Requirement } from '../types';
import { PriorityBadge } from './badges';

interface RequirementCardProps {
  requirement: Requirement;
  onClick?: (requirement: Requirement) => void;
  children?: React.ReactNode;
}

const RequirementCard = ({ requirement, onClick, children }: RequirementCardProps) => {
  const overdue = isOverdue(requirement);
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`需求 ${requirement.title}`}
      onClick={() => onClick?.(requirement)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.(requirement);
        }
      }}
      className={cn(
        'group relative overflow-hidden rounded-lg border border-border bg-card p-3.5 pl-4 text-left shadow-sm transition-all',
        'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
        onClick && 'cursor-pointer',
      )}
    >
      <span
        className={cn(
          'absolute inset-y-0 left-0 w-[3px]',
          PRIORITY_BAR_CLASS[requirement.priority],
        )}
      />
      <div className="flex items-start justify-between gap-2">
        <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          {requirement.title}
        </h4>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={requirement.priority} />
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
          {TYPE_LABELS[requirement.type]}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <User className="h-3 w-3" />
          {requirement.owner}
        </span>
        <span
          className={cn(
            'tnum inline-flex items-center gap-1',
            overdue && 'font-semibold text-overdue',
          )}
        >
          <CalendarDays className="h-3 w-3" />
          {requirement.dueDate ?? '无截止'}
          {overdue && ' · 已逾期'}
        </span>
      </div>
      {requirement.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {requirement.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-accent px-1.5 py-0.5 text-[10px] text-accent-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {children}
    </div>
  );
};

export default RequirementCard;
