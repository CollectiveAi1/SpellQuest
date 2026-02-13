import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.enum(["STUDENT", "PARENT", "TEACHER", "ADMIN"]).default("STUDENT"),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  avatarId: z.string().optional(),
  themeColor: z.string().optional(),
  title: z.string().optional(),
  bio: z.string().max(500).optional(),
});

export const bookmarkSchema = z.object({
  resourceTitle: z.string(),
  resourceCategory: z.string(),
  action: z.enum(["add", "remove"]),
});

export const dailyActivitySchema = z.object({
  segmentId: z.enum(["visual", "auditory", "kinesthetic"]),
  phaseNumber: z.number().min(1).max(6),
});

export const diagnosticSchema = z.object({
  totalScore: z.number().min(0).max(100),
  partAScore: z.number().min(0).optional(),
  partBScore: z.number().min(0).optional(),
  partCScore: z.number().min(0).optional(),
  partDScore: z.number().min(0).optional(),
  recommendedPhase: z.number().min(1).max(6),
  errorPatterns: z.array(z.string()).optional(),
  answers: z.record(z.any()),
});

export const exerciseResultSchema = z.object({
  exerciseType: z.string(),
  phaseNumber: z.number().int().min(1).max(6),
  score: z.number(),
  totalQuestions: z.number(),
  timeSpent: z.number().optional(),
  wordsAttempted: z.array(z.string()).optional(),
  incorrectWords: z.array(z.string()).optional(),
});

export const writingProjectSchema = z.object({
  projectNumber: z.number(),
  title: z.string(),
  content: z.string(),
  wordCount: z.number(),
  status: z.enum(["DRAFT", "IN_PROGRESS", "COMPLETED"]),
});

export const checkpointSchema = z.object({
  phaseNumber: z.number().int().min(1).max(6),
  score: z.number().int().nonnegative(),
  totalPoints: z.number().int().positive(),
  passed: z.boolean(),
  answers: z.any(),
});
