"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin/dashboard");
        router.refresh(); // Refresh untuk update middleware
      } else {
        setError(data.message || "Login gagal");
      }
    } catch {
      setError("Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#faf6ef] to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-[#c9973a]/20 shadow-xl shadow-[#c9973a]/5">
        <CardHeader className="text-center">
          <div className="w-24 h-24 relative flex items-center justify-center mx-auto mb-6">
            <Image src="/logo.jpg" alt="Logo" fill className="object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Admin Login</CardTitle>
          <CardDescription className="text-[#c9973a] font-medium">
            Dinas Perindustrian dan Perdagangan
            <br />
            Provinsi Sumatera Barat
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin"
                className="border-gray-200 focus:border-[#c9973a] focus:ring-[#c9973a]/20"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center font-medium bg-red-50 py-2 rounded-lg border border-red-100">{error}</p>
            )}
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              type="submit"
              className="w-full bg-[#c9973a] hover:bg-[#e8b85c] text-navy font-bold shadow-lg shadow-[#c9973a]/20 transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Login Ke Panel Admin"}
            </Button>
          </CardFooter>
        </form>
        <p className="text-xs text-center text-gray-400 mt-2 mb-4">
          Gunakan password: <span className="font-mono">admin123</span>
        </p>
      </Card>
    </div>
  );
}
