import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: string;
  hint?: string;
}

const StatCard = ({ label, value, icon: Icon, accent, hint }: StatCardProps) => {
  return (
    <div className="hover-elevate rise rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="tnum mt-2 text-3xl font-bold text-foreground">{value}</p>
          {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
        </div>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
          style={{
            color: accent ?? 'var(--primary)',
            backgroundColor: `color-mix(in srgb, ${accent ?? 'var(--primary)'} 12%, white)`,
          }}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
    </div>
  );
};

export default StatCard;
