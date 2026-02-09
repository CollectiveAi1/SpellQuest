import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create default test user
  const hashedPassword = await bcrypt.hash("johndoe123", 12);

  const user = await prisma.user.upsert({
    where: { email: "john@doe.com" },
    update: {},
    create: {
      email: "john@doe.com",
      password: hashedPassword,
      name: "John Doe",
      role: "STUDENT",
      progress: {
        create: {
          currentPhase: 1,
          phaseCompletion: 0,
          wordsMastered: 0,
          spellingAccuracy: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalStudyMinutes: 0,
          creativeWordCount: 0,
          diagnosticCompleted: false,
        },
      },
    },
  });

  console.log("Created user:", user.email);

  // Create achievements
  const achievements = [
    { achievementId: "first_session", title: "Getting Started", description: "Complete your first study session", iconName: "Rocket", category: "milestones", requirement: "Complete 1 session", threshold: 1 },
    { achievementId: "week_streak_3", title: "Hot Streak", description: "Study 3 days in a row", iconName: "Flame", category: "streaks", requirement: "3 day streak", threshold: 3 },
    { achievementId: "week_streak_7", title: "On Fire!", description: "Study 7 days in a row", iconName: "Fire", category: "streaks", requirement: "7 day streak", threshold: 7 },
    { achievementId: "words_25", title: "Word Collector", description: "Master 25 words", iconName: "BookOpen", category: "vocabulary", requirement: "Master 25 words", threshold: 25 },
    { achievementId: "words_50", title: "Vocabulary Builder", description: "Master 50 words", iconName: "Library", category: "vocabulary", requirement: "Master 50 words", threshold: 50 },
    { achievementId: "words_100", title: "Word Wizard", description: "Master 100 words", iconName: "Wand2", category: "vocabulary", requirement: "Master 100 words", threshold: 100 },
    { achievementId: "phase_1_complete", title: "Foundation Master", description: "Complete Phase 1", iconName: "Medal", category: "phases", requirement: "Complete Phase 1", threshold: 1 },
    { achievementId: "phase_2_complete", title: "Pattern Pro", description: "Complete Phase 2", iconName: "Puzzle", category: "phases", requirement: "Complete Phase 2", threshold: 1 },
    { achievementId: "phase_3_complete", title: "Exception Expert", description: "Complete Phase 3", iconName: "Sparkles", category: "phases", requirement: "Complete Phase 3", threshold: 1 },
    { achievementId: "perfect_score", title: "Perfect!", description: "Get 100% on any exercise", iconName: "Star", category: "accuracy", requirement: "100% accuracy", threshold: 1 },
    { achievementId: "writing_project_1", title: "Creative Writer", description: "Complete your first writing project", iconName: "Pencil", category: "writing", requirement: "Complete 1 project", threshold: 1 },
    { achievementId: "writing_project_5", title: "Author in Training", description: "Complete 5 writing projects", iconName: "BookText", category: "writing", requirement: "Complete 5 projects", threshold: 5 },
    { achievementId: "diagnostic_complete", title: "Diagnosed!", description: "Complete the diagnostic assessment", iconName: "ClipboardCheck", category: "milestones", requirement: "Complete diagnostic", threshold: 1 },
    { achievementId: "accuracy_90", title: "Sharp Speller", description: "Achieve 90% overall accuracy", iconName: "Target", category: "accuracy", requirement: "90% accuracy", threshold: 90 },
    { achievementId: "hours_10", title: "Dedicated Learner", description: "Study for 10 hours total", iconName: "Clock", category: "time", requirement: "10 hours", threshold: 600 },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { achievementId: achievement.achievementId },
      update: {},
      create: achievement,
    });
  }

  console.log("Created achievements:", achievements.length);

  // Create phases
  const phases = [
    {
      phaseNumber: 1,
      title: "Phonics Foundation Review",
      description: "Master sound-symbol correspondence and basic syllable types",
      objectives: ["Master sound-symbol correspondence", "Decode multisyllabic words", "Apply basic syllable types"],
      keyConcepts: ["Vowel sounds", "Consonant blends", "Syllable division"],
      milestones: [{ week: 1, milestone: "90% CVC accuracy" }],
      totalSessions: 20,
      weeks: "Weeks 1-4",
    },
    {
      phaseNumber: 2,
      title: "Common Spelling Patterns",
      description: "Master common spelling patterns and word families",
      objectives: ["Master spelling patterns", "Apply suffix rules", "Recognize prefixes"],
      keyConcepts: ["Drop-e rule", "Doubling rule", "Y-to-I rule"],
      milestones: [{ week: 5, milestone: "90% drop-e accuracy" }],
      totalSessions: 30,
      weeks: "Weeks 5-10",
    },
    {
      phaseNumber: 3,
      title: "Irregular Words & Exceptions",
      description: "Master high-frequency irregular words and silent letters",
      objectives: ["Master irregular words", "Spell silent letter words", "Understand etymology"],
      keyConcepts: ["Silent letters", "I before E rule", "Assimilated prefixes"],
      milestones: [{ week: 12, milestone: "Master 20 irregular words" }],
      totalSessions: 30,
      weeks: "Weeks 11-16",
    },
    {
      phaseNumber: 4,
      title: "Homophones & Confusing Words",
      description: "Distinguish between common homophones through context",
      objectives: ["Distinguish homophones", "Master confused words", "Apply word choice"],
      keyConcepts: ["their/there/they're", "your/you're", "accept/except"],
      milestones: [{ week: 18, milestone: "90% homophone accuracy" }],
      totalSessions: 25,
      weeks: "Weeks 17-21",
    },
    {
      phaseNumber: 5,
      title: "Advanced Vocabulary & Academic Words",
      description: "Master Greek and Latin roots for vocabulary expansion",
      objectives: ["Master Greek/Latin roots", "Spell academic vocabulary", "Apply morphological analysis"],
      keyConcepts: ["Greek roots", "Latin roots", "Academic vocabulary"],
      milestones: [{ week: 22, milestone: "Identify 15 roots" }],
      totalSessions: 25,
      weeks: "Weeks 22-26",
    },
    {
      phaseNumber: 6,
      title: "Creative Writing Mastery",
      description: "Apply all learned spelling skills in creative writing contexts",
      objectives: ["Apply all spelling skills", "Master literary vocabulary", "Self-edit effectively"],
      keyConcepts: ["Literary terms", "Descriptive vocabulary", "Self-editing"],
      milestones: [{ week: 27, milestone: "Master 25 literary terms" }],
      totalSessions: 20,
      weeks: "Weeks 27-30",
    },
  ];

  for (const phase of phases) {
    await prisma.phase.upsert({
      where: { phaseNumber: phase.phaseNumber },
      update: {},
      create: phase,
    });
  }

  console.log("Created phases:", phases.length);

  // Initialize phase 1 progress for test user
  await prisma.phaseProgress.upsert({
    where: {
      userId_phaseNumber: {
        userId: user.id,
        phaseNumber: 1,
      },
    },
    update: {},
    create: {
      userId: user.id,
      phaseNumber: 1,
      completionPct: 0,
      sessionsCompleted: 0,
      totalSessions: 20,
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
