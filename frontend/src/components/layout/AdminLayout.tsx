import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, LogOut, Package, Tag } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

interface NavItem {
  to: string;
  label: string;
  icon: typeof ClipboardList;
}

const ORDER_NAV: NavItem[] = [{ to: '/admin', label: '注文管理', icon: ClipboardList }];

const MASTER_NAV: NavItem[] = [
  { to: '/admin/master/product-categories', label: '商品カテゴリ', icon: Tag },
  { to: '/admin/master/products', label: '商品マスタ', icon: Package },
];

interface AdminLayoutProps {
  onLogout: () => void;
  children: ReactNode;
}

// 管理画面共通のレイアウト。開閉可能なサイドバーを持つ。
export default function AdminLayout({ onLogout, children }: AdminLayoutProps) {
  const location = useLocation();

  const renderNavGroup = (label: string, items: NavItem[]) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.to}
                tooltip={item.label}
              >
                <Link to={item.to}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div style={{ padding: '8px 4px' }}>
            <span className="kicker">ADMIN</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {renderNavGroup('メニュー', ORDER_NAV)}
          {renderNavGroup('マスタ管理', MASTER_NAV)}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={onLogout} tooltip="ログアウト">
                <LogOut />
                <span>ログアウト</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div style={{ padding: '12px 20px 0' }}>
          <SidebarTrigger />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
