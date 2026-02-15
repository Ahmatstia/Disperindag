// components/admin/charts.tsx
"use client";

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, AlertCircle } from "lucide-react";

export function KepuasanChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <PieChart className="w-4 h-4 text-purple-600" />
          Distribusi Kepuasan
        </CardTitle>
        <CardDescription>Berdasarkan responden</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="truncate">{item.name}</span>
              <span className="font-medium ml-auto">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatusAduanChart({
  data,
  total,
}: {
  data: Record<string, number>;
  total: number;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          Status Aduan
        </CardTitle>
        <CardDescription>Total {total} aduan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(data).map(([status, count]: [string, any]) => {
          const percentage = ((count / total) * 100).toFixed(1);
          return (
            <div key={status}>
              <div className="flex justify-between text-sm mb-1">
                <span>{status}</span>
                <span className="font-medium">
                  {count} ({percentage}%)
                </span>
              </div>
              <Progress value={parseFloat(percentage)} className="h-1.5" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
