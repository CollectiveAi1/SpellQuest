"use client";

import { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Trophy,
  BookOpen,
  PenTool,
  Flame,
  Calendar,
  Award,
  Download,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { phases, achievements as allAchievements } from "@/lib/curriculum-data";

interface AnalyticsClientProps {
  userProgress: any;
  exerciseResults: any[];
  dailyActivities: any[];
  checkpointResults: any[];
  achievements: any[];
  writingProjects: any[];
  phaseProgress: any[];
}

const COLORS = ["#7c3aed", "#f97316", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function AnalyticsClient({
  userProgress,
  exerciseResults,
  dailyActivities,
  checkpointResults,
  achievements,
  writingProjects,
  phaseProgress,
}: AnalyticsClientProps) {
  // Calculate weekly activity data
  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data = days?.map((day) => ({
      day,
      minutes: 0,
      exercises: 0,
    }));

    dailyActivities?.forEach((activity) => {
      const date = new Date(activity?.date);
      const dayIndex = date?.getDay();
      if (data?.[dayIndex]) {
        data[dayIndex].minutes += activity?.totalMinutes ?? 0;
      }
    });

    exerciseResults?.forEach((result) => {
      const date = new Date(result?.completedAt);
      const dayIndex = date?.getDay();
      if (data?.[dayIndex]) {
        data[dayIndex].exercises += 1;
      }
    });

    return data;
  }, [dailyActivities, exerciseResults]);

  // Calculate accuracy trend
  const accuracyTrend = useMemo(() => {
    const grouped: Record<string, { total: number; count: number }> = {};
    
    exerciseResults?.forEach((result) => {
      const date = new Date(result?.completedAt)?.toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = { total: 0, count: 0 };
      }
      grouped[date].total += result?.accuracy ?? 0;
      grouped[date].count += 1;
    });

    return Object.entries(grouped)
      ?.slice(-7)
      ?.map(([date, { total, count }]) => ({
        date: date?.split("/")?.slice(0, 2)?.join("/"),
        accuracy: Math.round(total / count),
      }));
  }, [exerciseResults]);

  // Calculate exercise distribution
  const exerciseDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    
    exerciseResults?.forEach((result) => {
      const type = result?.exerciseType ?? "other";
      distribution[type] = (distribution[type] ?? 0) + 1;
    });

    return Object.entries(distribution)?.map(([name, value]) => ({
      name: name?.replace("_", " ")?.replace(/\b\w/g, (l) => l?.toUpperCase()),
      value,
    }));
  }, [exerciseResults]);

  // Calculate strengths and weaknesses
  const strengthsWeaknesses = useMemo(() => {
    const byType: Record<string, { correct: number; total: number }> = {};

    exerciseResults?.forEach((result) => {
      const type = result?.exerciseType ?? "other";
      if (!byType[type]) {
        byType[type] = { correct: 0, total: 0 };
      }
      byType[type].correct += result?.score ?? 0;
      byType[type].total += result?.totalQuestions ?? 0;
    });

    const sorted = Object.entries(byType)
      ?.map(([type, { correct, total }]) => ({
        type: type?.replace("_", " ")?.replace(/\b\w/g, (l) => l?.toUpperCase()),
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      }))
      ?.sort((a, b) => (b?.accuracy ?? 0) - (a?.accuracy ?? 0));

    return {
      strengths: sorted?.slice(0, 2) ?? [],
      weaknesses: sorted?.slice(-2)?.reverse() ?? [],
    };
  }, [exerciseResults]);

  const earnedAchievements = achievements?.map((a) => a?.achievementId) ?? [];
  const completedProjects = writingProjects?.filter((p) => p?.status === "COMPLETED")?.length ?? 0;
  const passedCheckpoints = checkpointResults?.filter((c) => c?.passed)?.length ?? 0;

  const stats = [
    {
      icon: Clock,
      label: "Total Study Time",
      value: `${userProgress?.totalStudyMinutes ?? 0} min`,
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: Target,
      label: "Words Mastered",
      value: userProgress?.wordsMastered ?? 0,
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: TrendingUp,
      label: "Overall Accuracy",
      value: `${Math.round(userProgress?.spellingAccuracy ?? 0)}%`,
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      icon: Flame,
      label: "Longest Streak",
      value: `${userProgress?.longestStreak ?? 0} days`,
      color: "text-red-500",
      bg: "bg-red-100 dark:bg-red-900/30",
    },
    {
      icon: PenTool,
      label: "Words Written",
      value: userProgress?.creativeWordCount ?? 0,
      color: "text-pink-500",
      bg: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      icon: Trophy,
      label: "Phases Completed",
      value: `${passedCheckpoints} / 6`,
      color: "text-yellow-500",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
    },
  ];

  // Export report function
  const exportReport = useCallback(() => {
    const report = `
SPELLING ENHANCEMENT PROGRESS REPORT
====================================
Generated: ${new Date().toLocaleDateString()}

OVERVIEW
--------
Current Phase: Phase ${userProgress?.currentPhase ?? 1}
Total Study Time: ${userProgress?.totalStudyMinutes ?? 0} minutes
Current Streak: ${userProgress?.currentStreak ?? 0} days
Longest Streak: ${userProgress?.longestStreak ?? 0} days

PERFORMANCE METRICS
-------------------
Words Mastered: ${userProgress?.wordsMastered ?? 0}
Overall Spelling Accuracy: ${Math.round(userProgress?.spellingAccuracy ?? 0)}%
Creative Writing Word Count: ${userProgress?.creativeWordCount ?? 0}

PHASE PROGRESS
--------------
Phases Completed: ${passedCheckpoints} / 6

EXERCISE SUMMARY
----------------
Total Exercises Completed: ${exerciseResults?.length ?? 0}
Average Accuracy: ${Math.round((exerciseResults?.reduce((acc, r) => acc + (r?.accuracy ?? 0), 0) ?? 0) / (exerciseResults?.length || 1))}%

WRITING PROJECTS
----------------
Completed Projects: ${writingProjects?.filter(p => p?.status === 'COMPLETED')?.length ?? 0}
In Progress: ${writingProjects?.filter(p => p?.status === 'IN_PROGRESS')?.length ?? 0}

ACHIEVEMENTS
------------
Achievements Unlocked: ${achievements?.length ?? 0}

STRENGTHS
---------
${strengthsWeaknesses?.strengths?.map((s: any) => `• ${s?.type}: ${s?.accuracy}% accuracy`)?.join('\n') || 'Keep practicing to identify strengths!'}

AREAS FOR IMPROVEMENT
---------------------
${strengthsWeaknesses?.weaknesses?.map((a: any) => `• ${a?.type}: ${a?.accuracy}% accuracy`)?.join('\n') || 'Great job! No major areas identified.'}

====================================
Keep up the great work! 🌟
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spelling-progress-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Progress report downloaded! 📊');
  }, [userProgress, exerciseResults, writingProjects, achievements, passedCheckpoints, strengthsWeaknesses]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            Progress Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Detailed insights into learning progress and performance
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportReport}
          className="px-4 py-2 gradient-bg text-white rounded-xl font-medium flex items-center gap-2 shadow-lg"
        >
          <Download className="w-5 h-5" />
          Export Report
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats?.map((stat, i) => (
          <motion.div
            key={stat?.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm"
          >
            <div className={`${stat?.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat?.color}`} />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat?.label}</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{stat?.value}</p>
          </motion.div>
        )) ?? []}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">Weekly Activity</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" tickLine={false} tick={{ fontSize: 10 }} axisLine={false} />
                <YAxis tickLine={false} tick={{ fontSize: 10 }} axisLine={false} width={30} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    fontSize: "11px",
                  }}
                />
                <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="minutes" name="Minutes" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="exercises" name="Exercises" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Accuracy Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">Accuracy Trend</h3>
          <div className="h-[250px]">
            {accuracyTrend?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={accuracyTrend}>
                  <defs>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 10 }} axisLine={false} />
                  <YAxis tickLine={false} tick={{ fontSize: 10 }} axisLine={false} width={30} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      fontSize: "11px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAccuracy)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No data yet
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Exercise Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">Exercise Distribution</h3>
          <div className="h-[200px]">
            {exerciseDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={exerciseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {exerciseDistribution?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      fontSize: "11px",
                    }}
                  />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No exercises completed
              </div>
            )}
          </div>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">Strengths & Areas to Improve</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Strengths
              </p>
              {strengthsWeaknesses?.strengths?.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item?.type}</span>
                  <span className="font-bold text-green-600 dark:text-green-400">{item?.accuracy}%</span>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Focus Areas
              </p>
              {strengthsWeaknesses?.weaknesses?.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item?.type}</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">{item?.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Phase Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">Phase Progress</h3>
          
          <div className="space-y-3">
            {phases?.map((phase) => {
              const progress = phaseProgress?.find((p) => p?.phaseNumber === phase?.phaseNumber);
              const isCompleted = (progress?.completionPct ?? 0) >= 100;
              const isCurrent = phase?.phaseNumber === userProgress?.currentPhase;

              return (
                <div key={phase?.phaseNumber} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${
                      isCurrent ? "text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-400"
                    }`}>
                      Phase {phase?.phaseNumber}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {isCompleted ? "100%" : `${Math.round(progress?.completionPct ?? 0)}%`}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCompleted ? "bg-green-500" : "bg-purple-500"
                      }`}
                      style={{ width: `${progress?.completionPct ?? 0}%` }}
                    />
                  </div>
                </div>
              );
            }) ?? []}
          </div>
        </motion.div>
      </div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-4">Achievements ({earnedAchievements?.length ?? 0} / {allAchievements?.length ?? 0})</h3>
        
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-3">
          {allAchievements?.map((achievement) => {
            const isEarned = earnedAchievements?.includes(achievement?.id);
            return (
              <motion.div
                key={achievement?.id}
                whileHover={{ scale: 1.05 }}
                className={`p-3 rounded-xl text-center transition-colors ${
                  isEarned
                    ? "bg-yellow-50 dark:bg-yellow-900/20"
                    : "bg-gray-50 dark:bg-slate-700 opacity-50"
                }`}
                title={achievement?.title}
              >
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  isEarned ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-gray-200 dark:bg-slate-600"
                }`}>
                  <Award className={`w-5 h-5 ${isEarned ? "text-yellow-500" : "text-gray-400"}`} />
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                  {achievement?.title}
                </p>
              </motion.div>
            );
          }) ?? []}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 rounded-2xl p-6"
      >
        <h3 className="font-bold text-gray-800 dark:text-white mb-4">Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "Keep up the streak!",
              description: `You've studied for ${userProgress?.currentStreak ?? 0} days in a row. Keep going to maintain your momentum!`,
              icon: Flame,
              color: "text-orange-500",
            },
            {
              title: strengthsWeaknesses?.weaknesses?.[0]?.type ? `Practice ${strengthsWeaknesses?.weaknesses?.[0]?.type}` : "Try new exercises",
              description: strengthsWeaknesses?.weaknesses?.[0]?.accuracy
                ? `Your accuracy is ${strengthsWeaknesses?.weaknesses?.[0]?.accuracy}%. Focus on this area to improve.`
                : "Complete more exercises to get personalized recommendations.",
              icon: Target,
              color: "text-purple-500",
            },
          ]?.map((rec, i) => (
            <div key={i} className="flex items-start gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl">
              <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
                <rec.icon className={`w-5 h-5 ${rec?.color}`} />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">{rec?.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{rec?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
