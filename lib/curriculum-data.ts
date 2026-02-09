import { DiagnosticQuestion, Phase, DailySchedule, Achievement, WritingProject } from "./types";

export const diagnosticQuestions: DiagnosticQuestion[] = [
  // Part A: Phonetic Awareness (Questions 1-8)
  { id: 1, part: "A", type: "spelling", question: "Spell this word: beautiful", correctAnswer: "beautiful", points: 1, category: "phonetic" },
  { id: 2, part: "A", type: "spelling", question: "Spell this word: receive", correctAnswer: "receive", points: 1, category: "phonetic" },
  { id: 3, part: "A", type: "spelling", question: "Spell this word: separate", correctAnswer: "separate", points: 1, category: "phonetic" },
  { id: 4, part: "A", type: "spelling", question: "Spell this word: believe", correctAnswer: "believe", points: 1, category: "phonetic" },
  { id: 5, part: "A", type: "spelling", question: "Spell this word: beginning", correctAnswer: "beginning", points: 1, category: "phonetic" },
  { id: 6, part: "A", type: "fill_blank", question: "Add '-ed' to 'play'", correctAnswer: "played", points: 2, category: "morphophonemic" },
  { id: 7, part: "A", type: "fill_blank", question: "Add '-ed' to 'cry'", correctAnswer: "cried", points: 2, category: "morphophonemic" },
  { id: 8, part: "A", type: "spelling", question: "Spell this sports word: tournament", correctAnswer: "tournament", points: 2, category: "vocabulary" },
  // Part B: Spelling Rules Knowledge
  { id: 9, part: "B", type: "fill_blank", question: "What happens when you add '-ing' to 'make'?", correctAnswer: "making", points: 2, category: "rules" },
  { id: 10, part: "B", type: "fill_blank", question: "I before E except after ___ (fill in the letter)", correctAnswer: ["c", "C"], points: 2, category: "rules" },
  { id: 11, part: "B", type: "multiple_choice", question: "Choose the correct spelling:", options: ["accross", "across"], correctAnswer: "across", points: 2, category: "rules" },
  { id: 12, part: "B", type: "multiple_choice", question: "Choose the correct spelling:", options: ["occured", "occurred"], correctAnswer: "occurred", points: 2, category: "rules" },
  { id: 13, part: "B", type: "multiple_choice", question: "Choose the correct spelling:", options: ["untill", "until"], correctAnswer: "until", points: 2, category: "rules" },
  { id: 14, part: "B", type: "multiple_choice", question: "Choose the correct spelling:", options: ["tommorow", "tomorrow"], correctAnswer: "tomorrow", points: 2, category: "rules" },
  { id: 15, part: "B", type: "fill_blank", question: "Form the plural of 'tooth'", correctAnswer: "teeth", points: 2, category: "plurals" },
  { id: 16, part: "B", type: "fill_blank", question: "Form the plural of 'crisis'", correctAnswer: "crises", points: 2, category: "plurals" },
  // Part C: Context and Application
  { id: 17, part: "C", type: "multiple_choice", question: "'She gave me a nice ___' (kind words)", options: ["compliment", "complement"], correctAnswer: "compliment", points: 2, category: "homophones" },
  { id: 18, part: "C", type: "multiple_choice", question: "'The colors ___ each other' (go well together)", options: ["compliment", "complement"], correctAnswer: "complement", points: 2, category: "homophones" },
  { id: 19, part: "C", type: "spelling", question: "Spell this word correctly: charactor (character in a story)", correctAnswer: "character", points: 2, category: "vocabulary" },
  { id: 20, part: "C", type: "spelling", question: "Spell this word correctly: favorit (something you like best)", correctAnswer: "favorite", points: 2, category: "vocabulary" },
  { id: 21, part: "C", type: "spelling", question: "Spell this word correctly: achived (reached a goal)", correctAnswer: "achieved", points: 2, category: "vocabulary" },
  { id: 22, part: "C", type: "spelling", question: "Spell this word correctly: oponent (someone you compete against)", correctAnswer: "opponent", points: 2, category: "vocabulary" },
  // Part D: Creative Writing Vocabulary
  { id: 23, part: "D", type: "spelling", question: "Spell this literary term: protagonist (main character)", correctAnswer: "protagonist", points: 2, category: "literary" },
  { id: 24, part: "D", type: "spelling", question: "Spell this descriptive word: mysterious", correctAnswer: "mysterious", points: 2, category: "descriptive" },
  { id: 25, part: "D", type: "spelling", question: "Spell this descriptive word: courageous", correctAnswer: "courageous", points: 2, category: "descriptive" }
];

export const phases: Phase[] = [
  {
    phaseNumber: 1,
    title: "Phonics Foundation Review",
    description: "Master sound-symbol correspondence and basic syllable types",
    objectives: [
      "Master sound-symbol correspondence for all 44 phonemes",
      "Accurately decode and encode single-syllable and simple multisyllabic words",
      "Identify and apply basic syllable types (closed, open, vowel-consonant-e, r-controlled)",
      "Recognize and spell common consonant blends and digraphs"
    ],
    keyConcepts: [
      "Short and long vowel sounds in context",
      "Consonant blends (bl-, str-, -nd, -nch)",
      "Consonant digraphs (sh, ch, th, ph, wh)",
      "R-controlled vowels (ar, er, ir, or, ur)",
      "Syllable division patterns (VC/CV, V/CV, VC/V)",
      "Basic prefixes (un-, re-, pre-) and suffixes (-s, -es, -ing, -ed)"
    ],
    milestones: [
      { week: 1, milestone: "Accurately spell 90% of CVC words" },
      { week: 2, milestone: "Master consonant blends and digraphs with 85% accuracy" },
      { week: 3, milestone: "Correctly divide and spell 80% of two-syllable words" },
      { week: 4, milestone: "Apply basic prefixes/suffixes with 85% accuracy" }
    ],
    totalSessions: 20,
    weeks: "Weeks 1-4"
  },
  {
    phaseNumber: 2,
    title: "Common Spelling Patterns",
    description: "Master common spelling patterns and word families",
    objectives: [
      "Master common spelling patterns and word families",
      "Apply spelling rules for adding suffixes",
      "Recognize and spell words with common prefixes",
      "Distinguish between similar-sounding spelling patterns"
    ],
    keyConcepts: [
      "Drop-e rule (take → taking, hope → hoping)",
      "Doubling rule (run → running, big → bigger)",
      "Change-y-to-i rule (try → tried, happy → happiest)",
      "Plural formation rules (regular, -es, -ies, irregular)",
      "Common word families (-ight, -ought, -ough, -tion, -sion)",
      "Prefixes: dis-, mis-, non-, over-, sub-, inter-"
    ],
    milestones: [
      { week: 5, milestone: "Apply drop-e rule with 90% accuracy" },
      { week: 6, milestone: "Apply doubling rule with 85% accuracy" },
      { week: 8, milestone: "Master y-to-i rule and plural formations with 80% accuracy" },
      { week: 10, milestone: "Correctly use learned prefixes/suffixes in creative writing" }
    ],
    totalSessions: 30,
    weeks: "Weeks 5-10"
  },
  {
    phaseNumber: 3,
    title: "Irregular Words & Exceptions",
    description: "Master high-frequency irregular words and silent letters",
    objectives: [
      "Master high-frequency irregular words (demon words)",
      "Recognize and spell words with silent letters",
      "Understand etymology-based spelling (foreign borrowings)",
      "Apply 'I before E' rule and its exceptions"
    ],
    keyConcepts: [
      "Silent letters: k (knife), w (write), g (gnaw), b (thumb)",
      "Irregular high-frequency words: colonel, necessary, rhythm, Wednesday",
      "Foreign borrowings: ballet, café, karate, tsunami",
      "I before E rule: receive, believe, ceiling, weird",
      "Assimilated prefixes: ad- (accomplish), in- (illegal)"
    ],
    milestones: [
      { week: 12, milestone: "Master 20 high-frequency irregular words" },
      { week: 13, milestone: "Spell words with silent letters at 80% accuracy" },
      { week: 14, milestone: "Apply I before E rule and exceptions with 85% accuracy" },
      { week: 16, milestone: "Use 15+ irregular words correctly in creative writing" }
    ],
    totalSessions: 30,
    weeks: "Weeks 11-16"
  },
  {
    phaseNumber: 4,
    title: "Homophones & Confusing Words",
    description: "Distinguish between common homophones through context",
    objectives: [
      "Distinguish between common homophones through context",
      "Master commonly confused word pairs",
      "Apply appropriate word choice in writing",
      "Understand semantic differences between similar-sounding words"
    ],
    keyConcepts: [
      "Common homophones: their/there/they're, your/you're, to/too/two, its/it's",
      "6th-grade homophones: compliment/complement, capitol/capital, principal/principle",
      "Confusing word pairs: accept/except, desert/dessert, loose/lose",
      "Context-dependent spelling: lead vs. led, read vs. read"
    ],
    milestones: [
      { week: 18, milestone: "Master 10 most common homophone pairs with 90% accuracy" },
      { week: 19, milestone: "Apply grade-level homophones correctly in sentences" },
      { week: 20, milestone: "Use confusing word pairs correctly in original writing" },
      { week: 21, milestone: "Demonstrate mastery through error-free paragraph writing" }
    ],
    totalSessions: 25,
    weeks: "Weeks 17-21"
  },
  {
    phaseNumber: 5,
    title: "Advanced Vocabulary & Academic Words",
    description: "Master Greek and Latin roots for vocabulary expansion",
    objectives: [
      "Master Greek and Latin roots for vocabulary expansion",
      "Spell complex academic and content-area vocabulary",
      "Apply morphological analysis to unknown words",
      "Build creative writing vocabulary with sophisticated word choice"
    ],
    keyConcepts: [
      "Greek roots: tele- (telephone), photo- (photograph), bio- (biography)",
      "Latin roots: script (manuscript), dict (dictionary), port (transport)",
      "Academic vocabulary: analysis, evaluate, synthesize, hypothesis",
      "Content-area words: ecosystem, democracy, equation, metaphor"
    ],
    milestones: [
      { week: 22, milestone: "Identify and define 15 Greek/Latin roots" },
      { week: 23, milestone: "Use morphological analysis to spell 80% of unfamiliar words" },
      { week: 25, milestone: "Master 30 academic vocabulary words" },
      { week: 26, milestone: "Incorporate 20+ advanced words in creative writing" }
    ],
    totalSessions: 25,
    weeks: "Weeks 22-26"
  },
  {
    phaseNumber: 6,
    title: "Creative Writing Mastery",
    description: "Apply all learned spelling skills in creative writing contexts",
    objectives: [
      "Apply all learned spelling skills in creative writing contexts",
      "Master specialized vocabulary for creative writing",
      "Self-edit and proofread for spelling accuracy",
      "Create polished, publication-ready creative pieces"
    ],
    keyConcepts: [
      "Literary terminology: protagonist, antagonist, exposition, foreshadowing",
      "Descriptive vocabulary: luminous, melodious, velvety, exasperated",
      "Dialogue tags: exclaimed, murmured, interrupted, hesitated",
      "Genre-specific vocabulary: fantasy, mystery, sci-fi"
    ],
    milestones: [
      { week: 27, milestone: "Master 25 literary terms with correct spelling" },
      { week: 28, milestone: "Create a 500-word piece with 95%+ spelling accuracy" },
      { week: 29, milestone: "Demonstrate effective self-editing process" },
      { week: 30, milestone: "Complete portfolio with 3+ polished pieces" }
    ],
    totalSessions: 20,
    weeks: "Weeks 27-30"
  }
];

export const getDailySchedule = (phase: number, dayOfWeek: string): DailySchedule => {
  const schedules: Record<number, Record<string, DailySchedule>> = {
    1: {
      monday: {
        dayOfWeek: "Monday",
        visual: { title: "Phoneme-Grapheme Mapping", description: "Review flashcards showing sound-symbol correspondences. Color-code syllable types in 5 multisyllabic words.", duration: 10 },
        auditory: { title: "Sound Blending & Segmentation", description: "Practice blending sounds aloud using 10 target words. Phoneme segmentation: say each sound while tapping.", duration: 10 },
        kinesthetic: { title: "Multi-Sensory Reinforcement", description: "Skywriting: Write 5 challenging words in air with large arm movements while spelling aloud.", duration: 10 }
      },
      tuesday: {
        dayOfWeek: "Tuesday",
        visual: { title: "Word Families & Pattern Recognition", description: "Create word family chart (e.g., -ight family). Identify common patterns in themed word list.", duration: 10 },
        auditory: { title: "Dictation & Listening", description: "Listen to 8 words from weekly list and write them. Read words aloud for self-checking.", duration: 10 },
        kinesthetic: { title: "Active Learning", description: "Letter tile building: Use manipulatives to build 6 target words. Online phonics game.", duration: 10 }
      },
      wednesday: {
        dayOfWeek: "Wednesday",
        visual: { title: "Phoneme-Grapheme Mapping", description: "Review flashcards showing sound-symbol correspondences. Color-code syllable types in 5 multisyllabic words.", duration: 10 },
        auditory: { title: "Sound Blending & Segmentation", description: "Practice blending sounds aloud using 10 target words. Say-spell-say practice.", duration: 10 },
        kinesthetic: { title: "Multi-Sensory Reinforcement", description: "Sand/shaving cream tracing: Trace letters while saying sounds. Sports Spelling Race.", duration: 10 }
      },
      thursday: {
        dayOfWeek: "Thursday",
        visual: { title: "Word Families & Pattern Recognition", description: "Create word family chart (e.g., -ight family). Identify common patterns in themed word list.", duration: 10 },
        auditory: { title: "Dictation & Listening", description: "Create a silly sentence using 4 target words; say aloud dramatically.", duration: 10 },
        kinesthetic: { title: "Active Learning", description: "Movement spelling: Jump rope or bounce ball for each letter. Online game session.", duration: 10 }
      },
      friday: {
        dayOfWeek: "Friday",
        visual: { title: "Phoneme-Grapheme Mapping", description: "Weekly review of sound-symbol correspondences. Color-code syllable types.", duration: 10 },
        auditory: { title: "Sound Blending & Segmentation", description: "Final practice of weekly words. Say-spell-say method.", duration: 10 },
        kinesthetic: { title: "Multi-Sensory Reinforcement", description: "Skywriting and spelling race. Review all weekly words with movement.", duration: 10 }
      }
    }
  };
  
  // Default schedule structure for other phases
  const defaultSchedule: DailySchedule = {
    dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
    visual: { title: "Visual Learning", description: "Pattern recognition, flashcards, and color-coded word study.", duration: 10 },
    auditory: { title: "Auditory Learning", description: "Dictation, oral spelling practice, and listening exercises.", duration: 10 },
    kinesthetic: { title: "Kinesthetic Learning", description: "Movement-based activities, games, and hands-on practice.", duration: 10 }
  };
  
  return schedules?.[phase]?.[dayOfWeek.toLowerCase()] ?? defaultSchedule;
};

export const achievements: Achievement[] = [
  { id: "first_session", title: "Getting Started", description: "Complete your first study session", iconName: "Rocket", category: "milestones", requirement: "Complete 1 session", threshold: 1 },
  { id: "week_streak_3", title: "Hot Streak", description: "Study 3 days in a row", iconName: "Flame", category: "streaks", requirement: "3 day streak", threshold: 3 },
  { id: "week_streak_7", title: "On Fire!", description: "Study 7 days in a row", iconName: "Fire", category: "streaks", requirement: "7 day streak", threshold: 7 },
  { id: "words_25", title: "Word Collector", description: "Master 25 words", iconName: "BookOpen", category: "vocabulary", requirement: "Master 25 words", threshold: 25 },
  { id: "words_50", title: "Vocabulary Builder", description: "Master 50 words", iconName: "Library", category: "vocabulary", requirement: "Master 50 words", threshold: 50 },
  { id: "words_100", title: "Word Wizard", description: "Master 100 words", iconName: "Wand2", category: "vocabulary", requirement: "Master 100 words", threshold: 100 },
  { id: "phase_1_complete", title: "Foundation Master", description: "Complete Phase 1", iconName: "Medal", category: "phases", requirement: "Complete Phase 1", threshold: 1 },
  { id: "phase_2_complete", title: "Pattern Pro", description: "Complete Phase 2", iconName: "Puzzle", category: "phases", requirement: "Complete Phase 2", threshold: 1 },
  { id: "phase_3_complete", title: "Exception Expert", description: "Complete Phase 3", iconName: "Sparkles", category: "phases", requirement: "Complete Phase 3", threshold: 1 },
  { id: "perfect_score", title: "Perfect!", description: "Get 100% on any exercise", iconName: "Star", category: "accuracy", requirement: "100% accuracy", threshold: 1 },
  { id: "writing_project_1", title: "Creative Writer", description: "Complete your first writing project", iconName: "Pencil", category: "writing", requirement: "Complete 1 project", threshold: 1 },
  { id: "writing_project_5", title: "Author in Training", description: "Complete 5 writing projects", iconName: "BookText", category: "writing", requirement: "Complete 5 projects", threshold: 5 },
  { id: "diagnostic_complete", title: "Diagnosed!", description: "Complete the diagnostic assessment", iconName: "ClipboardCheck", category: "milestones", requirement: "Complete diagnostic", threshold: 1 },
  { id: "accuracy_90", title: "Sharp Speller", description: "Achieve 90% overall accuracy", iconName: "Target", category: "accuracy", requirement: "90% accuracy", threshold: 90 },
  { id: "hours_10", title: "Dedicated Learner", description: "Study for 10 hours total", iconName: "Clock", category: "time", requirement: "10 hours", threshold: 600 }
];

export const writingProjects: WritingProject[] = [
  { id: "1", projectNumber: 1, title: "Sports Trading Cards Collection", objective: "Create trading cards for favorite athletes with accurate spelling of names, teams, and statistics.", materials: "Index cards, markers, sports magazines", instructions: ["Choose 10 athletes from different sports", "Create trading card with: Name, team, position, 3 stats, 1 fun fact", "Focus on spelling: position names, action verbs"], spellingFocus: "Proper nouns, sports vocabulary, past tense verbs", time: "30 minutes", phase: "1-2", level: "Beginner" },
  { id: "2", projectNumber: 2, title: "Game Controls Instruction Manual", objective: "Write an instruction manual for a favorite video game with accurate spelling.", materials: "Notebook, pencils, optional computer", instructions: ["List all game controls", "Write step-by-step instructions for basic gameplay", "Include 5 tips for beginners"], spellingFocus: "Command verbs, gaming vocabulary", time: "30-40 minutes", phase: "1-2", level: "Beginner" },
  { id: "3", projectNumber: 3, title: "Anime Character Name Tag Design", objective: "Create name tags for 8 anime characters with character traits.", materials: "Construction paper, markers, stickers", instructions: ["Choose 8 characters from different anime", "Design name tag with: Name, 3 personality traits, 1 special ability", "Decorate with symbols"], spellingFocus: "Adjectives, character trait vocabulary", time: "25-30 minutes", phase: "1-2", level: "Beginner" },
  { id: "4", projectNumber: 4, title: "Cartoon Episode Summary", objective: "Write plot summaries for 5 favorite cartoon episodes.", materials: "Notebook, episode references", instructions: ["Watch or recall 5 cartoon episodes", "Write 4-5 sentence summary for each", "Include: Beginning, middle, end, main problem, solution"], spellingFocus: "Sequence words, action verbs, plot vocabulary", time: "35-40 minutes", phase: "2", level: "Beginner" },
  { id: "5", projectNumber: 5, title: "Sports Play-by-Play Commentary", objective: "Write a sports commentary for a real or imagined game.", materials: "Paper, sports video optional", instructions: ["Choose a sport and game situation", "Write 10-15 sentences of play-by-play action", "Include player names, actions, exciting moments"], spellingFocus: "Present tense verbs, sports terminology, transition words", time: "30 minutes", phase: "2", level: "Beginner" },
  { id: "6", projectNumber: 6, title: "Video Game Review Blog", objective: "Write a 250-word game review with correct spelling and homophone usage.", materials: "Computer/notebook, game experience", instructions: ["Choose a recently played game", "Include: Title, genre, platform, ratings for graphics, gameplay, story", "Write pros and cons (3 each)", "Use at least 5 descriptive adjectives"], spellingFocus: "Homophones, descriptive vocabulary, irregular words", time: "45 minutes", phase: "3-4", level: "Intermediate" },
  { id: "7", projectNumber: 7, title: "Anime Character Profile Database", objective: "Create detailed profiles for 6 anime characters.", materials: "Notebook or digital document", instructions: ["Select 6 characters from different anime", "Create profile with: Full name, age, appearance, personality traits, abilities", "Focus on varied, sophisticated vocabulary"], spellingFocus: "Descriptive adjectives, irregular plurals, foreign borrowings", time: "50-60 minutes", phase: "3-4", level: "Intermediate" },
  { id: "8", projectNumber: 8, title: "Sports Hall of Fame Induction Speech", objective: "Write a 200-word induction speech for a favorite athlete.", materials: "Paper, athlete research", instructions: ["Research athlete's career achievements", "Write speech including: Introduction, 3 major accomplishments, character qualities", "Practice delivering speech aloud"], spellingFocus: "Silent letters, irregular words, formal vocabulary", time: "40 minutes", phase: "3-4", level: "Intermediate" },
  { id: "9", projectNumber: 9, title: "Game Strategy Guide", objective: "Create a comprehensive strategy guide for a favorite game.", materials: "Notebook, game knowledge", instructions: ["Choose one game level or challenge", "Write: Overview, objectives, step-by-step walkthrough", "Include tips & tricks, common mistakes to avoid"], spellingFocus: "Command forms, sequence words, gaming vocabulary", time: "50 minutes", phase: "3-4", level: "Intermediate" },
  { id: "10", projectNumber: 10, title: "Cartoon Crossover Story", objective: "Write a creative 300-word story featuring characters from 2 different cartoons.", materials: "Paper or computer", instructions: ["Choose 2 characters from different cartoons", "Create scenario where they meet", "Include dialogue (at least 6 exchanges)"], spellingFocus: "Homophones, dialogue punctuation, creative vocabulary", time: "45-50 minutes", phase: "4", level: "Intermediate" },
  { id: "11", projectNumber: 11, title: "E-Sports Tournament Report", objective: "Write a journalistic report on a real or fictional e-sports tournament.", materials: "Computer, tournament knowledge", instructions: ["Research or imagine an e-sports tournament", "Write 300-word report with key players, highlights, results", "Use academic vocabulary"], spellingFocus: "Academic words, gaming terminology, Greek/Latin roots", time: "60 minutes", phase: "5", level: "Advanced" },
  { id: "12", projectNumber: 12, title: "Anime Series Analysis Essay", objective: "Write a 400-word analytical essay about themes in a favorite anime.", materials: "Computer, anime knowledge", instructions: ["Choose an anime series", "Identify main theme", "Write essay with thesis, body paragraphs, conclusion"], spellingFocus: "Literary terms, academic vocabulary, complex words", time: "60-70 minutes", phase: "5-6", level: "Advanced" },
  { id: "13", projectNumber: 13, title: "Sports Science Article", objective: "Write an educational article explaining the science behind a sport.", materials: "Computer, research sources", instructions: ["Choose a sport", "Research scientific concepts", "Write 350-word accessible explanation"], spellingFocus: "Scientific vocabulary, academic terms, Greek/Latin roots", time: "70 minutes", phase: "5", level: "Advanced" },
  { id: "14", projectNumber: 14, title: "Original Game Design Document", objective: "Create a comprehensive design document for an original video game concept.", materials: "Computer or notebook", instructions: ["Design original game concept", "Include: Title, genre, story, characters, mechanics", "Use professional vocabulary"], spellingFocus: "Technical vocabulary, creative descriptive words", time: "80-90 minutes", phase: "5-6", level: "Advanced" },
  { id: "15", projectNumber: 15, title: "Anime Episode Script", objective: "Write a complete script for an original 5-minute anime episode.", materials: "Computer, script format reference", instructions: ["Create original characters", "Write script with scene descriptions, dialogue, sound cues", "Include literary elements"], spellingFocus: "Literary terms, dialogue tags, descriptive language", time: "90 minutes", phase: "6", level: "Advanced" },
  { id: "16", projectNumber: 16, title: "Sports Commentary Podcast Script", objective: "Write a 500-word podcast script analyzing a famous sports moment.", materials: "Computer, sports history research", instructions: ["Choose iconic sports moment", "Write with historical context, vivid details, analysis"], spellingFocus: "Advanced descriptive vocabulary, Greek/Latin roots", time: "60-70 minutes", phase: "6", level: "Advanced" },
  { id: "17", projectNumber: 17, title: "Game Review Comparison Article", objective: "Write a comparative analysis of 3 games in the same genre.", materials: "Computer, game experience", instructions: ["Choose 3 games from same genre", "Create comparison chart", "Write 500-word analysis"], spellingFocus: "Comparative language, technical vocabulary", time: "70-80 minutes", phase: "6", level: "Advanced" },
  { id: "18", projectNumber: 18, title: "Cartoon Animation Storyboard", objective: "Create a storyboard with detailed written descriptions for a short cartoon.", materials: "Large paper, drawing supplies", instructions: ["Plan 2-minute cartoon short", "Draw 8-10 panels with descriptions"], spellingFocus: "Cinematic vocabulary, action verbs, descriptive language", time: "90 minutes", phase: "6", level: "Advanced" },
  { id: "19", projectNumber: 19, title: "Fantasy Sports Team Report", objective: "Write a professional report analyzing fantasy sports team performance.", materials: "Computer, fantasy sports knowledge", instructions: ["Create or use existing fantasy team", "Write 400-word analysis"], spellingFocus: "Statistical vocabulary, analytical terms", time: "60 minutes", phase: "5-6", level: "Advanced" },
  { id: "20", projectNumber: 20, title: "My Gaming Journey", objective: "Create a comprehensive multimedia presentation about personal gaming history.", materials: "Computer, photos/screenshots", instructions: ["Outline personal gaming history", "Write 600-word narrative essay", "Add images with captions"], spellingFocus: "Narrative vocabulary, reflective language, literary devices", time: "120 minutes", phase: "6", level: "Advanced" }
];

export const spellingWords = {
  phase1: [
    "sprint", "strength", "splash", "shrink", "prompt", "twelfth", "sketch", "flake", "drone", "shrine",
    "basket", "picnic", "robot", "compete", "respond", "burger", "squirrel", "explore", "emergency", "territory"
  ],
  phase2: [
    "making", "hoping", "creating", "usable", "running", "biggest", "occurred", "traveler", "tried", "happiness",
    "beautiful", "studied", "foxes", "babies", "churches", "leaves", "heroes", "reefs", "shelves", "mice",
    "disagreement", "uncomfortable", "nonexistent", "overreaction", "subtraction", "intercontinental", "meaningful", "fearlessly", "hopelessness"
  ],
  phase3: [
    "knowledge", "wrestle", "gnome", "psychology", "solemn", "salmon", "receipt", "scissors", "mortgage", "handsome",
    "necessary", "recommend", "occasion", "restaurant", "accommodate", "calendar", "colonel", "rhythm", "Wednesday", "Arctic",
    "receive", "believe", "weird", "neighbor", "ceiling", "achieve", "seizure", "freight"
  ],
  phase4: [
    "their", "there", "they're", "your", "you're", "its", "it's", "to", "too", "two",
    "whose", "who's", "compliment", "complement", "capitol", "capital", "stationary", "stationery", "principal", "principle",
    "accept", "except", "desert", "dessert", "loose", "lose", "breath", "breathe", "advice", "advise"
  ],
  phase5: [
    "telephone", "television", "photograph", "biography", "psychology", "automatic", "microscope", "thermometer", "manuscript", "dictionary",
    "interrupt", "transportation", "construction", "submarine", "analysis", "evaluate", "synthesize", "hypothesis", "perspective", "significant",
    "contemporary", "legitimate", "demonstrate", "fundamental", "ecosystem", "democracy", "equation", "civilization", "architecture", "atmosphere"
  ],
  phase6: [
    "protagonist", "antagonist", "exposition", "foreshadowing", "flashback", "metaphor", "simile", "personification", "alliteration", "onomatopoeia",
    "ferocious", "luminous", "treacherous", "spectacular", "mysterious", "courageous", "melancholy", "exasperated", "triumphant", "ominous",
    "whispered", "exclaimed", "interrupted", "murmured", "declared", "sorcerer", "enchanted", "galaxy", "android", "dimension"
  ]
};

export const resources = [
  { category: "foundational_phonics", items: [
    { title: "OnTrack Reading Middle School Phonics Course", description: "A mini-curriculum for middle schoolers to improve decoding of multisyllable words.", qualityRating: 4, difficultyLevel: "intermediate", timeCommitment: "10 sessions of 15 minutes", cost: "Paid (approx. $20)", url: "https://www.ontrackreading.com/phonics-program/middle-school-phonics-course", bestForPhase: "Foundational Phonics" },
    { title: "Reading Horizons", description: "Software program for reading and phonics skills development.", qualityRating: 4, difficultyLevel: "intermediate", timeCommitment: "Varies (self-paced)", cost: "Paid (with free trial)", url: "https://www.readinghorizons.com/", bestForPhase: "Foundational Phonics" },
    { title: "Phonics.com", description: "Free online platform with phonics resources, activities, and games.", qualityRating: 3, difficultyLevel: "beginner", timeCommitment: "Varies (self-paced)", cost: "Free", url: "https://www.phonics.com/", bestForPhase: "Foundational Phonics" }
  ]},
  { category: "spelling_rules_and_patterns", items: [
    { title: "Spelling-Words-Well.com", description: "Spelling resources for 6th grade including word lists, games, worksheets.", qualityRating: 4, difficultyLevel: "intermediate", timeCommitment: "Varies (self-paced)", cost: "Free", url: "https://www.spelling-words-well.com/6th-grade-spelling.html", bestForPhase: "Spelling Rules and Patterns" },
    { title: "Spelling Stars", description: "Interactive games, tests, and customizable spelling lists for 6th grade.", qualityRating: 4, difficultyLevel: "intermediate", timeCommitment: "Varies (self-paced)", cost: "Paid (with free trial)", url: "https://www.spellingstars.com/6th-grade", bestForPhase: "Spelling Rules and Patterns" },
    { title: "All About Spelling", description: "Comprehensive, multisensory spelling program based on Orton-Gillingham approach.", qualityRating: 5, difficultyLevel: "beginner to advanced", timeCommitment: "20 minutes per day", cost: "Paid (approx. $50-65 per level)", url: "https://www.allaboutlearningpress.com/all-about-spelling/", bestForPhase: "Spelling Rules and Patterns" }
  ]},
  { category: "vocabulary_building", items: [
    { title: "Vocabulary.com", description: "Interactive platform for learning new words through games and quizzes.", qualityRating: 5, difficultyLevel: "intermediate to advanced", timeCommitment: "Varies (self-paced)", cost: "Free and paid plans", url: "https://www.vocabulary.com/", bestForPhase: "Vocabulary Building" },
    { title: "Membean", description: "Personalized vocabulary learning using cognitive science for long-term retention.", qualityRating: 5, difficultyLevel: "intermediate to advanced", timeCommitment: "Varies (self-paced)", cost: "Paid", url: "https://membean.com/", bestForPhase: "Vocabulary Building" },
    { title: "Knoword", description: "Engaging vocabulary games and custom flashcards.", qualityRating: 4, difficultyLevel: "beginner to intermediate", timeCommitment: "Varies (self-paced)", cost: "Free and paid plans", url: "https://knoword.com/", bestForPhase: "Vocabulary Building" }
  ]},
  { category: "creative_writing", items: [
    { title: "Night Zookeeper", description: "Gamified language arts program encouraging creative writing through interactive lessons.", qualityRating: 5, difficultyLevel: "beginner to intermediate", timeCommitment: "Varies (self-paced)", cost: "Paid (with free trial)", url: "https://www.nightzookeeper.com/", bestForPhase: "Creative Writing" },
    { title: "Storybird", description: "Platform to create and publish storybooks using professional illustrations.", qualityRating: 4, difficultyLevel: "beginner to intermediate", timeCommitment: "Varies (self-paced)", cost: "Free and paid plans", url: "https://storybird.com/", bestForPhase: "Creative Writing" },
    { title: "BoomWriter", description: "Collaborative writing platform using gamification to engage students.", qualityRating: 4, difficultyLevel: "intermediate", timeCommitment: "Varies (self-paced)", cost: "Paid", url: "https://www.boomwriter.com/", bestForPhase: "Creative Writing" }
  ]},
  { category: "gamified_learning", items: [
    { title: "Spelling Shed", description: "Gamified spelling app with competitive leagues and rewards.", qualityRating: 4, difficultyLevel: "beginner to intermediate", timeCommitment: "Varies (self-paced)", cost: "Paid", url: "https://www.spellingshed.com/", bestForPhase: "Gamified Learning" },
    { title: "SpellingCity", description: "Vocabulary and spelling practice through fun games and activities.", qualityRating: 4, difficultyLevel: "intermediate to advanced", timeCommitment: "Varies (self-paced)", cost: "Free with premium options", url: "https://www.spellingcity.com/", bestForPhase: "Gamified Learning" }
  ]}
];
