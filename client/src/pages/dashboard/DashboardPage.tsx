const DashboardPage = () => {
  return (
    <div className="rise space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">工作台</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          需求整体进度、状态与优先级分布统计
        </p>
      </div>
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-card">
        <p className="text-sm text-muted-foreground">统计图表建设中…</p>
      </div>
    </div>
  );
};

export default DashboardPage;
