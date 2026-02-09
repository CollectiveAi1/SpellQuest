"use client";

import { motion } from "framer-motion";
import {
  Award,
  Rocket,
  Flame,
  BookOpen,
  Library,
  Wand2,
  Medal,
  Puzzle,
  Sparkles,
  Star,
  Pencil,
  BookText,
  ClipboardCheck,
  Target,
  Clock,
  Lock,
} from "lucide-react";
import { achievements } from "@/lib/curriculum-data";
import Image from "next/image";

interface AchievementsClientProps {
  userAchievements: any[];
  userProgress: any;
}

const iconMap: Record<string, any> = {
  Rocket,
  Flame,
  Fire: Flame,
  BookOpen,
  Library,
  Wand2,
  Medal,
  Puzzle,
  Sparkles,
  Star,
  Pencil,
  BookText,
  ClipboardCheck,
  Target,
  Clock,
};

export default function AchievementsClient({
  userAchievements,
  userProgress,
}: AchievementsClientProps) {
  const earnedIds = userAchievements?.map((a) => a?.achievementId) ?? [];
  const earnedCount = earnedIds?.length ?? 0;
  const totalCount = achievements?.length ?? 0;

  const categories = [
    { id: "milestones", label: "Milestones", color: "purple" },
    { id: "streaks", label: "Streaks", color: "orange" },
    { id: "vocabulary", label: "Vocabulary", color: "green" },
    { id: "phases", label: "Phases", color: "cyan" },
    { id: "accuracy", label: "Accuracy", color: "yellow" },
    { id: "writing", label: "Writing", color: "pink" },
    { id: "time", label: "Time", color: "blue" },
  ];

  const getProgress = (achievement: any) => {
    if (!userProgress) return 0;
    
    switch (achievement?.id) {
      case "week_streak_3":
        return Math.min(100, ((userProgress?.currentStreak ?? 0) / 3) * 100);
      case "week_streak_7":
        return Math.min(100, ((userProgress?.currentStreak ?? 0) / 7) * 100);
      case "words_25":
        return Math.min(100, ((userProgress?.wordsMastered ?? 0) / 25) * 100);
      case "words_50":
        return Math.min(100, ((userProgress?.wordsMastered ?? 0) / 50) * 100);
      case "words_100":
        return Math.min(100, ((userProgress?.wordsMastered ?? 0) / 100) * 100);
      case "accuracy_90":
        return Math.min(100, ((userProgress?.spellingAccuracy ?? 0) / 90) * 100);
      case "hours_10":
        return Math.min(100, ((userProgress?.totalStudyMinutes ?? 0) / 600) * 100);
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image
            src="https://cdn.abacus.ai/images/dd9aad7c-5813-4698-9b00-93c3715a9c99.png"
            alt="Trophy"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Achievements</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Collect badges as you master spelling skills!
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
          <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span className="font-bold text-purple-600 dark:text-purple-400">
            {earnedCount} / {totalCount} Earned
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {categories?.map((category) => {
          const categoryAchievements = achievements?.filter(
            (a) => a?.category === category?.id
          ) ?? [];

          if (categoryAchievements?.length === 0) return null;

          return (
            <div key={category?.id}>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 capitalize">
                {category?.label}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryAchievements?.map((achievement, i) => {
                  const isEarned = earnedIds?.includes(achievement?.id);
                  const Icon = iconMap?.[achievement?.iconName ?? ""] ?? Award;
                  const progress = getProgress(achievement);

                  return (
                    <motion.div
                      key={achievement?.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm ${
                        isEarned ? "border-2 border-yellow-400" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            isEarned
                              ? "bg-yellow-100 dark:bg-yellow-900/30 achievement-glow"
                              : "bg-gray-100 dark:bg-slate-700"
                          }`}
                        >
                          {isEarned ? (
                            <Icon className="w-7 h-7 text-yellow-500" />
                          ) : (
                            <Lock className="w-7 h-7 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-bold ${
                              isEarned
                                ? "text-gray-800 dark:text-white"
                                : "text-gray-400 dark:text-gray-500"
                            }`}
                          >
                            {achievement?.title}
                          </h3>
                          <p
                            className={`text-sm ${
                              isEarned
                                ? "text-gray-500 dark:text-gray-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          >
                            {achievement?.description}
                          </p>
                          {!isEarned && progress > 0 && (
                            <div className="mt-2">
                              <div className="h-1.5 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-500 rounded-full"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-400 mt-1">
                                {Math.round(progress)}% complete
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                }) ?? []}
              </div>
            </div>
          );
        }) ?? []}
      </div>
    </div>
  );
}
