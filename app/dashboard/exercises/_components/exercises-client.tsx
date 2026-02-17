"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Target,
  Shuffle,
  Volume2,
  Sparkles,
  Trophy,
  Star,
  ChevronRight,
  Check,
  X,
  RotateCcw,
  Zap,
  Layers,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { spellingWords, wordDefinitions } from "@/lib/curriculum-data";

interface ExercisesClientProps {
  userId: string;
  currentPhase: number;
  recentResults: any[];
}

type GameType = "spelling_bee" | "word_match" | "fill_blank" | "word_sort";

// Common spelling mistake patterns for generating challenging wrong options
const commonMistakes: Record<string, string[]> = {
  "ie": ["ei"],
  "ei": ["ie"],
  "tion": ["shun", "sion"],
  "sion": ["tion", "shun"],
  "ough": ["uff", "off", "ow"],
  "ible": ["able"],
  "able": ["ible"],
  "ance": ["ence"],
  "ence": ["ance"],
  "ant": ["ent"],
  "ent": ["ant"],
  "er": ["or", "ar"],
  "or": ["er", "ar"],
  "ar": ["er", "or"],
  "ous": ["us"],
  "ful": ["full"],
  "ly": ["ley", "lee"],
  "ness": ["niss"],
  "ment": ["mint"],
  "ck": ["k", "c"],
  "ph": ["f"],
  "gh": ["g", ""],
  "wh": ["w"],
  "kn": ["n"],
  "wr": ["r"],
  "mb": ["m"],
  "sc": ["s"],
  "ps": ["s"],
  "rh": ["r"],
  "gn": ["n"],
};

// Generate a challenging wrong spelling that looks similar to the correct word
const generateWrongSpelling = (word: string): string => {
  const lowerWord = word.toLowerCase();
  
  // Try to apply common mistake patterns
  for (const [correct, wrongs] of Object.entries(commonMistakes)) {
    if (lowerWord.includes(correct)) {
      const wrongPattern = wrongs[Math.floor(Math.random() * wrongs.length)];
      return word.replace(new RegExp(correct, 'i'), wrongPattern);
    }
  }
  
  // Fallback strategies
  const chars = word.split('');
  const strategies = [
    // Swap adjacent letters
    () => {
      const charsCopy = [...chars];
      const idx = Math.floor(Math.random() * (charsCopy.length - 1));
      [charsCopy[idx], charsCopy[idx + 1]] = [charsCopy[idx + 1], charsCopy[idx]];
      return charsCopy.join('');
    },
    // Double a consonant
    () => {
      const charsCopy = [...chars];
      const consonants = charsCopy.map((c, i) => ({ c, i })).filter(({ c }) => !'aeiou'.includes(c.toLowerCase()));
      if (consonants.length > 0) {
        const { c, i } = consonants[Math.floor(Math.random() * consonants.length)];
        charsCopy.splice(i, 0, c);
      }
      return charsCopy.join('');
    },
    // Remove a doubled letter
    () => {
      const charsCopy = [...chars];
      for (let i = 0; i < charsCopy.length - 1; i++) {
        if (charsCopy[i].toLowerCase() === charsCopy[i + 1].toLowerCase()) {
          charsCopy.splice(i, 1);
          return charsCopy.join('');
        }
      }
      // If no doubled letter, just swap
      const idx = Math.floor(Math.random() * (charsCopy.length - 1));
      [charsCopy[idx], charsCopy[idx + 1]] = [charsCopy[idx + 1], charsCopy[idx]];
      return charsCopy.join('');
    },
    // Replace a vowel with another vowel
    () => {
      const charsCopy = [...chars];
      const vowels = 'aeiou';
      const vowelIndices = charsCopy.map((c, i) => ({ c, i })).filter(({ c }) => vowels.includes(c.toLowerCase()));
      if (vowelIndices.length > 0) {
        const { c, i } = vowelIndices[Math.floor(Math.random() * vowelIndices.length)];
        const newVowel = vowels.replace(c.toLowerCase(), '')[Math.floor(Math.random() * 4)];
        charsCopy[i] = c === c.toUpperCase() ? newVowel.toUpperCase() : newVowel;
      }
      return charsCopy.join('');
    },
  ];
  
  const strategy = strategies[Math.floor(Math.random() * strategies.length)];
  const result = strategy();
  
  // Make sure the wrong spelling is actually different
  return result.toLowerCase() === word.toLowerCase() ? word.slice(0, -1) + 'e' : result;
};

export default function ExercisesClient({
  userId,
  currentPhase,
  recentResults,
}: ExercisesClientProps) {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [gameState, setGameState] = useState<"menu" | "playing" | "results">("menu");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ word: string; correct: boolean; userAnswer: string }[]>([]);
  const [gameWords, setGameWords] = useState<string[]>([]);
  const [fillBlankData, setFillBlankData] = useState<{ word: string; indices: number[] }[]>([]);
  const [sortCategories, setSortCategories] = useState<string[]>([]);
  const [sortedWords, setSortedWords] = useState<Record<string, string[]>>({});
  // Pre-generated wrong spellings for word_match game (stable across renders)
  const [wordMatchOptions, setWordMatchOptions] = useState<{ word: string; wrong: string; options: string[] }[]>([]);
  // Hint feature for fill_blank game
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  // Pattern Sorter category assignments
  const [patternCategories, setPatternCategories] = useState<{ categories: string[]; wordCategories: Record<string, string> }>({ categories: [], wordCategories: {} });
  // Definition visibility for spelling bee
  const [showDefinition, setShowDefinition] = useState(false);

  const phaseKey = `phase${currentPhase}` as keyof typeof spellingWords;
  const availableWords = spellingWords?.[phaseKey] ?? spellingWords?.phase1 ?? [];

  const games = [
    {
      id: "spelling_bee" as GameType,
      title: "Spelling Bee",
      description: "Listen to the word and spell it correctly!",
      icon: Volume2,
      color: "from-purple-500 to-purple-600",
      image: "https://cdn.abacus.ai/images/dd9aad7c-5813-4698-9b00-93c3715a9c99.png",
    },
    {
      id: "fill_blank" as GameType,
      title: "Complete the Word",
      description: "Fill in the missing letters to complete each word!",
      icon: Target,
      color: "from-orange-500 to-orange-600",
      image: "https://cdn.abacus.ai/images/c5196a45-3c32-48d1-b977-455f024dc404.png",
    },
    {
      id: "word_match" as GameType,
      title: "Spot the Spelling",
      description: "Choose the correctly spelled word from tricky options!",
      icon: Shuffle,
      color: "from-cyan-500 to-cyan-600",
      image: "https://cdn.abacus.ai/images/08c5f3c9-e047-4cd3-ae32-65b2b0bf8326.png",
    },
    {
      id: "word_sort" as GameType,
      title: "Pattern Sorter",
      description: "Drag words into their correct spelling pattern categories!",
      icon: Layers,
      color: "from-pink-500 to-pink-600",
      image: "https://cdn.abacus.ai/images/49696dcb-8e49-43cc-a0ea-0a6b5073703c.png",
    },
  ];

  // Pattern detection functions for word sort
  const detectPatterns = (word: string): string[] => {
    const patterns: string[] = [];
    const lowerWord = word.toLowerCase();
    
    // Silent letters
    const silentPatterns = ['kn', 'wr', 'gn', 'mb', 'gh', 'ps', 'rh', 'bt', 'mn'];
    if (silentPatterns.some(p => lowerWord.includes(p))) patterns.push("Silent Letters");
    
    // Double letters
    for (let i = 0; i < lowerWord.length - 1; i++) {
      if (lowerWord[i] === lowerWord[i + 1]) {
        patterns.push("Double Letters");
        break;
      }
    }
    
    // Consonant blends (at start)
    const blends = ['bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'pl', 'pr', 'sc', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'str', 'spr', 'spl', 'shr', 'thr', 'sw', 'tr', 'tw'];
    if (blends.some(b => lowerWord.startsWith(b))) patterns.push("Consonant Blends");
    
    // Vowel teams
    const vowelTeams = ['ai', 'ay', 'ea', 'ee', 'oa', 'oe', 'ow', 'ou', 'ie', 'ei', 'ue', 'oo', 'au', 'aw'];
    if (vowelTeams.some(v => lowerWord.includes(v))) patterns.push("Vowel Teams");
    
    // Suffixes
    const suffixes = ['ing', 'ed', 'tion', 'sion', 'ness', 'ment', 'ful', 'less', 'able', 'ible', 'ous', 'ive', 'ly'];
    if (suffixes.some(s => lowerWord.endsWith(s))) patterns.push("Suffix Words");
    
    // Prefixes
    const prefixes = ['un', 're', 'dis', 'mis', 'pre', 'non', 'over', 'sub', 'inter', 'trans'];
    if (prefixes.some(p => lowerWord.startsWith(p) && lowerWord.length > p.length + 2)) patterns.push("Prefix Words");
    
    return patterns;
  };

  const startGame = (gameType: GameType) => {
    // Create unique word list (no duplicates)
    const uniqueWords = [...new Set(availableWords)];
    const shuffled = [...uniqueWords].sort(() => Math.random() - 0.5).slice(0, 10);
    setGameWords(shuffled);
    setSelectedGame(gameType);
    setGameState("playing");
    setCurrentWordIndex(0);
    setScore(0);
    setAnswers([]);
    setUserAnswer("");
    setRevealedHints([]);
    setHintsUsed(0);
    setShowDefinition(false);

    // Pre-generate fill-in-blank data for consistent display
    if (gameType === "fill_blank") {
      const blankData = shuffled.map(word => {
        const indices: number[] = [];
        const numMissing = Math.max(1, Math.floor(word.length / 3));
        while (indices.length < numMissing) {
          const idx = Math.floor(Math.random() * word.length);
          if (!indices.includes(idx)) {
            indices.push(idx);
          }
        }
        return { word, indices: indices.sort((a, b) => a - b) };
      });
      setFillBlankData(blankData);
    }

    // Pre-generate word match options (stable across renders - fixes hooks error)
    if (gameType === "word_match") {
      const matchOptions = shuffled.map(word => {
        const wrong = generateWrongSpelling(word);
        const options = [word, wrong].sort(() => Math.random() - 0.5);
        return { word, wrong, options };
      });
      setWordMatchOptions(matchOptions);
    }

    // Setup word sort with dynamic categories based on actual words
    if (gameType === "word_sort") {
      // Analyze words to find which patterns they have
      const wordPatternMap: Record<string, string[]> = {};
      const patternCounts: Record<string, number> = {};
      
      shuffled.forEach(word => {
        const patterns = detectPatterns(word);
        wordPatternMap[word] = patterns.length > 0 ? patterns : ["Regular Words"];
        patterns.forEach(p => {
          patternCounts[p] = (patternCounts[p] || 0) + 1;
        });
        if (patterns.length === 0) {
          patternCounts["Regular Words"] = (patternCounts["Regular Words"] || 0) + 1;
        }
      });
      
      // Select top 3-4 categories that have the most words (minimum 2 words each)
      const sortedCategories = Object.entries(patternCounts)
        .filter(([_, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([cat]) => cat);
      
      // Ensure we have at least 3 categories
      if (sortedCategories.length < 3) {
        const allCategories = ["Silent Letters", "Double Letters", "Consonant Blends", "Vowel Teams", "Suffix Words", "Regular Words"];
        allCategories.forEach(cat => {
          if (!sortedCategories.includes(cat) && sortedCategories.length < 3) {
            sortedCategories.push(cat);
          }
        });
      }
      
      // Assign each word to exactly one category (primary pattern)
      const wordCategories: Record<string, string> = {};
      shuffled.forEach(word => {
        const patterns = wordPatternMap[word];
        // Find the best matching category from selected categories
        const matchingCategory = sortedCategories.find(cat => patterns.includes(cat)) || "Regular Words";
        wordCategories[word] = matchingCategory;
      });
      
      // Make sure Regular Words is always available if needed
      if (!sortedCategories.includes("Regular Words")) {
        const hasUnassigned = shuffled.some(w => !sortedCategories.includes(wordCategories[w]));
        if (hasUnassigned) sortedCategories.push("Regular Words");
      }
      
      setSortCategories(sortedCategories);
      setPatternCategories({ categories: sortedCategories, wordCategories });
      setSortedWords({});
    }
  };

  const speakWord = (word: string) => {
    if (typeof window !== "undefined" && window?.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  };

  const checkAnswer = async (answer: string) => {
    const currentWord = gameWords?.[currentWordIndex] ?? "";
    const isCorrect = answer?.toLowerCase()?.trim() === currentWord?.toLowerCase();
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      toast.success("Correct! 🌟");
    } else {
      toast.error(`Incorrect! The answer was: ${currentWord}`);
    }

    setAnswers((prev) => [...(prev ?? []), { word: currentWord, correct: isCorrect, userAnswer: answer }]);

    if (currentWordIndex < (gameWords?.length ?? 0) - 1) {
      setCurrentWordIndex((prev) => prev + 1);
      setUserAnswer("");
      setRevealedHints([]); // Reset hints for next word
      setShowDefinition(false); // Reset definition for next word
    } else {
      // Game finished
      const finalScore = isCorrect ? score + 1 : score;
      setGameState("results");
      
      // Save results
      try {
        await fetch("/api/exercises", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            exerciseType: selectedGame,
            phaseNumber: currentPhase,
            score: finalScore,
            totalQuestions: gameWords?.length ?? 10,
            wordsAttempted: gameWords,
            incorrectWords: answers?.filter((a) => !a?.correct)?.map((a) => a?.word) ?? [],
          }),
        });
      } catch (error) {
        console.error("Failed to save results");
      }
    }
  };

  // Hint function for fill_blank game
  const useHint = () => {
    const currentData = fillBlankData?.[currentWordIndex];
    const missingIndices = currentData?.indices ?? [];
    
    // Find a missing letter that hasn't been revealed yet
    const unrevealed = missingIndices.filter(idx => !revealedHints.includes(idx));
    if (unrevealed.length > 0) {
      const hintIdx = unrevealed[0];
      setRevealedHints(prev => [...prev, hintIdx]);
      setHintsUsed(prev => prev + 1);
      toast("💡 Hint revealed! (-0.5 points)", { icon: "💡" });
    }
  };

  // Game Menu
  if (gameState === "menu") {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-purple-600" />
            Spelling Games
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Practice spelling through fun, interactive games!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {games?.map((game, i) => (
            <motion.div
              key={game?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => startGame(game?.id)}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm cursor-pointer card-hover"
            >
              <div className={`h-32 bg-gradient-to-br ${game?.color} relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-20 h-20">
                    <Image
                      src={game?.image ?? ""}
                      alt={game?.title ?? ""}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <game.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {game?.title}
                  </h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {game?.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">10 words</span>
                  <span className="text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
                    Play <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          )) ?? []}
        </div>

        {/* Recent Results */}
        {(recentResults?.length ?? 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
          >
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">Recent Games</h3>
            <div className="space-y-3">
              {recentResults?.slice(0, 5)?.map((result, i) => (
                <div
                  key={result?.id ?? i}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      (result?.accuracy ?? 0) >= 80
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-orange-100 dark:bg-orange-900/30"
                    }`}>
                      {(result?.accuracy ?? 0) >= 80 ? (
                        <Trophy className="w-5 h-5 text-green-500" />
                      ) : (
                        <Target className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white capitalize">
                        {result?.exerciseType?.replace("_", " ") ?? "Exercise"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(result?.completedAt)?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 dark:text-white">
                      {result?.score ?? 0}/{result?.totalQuestions ?? 10}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.round(result?.accuracy ?? 0)}%
                    </p>
                  </div>
                </div>
              )) ?? []}
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Results Screen
  if (gameState === "results") {
    const accuracy = ((score / (gameWords?.length ?? 1)) * 100);
    const isPassing = accuracy >= 80;

    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
              isPassing ? "bg-green-100 dark:bg-green-900/30" : "bg-orange-100 dark:bg-orange-900/30"
            }`}
          >
            {isPassing ? (
              <Trophy className="w-12 h-12 text-green-500" />
            ) : (
              <Target className="w-12 h-12 text-orange-500" />
            )}
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {isPassing ? "Excellent Work! 🎉" : "Good Effort! 💪"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {isPassing
              ? "You're becoming a spelling champion!"
              : "Keep practicing, you're getting better!"}
          </p>

          <div className="text-6xl font-bold gradient-text mb-2">
            {score}/{gameWords?.length ?? 10}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{Math.round(accuracy)}% accuracy</p>

          {/* Results breakdown */}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
            <div className="space-y-2">
              {answers?.map((answer, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    answer?.correct
                      ? "bg-green-100 dark:bg-green-900/20"
                      : "bg-red-100 dark:bg-red-900/20"
                  }`}
                >
                  <span className="font-medium text-gray-800 dark:text-white">
                    {answer?.word}
                  </span>
                  <div className="flex items-center gap-2">
                    {!answer?.correct && (
                      <span className="text-sm text-red-500 line-through">
                        {answer?.userAnswer}
                      </span>
                    )}
                    {answer?.correct ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
              )) ?? []}
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setGameState("menu")}
              className="flex-1 px-6 py-3 border-2 border-purple-500 text-purple-600 dark:text-purple-400 font-semibold rounded-xl"
            >
              Back to Games
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => startGame(selectedGame ?? "spelling_bee")}
              className="flex-1 px-6 py-3 gradient-bg text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Play Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Playing - Spelling Bee
  if (selectedGame === "spelling_bee") {
    const currentWord = gameWords?.[currentWordIndex] ?? "";
    const definition = wordDefinitions[currentWord.toLowerCase()] || "Definition not available";

    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setGameState("menu")}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ← Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentWordIndex + 1} / {gameWords?.length ?? 10}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-gray-800 dark:text-white">{score}</span>
            </div>
          </div>
        </div>

        <motion.div
          key={currentWordIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm text-center"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            Listen to the word and spell it!
          </h2>

          <div className="flex justify-center items-center gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => speakWord(currentWord)}
              className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center shadow-lg"
            >
              <Volume2 className="w-12 h-12 text-white" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDefinition(!showDefinition)}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-colors ${
                showDefinition 
                  ? "bg-blue-500 text-white" 
                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
              }`}
              title="Show Definition"
            >
              <BookOpen className="w-7 h-7" />
            </motion.button>
          </div>

          <AnimatePresence>
            {showDefinition && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
              >
                <p className="text-sm text-blue-600 dark:text-blue-300 font-medium mb-1">Definition:</p>
                <p className="text-blue-800 dark:text-blue-200 italic">{definition}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && userAnswer && checkAnswer(userAnswer)}
            className="w-full p-4 text-center text-2xl rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Type your answer..."
            autoFocus
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => checkAnswer(userAnswer)}
            disabled={!userAnswer}
            className="mt-6 px-8 py-4 gradient-bg text-white font-semibold rounded-xl shadow-lg disabled:opacity-50"
          >
            Check Answer
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Playing - Fill in the Blank (Complete the Word)
  if (selectedGame === "fill_blank") {
    const currentData = fillBlankData?.[currentWordIndex];
    const currentWord = currentData?.word ?? "";
    const missingIndices = currentData?.indices ?? [];
    const unrevealedCount = missingIndices.filter(idx => !revealedHints.includes(idx)).length;
    const definition = wordDefinitions[currentWord.toLowerCase()] || "Definition not available";

    // Create a stable display with fixed letter positions (shows revealed hints)
    const renderWordDisplay = () => {
      return currentWord.split('').map((char, idx) => {
        const isMissing = missingIndices.includes(idx);
        const isRevealed = revealedHints.includes(idx);
        return (
          <span
            key={idx}
            className={`inline-block w-10 h-14 mx-1 text-4xl font-mono font-bold flex items-center justify-center rounded-lg ${
              isMissing && !isRevealed
                ? "bg-purple-100 dark:bg-purple-900/30 border-2 border-dashed border-purple-400 text-purple-600" 
                : isRevealed
                ? "bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 text-yellow-600 dark:text-yellow-400"
                : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white"
            }`}
          >
            {isMissing && !isRevealed ? "_" : char}
          </span>
        );
      });
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setGameState("menu")}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ← Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentWordIndex + 1} / {gameWords?.length ?? 10}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-gray-800 dark:text-white">{score}</span>
            </div>
          </div>
        </div>

        <motion.div
          key={currentWordIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm text-center"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            Complete the word!
          </h2>

          <div className="flex justify-center items-center flex-wrap mb-4">
            {renderWordDisplay()}
          </div>

          {/* Definition displayed below the word */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-300" />
              <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Definition:</p>
            </div>
            <p className="text-blue-800 dark:text-blue-200 italic">{definition}</p>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Fill in the {missingIndices.length - revealedHints.length} missing letter{(missingIndices.length - revealedHints.length) !== 1 ? 's' : ''}
            {hintsUsed > 0 && <span className="text-yellow-500 ml-2">({hintsUsed} hint{hintsUsed !== 1 ? 's' : ''} used)</span>}
          </p>

          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && userAnswer && checkAnswer(userAnswer)}
            className="w-full p-4 text-center text-2xl rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Type the complete word..."
            autoFocus
          />

          <div className="flex gap-4 mt-6 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={useHint}
              disabled={unrevealedCount === 0}
              className="px-6 py-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-semibold rounded-xl border-2 border-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 disabled:opacity-50 flex items-center gap-2"
            >
              <Lightbulb className="w-5 h-5" />
              Hint ({unrevealedCount} left)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => checkAnswer(userAnswer)}
              disabled={!userAnswer}
              className="px-8 py-4 gradient-bg text-white font-semibold rounded-xl shadow-lg disabled:opacity-50"
            >
              Check Answer
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Word Sort game - categorize words by pattern (uses dynamic categories)
  if (selectedGame === "word_sort") {
    // Get the correct category from pre-computed word categories
    const getCorrectCategory = (word: string) => {
      return patternCategories.wordCategories[word] || "Regular Words";
    };

    const unsortedWords = gameWords.filter(w => 
      !Object.values(sortedWords).flat().includes(w)
    );

    const handleDrop = async (word: string, category: string) => {
      const correct = getCorrectCategory(word) === category;
      
      const newSortedWords = {
        ...sortedWords,
        [category]: [...(sortedWords[category] || []), word]
      };
      setSortedWords(newSortedWords);
      setUserAnswer(""); // Clear selection after dropping

      if (correct) {
        setScore(prev => prev + 1);
        toast.success("Correct! 🌟");
      } else {
        toast.error(`Oops! "${word}" belongs to ${getCorrectCategory(word)}`);
      }

      // Check if game is done - when ALL words are sorted (none left unsorted)
      const totalSorted = Object.values(newSortedWords).flat().length;
      if (totalSorted >= gameWords.length) {
        // Calculate final score for word_sort
        const finalScore = correct ? score + 1 : score;
        
        // Save results only when actually complete
        try {
          await fetch("/api/exercises", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              exerciseType: selectedGame,
              phaseNumber: currentPhase,
              score: finalScore,
              totalQuestions: gameWords.length,
              wordsAttempted: gameWords,
              incorrectWords: [],
            }),
          });
        } catch (error) {
          console.error("Failed to save results");
        }
        
        setTimeout(() => setGameState("results"), 500);
      }
    };

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setGameState("menu")}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ← Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Sorted: {Object.values(sortedWords).flat().length} / {gameWords.length}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-gray-800 dark:text-white">{score}</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm mb-6"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
            Click a word, then click its category!
          </h2>
          
          {/* Unsorted words */}
          <div className="flex flex-wrap justify-center gap-3 mb-6 min-h-[60px]">
            {unsortedWords.map((word, i) => (
              <motion.button
                key={`${word}-${i}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUserAnswer(userAnswer === word ? "" : word)}
                className={`px-4 py-2 rounded-xl font-medium text-lg transition-all ${
                  userAnswer === word
                    ? "gradient-bg text-white shadow-lg"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-purple-100 dark:hover:bg-purple-900/30"
                }`}
              >
                {word}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Categories */}
        <div className="grid md:grid-cols-3 gap-4">
          {sortCategories.map((category) => (
            <motion.div
              key={category}
              whileHover={userAnswer ? { scale: 1.02 } : {}}
              onClick={() => userAnswer && handleDrop(userAnswer, category)}
              className={`bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm cursor-pointer border-2 transition-all ${
                userAnswer 
                  ? "border-purple-300 dark:border-purple-700 hover:border-purple-500" 
                  : "border-transparent"
              }`}
            >
              <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-center">
                {category}
              </h3>
              <div className="min-h-[100px] bg-gray-50 dark:bg-slate-700 rounded-lg p-3 flex flex-wrap gap-2">
                {(sortedWords[category] || []).map((word, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Word Match game (Spot the Spelling) - uses pre-generated options
  const currentMatchData = wordMatchOptions[currentWordIndex];
  const currentWord = currentMatchData?.word ?? "";
  const options = currentMatchData?.options ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setGameState("menu")}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentWordIndex + 1} / {gameWords?.length ?? 10}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-gray-800 dark:text-white">{score}</span>
          </div>
        </div>
      </div>

      <motion.div
        key={currentWordIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm text-center"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          Choose the correct spelling!
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Look carefully - one has a common spelling mistake!
        </p>

        <div className="space-y-4">
          {options.map((option, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => checkAnswer(option)}
              className="w-full p-6 text-2xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors text-gray-800 dark:text-white"
            >
              {option}
            </motion.button>
          )) ?? []}
        </div>
      </motion.div>
    </div>
  );
}
