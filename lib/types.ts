/**
 * Shared type definitions for the SpellQuest application.
 */

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: "STUDENT" | "PARENT" | "TEACHER" | "ADMIN";
}

export interface UserProgress {
  id: string;
  currentPhase: number;
  phaseCompletion: number;
  wordsMastered: number;
  spellingAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyMinutes: number;
  creativeWordCount: number;
  diagnosticCompleted: boolean;
  diagnosticScore: number | null;
  recommendedPhase: number | null;
}

export interface DiagnosticQuestion {
  id: number;
  part: string;
  type: "multiple_choice" | "fill_blank" | "spelling" | "short_answer";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  category: string;
}

export interface Phase {
  phaseNumber: number;
  title: string;
  description: string;
  objectives: string[];
  keyConcepts: string[];
  milestones: { week: number; milestone: string }[];
  totalSessions: number;
  weeks: string;
}

export interface DailySchedule {
  dayOfWeek: string;
  visual: {
    title: string;
    description: string;
    duration: number;
  };
  auditory: {
    title: string;
    description: string;
    duration: number;
  };
  kinesthetic: {
    title: string;
    description: string;
    duration: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: string;
  requirement: string;
  threshold: number;
  earned?: boolean;
  earnedAt?: Date;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  qualityRating: number;
  difficultyLevel: string;
  timeCommitment: string;
  cost: string;
  url: string;
  category: string;
  bestForPhase: string;
  bookmarked?: boolean;
}

export interface WritingProject {
  id: string;
  projectNumber: number;
  title: string;
  objective: string;
  materials: string;
  instructions: string[];
  spellingFocus: string;
  time: string;
  phase: string;
  level: string;
  content?: string;
  wordCount?: number;
  status?: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
}

export interface ExerciseResult {
  exerciseType: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpent: number;
  wordsAttempted: string[];
  incorrectWords: string[];
}

export interface ErrorPattern {
  type: string;
  count: number;
  examples: string[];
  recommendation: string;
}
