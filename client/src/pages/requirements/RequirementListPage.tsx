const RequirementListPage = () => {
  return (
    <div className="rise space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">需求列表</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          浏览、搜索、筛选全部需求，并进行新增、编辑与删除
        </p>
      </div>
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-card">
        <p className="text-sm text-muted-foreground">需求表格建设中…</p>
      </div>
    </div>
  );
};

export default RequirementListPage;
