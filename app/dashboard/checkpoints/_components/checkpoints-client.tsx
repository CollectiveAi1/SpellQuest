"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Lock,
  CheckCircle,
  ChevronRight,
  Star,
  Target,
  Award,
  RotateCcw,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { phases, spellingWords } from "@/lib/curriculum-data";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CheckpointsClientProps {
  userId: string;
  currentPhase: number;
  checkpointResults: any[];
  phaseProgress: any[];
}

interface Question {
  id: number;
  question: string;
  type: "spelling" | "multiple_choice" | "fill_blank";
  options?: string[];
  correctAnswer: string;
  points: number;
}

export default function CheckpointsClient({
  userId,
  currentPhase,
  checkpointResults,
  phaseProgress,
}: CheckpointsClientProps) {
  const router = useRouter();
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const generateQuestions = (phase: number): Question[] => {
    const phaseKey = `phase${phase}` as keyof typeof spellingWords;
    const words = spellingWords?.[phaseKey] ?? spellingWords?.phase1 ?? [];
    const shuffled = [...words]?.sort(() => Math.random() - 0.5);
    
    const questions: Question[] = [];
    
    // Generate 15 questions
    for (let i = 0; i < 15 && i < shuffled.length; i++) {
      const word = shuffled?.[i] ?? "";
      const type = i % 3;
      
      if (type === 0) {
        // Spelling question
        questions.push({
          id: i + 1,
          question: `Spell this word correctly: "${word}"`,
          type: "spelling",
          correctAnswer: word,
          points: 5,
        });
      } else if (type === 1) {
        // Multiple choice - correct vs misspelled
        const misspelled = word?.slice(0, -1) + (word?.slice(-1) === "e" ? "a" : "e");
        const options = [word, misspelled]?.sort(() => Math.random() - 0.5);
        questions.push({
          id: i + 1,
          question: `Which spelling is correct?`,
          type: "multiple_choice",
          options,
          correctAnswer: word,
          points: 5,
        });
      } else {
        // Fill in blank
        const blankIndex = Math.floor((word?.length ?? 1) / 2);
        const display = word?.slice(0, blankIndex) + "___" + word?.slice(blankIndex + 1);
        questions.push({
          id: i + 1,
          question: `Complete the word: ${display}`,
          type: "fill_blank",
          correctAnswer: word,
          points: 5,
        });
      }
    }
    
    return questions;
  };

  const startCheckpoint = (phase: number) => {
    const questions = generateQuestions(phase);
    setTestQuestions(questions);
    setSelectedPhase(phase);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
  };

  const handleAnswer = (value: string) => {
    const question = testQuestions?.[currentQuestion];
    setAnswers((prev) => ({ ...(prev ?? {}), [question?.id ?? 0]: value }));
  };

  const goNext = () => {
    if (currentQuestion < (testQuestions?.length ?? 0) - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const submitCheckpoint = async () => {
    setSubmitting(true);
    let score = 0;
    const totalPoints = (testQuestions?.length ?? 0) * 5;
    
    testQuestions?.forEach((q) => {
      const userAnswer = (answers?.[q?.id ?? 0] ?? "")?.trim()?.toLowerCase();
      if (userAnswer === q?.correctAnswer?.toLowerCase()) {
        score += q?.points ?? 0;
      }
    });

    const passed = (score / totalPoints) * 100 >= 80;

    try {
      const res = await fetch("/api/checkpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          phaseNumber: selectedPhase,
          score,
          totalPoints,
          passed,
          answers,
        }),
      });

      if (res.ok) {
        setResults({ score, totalPoints, passed });
        setShowResults(true);
        toast.success(passed ? "Congratulations! You passed! 🎉" : "Keep practicing! You can do it!");
      }
    } catch (error) {
      toast.error("Failed to save results");
    } finally {
      setSubmitting(false);
    }
  };

  const getPhaseResult = (phase: number) => {
    return checkpointResults?.find((r) => r?.phaseNumber === phase && r?.passed);
  };

  // Results Screen
  if (showResults && results) {
    const percentage = Math.round((results?.score / results?.totalPoints) * 100);

    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm text-center"
        >
          {results?.passed ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-32 h-32 mx-auto mb-6 relative"
              >
                <Image
                  src="https://cdn.abacus.ai/images/dd9aad7c-5813-4698-9b00-93c3715a9c99.png"
                  alt="Trophy"
                  fill
                  className="object-contain"
                />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Phase {selectedPhase} Complete! 🎉
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                You've mastered this phase and can move on!
              </p>
            </>
          ) : (
            <>
              <div className="w-24 h-24 mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6">
                <Target className="w-12 h-12 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Almost There! 💪
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                You need 80% to pass. Keep practicing and try again!
              </p>
            </>
          )}

          <div className="text-6xl font-bold gradient-text mb-2">{percentage}%</div>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            {results?.score} / {results?.totalPoints} points
          </p>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPhase(null)}
              className="flex-1 px-6 py-3 border-2 border-purple-500 text-purple-600 dark:text-purple-400 font-semibold rounded-xl"
            >
              Back to Checkpoints
            </motion.button>
            {!results?.passed && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startCheckpoint(selectedPhase ?? 1)}
                className="flex-1 px-6 py-3 gradient-bg text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Taking Checkpoint
  if (selectedPhase !== null && testQuestions?.length > 0) {
    const question = testQuestions?.[currentQuestion];
    const progress = ((currentQuestion + 1) / (testQuestions?.length ?? 1)) * 100;

    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>Question {currentQuestion + 1} of {testQuestions?.length}</span>
            <span>Phase {selectedPhase} Checkpoint</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full progress-bar"
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
              {question?.points} points
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            {question?.question}
          </h2>

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
              )) ?? []}
            </div>
          ) : (
            <input
              type="text"
              value={answers?.[question?.id ?? 0] ?? ""}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Type your answer..."
              autoFocus
            />
          )}

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={goPrev}
              disabled={currentQuestion === 0}
              className="px-6 py-3 text-gray-600 dark:text-gray-400 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Previous
            </button>

            {currentQuestion < (testQuestions?.length ?? 0) - 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goNext}
                disabled={!answers?.[question?.id ?? 0]}
                className="px-6 py-3 gradient-bg text-white font-medium rounded-xl shadow-lg disabled:opacity-50"
              >
                Next <ChevronRight className="inline w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={submitCheckpoint}
                disabled={!answers?.[question?.id ?? 0] || submitting}
                className="px-6 py-3 bg-green-500 text-white font-medium rounded-xl shadow-lg disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Checkpoint"}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Checkpoint List
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <Trophy className="w-8 h-8 text-purple-600" />
          Phase Checkpoints
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Complete checkpoint assessments to advance to the next phase. Score 80% or higher to pass!
        </p>
      </div>

      <div className="space-y-4">
        {phases?.map((phase, i) => {
          const result = getPhaseResult(phase?.phaseNumber ?? 0);
          const isLocked = (phase?.phaseNumber ?? 0) > currentPhase;
          const isCurrent = phase?.phaseNumber === currentPhase;
          const isPassed = !!result;

          return (
            <motion.div
              key={phase?.phaseNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm ${
                isPassed ? "border-2 border-green-500" : isCurrent ? "border-2 border-purple-500" : ""
              }`}
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  isPassed
                    ? "bg-green-100 dark:bg-green-900/30"
                    : isCurrent
                    ? "gradient-bg"
                    : "bg-gray-100 dark:bg-slate-700"
                }`}>
                  {isPassed ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : isLocked ? (
                    <Lock className="w-8 h-8 text-gray-400" />
                  ) : (
                    <span className="text-2xl font-bold text-white">{phase?.phaseNumber}</span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    Phase {phase?.phaseNumber}: {phase?.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {phase?.description}
                  </p>
                  {result && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Passed with {Math.round((result?.score / result?.totalPoints) * 100)}%
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: isLocked ? 1 : 1.02 }}
                  whileTap={{ scale: isLocked ? 1 : 0.98 }}
                  onClick={() => !isLocked && startCheckpoint(phase?.phaseNumber ?? 1)}
                  disabled={isLocked}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                    isPassed
                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                      : isLocked
                      ? "bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed"
                      : "gradient-bg text-white shadow-lg"
                  }`}
                >
                  {isPassed ? "Retake" : isLocked ? "Locked" : "Start"}
                </motion.button>
              </div>
            </motion.div>
          );
        }) ?? []}
      </div>
    </div>
  );
}
