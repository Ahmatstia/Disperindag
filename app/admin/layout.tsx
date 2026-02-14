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
  // Cek token di server
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  // Jika tidak ada token, redirect ke login
  if (!token || token !== "logged-in") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo dan Menu */}
            <div className="flex items-center gap-8">
              <Link
                href="/admin/dashboard"
                className="font-semibold text-lg hover:text-blue-600 transition"
              >
                Admin Disperindag
              </Link>

              {/* Menu Navigasi Desktop */}
              <div className="hidden md:flex gap-4">
                <Link
                  href="/admin/dashboard"
                  className="text-gray-600 hover:text-blue-600 transition px-3 py-2 rounded-md hover:bg-blue-50"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/data-survey"
                  className="text-gray-600 hover:text-blue-600 transition px-3 py-2 rounded-md hover:bg-blue-50"
                >
                  Data Survey
                </Link>
                <Link
                  href="/admin/data-aduan"
                  className="text-gray-600 hover:text-blue-600 transition px-3 py-2 rounded-md hover:bg-blue-50"
                >
                  Data Aduan
                </Link>
                <Link
                  href="/admin/data-tamu"
                  className="text-gray-600 hover:text-blue-600 transition px-3 py-2 rounded-md hover:bg-blue-50"
                >
                  Data Tamu
                </Link>
              </div>
            </div>

            {/* Tombol Logout */}
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Footer kecil untuk admin */}
      <footer className="bg-white border-t mt-8 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            © 2026 Dinas Perindustrian dan Perdagangan Provinsi Sumatera Barat -
            Admin Panel
          </p>
        </div>
      </footer>
    </div>
  );
}
