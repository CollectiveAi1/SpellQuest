"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface ProgressChartProps {
  recentExercises: any[];
  recentActivities: any[];
}

export default function ProgressChart({ recentExercises, recentActivities }: ProgressChartProps) {
  const chartData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      const dateStr = date.toISOString().split("T")[0];

      // Find activities for this day
      const dayActivities = recentActivities?.filter((a) => {
        const actDate = new Date(a?.date)?.toISOString()?.split("T")?.[0];
        return actDate === dateStr;
      }) ?? [];

      // Find exercises for this day
      const dayExercises = recentExercises?.filter((e) => {
        const exDate = new Date(e?.completedAt)?.toISOString()?.split("T")?.[0];
        return exDate === dateStr;
      }) ?? [];

      const totalMinutes = dayActivities?.reduce((sum, a) => sum + (a?.totalMinutes ?? 0), 0) ?? 0;
      const avgAccuracy = dayExercises?.length > 0
        ? Math.round(dayExercises?.reduce((sum, e) => sum + (e?.accuracy ?? 0), 0) / dayExercises.length)
        : 0;

      data.push({
        day: dayName,
        minutes: totalMinutes,
        accuracy: avgAccuracy,
      });
    }

    return data;
  }, [recentExercises, recentActivities]);

  // Check if we have any data
  const hasData = chartData?.some((d) => (d?.minutes ?? 0) > 0 || (d?.accuracy ?? 0) > 0);

  if (!hasData) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No activity data yet</p>
          <p className="text-sm">Complete some exercises to see your progress!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tickLine={false}
            tick={{ fontSize: 10 }}
            axisLine={false}
          />
          <YAxis
            tickLine={false}
            tick={{ fontSize: 10 }}
            axisLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              fontSize: "11px",
            }}
          />
          <Legend
            verticalAlign="top"
            wrapperStyle={{ fontSize: 11 }}
          />
          <Area
            type="monotone"
            dataKey="minutes"
            name="Minutes"
            stroke="#7c3aed"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorMinutes)"
          />
          <Area
            type="monotone"
            dataKey="accuracy"
            name="Accuracy %"
            stroke="#f97316"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAccuracy)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
