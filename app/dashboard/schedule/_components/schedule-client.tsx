"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Eye,
  Ear,
  Hand,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Flame,
  Star,
  Sparkles,
  Volume2,
  X,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { getDailySchedule, spellingWords } from "@/lib/curriculum-data";
import Image from "next/image";

interface ScheduleClientProps {
  userId: string;
  currentPhase: number;
  todayActivity: any;
  weeklyActivities: any[];
  currentStreak: number;
}

export default function ScheduleClient({
  userId,
  currentPhase,
  todayActivity,
  weeklyActivities,
  currentStreak,
}: ScheduleClientProps) {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const today = new Date();
  const dayOfWeek = days?.[today?.getDay()] ?? "monday";
  const schedule = getDailySchedule(currentPhase, dayOfWeek);

  const [visualComplete, setVisualComplete] = useState(todayActivity?.visualCompleted ?? false);
  const [auditoryComplete, setAuditoryComplete] = useState(todayActivity?.auditoryCompleted ?? false);
  const [kinestheticComplete, setKinestheticComplete] = useState(todayActivity?.kinestheticCompleted ?? false);
  
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [showLesson, setShowLesson] = useState(false);
  const [lessonStep, setLessonStep] = useState(0);

  // Get words for current phase
  const phaseKey = `phase${currentPhase}` as keyof typeof spellingWords;
  const lessonWords = useMemo(() => {
    const words = spellingWords?.[phaseKey] ?? spellingWords?.phase1 ?? [];
    return [...words].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [phaseKey]);

  const segments = [
    {
      id: "visual",
      icon: Eye,
      title: schedule?.visual?.title ?? "Visual Learning",
      description: schedule?.visual?.description ?? "",
      duration: schedule?.visual?.duration ?? 10,
      color: "purple",
      completed: visualComplete,
      setCompleted: setVisualComplete,
    },
    {
      id: "auditory",
      icon: Ear,
      title: schedule?.auditory?.title ?? "Auditory Learning",
      description: schedule?.auditory?.description ?? "",
      duration: schedule?.auditory?.duration ?? 10,
      color: "orange",
      completed: auditoryComplete,
      setCompleted: setAuditoryComplete,
    },
    {
      id: "kinesthetic",
      icon: Hand,
      title: schedule?.kinesthetic?.title ?? "Kinesthetic Learning",
      description: schedule?.kinesthetic?.description ?? "",
      duration: schedule?.kinesthetic?.duration ?? 10,
      color: "cyan",
      completed: kinestheticComplete,
      setCompleted: setKinestheticComplete,
    },
  ];

  const allComplete = visualComplete && auditoryComplete && kinestheticComplete;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, "0")}`;
  };

  const startTimer = (segmentId: string, duration: number) => {
    setActiveTimer(segmentId);
    setTimeRemaining(duration * 60);
    setIsPaused(false);
    setShowLesson(true);
    setLessonStep(0);
  };

  const speakWord = (word: string) => {
    if (typeof window !== "undefined" && window?.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  };

  const closeLesson = () => {
    setShowLesson(false);
    if (activeTimer) {
      completeSegment(activeTimer);
    }
  };

  const completeSegment = useCallback(async (segmentId: string) => {
    const segment = segments?.find((s) => s?.id === segmentId);
    if (segment) {
      segment.setCompleted(true);
    }
    setActiveTimer(null);
    setTimeRemaining(600);

    // Save to database
    try {
      await fetch("/api/daily-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          segmentId,
          phaseNumber: currentPhase,
        }),
      });
      toast.success(`${segmentId.charAt(0).toUpperCase() + segmentId.slice(1)} segment completed! 🌟`);
    } catch (error) {
      console.error("Failed to save activity");
    }
  }, [userId, currentPhase, segments]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            completeSegment(activeTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer, isPaused, timeRemaining, completeSegment]);

  // Get week calendar data
  const getWeekDays = () => {
    const weekDays = [];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      const dateStr = date?.toISOString()?.split("T")?.[0];
      const activity = weeklyActivities?.find((a) => {
        const actDate = new Date(a?.date)?.toISOString()?.split("T")?.[0];
        return actDate === dateStr;
      });

      weekDays.push({
        date,
        dayName: days?.[i]?.slice(0, 3)?.toUpperCase() ?? "",
        dayNum: date?.getDate(),
        isToday: date?.toDateString() === today?.toDateString(),
        completed: activity?.visualCompleted && activity?.auditoryCompleted && activity?.kinestheticCompleted,
        partial: activity && !(activity?.visualCompleted && activity?.auditoryCompleted && activity?.kinestheticCompleted),
      });
    }
    return weekDays;
  };

  const weekDays = getWeekDays();

  // Render lesson content based on active segment
  const renderLessonContent = () => {
    if (!activeTimer) return null;
    
    const segment = segments?.find((s) => s?.id === activeTimer);
    const currentWord = lessonWords?.[lessonStep] ?? "";

    if (activeTimer === "visual") {
      return (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Visual Pattern Recognition
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Study the word family patterns below. Notice how similar endings sound and look alike.
          </p>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 mb-6">
            <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-4">Word Family: -{currentWord?.slice(-3) || "ing"}</h4>
            <div className="flex flex-wrap justify-center gap-4">
              {lessonWords?.map((word, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="px-6 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm"
                >
                  <span className="text-2xl font-mono font-bold text-gray-800 dark:text-white">
                    {word?.slice(0, -3)}<span className="text-purple-600">{word?.slice(-3)}</span>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Tip:</strong> Color-code similar endings in different words to see patterns!
            </p>
          </div>
        </div>
      );
    }

    if (activeTimer === "auditory") {
      return (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Dictation & Listening
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Listen to each word, then say it out loud dramatically like you're in an anime!
          </p>
          
          <div className="space-y-6">
            {lessonWords?.map((word, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.3 }}
                className="flex items-center justify-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => speakWord(word)}
                  className="w-14 h-14 gradient-bg rounded-full flex items-center justify-center shadow-lg"
                >
                  <Volume2 className="w-6 h-6 text-white" />
                </motion.button>
                <span className="text-xl font-bold text-gray-800 dark:text-white min-w-[150px] text-left">
                  Word {i + 1}
                </span>
                <span className="text-sm text-gray-500">(Click to hear)</span>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
            <p className="text-sm text-orange-700 dark:text-orange-300">
              <strong>Challenge:</strong> Create a silly sentence using all 5 words and say it dramatically!
            </p>
          </div>
        </div>
      );
    }

    if (activeTimer === "kinesthetic") {
      return (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Active Learning Time! 🏃‍♂️
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Get moving! Physical activity helps your brain remember better.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-6">
              <h4 className="font-bold text-cyan-700 dark:text-cyan-300 mb-3">
                🏀 Movement Spelling Challenge
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                For each word below, do an action for each letter:
              </p>
              <ul className="text-left text-sm text-gray-600 dark:text-gray-400 space-y-2 max-w-md mx-auto">
                <li>• <strong>Vowels (a,e,i,o,u):</strong> Jump up!</li>
                <li>• <strong>Consonants:</strong> Bounce an imaginary ball</li>
                <li>• <strong>Double letters:</strong> Spin around!</li>
              </ul>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {lessonWords?.map((word, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 border-cyan-200 dark:border-cyan-800"
                >
                  <span className="text-xl font-mono font-bold text-gray-800 dark:text-white">
                    {word}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Bonus:</strong> Air-write each word with your finger while saying the letters!
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Lesson Modal */}
      <AnimatePresence>
        {showLesson && activeTimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && closeLesson()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {segments?.find((s) => s?.id === activeTimer)?.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Time remaining: {formatTime(timeRemaining)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-2 bg-gray-100 dark:bg-slate-700 rounded-xl"
                  >
                    {isPaused ? (
                      <Play className="w-5 h-5 text-green-500" />
                    ) : (
                      <Pause className="w-5 h-5 text-orange-500" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeLesson}
                    className="p-2 bg-gray-100 dark:bg-slate-700 rounded-xl"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </motion.button>
                </div>
              </div>

              <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden mb-8">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeRemaining / 600) * 100}%` }}
                  className="h-full progress-bar"
                />
              </div>

              {renderLessonContent()}

              <div className="mt-8 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeLesson}
                  className="px-8 py-3 gradient-bg text-white font-semibold rounded-xl shadow-lg flex items-center gap-2"
                >
                  Complete Activity
                  <CheckCircle className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Today's Spelling Quest
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {schedule?.dayOfWeek}, Phase {currentPhase}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-orange-600 dark:text-orange-400">{currentStreak} day streak</span>
          </div>
        </div>
      </div>

      {/* Week Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="font-bold text-gray-800 dark:text-white">This Week</h2>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays?.map((day, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`p-3 rounded-xl text-center cursor-pointer transition-colors ${
                day?.isToday
                  ? "gradient-bg text-white"
                  : day?.completed
                  ? "bg-green-100 dark:bg-green-900/30"
                  : day?.partial
                  ? "bg-yellow-100 dark:bg-yellow-900/30"
                  : "bg-gray-100 dark:bg-slate-700"
              }`}
            >
              <p className={`text-xs font-medium ${
                day?.isToday ? "text-white/80" : "text-gray-500 dark:text-gray-400"
              }`}>
                {day?.dayName}
              </p>
              <p className={`text-lg font-bold ${
                day?.isToday ? "text-white" : "text-gray-800 dark:text-white"
              }`}>
                {day?.dayNum}
              </p>
              {day?.completed && !day?.isToday && (
                <CheckCircle className="w-4 h-4 mx-auto text-green-500" />
              )}
            </motion.div>
          )) ?? []}
        </div>
      </motion.div>

      {/* Completion celebration */}
      {allComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gradient-bg rounded-2xl p-6 text-white text-center"
        >
          <Sparkles className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Amazing Work! 🎉</h2>
          <p className="opacity-90">You've completed today's spelling adventure!</p>
        </motion.div>
      )}

      {/* Active Timer */}
      {activeTimer && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white">
                {segments?.find((s) => s?.id === activeTimer)?.title ?? "Activity"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Time remaining</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold gradient-text">{formatTime(timeRemaining)}</div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-3 bg-gray-100 dark:bg-slate-700 rounded-xl"
                >
                  {isPaused ? (
                    <Play className="w-5 h-5 text-green-500" />
                  ) : (
                    <Pause className="w-5 h-5 text-orange-500" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTimeRemaining(600)}
                  className="p-3 bg-gray-100 dark:bg-slate-700 rounded-xl"
                >
                  <RotateCcw className="w-5 h-5 text-gray-500" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => completeSegment(activeTimer)}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium"
                >
                  Done
                </motion.button>
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: `${(timeRemaining / 600) * 100}%` }}
              className="h-full progress-bar"
            />
          </div>
        </motion.div>
      )}

      {/* Learning Segments */}
      <div className="grid md:grid-cols-3 gap-6">
        {segments?.map((segment, i) => (
          <motion.div
            key={segment?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border-2 transition-colors ${
              segment?.completed
                ? "border-green-500"
                : activeTimer === segment?.id
                ? "border-purple-500"
                : "border-transparent"
            }`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
              segment?.color === "purple"
                ? "bg-purple-100 dark:bg-purple-900/30"
                : segment?.color === "orange"
                ? "bg-orange-100 dark:bg-orange-900/30"
                : "bg-cyan-100 dark:bg-cyan-900/30"
            }`}>
              {segment?.completed ? (
                <CheckCircle className="w-7 h-7 text-green-500" />
              ) : (
                <segment.icon className={`w-7 h-7 ${
                  segment?.color === "purple"
                    ? "text-purple-500"
                    : segment?.color === "orange"
                    ? "text-orange-500"
                    : "text-cyan-500"
                }`} />
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              {segment?.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">
              {segment?.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{segment?.duration} min</span>
              </div>

              {segment?.completed ? (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                  Completed!
                </span>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startTimer(segment?.id ?? "", segment?.duration ?? 10)}
                  disabled={activeTimer !== null}
                  className="px-4 py-2 gradient-bg text-white rounded-xl text-sm font-medium shadow-lg disabled:opacity-50"
                >
                  <Play className="w-4 h-4 inline mr-1" />
                  Start
                </motion.button>
              )}
            </div>
          </motion.div>
        )) ?? []}
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 rounded-2xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src="https://cdn.abacus.ai/images/5d32afdb-a3c0-4a7e-98f9-9660611af32e.png"
              alt="Magical book"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-2">Today's Tip 💡</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try saying each word out loud while writing it! This uses both auditory and kinesthetic
              learning to help the spelling stick in your memory.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
