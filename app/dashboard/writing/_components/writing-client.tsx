"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool,
  BookOpen,
  Save,
  Download,
  ChevronLeft,
  CheckCircle,
  Clock,
  FileText,
  Sparkles,
  Edit3,
  Trash2,
  Trophy,
  AlertCircle,
  Lightbulb,
  Target,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { writingProjects, spellingWords } from "@/lib/curriculum-data";

// Dynamic story prompts for each project type - Complete prompts for all 20 projects
const storyPrompts: Record<number, { prompt: string; guidelines: string[]; examples: string[] }> = {
  // BEGINNER PROJECTS (1-5)
  1: {
    prompt: "🏆 Your mission: Create an exciting sports trading card collection! Imagine you're a sports card designer at a famous trading card company. Your boss wants you to create 10 unique cards for the company's newest set.",
    guidelines: [
      "Start with your favorite athlete - describe them like you're introducing a superhero!",
      "Include 3 impressive statistics (like 'scored 50 goals in one season')",
      "Add one surprising fun fact that fans would love to know",
      "Use action words like 'launched', 'dominated', 'conquered'",
      "Double-check the spelling of team names and player positions"
    ],
    examples: ["Example: 'LeBron James | Forward | Los Angeles Lakers | Career Points: 38,652 | Fun Fact: Can solve a Rubik's Cube!'"]
  },
  2: {
    prompt: "🎮 You've been hired as a game guide writer! A new player is struggling with your favorite game. Write instructions that will help them become a pro player like you.",
    guidelines: [
      "Start with 'Welcome, Player!' and set an exciting tone",
      "List controls in order of importance (most used first)",
      "Use bullet points for quick tips",
      "Include warnings like 'Watch out for...' or 'Don't forget to...'",
      "End with an encouraging message"
    ],
    examples: ["Example: '⚡ Pro Tip: Always save your game before boss battles!'"]
  },
  3: {
    prompt: "✨ You're creating character cards for an anime fan convention! Each card should make fans instantly recognize and love the character.",
    guidelines: [
      "Use vivid adjectives (brave, mysterious, energetic, wise)",
      "Describe their signature look in 2-3 sentences",
      "List their special ability with dramatic flair",
      "Include their catchphrase if they have one",
      "Make each card feel like its own mini-story"
    ],
    examples: ["Example: 'Naruto Uzumaki | Energetic, determined, never-give-up ninja | Special Ability: Shadow Clone Jutsu - creates hundreds of copies!'"]
  },
  4: {
    prompt: "📺 You're a cartoon critic writing summaries for a streaming service! Help viewers decide what to watch by writing exciting but spoiler-free summaries.",
    guidelines: [
      "Hook readers with an exciting opening sentence",
      "Introduce the main character's problem without spoilers",
      "Use sequence words: First, Then, Next, Finally",
      "End with a cliffhanger question: 'Will they succeed?'",
      "Keep it under 5 sentences - make every word count!"
    ],
    examples: ["Example: 'When SpongeBob's beloved spatula goes missing, he must...'"]
  },
  5: {
    prompt: "🎙️ You're the announcer at the biggest game of the year! 50,000 fans are watching. Make them feel the excitement!",
    guidelines: [
      "Use present tense: 'He shoots! He SCORES!'",
      "Include crowd reactions: 'The crowd goes WILD!'",
      "Name specific plays and moves",
      "Build tension with short, punchy sentences",
      "Use exclamation points to show excitement!"
    ],
    examples: ["Example: 'Johnson dribbles past the defender! He's open! He takes the shot—NOTHING BUT NET!'"]
  },
  // INTERMEDIATE PROJECTS (6-10)
  6: {
    prompt: "📝 You're a famous game reviewer! Thousands of gamers read your reviews before buying games. Write a review that's honest and helpful.",
    guidelines: [
      "Start with a catchy headline and rating (⭐⭐⭐⭐⭐)",
      "Describe what makes this game unique in the first paragraph",
      "Be specific: Instead of 'good graphics', say 'realistic water effects'",
      "Balance positives and negatives fairly",
      "End with 'Who should play this?' recommendation"
    ],
    examples: ["Example: 'Graphics: ⭐⭐⭐⭐ - The sunset reflections on water are breathtaking, but character faces need work.'"]
  },
  7: {
    prompt: "📋 You're building a digital encyclopedia for anime fans! Create comprehensive character profiles that capture everything a fan needs to know about their favorite characters.",
    guidelines: [
      "Start with the character's full name and any titles or nicknames",
      "Describe their appearance in vivid detail (hair, eyes, signature outfit)",
      "List 5 personality traits with examples of how they show each trait",
      "Explain their backstory - what shaped who they are today?",
      "Include their relationships with other characters",
      "Describe their powers or abilities in detail with strengths and weaknesses"
    ],
    examples: ["Example: 'Goku (Kakarot) | Title: Earth's Mightiest Warrior | Appearance: Spiky black hair, orange gi, muscular build | Traits: Determined (never gives up, even against impossible odds), Kind-hearted (spares enemies who show remorse)...'"]
  },
  8: {
    prompt: "🎤 You've been chosen to introduce a legendary athlete into the Sports Hall of Fame! Write a speech that captures their greatness and inspires everyone in the audience.",
    guidelines: [
      "Open with a powerful hook: a memorable moment or quote",
      "Describe 3 major career achievements in chronological order",
      "Include specific statistics that prove their greatness",
      "Discuss what they mean to fans and the sport itself",
      "Highlight their character traits: sportsmanship, dedication, leadership",
      "End with a memorable closing line that will be remembered"
    ],
    examples: ["Example: 'On a cold February night in 2016, the impossible happened. Steph Curry pulled up from 35 feet and the ball swished through the net. That shot didn't just win the game—it redefined what basketball could be.'"]
  },
  9: {
    prompt: "📖 You're writing the ultimate strategy guide that players will depend on! Make sure every tip and trick is crystal clear and helps players master the game.",
    guidelines: [
      "Start with an overview of the level/challenge you're explaining",
      "List the objectives clearly - what does success look like?",
      "Write step-by-step instructions using numbered lists",
      "Include 'Pro Tips' boxes with advanced strategies",
      "Warn about common mistakes and how to avoid them",
      "Add a 'Troubleshooting' section for when things go wrong"
    ],
    examples: ["Example: 'OBJECTIVE: Defeat the Water Temple Boss | DIFFICULTY: ⭐⭐⭐⭐ | TIME: 20-30 minutes\\n\\nSTEP 1: Enter the boss room with full health and at least 10 arrows...\\n\\n⚠️ COMMON MISTAKE: Don't waste magic on the first phase!'"]
  },
  10: {
    prompt: "🌟 Two characters from different worlds are about to meet! You're the author of this epic crossover story. What adventure awaits when these heroes collide?",
    guidelines: [
      "Set the scene: Where and when do they meet? Make it dramatic!",
      "Show their personalities through dialogue and actions, not just description",
      "Create a conflict or challenge they must face together",
      "Use 'said' alternatives: whispered, exclaimed, muttered, declared",
      "Show how their different abilities complement each other",
      "Include at least 6 exchanges of dialogue with proper punctuation"
    ],
    examples: ["Example: 'SpongeBob stared at the strange yellow mouse. \"Are you some kind of sea creature?\" Pikachu tilted its head. \"Pika?\"\\n\"Well,\" SpongeBob said, extending a spongy hand, \"I'm SpongeBob SquarePants, and I'm ready to be friends!\"'"]
  },
  // ADVANCED PROJECTS (11-20)
  11: {
    prompt: "📰 You're a professional e-sports journalist covering the biggest tournament of the year! Write a news article that captures all the excitement and drama of the competition.",
    guidelines: [
      "Write a compelling headline that makes readers want to read more",
      "Start with the most important news: who won and why it matters",
      "Include direct quotes from players (you can make these up)",
      "Describe key moments and turning points in the matches",
      "Use statistics to support your narrative",
      "End with what this means for the future of competitive gaming"
    ],
    examples: ["Example: 'HISTORIC UPSET: Unknown Team Defeats World Champions in Grand Finals\\n\\nIn what experts are calling the greatest upset in e-sports history, underdog team Phoenix Rising defeated three-time world champions...'"]
  },
  12: {
    prompt: "🎓 You're writing an academic analysis of your favorite anime's themes! Show your understanding of storytelling by exploring the deeper meanings in the narrative.",
    guidelines: [
      "Write a clear thesis statement that identifies the main theme",
      "Use the PEEL structure: Point, Evidence, Explain, Link",
      "Include 3 examples from the anime that support your thesis",
      "Analyze symbolism, character development, and plot elements",
      "Compare the theme to real-world issues or universal experiences",
      "Write a conclusion that restates your thesis and offers final insights"
    ],
    examples: ["Example: 'THESIS: Attack on Titan explores the cycle of violence and hatred, showing how oppression creates the very enemies it seeks to destroy.\\n\\nEVIDENCE 1: The Walls symbolize humanity's attempt to isolate itself from consequences...'"]
  },
  13: {
    prompt: "🔬 You're a science writer making complex sports science accessible to everyone! Explain the physics, biology, or psychology behind athletic performance.",
    guidelines: [
      "Choose a specific scientific concept (aerodynamics, muscle memory, etc.)",
      "Open with an amazing fact or question to grab attention",
      "Explain the science using analogies that anyone can understand",
      "Include real examples from professional sports",
      "Use proper scientific vocabulary (define terms when you first use them)",
      "End with practical tips readers can apply to their own activities"
    ],
    examples: ["Example: 'THE SCIENCE OF THE PERFECT SERVE\\n\\nWhen Serena Williams launches a serve at 128 mph, she's not just using arm strength—she's harnessing the laws of physics. The kinetic chain starts from her feet and travels through her body like a wave...'"]
  },
  14: {
    prompt: "🎯 You're a game designer presenting your original game concept to investors! Create a professional design document that sells your creative vision.",
    guidelines: [
      "Create a compelling title and tagline for your game",
      "Write an executive summary: genre, platform, target audience",
      "Describe the core gameplay loop - what will players do repeatedly?",
      "Design 3 unique characters with names, abilities, and backstories",
      "Explain the game's progression system and rewards",
      "Include technical details: camera perspective, art style, sound design"
    ],
    examples: ["Example: 'CHRONOSHIFTERS: Rewrite History\\nGenre: Action-Adventure RPG | Platform: PC, Console | Target: Ages 13+\\n\\nEXECUTIVE SUMMARY: Players control time-traveling heroes who must prevent villains from changing history...'"]
  },
  15: {
    prompt: "🎬 You're writing the next episode of YOUR anime series! Create original characters, dramatic scenes, and unforgettable dialogue that will have viewers begging for more.",
    guidelines: [
      "Use proper script format: [Scene description] CHARACTER: Dialogue",
      "Include action lines describing movements and expressions",
      "Add sound effects (SFX) and music cues [BGM: Intense battle theme]",
      "Give each character a unique voice and speaking style",
      "Build dramatic tension with pacing - short lines for action, long for emotion",
      "End with a cliffhanger that sets up the next episode"
    ],
    examples: ["Example: '[EXT. MOUNTAIN CLIFF - SUNSET]\\n[BGM: Soft, melancholic piano]\\n\\nAKIRA stands at the edge, wind whipping through her hair. She clutches a broken sword.\\n\\nAKIRA: (whispers) I promised I'd protect them...\\n\\n[SFX: Thunder in the distance]\\n\\nAKIRA: (voice hardening) And I will.'"]
  },
  16: {
    prompt: "🎧 You're hosting a sports history podcast! Write a script that analyzes one of the greatest moments in sports history and keeps listeners engaged from start to finish.",
    guidelines: [
      "Open with a hook that immediately grabs attention",
      "Set the historical context: What was happening at this time?",
      "Build the narrative with vivid sensory details",
      "Include the perspectives of different people involved",
      "Analyze why this moment was historically significant",
      "Connect the past to the present - what's the lasting impact?"
    ],
    examples: ["Example: '[INTRO MUSIC FADES]\\n\\nHey sports fans, welcome back to Legendary Moments! Today we're rewinding to February 22, 1980 - Lake Placid, New York. The United States was facing the Soviet Union in hockey, and what happened next would become known as the Miracle on Ice...'"]
  },
  17: {
    prompt: "⚖️ You're a gaming critic writing a deep comparison of games in the same genre! Help readers understand what makes each game unique and which one is right for them.",
    guidelines: [
      "Create a clear structure with categories (Graphics, Story, Gameplay, etc.)",
      "Be specific with comparisons - use direct examples from each game",
      "Use a rating system consistently across all categories",
      "Include a comparison table or summary chart in text form",
      "Consider different types of players - who will prefer which game?",
      "End with clear recommendations for different player preferences"
    ],
    examples: ["Example: 'BATTLE ROYALE SHOWDOWN: Fortnite vs Apex Legends vs PUBG\\n\\nGRAPHICS:\\n• Fortnite: Colorful, cartoonish art style (⭐⭐⭐⭐)\\n• Apex Legends: Sleek sci-fi aesthetic with detailed characters (⭐⭐⭐⭐⭐)\\n• PUBG: Realistic military visuals (⭐⭐⭐)...'"]
  },
  18: {
    prompt: "🎨 You're creating a professional storyboard for an animated short! Write detailed descriptions that will guide the animators in bringing your vision to life.",
    guidelines: [
      "Number each panel and describe the camera angle (close-up, wide shot, etc.)",
      "Write action descriptions in present tense",
      "Include dialogue and sound effects for each panel",
      "Describe character emotions and body language",
      "Note timing - how long should each shot last?",
      "Add transition notes between scenes (cut to, fade to, dissolve)"
    ],
    examples: ["Example: 'PANEL 1 (2 seconds) | WIDE SHOT\\nA peaceful meadow at dawn. Mist rolls across the grass.\\n[SFX: Birds chirping, gentle wind]\\n\\nPANEL 2 (1 second) | CUT TO - EXTREME CLOSE UP\\nA single flower trembles.\\n[SFX: Rumbling grows louder]\\n\\nPANEL 3 (3 seconds) | SMASH CUT TO - LOW ANGLE\\nA massive dragon foot CRASHES down, shaking the earth!\\n[SFX: BOOM! Ground cracking]'"]
  },
  19: {
    prompt: "📊 You're a fantasy sports analyst writing a professional report! Analyze team performance with statistics, predictions, and strategic recommendations.",
    guidelines: [
      "Open with key performance metrics and rankings",
      "Analyze individual player contributions with statistics",
      "Identify trends - what's improving? What's declining?",
      "Compare performance to league averages",
      "Make predictions based on upcoming matchups",
      "Provide actionable recommendations for managers"
    ],
    examples: ["Example: 'WEEK 8 FANTASY FOOTBALL ANALYSIS\\n\\nTEAM PERFORMANCE SUMMARY\\nCurrent Rank: 3rd | Record: 5-2 | Points For: 847.6\\n\\nTOP PERFORMERS:\\n• QB Josh Allen: 28.4 avg pts (League: 22.1) ✅\\n• RB Derrick Henry: 22.8 avg pts (Trending ↑)\\n\\nCONCERN AREAS:\\n• WR depth severely lacking...'"]
  },
  20: {
    prompt: "📚 You're writing your gaming memoir! Create a personal narrative that takes readers through your journey as a gamer, from your first game to now.",
    guidelines: [
      "Start with your earliest gaming memory - make it vivid and emotional",
      "Organize chronologically with clear transitions between eras",
      "Include specific games, systems, and moments that shaped you",
      "Reflect on what gaming has taught you about life",
      "Describe your evolution as a player - how have you grown?",
      "End with where you are now and hopes for the future"
    ],
    examples: ["Example: 'CHAPTER 1: The Beginning\\n\\nI was six years old when I first held a controller. It was my cousin's Nintendo 64, and the game was Super Mario 64. I remember the weight of it in my small hands, the satisfying click of the buttons, and the wonder of seeing Mario appear on screen. I didn't know it then, but that moment would change my life forever...'"]
  }
};

// Common misspellings dictionary for spell checking
const commonMisspellings: Record<string, string> = {
  "teh": "the", "recieve": "receive", "occured": "occurred", "seperate": "separate",
  "definately": "definitely", "accomodate": "accommodate", "occassion": "occasion",
  "wierd": "weird", "untill": "until", "acheive": "achieve", "beleive": "believe",
  "buisness": "business", "calender": "calendar", "cemetary": "cemetery",
  "collegue": "colleague", "concious": "conscious", "embarass": "embarrass",
  "enviroment": "environment", "existance": "existence", "foriegn": "foreign",
  "freind": "friend", "goverment": "government", "grammer": "grammar",
  "happend": "happened", "harrass": "harass", "immediatly": "immediately",
  "independant": "independent", "knowlege": "knowledge", "libary": "library",
  "mispell": "misspell", "neccessary": "necessary", "noticable": "noticeable",
  "occurence": "occurrence", "persue": "pursue", "posession": "possession",
  "reccomend": "recommend", "restaraunt": "restaurant", "rythm": "rhythm",
  "succesful": "successful", "suprise": "surprise", "tommorow": "tomorrow",
  "truely": "truly", "wether": "whether", "writting": "writing",
  "alot": "a lot", "basicly": "basically", "becuase": "because",
  "beggining": "beginning", "comming": "coming", "diffrent": "different",
  "excercise": "exercise", "famouse": "famous", "finaly": "finally",
  "geting": "getting", "happyness": "happiness", "intresting": "interesting",
  "probaly": "probably", "realy": "really", "sayed": "said",
  "thier": "their", "togeather": "together", "tommorrow": "tomorrow",
};

// Challenge type definitions
interface Challenge {
  id: string;
  challengeType: string;
  title: string;
  prompt: string;
  guidelines: any;
  examples: any;
  spellingFocus: string;
  wordGoal: number;
  level: string;
  theme: string;
  content: string;
  wordCount: number;
  status: string;
  unlockedAt: string | Date;
  completedAt?: string | Date | null;
  sourceProjectId?: number | null;
}

interface WritingClientProps {
  userId: string;
  currentPhase: number;
  userProjects: any[];
  userChallenges?: Challenge[];
}

export default function WritingClient({
  userId,
  currentPhase,
  userProjects: initialUserProjects,
  userChallenges = [],
}: WritingClientProps) {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "editor" | "challenge-editor">("list");
  const [showSpellCheck, setShowSpellCheck] = useState(false);
  const [spellingErrors, setSpellingErrors] = useState<{ word: string; suggestion: string; index: number }[]>([]);
  const [activeTab, setActiveTab] = useState<"projects" | "challenges">("projects");
  const [challenges, setChallenges] = useState<Challenge[]>(userChallenges);
  const [projects, setProjects] = useState<any[]>(initialUserProjects);

  // Get projects for current phase
  const getPhaseRange = (phase: number) => {
    if (phase <= 2) return "1-2";
    if (phase <= 4) return "3-4";
    return "5-6";
  };

  const availableProjects = writingProjects?.filter((p) => {
    const projectPhase = p?.phase ?? "1-2";
    const [min, max] = projectPhase?.split("-")?.map(Number) ?? [1, 2];
    return currentPhase >= (min ?? 1) && currentPhase <= ((max ?? min) + 2);
  }) ?? [];

  const phaseKey = `phase${currentPhase}` as keyof typeof spellingWords;
  const wordBank = spellingWords?.[phaseKey] ?? [];

  const getUserProject = (projectNumber: number) => {
    return projects?.find((p) => p?.projectNumber === projectNumber);
  };

  const startProject = (project: any) => {
    const existing = getUserProject(project?.projectNumber);
    setSelectedProject(project);
    setSelectedChallenge(null);
    setContent(existing?.content ?? "");
    setViewMode("editor");
    setSpellingErrors([]);
    setShowSpellCheck(false);
  };

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setSelectedProject(null);
    setContent(challenge.content ?? "");
    setViewMode("challenge-editor");
    setSpellingErrors([]);
    setShowSpellCheck(false);
  };

  // Spell check function
  const runSpellCheck = useCallback(() => {
    const words = content.split(/\s+/);
    const errors: { word: string; suggestion: string; index: number }[] = [];
    
    words.forEach((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (cleanWord && commonMisspellings[cleanWord]) {
        errors.push({
          word: cleanWord,
          suggestion: commonMisspellings[cleanWord],
          index
        });
      }
    });

    setSpellingErrors(errors);
    setShowSpellCheck(true);
    
    if (errors.length === 0) {
      toast.success("No spelling errors found! 🎉");
    } else {
      toast.error(`Found ${errors.length} potential spelling error${errors.length > 1 ? 's' : ''}`);
    }
  }, [content]);

  // Fix a spelling error
  const fixSpellingError = (error: { word: string; suggestion: string }) => {
    const regex = new RegExp(`\\b${error.word}\\b`, 'gi');
    setContent(prev => prev.replace(regex, error.suggestion));
    setSpellingErrors(prev => prev.filter(e => e.word !== error.word));
    toast.success(`Fixed: "${error.word}" → "${error.suggestion}"`);
  };

  // Fix all errors
  const fixAllErrors = () => {
    let newContent = content;
    spellingErrors.forEach(error => {
      const regex = new RegExp(`\\b${error.word}\\b`, 'gi');
      newContent = newContent.replace(regex, error.suggestion);
    });
    setContent(newContent);
    setSpellingErrors([]);
    toast.success("All spelling errors fixed! 🎉");
  };

  const saveProject = async (status: "DRAFT" | "IN_PROGRESS" | "COMPLETED" = "IN_PROGRESS") => {
    setSaving(true);
    try {
      const wordCount = content?.trim()?.split(/\s+/)?.filter(Boolean)?.length ?? 0;
      
      const response = await fetch("/api/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          projectNumber: selectedProject?.projectNumber,
          title: selectedProject?.title,
          content,
          wordCount,
          status,
        }),
      });
      
      const data = await response.json();
      
      // Update the projects state with the saved content
      if (data.project) {
        setProjects(prev => {
          const existingIndex = prev.findIndex(p => p.projectNumber === selectedProject?.projectNumber);
          if (existingIndex >= 0) {
            // Update existing project
            const updated = [...prev];
            updated[existingIndex] = { ...updated[existingIndex], content, wordCount, status };
            return updated;
          } else {
            // Add new project
            return [...prev, { ...data.project, projectNumber: selectedProject?.projectNumber, content, wordCount, status }];
          }
        });
      }
      
      if (status === "COMPLETED") {
        toast.success("Project completed! 🎉");
        
        // If a new challenge was unlocked, add it to the state and notify user
        if (data.newChallenge) {
          setChallenges(prev => [data.newChallenge, ...prev]);
          toast.success(`🌟 New challenge unlocked: "${data.newChallenge.title}"!`, {
            duration: 5000,
          });
        }
        
        setViewMode("list");
      } else {
        toast.success("Draft saved!");
      }
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const saveChallenge = async (status: "DRAFT" | "IN_PROGRESS" | "COMPLETED" = "IN_PROGRESS") => {
    if (!selectedChallenge) return;
    setSaving(true);
    try {
      const wordCount = content?.trim()?.split(/\s+/)?.filter(Boolean)?.length ?? 0;
      
      const response = await fetch("/api/writing/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: selectedChallenge.id,
          content,
          wordCount,
          status,
        }),
      });
      
      const data = await response.json();
      
      if (status === "COMPLETED") {
        toast.success("Challenge completed! 🏆");
        // Update the challenge in state
        setChallenges(prev => 
          prev.map(c => c.id === selectedChallenge.id ? { ...c, status: "COMPLETED", content, wordCount, completedAt: new Date().toISOString() } : c)
        );
        setViewMode("list");
      } else {
        toast.success("Draft saved!");
        // Update the challenge content in state
        setChallenges(prev => 
          prev.map(c => c.id === selectedChallenge.id ? { ...c, content, wordCount, status } : c)
        );
      }
    } catch (error) {
      toast.error("Failed to save challenge");
    } finally {
      setSaving(false);
    }
  };

  const completedCount = projects?.filter((p) => p?.status === "COMPLETED")?.length ?? 0;
  const [levelFilter, setLevelFilter] = useState<string>("All");

  // Get dynamic prompt for current project
  const currentPrompt = selectedProject ? storyPrompts[selectedProject.projectNumber] : null;

  // Filter projects by level
  const filteredProjects = availableProjects?.filter((p) => {
    if (levelFilter === "All") return true;
    return p?.level === levelFilter;
  }) ?? [];

  if (viewMode === "editor" && selectedProject) {
    const wordCount = content?.trim()?.split(/\s+/)?.filter(Boolean)?.length ?? 0;

    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Projects
          </button>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runSpellCheck}
              className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl font-medium flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Spell Check
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => saveProject("IN_PROGRESS")}
              disabled={saving}
              className="px-4 py-2 border-2 border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => saveProject("COMPLETED")}
              disabled={saving || wordCount < 50}
              className="px-4 py-2 gradient-bg text-white rounded-xl font-medium flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Complete
            </motion.button>
          </div>
        </div>

        {/* Dynamic Story Prompt */}
        {currentPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-900/20 dark:to-orange-900/20 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">Your Writing Mission</h3>
                <p className="text-gray-700 dark:text-gray-300">{currentPrompt.prompt}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Spell Check Results */}
        <AnimatePresence>
          {showSpellCheck && spellingErrors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Spelling Suggestions ({spellingErrors.length})
                </h4>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fixAllErrors}
                  className="px-3 py-1 bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-lg text-sm font-medium"
                >
                  Fix All
                </motion.button>
              </div>
              <div className="flex flex-wrap gap-2">
                {spellingErrors.map((error, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => fixSpellingError(error)}
                    className="px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-sm flex items-center gap-2"
                  >
                    <span className="line-through text-red-500">{error.word}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-green-600 font-medium">{error.suggestion}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {selectedProject?.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {selectedProject?.objective}
              </p>
              
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setShowSpellCheck(false);
                }}
                className="w-full h-96 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                placeholder="Start writing your project here..."
              />

              <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className={wordCount >= 50 ? "text-green-500" : ""}>{wordCount} words {wordCount < 50 && "(minimum 50)"}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Est. time: {selectedProject?.time}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Writing Guidelines */}
            {currentPrompt && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  Writing Guidelines
                </h3>
                <ol className="space-y-3 text-sm">
                  {currentPrompt.guidelines.map((guideline, i) => (
                    <li key={i} className="flex gap-2 text-gray-600 dark:text-gray-400">
                      <span className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ol>
                {currentPrompt.examples.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      {currentPrompt.examples[0]}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Project Steps
              </h3>
              <ol className="space-y-2 text-sm">
                {selectedProject?.instructions?.map((step: string, i: number) => (
                  <li key={i} className="flex gap-2 text-gray-600 dark:text-gray-400">
                    <span className="font-bold text-purple-600">{i + 1}.</span>
                    {step}
                  </li>
                )) ?? []}
              </ol>
            </div>

            {/* Spelling Focus */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6">
              <h3 className="font-bold text-purple-700 dark:text-purple-300 mb-2">
                Spelling Focus
              </h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                {selectedProject?.spellingFocus}
              </p>
            </div>

            {/* Word Bank */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                Word Bank
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Click a word to add it to your writing!</p>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {wordBank?.slice(0, 20)?.map((word: string, i: number) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setContent((prev) => `${prev} ${word}`)}
                    className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    {word}
                  </motion.button>
                )) ?? []}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Challenge Editor View
  if (viewMode === "challenge-editor" && selectedChallenge) {
    const wordCount = content?.trim()?.split(/\s+/)?.filter(Boolean)?.length ?? 0;
    const challengeGuidelines = Array.isArray(selectedChallenge.guidelines) ? selectedChallenge.guidelines : [];
    const challengeExamples = Array.isArray(selectedChallenge.examples) ? selectedChallenge.examples : [];

    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setViewMode("list")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Challenges
          </button>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runSpellCheck}
              className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl font-medium flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Spell Check
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => saveChallenge("IN_PROGRESS")}
              disabled={saving}
              className="px-4 py-2 border-2 border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => saveChallenge("COMPLETED")}
              disabled={saving || wordCount < Math.min(30, selectedChallenge.wordGoal * 0.5)}
              className="px-4 py-2 gradient-bg text-white rounded-xl font-medium flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Trophy className="w-4 h-4" />
              Complete Challenge
            </motion.button>
          </div>
        </div>

        {/* Challenge Prompt */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-50 to-purple-50 dark:from-orange-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-gray-800 dark:text-white">{selectedChallenge.title}</h3>
                <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs rounded-full font-medium">
                  {selectedChallenge.challengeType.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{selectedChallenge.prompt}</p>
            </div>
          </div>
        </motion.div>

        {/* Spell Check Results */}
        <AnimatePresence>
          {showSpellCheck && spellingErrors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Spelling Suggestions ({spellingErrors.length})
                </h4>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fixAllErrors}
                  className="px-3 py-1 bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-lg text-sm font-medium"
                >
                  Fix All
                </motion.button>
              </div>
              <div className="flex flex-wrap gap-2">
                {spellingErrors.map((error, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => fixSpellingError(error)}
                    className="px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-sm flex items-center gap-2"
                  >
                    <span className="line-through text-red-500">{error.word}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-green-600 font-medium">{error.suggestion}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {selectedChallenge.title}
                </h2>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
                  Goal: {selectedChallenge.wordGoal} words
                </span>
              </div>
              
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setShowSpellCheck(false);
                }}
                className="w-full h-96 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                placeholder="Start writing your challenge response here..."
              />

              <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className={wordCount >= selectedChallenge.wordGoal ? "text-green-500 font-medium" : ""}>
                  {wordCount} / {selectedChallenge.wordGoal} words
                  {wordCount >= selectedChallenge.wordGoal && " ✅"}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {selectedChallenge.level} Level
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Writing Guidelines */}
            {challengeGuidelines.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  Challenge Guidelines
                </h3>
                <ol className="space-y-3 text-sm">
                  {challengeGuidelines.map((guideline: string, i: number) => (
                    <li key={i} className="flex gap-2 text-gray-600 dark:text-gray-400">
                      <span className="w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ol>
                {challengeExamples.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      {challengeExamples[0]}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Spelling Focus */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6">
              <h3 className="font-bold text-orange-700 dark:text-orange-300 mb-2">
                Spelling Focus
              </h3>
              <p className="text-sm text-orange-600 dark:text-orange-400">
                {selectedChallenge.spellingFocus}
              </p>
            </div>

            {/* Word Bank */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                Word Bank
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Click a word to add it to your writing!</p>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {wordBank?.slice(0, 20)?.map((word: string, i: number) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setContent((prev) => `${prev} ${word}`)}
                    className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                  >
                    {word}
                  </motion.button>
                )) ?? []}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Counts for challenges
  const completedChallenges = challenges.filter(c => c.status === "COMPLETED").length;
  const activeChallenges = challenges.filter(c => c.status !== "COMPLETED");

  // Project List View
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <PenTool className="w-8 h-8 text-purple-600" />
            Writing Projects
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Creative writing projects themed around sports, gaming & anime!
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <span className="font-bold text-green-600 dark:text-green-400">
              {completedCount} / {writingProjects?.length ?? 20} Completed
            </span>
          </div>
        </div>
      </div>

      {/* Main Tabs: Projects vs Challenges */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "projects"
              ? "border-purple-600 text-purple-600 dark:text-purple-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Projects ({writingProjects?.length ?? 20})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("challenges")}
          className={`px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "challenges"
              ? "border-orange-600 text-orange-600 dark:text-orange-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Bonus Challenges ({challenges.length})
            {activeChallenges.length > 0 && (
              <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-xs rounded-full">
                {activeChallenges.length} new
              </span>
            )}
          </span>
        </button>
      </div>

      {/* Projects Tab Content */}
      {activeTab === "projects" && (
        <>
          {/* Level Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
                  levelFilter === level
                    ? "gradient-bg text-white shadow-lg"
                    : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects?.map((project, i) => {
          const userProject = getUserProject(project?.projectNumber ?? 0);
          const isCompleted = userProject?.status === "COMPLETED";
          const inProgress = userProject?.status === "IN_PROGRESS" || userProject?.status === "DRAFT";

          return (
            <motion.div
              key={project?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm card-hover ${
                isCompleted ? "border-2 border-green-500" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project?.level === "Beginner"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : project?.level === "Intermediate"
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                    : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                }`}>
                  {project?.level}
                </span>
                {isCompleted && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                {project?.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                {project?.objective}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {project?.time}
                </span>
                <span>Phase {project?.phase}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startProject(project)}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  isCompleted
                    ? "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"
                    : inProgress
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                    : "gradient-bg text-white shadow-lg"
                }`}
              >
                {isCompleted ? "View" : inProgress ? "Continue" : "Start Project"}
              </motion.button>
            </motion.div>
          );
        }) ?? []}
      </div>
        </>
      )}

      {/* Challenges Tab Content */}
      {activeTab === "challenges" && (
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-orange-50 to-purple-50 dark:from-orange-900/20 dark:to-purple-900/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">Bonus Writing Challenges</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete projects to unlock special writing challenges! These bonus activities help you practice different writing skills and styles. 
                  Each challenge is tailored to your current skill level.
                </p>
              </div>
            </div>
          </div>

          {challenges.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Challenges Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Complete writing projects to unlock bonus challenges! Each project you finish unlocks a new creative writing challenge.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab("projects")}
                className="px-6 py-3 gradient-bg text-white rounded-xl font-medium shadow-lg"
              >
                Browse Projects
              </motion.button>
            </div>
          ) : (
            <>
              {/* Challenge Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600">{challenges.length}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Unlocked</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{completedChallenges}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">{activeChallenges.length}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {challenges.reduce((acc, c) => acc + (c.wordCount || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Words Written</div>
                </div>
              </div>

              {/* Challenges Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge, i) => {
                  const isCompleted = challenge.status === "COMPLETED";
                  const inProgress = challenge.status === "IN_PROGRESS" || challenge.status === "DRAFT";
                  
                  return (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm card-hover ${
                        isCompleted ? "border-2 border-green-500" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          challenge.challengeType === "BONUS_CHALLENGE"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                            : challenge.challengeType === "CREATIVE_EXTENSION"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            : challenge.challengeType === "THEMED_CHALLENGE"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        }`}>
                          {challenge.challengeType.replace(/_/g, " ")}
                        </span>
                        {isCompleted && (
                          <Trophy className="w-6 h-6 text-green-500" />
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                        {challenge.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                        {challenge.prompt}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {challenge.wordGoal} words
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded-full text-xs">
                          {challenge.level}
                        </span>
                      </div>

                      {/* Progress bar for in-progress challenges */}
                      {inProgress && challenge.wordCount > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{challenge.wordCount} words</span>
                            <span>{Math.round((challenge.wordCount / challenge.wordGoal) * 100)}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-orange-500 transition-all"
                              style={{ width: `${Math.min(100, (challenge.wordCount / challenge.wordGoal) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => startChallenge(challenge)}
                        className={`w-full py-3 rounded-xl font-medium transition-colors ${
                          isCompleted
                            ? "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"
                            : inProgress
                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                            : "bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg"
                        }`}
                      >
                        {isCompleted ? "View" : inProgress ? "Continue" : "Start Challenge"}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
