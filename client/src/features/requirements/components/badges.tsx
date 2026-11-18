import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  PRIORITY_BADGE_CLASS,
  PRIORITY_LABELS,
  STATUS_BADGE_CLASS,
  STATUS_DOT_CLASS,
  STATUS_LABELS,
  TYPE_LABELS,
} from '../constants';
import type { Priority, RequirementStatus, RequirementType } from '../types';

export const StatusBadge = ({ status }: { status: RequirementStatus }) => (
  <Badge
    variant="secondary"
    className={cn(
      'gap-1.5 rounded-full border-transparent font-medium',
      STATUS_BADGE_CLASS[status],
    )}
  >
    <span className={cn('h-1.5 w-1.5 rounded-full', STATUS_DOT_CLASS[status])} />
    {STATUS_LABELS[status]}
  </Badge>
);

export const PriorityBadge = ({ priority }: { priority: Priority }) => (
  <Badge
    variant="secondary"
    className={cn(
      'rounded-full border-transparent font-semibold',
      PRIORITY_BADGE_CLASS[priority],
    )}
  >
    {PRIORITY_LABELS[priority]}
  </Badge>
);

export const TypeBadge = ({ type }: { type: RequirementType }) => (
  <Badge variant="outline" className="rounded-full bg-card font-normal text-muted-foreground">
    {TYPE_LABELS[type]}
  </Badge>
);
