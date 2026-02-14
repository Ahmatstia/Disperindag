"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KepuasanItem {
  Timestamp: string;
  Kepuasan?: string | number;
}

interface MonthlyData {
  [key: string]: {
    month: string;
    total: number;
    count: number;
  };
}

interface ChartDataItem {
  month: string;
  "Rata-rata Kepuasan": string | number;
}

interface KepuasanChartProps {
  data: KepuasanItem[];
}

export function KepuasanChart({ data }: KepuasanChartProps) {
  // Proses data untuk grafik per bulan
  const monthlyData = data.reduce((acc: MonthlyData, item: KepuasanItem) => {
    const date = new Date(item.Timestamp);
    const month = date.toLocaleString("id", { month: "short" });

    if (!acc[month]) {
      acc[month] = { month, total: 0, count: 0 };
    }

    if (item.Kepuasan) {
      acc[month].total += parseInt(String(item.Kepuasan));
      acc[month].count++;
    }

    return acc;
  }, {});

  const chartData = Object.values(monthlyData).map((item) => ({
    month: item.month,
    "Rata-rata Kepuasan":
      item.count > 0 ? (item.total / item.count).toFixed(1) : 0,
  })) as ChartDataItem[];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tren Kepuasan per Bulan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Rata-rata Kepuasan"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
