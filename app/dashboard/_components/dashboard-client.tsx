"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Flame,
  Target,
  BookOpen,
  Rocket,
  Star,
  CheckCircle,
  Clock,
  Zap,
  ChevronRight,
  Calendar,
  Gamepad2,
  PenTool,
  Award,
} from "lucide-react";
import { phases, achievements } from "@/lib/curriculum-data";
import ProgressChart from "./progress-chart";

interface DashboardClientProps {
  user: any;
  progress: any;
  recentActivities: any[];
  achievements: any[];
  phaseProgress: any[];
  writingProjectsCount: number;
  recentExercises: any[];
}

export default function DashboardClient({
  user,
  progress,
  recentActivities,
  achievements: userAchievements,
  phaseProgress,
  writingProjectsCount,
  recentExercises,
}: DashboardClientProps) {
  const currentPhase = progress?.currentPhase ?? 1;
  const phaseInfo = phases?.find((p) => p?.phaseNumber === currentPhase);
  const earnedAchievementIds = userAchievements?.map((a) => a?.achievementId) ?? [];
  const earnedAchievements = achievements?.filter((a) => earnedAchievementIds?.includes(a?.id)) ?? [];

  // Calculate weekly stats
  const weeklyMinutes = recentActivities?.reduce((sum, a) => sum + (a?.totalMinutes ?? 0), 0) ?? 0;
  const weeklyWordsCorrect = recentActivities?.reduce((sum, a) => sum + (a?.wordsCorrect ?? 0), 0) ?? 0;

  const stats = [
    {
      icon: Flame,
      label: "Current Streak",
      value: progress?.currentStreak ?? 0,
      suffix: " days",
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      icon: Target,
      label: "Words Mastered",
      value: progress?.wordsMastered ?? 0,
      suffix: "",
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Trophy,
      label: "Accuracy",
      value: Math.round(progress?.spellingAccuracy ?? 0),
      suffix: "%",
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: Clock,
      label: "Study Time",
      value: progress?.totalStudyMinutes ?? 0,
      suffix: " min",
      color: "text-cyan-500",
      bg: "bg-cyan-100 dark:bg-cyan-900/30",
    },
  ];

  const quickActions = [
    {
      href: "/dashboard/schedule",
      icon: Calendar,
      label: "Today's Lesson",
      description: "30-min daily session",
      color: "from-purple-500 to-purple-600",
    },
    {
      href: "/dashboard/exercises",
      icon: Gamepad2,
      label: "Practice Games",
      description: "Fun spelling exercises",
      color: "from-orange-500 to-orange-600",
    },
    {
      href: "/dashboard/writing",
      icon: PenTool,
      label: "Writing Projects",
      description: "Creative writing",
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Diagnostic Banner (if not completed) */}
      {!progress?.diagnosticCompleted && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-bg rounded-2xl p-6 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Rocket className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Start Your Adventure!</h2>
                <p className="opacity-90">Take the diagnostic assessment to personalize your learning path</p>
              </div>
            </div>
            <Link href="/dashboard/diagnostic">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl shadow-lg flex items-center gap-2"
              >
                Take Assessment
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm card-hover"
          >
            <div className={`${stat.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {stat.value}{stat.suffix}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Progress & Phase */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Phase Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Current Phase</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{phaseInfo?.weeks}</span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {currentPhase}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                  {phaseInfo?.title}
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  {phaseInfo?.description}
                </p>
              </div>
            </div>

            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Progress</span>
              <span className="font-medium text-purple-600 dark:text-purple-400">
                {Math.round(progress?.phaseCompletion ?? 0)}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress?.phaseCompletion ?? 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full progress-bar rounded-full"
              />
            </div>
          </motion.div>

          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Weekly Progress</h3>
            <ProgressChart recentExercises={recentExercises} recentActivities={recentActivities} />
          </motion.div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-3 gap-4">
            {quickActions.map((action, i) => (
              <Link key={action.href} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-br ${action.color} rounded-2xl p-6 text-white shadow-lg card-hover cursor-pointer`}
                >
                  <action.icon className="w-8 h-8 mb-3" />
                  <h4 className="font-bold text-lg">{action.label}</h4>
                  <p className="text-sm opacity-90">{action.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column - Achievements & Activity */}
        <div className="space-y-6">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Achievements</h3>
              <span className="text-sm text-purple-600 dark:text-purple-400">
                {earnedAchievements?.length ?? 0} / {achievements?.length ?? 0}
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {achievements?.slice(0, 8)?.map((achievement) => {
                const isEarned = earnedAchievementIds?.includes(achievement?.id);
                return (
                  <motion.div
                    key={achievement?.id}
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isEarned
                        ? "bg-yellow-100 dark:bg-yellow-900/30 achievement-glow"
                        : "bg-gray-100 dark:bg-slate-700 opacity-50"
                    }`}
                    title={achievement?.title}
                  >
                    {isEarned ? (
                      <Award className="w-6 h-6 text-yellow-500" />
                    ) : (
                      <Star className="w-6 h-6 text-gray-400" />
                    )}
                  </motion.div>
                );
              }) ?? []}
            </div>

            <Link href="/dashboard/achievements">
              <button className="w-full mt-4 py-2 text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors">
                View All Achievements
              </button>
            </Link>
          </motion.div>

          {/* Phase Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Learning Path</h3>
            
            <div className="space-y-3">
              {phases?.slice(0, 4)?.map((phase, i) => {
                const isActive = phase?.phaseNumber === currentPhase;
                const isCompleted = (phase?.phaseNumber ?? 0) < currentPhase;
                const pProgress = phaseProgress?.find((p) => p?.phaseNumber === phase?.phaseNumber);
                
                return (
                  <div
                    key={phase?.phaseNumber}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      isActive
                        ? "bg-purple-100 dark:bg-purple-900/30"
                        : "hover:bg-gray-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "gradient-bg text-white"
                          : "bg-gray-200 dark:bg-slate-600 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : phase?.phaseNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        isActive ? "text-purple-700 dark:text-purple-300" : "text-gray-700 dark:text-gray-300"
                      }`}>
                        {phase?.title}
                      </p>
                      {pProgress && (
                        <div className="h-1.5 bg-gray-100 dark:bg-slate-600 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${pProgress?.completionPct ?? 0}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }) ?? []}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-purple-500 to-orange-500 rounded-2xl p-6 text-white"
          >
            <h3 className="font-bold mb-4">This Week</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-bold">{weeklyMinutes}</p>
                <p className="text-sm opacity-90">Minutes studied</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{weeklyWordsCorrect}</p>
                <p className="text-sm opacity-90">Words correct</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
