// app/admin/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LogoutButton from "@/components/auth/logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  // Jangan redirect di layout, biarkan middleware yang handle
  if (!token || token !== "logged-in") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin/dashboard" className="font-semibold text-lg">
                Admin Disperindag
              </Link>
              <div className="hidden md:flex gap-4">
                <Link
                  href="/admin/dashboard"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/data-survey"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Data Survey
                </Link>
                <Link
                  href="/admin/data-aduan"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Data Aduan
                </Link>
                <Link
                  href="/admin/data-tamu"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Data Tamu
                </Link>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
