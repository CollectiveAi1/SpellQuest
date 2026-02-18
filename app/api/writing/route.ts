import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Challenge templates that can be generated when projects are completed
const challengeTemplates = {
  BONUS_CHALLENGE: [
    {
      title: "Quick Character Sketch",
      prompt: "🎨 Create a detailed character description in exactly 100 words. Every word counts! Describe a character from your favorite show or invent one from scratch.",
      guidelines: ["Use exactly 100 words - no more, no less", "Include physical appearance, personality, and one unique trait", "Make every adjective count", "Show don't tell - use actions to reveal personality"],
      examples: ["Example: 'Maya stood at 5'2\", her silver-streaked hair defying gravity...'"],
      spellingFocus: "Descriptive adjectives and character trait vocabulary",
      wordGoal: 100
    },
    {
      title: "Six-Word Story Challenge",
      prompt: "✨ Hemingway once wrote a story in just six words. Now write TEN six-word stories! Each one should tell a complete tale.",
      guidelines: ["Each story must be exactly 6 words", "Include a beginning, middle, and implied ending", "Try different genres: horror, romance, comedy, action", "Make readers feel something with each story"],
      examples: ["Example: 'For sale: baby shoes, never worn.' 'Strangers. Friends. Lovers. Strangers again. End.'"],
      spellingFocus: "Word choice and precise vocabulary",
      wordGoal: 60
    },
    {
      title: "Plot Twist Master",
      prompt: "🔄 Write a short scene that ends with a jaw-dropping plot twist! Set up expectations, then flip everything upside down.",
      guidelines: ["Build a normal scene for the first 80%", "Drop subtle hints that readers might miss", "Make the twist logical but unexpected", "End on the twist - don't explain it"],
      examples: ["Example: A detective solving a crime... twist: the detective is the criminal"],
      spellingFocus: "Narrative vocabulary and transition words",
      wordGoal: 200
    }
  ],
  CREATIVE_EXTENSION: [
    {
      title: "Alternate Ending Writer",
      prompt: "📖 Choose a story you know and write a completely different ending! What if the hero lost? What if the villain won? What if there was a third option?",
      guidelines: ["Start from a specific turning point in the original story", "Stay true to character personalities while changing events", "Make the new ending feel earned and logical", "Show consequences of the changed outcome"],
      examples: ["Example: What if Thanos kept the Infinity Stones? What if Harry joined Voldemort?"],
      spellingFocus: "Narrative vocabulary and story structure words",
      wordGoal: 250
    },
    {
      title: "Letter from a Character",
      prompt: "✉️ Write a letter from one character to another. Maybe it's an apology, a confession, a warning, or a farewell. What would they say?",
      guidelines: ["Use the character's voice - how would THEY write?", "Include specific memories or events", "Show emotion through word choice", "Proper letter format with greeting and closing"],
      examples: ["Example: A letter from Darth Vader to Luke before their final meeting"],
      spellingFocus: "Formal writing and emotional vocabulary",
      wordGoal: 200
    },
    {
      title: "Scene from Another Perspective",
      prompt: "👁️ Take a famous scene and rewrite it from a different character's point of view. The villain, the sidekick, or even an object in the room!",
      guidelines: ["Choose a scene with strong emotions", "Show thoughts and feelings the original didn't reveal", "Maintain consistency with what happened", "Add new details that make sense from this perspective"],
      examples: ["Example: The Titanic sinking from the iceberg's perspective"],
      spellingFocus: "Perspective vocabulary and descriptive language",
      wordGoal: 300
    }
  ],
  THEMED_CHALLENGE: [
    {
      title: "Weather Writer",
      prompt: "🌦️ The weather isn't just background - it's a character! Write a story where weather plays a crucial role. Storm, sunshine, fog, or snow - make it matter!",
      guidelines: ["Describe weather using all five senses", "Use weather to reflect character emotions", "Make weather affect the plot directly", "Use weather-specific vocabulary correctly"],
      examples: ["Example: A fog-covered city where the mist hides secrets"],
      spellingFocus: "Weather vocabulary and atmospheric descriptions",
      wordGoal: 250
    },
    {
      title: "Time Traveler's Diary",
      prompt: "⏰ You've discovered a time machine! Write diary entries from your journeys to 3 different time periods. What do you see? What goes wrong?",
      guidelines: ["Research historical details for accuracy", "Include sensory descriptions of each era", "Show culture shock and adjustment", "Include one mishap or adventure per entry"],
      examples: ["Example: 'Day 1 in Ancient Rome: The smell hit me first...'"],
      spellingFocus: "Historical vocabulary and time-related words",
      wordGoal: 300
    },
    {
      title: "Monster Creator",
      prompt: "👹 Design your own original monster! Describe its appearance, habitat, abilities, weaknesses, and write a short encounter story featuring it.",
      guidelines: ["Make it unique - not just a combination of existing monsters", "Include scientific-sounding explanations", "Give it logical strengths AND weaknesses", "The encounter story should show the monster in action"],
      examples: ["Example: The Whisperghast - a creature that feeds on secrets"],
      spellingFocus: "Descriptive vocabulary and creature terminology",
      wordGoal: 350
    }
  ],
  SKILL_BUILDER: [
    {
      title: "Dialogue Duel",
      prompt: "💬 Write a conversation between two characters who disagree about something important. No narration allowed - ONLY dialogue! Show their personalities through how they speak.",
      guidelines: ["Each character should have a distinct voice", "Use dialogue tags sparingly (said, asked)", "Show emotion through word choice and punctuation", "Build to a climax or resolution"],
      examples: ["Example: Two superheroes arguing about whether to save one person or many"],
      spellingFocus: "Dialogue punctuation and speech vocabulary",
      wordGoal: 200
    },
    {
      title: "Show Don't Tell Challenge",
      prompt: "🎭 Describe these emotions WITHOUT naming them: anger, fear, joy, sadness, love. Show us through actions, physical sensations, and metaphors.",
      guidelines: ["Never use the emotion word itself", "Use body language and physical sensations", "Include environmental reactions", "Make readers FEEL the emotion"],
      examples: ["Example: Instead of 'He was angry' → 'His fists clenched, jaw tight, a vein pulsing at his temple'"],
      spellingFocus: "Emotion vocabulary and sensory words",
      wordGoal: 250
    },
    {
      title: "World Builder",
      prompt: "🌍 Create a completely original world! Describe its geography, climate, creatures, cultures, and one major conflict. Make readers want to visit (or avoid) this place!",
      guidelines: ["Start with a unique 'hook' that makes your world different", "Include a map description or key locations", "Explain how geography affects culture", "Leave mysteries for readers to wonder about"],
      examples: ["Example: A world where gravity reverses every full moon"],
      spellingFocus: "Geographic and cultural vocabulary",
      wordGoal: 400
    }
  ]
};

// Themes based on project categories
const themes = ["sports", "gaming", "anime", "fantasy", "science", "adventure", "mystery", "comedy"];

// Function to generate a new challenge based on completed project
function generateNewChallenge(projectNumber: number, userLevel: string): {
  challengeType: "BONUS_CHALLENGE" | "CREATIVE_EXTENSION" | "THEMED_CHALLENGE" | "SKILL_BUILDER";
  title: string;
  prompt: string;
  guidelines: string[];
  examples: string[];
  spellingFocus: string;
  wordGoal: number;
  theme: string;
} {
  // Determine challenge type based on project number and variety
  const challengeTypes: ("BONUS_CHALLENGE" | "CREATIVE_EXTENSION" | "THEMED_CHALLENGE" | "SKILL_BUILDER")[] = 
    ["BONUS_CHALLENGE", "CREATIVE_EXTENSION", "THEMED_CHALLENGE", "SKILL_BUILDER"];
  
  // Rotate through challenge types based on project number for variety
  const typeIndex = projectNumber % challengeTypes.length;
  const challengeType = challengeTypes[typeIndex];
  
  // Get templates for this type
  const templates = challengeTemplates[challengeType];
  const templateIndex = Math.floor((projectNumber - 1) / 4) % templates.length;
  const template = templates[templateIndex];
  
  // Select theme based on project
  const themeIndex = (projectNumber - 1) % themes.length;
  const theme = themes[themeIndex];
  
  // Adjust word goal based on level
  let adjustedWordGoal = template.wordGoal;
  if (userLevel === "Beginner") {
    adjustedWordGoal = Math.max(50, Math.floor(template.wordGoal * 0.7));
  } else if (userLevel === "Advanced") {
    adjustedWordGoal = Math.floor(template.wordGoal * 1.3);
  }
  
  return {
    challengeType,
    title: template.title,
    prompt: template.prompt,
    guidelines: template.guidelines,
    examples: template.examples,
    spellingFocus: template.spellingFocus,
    wordGoal: adjustedWordGoal,
    theme
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, projectNumber, title, content, wordCount, status } = body;

    // Upsert writing project
    const project = await prisma.writingProject.upsert({
      where: {
        userId_projectNumber: {
          userId,
          projectNumber,
        },
      },
      update: {
        content,
        wordCount,
        status,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
      create: {
        userId,
        projectNumber,
        title,
        content,
        wordCount,
        status,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });

    let newChallenge = null;

    // Update creative word count in progress and generate new challenge
    if (status === "COMPLETED") {
      const userProgress = await prisma.userProgress.findUnique({
        where: { userId },
      });

      await prisma.userProgress.update({
        where: { userId },
        data: {
          creativeWordCount: (userProgress?.creativeWordCount ?? 0) + wordCount,
        },
      });

      // Check for writing achievements
      const completedProjects = await prisma.writingProject.count({
        where: { userId, status: "COMPLETED" },
      });

      if (completedProjects >= 1) {
        await prisma.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId,
              achievementId: "writing_project_1",
            },
          },
          update: {},
          create: {
            userId,
            achievementId: "writing_project_1",
          },
        });
      }

      if (completedProjects >= 5) {
        await prisma.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId,
              achievementId: "writing_project_5",
            },
          },
          update: {},
          create: {
            userId,
            achievementId: "writing_project_5",
          },
        });
      }

      // Generate a new writing challenge as a reward for completing the project
      const userLevel = userProgress?.currentPhase && userProgress.currentPhase >= 5 
        ? "Advanced" 
        : userProgress?.currentPhase && userProgress.currentPhase >= 3 
          ? "Intermediate" 
          : "Beginner";
      
      const challengeData = generateNewChallenge(projectNumber, userLevel);
      
      newChallenge = await prisma.writingChallenge.create({
        data: {
          userId,
          challengeType: challengeData.challengeType,
          title: challengeData.title,
          prompt: challengeData.prompt,
          guidelines: challengeData.guidelines,
          examples: challengeData.examples,
          spellingFocus: challengeData.spellingFocus,
          wordGoal: challengeData.wordGoal,
          level: userLevel,
          theme: challengeData.theme,
          sourceProjectId: projectNumber,
        },
      });
    }

    return NextResponse.json({ success: true, project, newChallenge });
  } catch (error) {
    console.error("Writing error:", error);
    return NextResponse.json(
      { error: "Failed to save project" },
      { status: 500 }
    );
  }
}
