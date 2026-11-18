const BoardPage = () => {
  return (
    <div className="rise space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">需求看板</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          按状态分列展示，拖动或操作卡片推进需求流转
        </p>
      </div>
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-card">
        <p className="text-sm text-muted-foreground">看板列建设中…</p>
      </div>
    </div>
  );
};

export default BoardPage;
