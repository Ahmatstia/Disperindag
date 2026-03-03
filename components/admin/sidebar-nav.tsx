"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  BookOpen,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";

const menuItems = [
  {
    group: "Utama",
    items: [
      {
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
      },
      {
        href: "/admin/data-survey",
        icon: ClipboardList,
        label: "Data Survey",
      },
      {
        href: "/admin/data-aduan",
        icon: MessageSquare,
        label: "Data Aduan",
        badge: "New",
        badgeVariant: "destructive" as const,
      },
      {
        href: "/admin/data-tamu",
        icon: BookOpen,
        label: "Data Tamu",
      },
    ],
  },
  {
    group: "Laporan",
    items: [
      {
        href: "/admin/laporan",
        icon: BarChart3,
        label: "Laporan Bulanan",
      },
    ],
  },
  {
    group: "Pengaturan",
    items: [
      {
        href: "/admin/pengaturan",
        icon: Settings,
        label: "Pengaturan",
      },
      {
        href: "/admin/bantuan",
        icon: HelpCircle,
        label: "Bantuan",
      },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-8 overflow-y-auto custom-scrollbar">
      {menuItems.map((group, idx) => (
        <div key={idx} className="space-y-2">
          <p className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
            {group.group}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 relative overflow-hidden",
                    isActive
                      ? "bg-indigo-50 text-indigo-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(79,70,229,0.3)]" />
                  )}

                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />
                  <span className="flex-1 tracking-tight">{item.label}</span>
                  
                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || "secondary"}
                      className={cn(
                        "text-[9px] px-1.5 py-0 h-4 font-black uppercase tracking-wider scale-90",
                        !isActive && "opacity-60"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
