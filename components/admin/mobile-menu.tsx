// components/admin/mobile-menu.tsx
"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  BookOpen,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";

export function MobileMenu() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/data-survey", label: "Data Survey", icon: ClipboardList },
    { href: "/admin/data-aduan", label: "Data Aduan", icon: MessageSquare },
    { href: "/admin/data-tamu", label: "Data Tamu", icon: BookOpen },
    { href: "/admin/laporan", label: "Laporan", icon: BarChart3 },
    { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
    { href: "/admin/bantuan", label: "Bantuan", icon: HelpCircle },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Menu Admin</h2>
          </div>
          <nav className="flex-1 p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg mb-1
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <LogoutButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Import LogoutButton di sini
import LogoutButton from "@/components/auth/logout-button";
