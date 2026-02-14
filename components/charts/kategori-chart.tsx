"use client";

import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

interface KategoriChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  title: string;
}

export function KategoriChart({ data, dataKey, title }: KategoriChartProps) {
  // Hitung distribusi kategori
  const kategoriData = data.reduce(
    (acc: Record<string, number>, item: Record<string, unknown>) => {
      const kategori = String(item[dataKey]);
      if (kategori) {
        acc[kategori] = (acc[kategori] || 0) + 1;
      }
      return acc;
    },
    {},
  );

  const chartData = Object.entries(kategoriData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <div
                    key={`cell-${index}`}
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
