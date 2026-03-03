// app/admin/layout.tsx
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LogoutButton from "@/components/auth/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileMenu } from "@/components/admin/mobile-menu";
import { SidebarNav } from "@/components/admin/sidebar-nav";

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
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-900">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200 shadow-sm">
            {/* Logo Area */}
            <div className="flex items-center h-20 flex-shrink-0 px-6 mb-4">
              <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                <div className="w-10 h-10 relative flex-shrink-0 p-1 bg-white rounded-xl shadow-md border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                  <Image src="/logo.jpg" alt="Logo" fill className="object-contain p-1" />
                </div>
                <div>
                  <h1 className="font-black text-gray-900 leading-tight tracking-tighter text-lg uppercase italic">
                    DISPER<span className="text-indigo-600">INDAG</span>
                  </h1>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                    Admin Portal
                  </p>
                </div>
              </Link>
            </div>

            {/* Sidebar Navigation Area */}
            <SidebarNav />

            {/* User Profile & Logout */}
            <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3 p-2 mb-3 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <Avatar className="h-10 w-10 border border-gray-100 ring-2 ring-indigo-500/10">
                  <AvatarImage src="/logo.jpg" alt="Admin" />
                  <AvatarFallback className="bg-indigo-50/50 text-indigo-600 font-black">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-gray-900 truncate uppercase tracking-tight">
                    Admin Disperindag
                  </p>
                  <p className="text-[10px] text-gray-400 truncate font-semibold">
                    System Administrator
                  </p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:ml-72 relative min-w-0 overflow-hidden bg-gray-50">
          {/* Mobile Header */}
          <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-[60] px-4 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 relative bg-white rounded-lg p-1 border border-gray-100">
                <Image src="/logo.jpg" alt="Logo" fill className="object-contain" />
              </div>
              <h1 className="font-black text-gray-900 tracking-tighter text-sm uppercase italic">
                DISPER<span className="text-indigo-600">INDAG</span>
              </h1>
            </Link>
            <MobileMenu />
          </header>

          {/* Desktop App Header */}
          <header className="hidden md:flex h-20 items-center justify-between px-8 bg-white/60 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Service Management <span className="text-indigo-600">Disperindag</span>
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Status Badge */}
              <div className="flex flex-col items-end mr-2">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Status</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">Live Server</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
            </div>
          </header>

          {/* Page Content Container */}
          <main className="flex-1 overflow-y-auto bg-white custom-scrollbar relative">
             {/* Decorative Background Element */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none" />
            
            <div className="relative z-10 w-full min-h-screen">
               {/* Content Wrapper */}
               <div className="md:p-8 p-4 pt-20 md:pt-8 w-full">
                  {children}
               </div>

               {/* Modern Footer */}
               <footer className="mt-20 py-10 px-8 border-t border-gray-200 bg-gray-50/30">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                       <Image src="/logo.jpg" alt="Logo" width={32} height={32} className="grayscale opacity-50" />
                       <div className="text-left">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Government Entity</p>
                          <p className="text-xs font-bold text-gray-500">Disperindag Sumatera Barat • Control Tower</p>
                       </div>
                    </div>
                    <div className="flex gap-8 items-center">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">© 2026 Admin Panel v2.0</p>
                       <div className="flex gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shadow-sm" />
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50 shadow-sm" />
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50 shadow-sm" />
                       </div>
                    </div>
                 </div>
               </footer>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
