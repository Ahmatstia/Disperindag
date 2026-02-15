// app/admin/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LogoutButton from "@/components/auth/logout-button"; // Import dari komponen external
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  BookOpen,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronRight,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileMenu } from "@/components/admin/mobile-menu"; // Import MobileMenu component

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cek token di server
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  // Jika tidak ada token, redirect ke login
  if (!token || token !== "logged-in") {
    redirect("/login");
  }

  return (
    <TooltipProvider>
      <AdminSidebar>
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          {/* Header dengan breadcrumb dan notifikasi */}
          <AdminHeader />

          {/* Main Content */}
          <div className="p-4 md:p-6">{children}</div>

          {/* Footer */}
          <AdminFooter />
        </main>
      </AdminSidebar>
    </TooltipProvider>
  );
}

// ==================== ADMIN SIDEBAR COMPONENT ====================
function AdminSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
          {/* Logo Area */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-800">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <div>
                <h1 className="font-semibold text-gray-800 dark:text-white">
                  Disperindag
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Admin Panel
                </p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatars/admin.png" alt="Admin" />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Admin Disperindag
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  admin@disperindag.go.id
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                Super Admin
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {/* Main Menu */}
              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Utama
                </p>
                <NavItem
                  href="/admin/dashboard"
                  icon={<LayoutDashboard className="w-5 h-5" />}
                  label="Dashboard"
                />
                <NavItem
                  href="/admin/data-survey"
                  icon={<ClipboardList className="w-5 h-5" />}
                  label="Data Survey"
                />
                <NavItem
                  href="/admin/data-aduan"
                  icon={<MessageSquare className="w-5 h-5" />}
                  label="Data Aduan"
                  badgeVariant="destructive"
                />
                <NavItem
                  href="/admin/data-tamu"
                  icon={<BookOpen className="w-5 h-5" />}
                  label="Data Tamu"
                />
              </div>

              {/* Reports */}
              <div className="space-y-1 pt-4">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Laporan
                </p>
                <NavItem
                  href="/admin/laporan"
                  icon={<BarChart3 className="w-5 h-5" />}
                  label="Laporan Bulanan"
                />
              </div>

              {/* Settings */}
              <div className="space-y-1 pt-4">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Pengaturan
                </p>
                <NavItem
                  href="/admin/pengaturan"
                  icon={<Settings className="w-5 h-5" />}
                  label="Pengaturan"
                />
                <NavItem
                  href="/admin/bantuan"
                  icon={<HelpCircle className="w-5 h-5" />}
                  label="Bantuan"
                />
              </div>
            </nav>
          </div>

          {/* Logout Button - menggunakan komponen yang di-import */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 p-4">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <h1 className="font-semibold text-gray-800 dark:text-white">
              Disperindag
            </h1>
          </Link>
          <MobileMenu />
        </div>
      </div>

      {/* Main Content - with margin for desktop sidebar */}
      <div className="md:ml-64 flex-1 flex flex-col min-w-0 relative">
        <div className="md:hidden h-16" /> {/* Spacer for mobile header */}
        {children}
      </div>
    </div>
  );
}

// ==================== NAVIGATION ITEM ====================
interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  badgeVariant?: "default" | "destructive" | "outline" | "secondary";
}

function NavItem({
  href,
  icon,
  label,
  badge,
  badgeVariant = "secondary",
}: NavItemProps) {
  // Untuk active state, nanti bisa ditambahkan dengan usePathname dari client component
  // Sementara kita asumsikan tidak aktif
  const isActive = false;

  return (
    <Link
      href={href}
      className={`
        group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all
        ${
          isActive
            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        }
      `}
    >
      <div className="flex items-center flex-1 gap-3">
        <span
          className={
            isActive
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500"
          }
        >
          {icon}
        </span>
        <span className="flex-1">{label}</span>
        {badge && (
          <Badge variant={badgeVariant} className="ml-auto text-xs">
            {badge}
          </Badge>
        )}
      </div>
    </Link>
  );
}

// ==================== ADMIN HEADER ====================
function AdminHeader() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Breadcrumb (sederhana) */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Admin</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Dashboard
          </span>
        </div>

        {/* Right side - Notifications (desktop only) */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}

// ==================== ADMIN FOOTER ====================
function AdminFooter() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-8 py-4">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p>
          © 2026 Dinas Perindustrian dan Perdagangan Provinsi Sumatera Barat -
          Admin Panel
        </p>
      </div>
    </footer>
  );
}
