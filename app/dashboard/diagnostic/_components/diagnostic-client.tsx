"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Trophy,
  Rocket,
  Target,
  Brain,
  Sparkles,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { diagnosticQuestions, phases } from "@/lib/curriculum-data";
import Image from "next/image";

interface DiagnosticClientProps {
  userId: string;
  diagnosticCompleted: boolean;
  previousResult: any;
}

export default function DiagnosticClient({
  userId,
  diagnosticCompleted,
  previousResult,
}: DiagnosticClientProps) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const question = diagnosticQuestions?.[currentQuestion];
  const totalQuestions = diagnosticQuestions?.length ?? 0;
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  const speakWord = (text: string) => {
    if (typeof window !== "undefined" && window?.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...(prev ?? {}), [question?.id ?? 0]: value }));
  };

  const goNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const calculateResults = () => {
    let totalScore = 0;
    let partAScore = 0;
    let partBScore = 0;
    let partCScore = 0;
    let partDScore = 0;
    const errorPatterns: Record<string, number> = {};

    diagnosticQuestions?.forEach((q) => {
      const userAnswer = (answers?.[q?.id ?? 0] ?? "")?.trim()?.toLowerCase();
      const correct = Array.isArray(q?.correctAnswer)
        ? q?.correctAnswer?.some((a) => a?.toLowerCase() === userAnswer)
        : q?.correctAnswer?.toLowerCase() === userAnswer;

      if (correct) {
        totalScore += q?.points ?? 0;
        if (q?.part === "A") partAScore += q?.points ?? 0;
        if (q?.part === "B") partBScore += q?.points ?? 0;
        if (q?.part === "C") partCScore += q?.points ?? 0;
        if (q?.part === "D") partDScore += q?.points ?? 0;
      } else {
        errorPatterns[q?.category ?? "unknown"] = (errorPatterns?.[q?.category ?? "unknown"] ?? 0) + 1;
      }
    });

    // Determine recommended phase
    let recommendedPhase = 1;
    if (totalScore >= 85) recommendedPhase = 4;
    else if (totalScore >= 70) recommendedPhase = 3;
    else if (totalScore >= 55) recommendedPhase = 2;
    else if (totalScore >= 40) recommendedPhase = 1;

    return {
      totalScore,
      partAScore,
      partBScore,
      partCScore,
      partDScore,
      recommendedPhase,
      errorPatterns,
    };
  };

  const submitAssessment = async () => {
    setSubmitting(true);
    const results = calculateResults();

    try {
      const res = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...results,
          answers,
        }),
      });

      if (res.ok) {
        setResults(results);
        setShowResults(true);
        toast.success("Assessment completed!");
      } else {
        toast.error("Failed to save results");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Show previous results if already completed
  if (diagnosticCompleted && previousResult && !started) {
    const errorPatternsObj = previousResult?.errorPatterns ?? {};
    const topErrors = Object.entries(errorPatternsObj as Record<string, number>)
      ?.sort((a, b) => (b?.[1] ?? 0) - (a?.[1] ?? 0))
      ?.slice(0, 3);

    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Assessment Complete!</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Completed on {new Date(previousResult?.completedAt)?.toLocaleDateString()}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
              <h3 className="font-bold text-lg text-purple-700 dark:text-purple-300 mb-4">Your Score</h3>
              <div className="text-5xl font-bold gradient-text">{previousResult?.totalScore ?? 0}/100</div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">Part A: {previousResult?.partAScore ?? 0}/40</p>
                <p className="text-gray-600 dark:text-gray-400">Part B: {previousResult?.partBScore ?? 0}/30</p>
                <p className="text-gray-600 dark:text-gray-400">Part C: {previousResult?.partCScore ?? 0}/20</p>
                <p className="text-gray-600 dark:text-gray-400">Part D: {previousResult?.partDScore ?? 0}/10</p>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6">
              <h3 className="font-bold text-lg text-orange-700 dark:text-orange-300 mb-4">Recommended Phase</h3>
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                Phase {previousResult?.recommendedPhase ?? 1}
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {phases?.find((p) => p?.phaseNumber === previousResult?.recommendedPhase)?.title}
              </p>
              {topErrors?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Focus areas:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {topErrors.map(([pattern]) => (
                      <span
                        key={pattern}
                        className="px-3 py-1 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded-full text-sm"
                      >
                        {pattern}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStarted(true)}
              className="flex-1 px-6 py-4 border-2 border-purple-500 text-purple-600 dark:text-purple-400 font-semibold rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
            >
              Retake Assessment
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/dashboard/schedule")}
              className="flex-1 px-6 py-4 gradient-bg text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              Start Learning
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show results after completing
  if (showResults && results) {
    const phaseInfo = phases?.find((p) => p?.phaseNumber === results?.recommendedPhase);

    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 mx-auto gradient-bg rounded-full flex items-center justify-center mb-6"
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Assessment Complete! 🎉
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Great job! Here's your personalized learning path.
          </p>

          <div className="text-6xl font-bold gradient-text mb-2">{results?.totalScore}/100</div>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Total Score</p>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-lg text-purple-700 dark:text-purple-300 mb-2">
              Recommended Starting Phase
            </h3>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {results?.recommendedPhase}
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-gray-800 dark:text-white">{phaseInfo?.title}</p>
                <p className="text-gray-500 dark:text-gray-400">{phaseInfo?.description}</p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/dashboard")}
            className="px-8 py-4 gradient-bg text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 mx-auto"
          >
            <Rocket className="w-5 h-5" />
            Start Your Adventure!
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Start screen
  if (!started) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm text-center"
        >
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Image
              src="https://cdn.abacus.ai/images/7ecf778d-9515-4915-9f7c-d056baecaa42.png"
              alt="Brain with gears - assessment"
              fill
              className="object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Diagnostic Assessment
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
            This 25-question assessment will evaluate your current spelling level and create a
            personalized learning path just for you!
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: ClipboardCheck, label: "25 Questions", desc: "Multiple formats" },
              { icon: Target, label: "Personalized", desc: "Custom learning path" },
              { icon: Brain, label: "No Time Limit", desc: "Go at your pace" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                <item.icon className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                <p className="font-semibold text-gray-800 dark:text-white">{item.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStarted(true)}
            className="px-8 py-4 gradient-bg text-white font-semibold text-lg rounded-xl shadow-lg flex items-center justify-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            Begin Assessment
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Question screen
  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <span>Part {question?.part}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full progress-bar"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm"
        >
          <div className="flex items-start justify-between mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              question?.type === "spelling"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                : question?.type === "multiple_choice"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
            }`}>
              {question?.type === "spelling" ? "Spelling" : question?.type === "multiple_choice" ? "Multiple Choice" : "Fill in the Blank"}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {question?.points} {(question?.points ?? 0) === 1 ? "point" : "points"}
            </span>
          </div>

          {/* For spelling questions, show only audio - hide the word */}
          {question?.type === "spelling" ? (
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                Listen carefully and spell the word you hear!
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => speakWord(String(question?.correctAnswer))}
                className="w-24 h-24 mx-auto gradient-bg rounded-full flex items-center justify-center shadow-lg"
              >
                <Volume2 className="w-12 h-12 text-white" />
              </motion.button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Click to hear the word</p>
            </div>
          ) : (
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
              {question?.question}
            </h2>
          )}

          {/* Answer input */}
          {question?.type === "multiple_choice" ? (
            <div className="space-y-3">
              {question?.options?.map((option, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                    answers?.[question?.id ?? 0] === option
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                  }`}
                >
                  <span className="font-medium text-gray-800 dark:text-white">{option}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={answers?.[question?.id ?? 0] ?? ""}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Type your answer here..."
              autoFocus
            />
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={goPrev}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </motion.button>

            {currentQuestion < totalQuestions - 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goNext}
                disabled={!answers?.[question?.id ?? 0]}
                className="flex items-center gap-2 px-6 py-3 gradient-bg text-white font-medium rounded-xl shadow-lg disabled:opacity-50"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={submitAssessment}
                disabled={!answers?.[question?.id ?? 0] || submitting}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-medium rounded-xl shadow-lg disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submit
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Question navigator */}
      <div className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          {diagnosticQuestions?.map((q, i) => (
            <button
              key={q?.id}
              onClick={() => setCurrentQuestion(i)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                i === currentQuestion
                  ? "gradient-bg text-white"
                  : answers?.[q?.id ?? 0]
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400"
              }`}
            >
              {i + 1}
            </button>
          )) ?? []}
        </div>
      </div>
    </div>
  );
}
