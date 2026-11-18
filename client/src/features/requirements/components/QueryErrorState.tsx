import { AlertTriangle, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface QueryErrorStateProps {
  message: string;
  onRetry: () => void;
}

const QueryErrorState = ({ message, onRetry }: QueryErrorStateProps) => (
  <Card className="flex flex-col items-center justify-center gap-3 border-dashed py-16 text-center">
    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-destructive/10 text-destructive">
      <AlertTriangle className="h-5 w-5" />
    </span>
    <div>
      <p className="text-sm font-medium text-foreground">数据加载失败</p>
      <p className="mt-1 max-w-md break-words text-[13px] text-muted-foreground">
        {message}
      </p>
    </div>
    <Button variant="outline" size="sm" onClick={onRetry}>
      <RotateCcw className="h-3.5 w-3.5" />
      重新加载
    </Button>
  </Card>
);

export default QueryErrorState;
