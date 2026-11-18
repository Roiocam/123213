import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAppInfo } from '@lark-apaas/client-toolkit/hooks/useAppInfo';
import {
  Columns3,
  KanbanSquare,
  LayoutDashboard,
  ListTodo,
  Menu,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Image } from '@client/src/components/ui/image';

const NAV_ITEMS = [
  { to: '/', label: '工作台', icon: LayoutDashboard, end: true },
  { to: '/board', label: '需求看板', icon: Columns3, end: false },
  { to: '/requirements', label: '需求列表', icon: ListTodo, end: false },
] as const;

function BrandMark({ compact = false }: { compact?: boolean }) {
  const { appName, appLogo } = useAppInfo();
  return (
    <div className="flex items-center gap-2.5 px-2">
      {appLogo ? (
        <Image src={appLogo} alt="" className="h-8 w-8 rounded-md object-cover" />
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <KanbanSquare className="h-4.5 w-4.5" />
        </span>
      )}
      {!compact && (
        <span className="truncate text-[15px] font-bold text-white">
          {appName || '项目需求看板'}
        </span>
      )}
    </div>
  );
}

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white',
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  'absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-sidebar-primary transition-opacity',
                  isActive ? 'opacity-100' : 'opacity-0',
                )}
              />
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border">
          <BrandMark />
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <NavItems />
        </div>
        <div className="border-t border-sidebar-border px-5 py-4">
          <p className="text-[11px] leading-relaxed text-sidebar-foreground/60">
            示例数据 · 本地演示
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="打开导航菜单">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar p-0">
              <SheetHeader className="flex h-14 flex-row items-center border-b border-sidebar-border">
                <SheetTitle className="flex items-center">
                  <BrandMark compact />
                </SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <NavItems onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          <BrandMark compact />
          <span className="text-[15px] font-bold">项目需求看板</span>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
