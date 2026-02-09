"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  User,
  Trophy,
  Palette,
  Edit3,
  Save,
  X,
  Star,
  Clock,
  Flame,
  BookOpen,
  Award,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface ProfileClientProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarId: string;
    themeColor: string;
    title: string;
    bio: string;
    createdAt: string;
  };
  progress: any;
  userAchievements: any[];
  allAchievements: any[];
  stats: {
    exercisesCompleted: number;
    writingProjectsCompleted: number;
    totalStudyMinutes: number;
    currentStreak: number;
    longestStreak: number;
    wordsMastered: number;
  };
}

const avatars = [
  { id: "avatar_wizard", name: "Wizard", image: "https://cdn.abacus.ai/images/b5aa508d-1913-43ea-b995-fad55c3607f6.jpg", color: "from-blue-500 to-purple-500" },
  { id: "avatar_ninja", name: "Ninja", image: "https://cdn.abacus.ai/images/6ea29aa1-6f74-4343-b116-27962d10b08e.jpg", color: "from-red-500 to-gray-800" },
  { id: "avatar_astronaut", name: "Astronaut", image: "https://cdn.abacus.ai/images/b303fbaf-9a8c-41b6-baec-c2d465606668.jpg", color: "from-slate-400 to-blue-500" },
  { id: "avatar_superhero", name: "Superhero", image: "https://cdn.abacus.ai/images/0ee855d5-a815-4920-a360-6bdae892558c.jpg", color: "from-red-500 to-yellow-500" },
  { id: "avatar_robot", name: "Robot", image: "https://cdn.abacus.ai/images/f84e841b-1562-4000-981e-ebfeab9e9899.jpg", color: "from-gray-400 to-green-500" },
  { id: "avatar_dragon", name: "Dragon", image: "https://cdn.abacus.ai/images/ccf31eec-f4d0-424a-949e-c3f84e9ffdad.jpg", color: "from-purple-500 to-orange-500" },
  { id: "avatar_pirate", name: "Pirate", image: "https://cdn.abacus.ai/images/7f48f0c9-fdd4-4cc5-8cce-53b7e6c8bc34.jpg", color: "from-amber-700 to-yellow-500" },
  { id: "avatar_gamer", name: "Gamer", image: "https://cdn.abacus.ai/images/3099ea02-b1c6-420a-b7ad-cf7d3a8b387b.jpg", color: "from-green-400 to-blue-500" },
];

const themeColors = [
  { id: "purple", name: "Royal Purple", class: "bg-purple-500", gradient: "from-purple-500 to-purple-600" },
  { id: "blue", name: "Ocean Blue", class: "bg-blue-500", gradient: "from-blue-500 to-blue-600" },
  { id: "green", name: "Forest Green", class: "bg-green-500", gradient: "from-green-500 to-green-600" },
  { id: "orange", name: "Sunset Orange", class: "bg-orange-500", gradient: "from-orange-500 to-orange-600" },
  { id: "red", name: "Fire Red", class: "bg-red-500", gradient: "from-red-500 to-red-600" },
  { id: "pink", name: "Candy Pink", class: "bg-pink-500", gradient: "from-pink-500 to-pink-600" },
  { id: "cyan", name: "Electric Cyan", class: "bg-cyan-500", gradient: "from-cyan-500 to-cyan-600" },
  { id: "amber", name: "Golden Amber", class: "bg-amber-500", gradient: "from-amber-500 to-amber-600" },
];

const titles = [
  "Spelling Apprentice",
  "Word Warrior",
  "Letter Legend",
  "Spelling Champion",
  "Vocabulary Victor",
  "Grammar Guardian",
  "Phonics Phoenix",
  "Dictionary Master",
];

export default function ProfileClient({
  user,
  progress,
  userAchievements,
  allAchievements,
  stats,
}: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedBio, setEditedBio] = useState(user.bio);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatarId);
  const [selectedTheme, setSelectedTheme] = useState(user.themeColor);
  const [selectedTitle, setSelectedTitle] = useState(user.title);
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const currentAvatar = avatars.find((a) => a.id === selectedAvatar) || avatars[0];
  const currentTheme = themeColors.find((t) => t.id === selectedTheme) || themeColors[0];

  const earnedAchievementIds = userAchievements.map((a) => a.achievementId);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editedName,
          bio: editedBio,
          avatarId: selectedAvatar,
          themeColor: selectedTheme,
          title: selectedTitle,
        }),
      });

      if (res.ok) {
        toast.success("Profile updated! 🎉");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setIsSaving(false);
  };

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <User className="w-8 h-8 text-purple-600" />
            My Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Customize your profile and view achievements
          </p>
        </div>
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 gradient-bg text-white rounded-xl font-medium flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 gradient-bg text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save"}
            </motion.button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Banner */}
        <div className={`h-32 bg-gradient-to-r ${currentTheme.gradient}`} />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4">
            <div
              className="relative w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden cursor-pointer group"
              onClick={() => isEditing && setShowAvatarPicker(true)}
            >
              <Image
                src={currentAvatar.image}
                alt={currentAvatar.name}
                fill
                className="object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Palette className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full ${currentTheme.class} flex items-center justify-center`}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Name & Title */}
          <div className="mb-4">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-2xl font-bold bg-transparent border-b-2 border-purple-500 focus:outline-none text-gray-800 dark:text-white w-full mb-2"
                placeholder="Your name"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {editedName}
              </h2>
            )}
            {isEditing ? (
              <select
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                className="text-sm text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full mt-2"
              >
                {titles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            ) : (
              <span className="inline-block text-sm text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full mt-2">
                {selectedTitle}
              </span>
            )}
          </div>

          {/* Bio */}
          <div className="mb-6">
            {isEditing ? (
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
                rows={3}
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                {editedBio || "No bio yet. Click edit to add one!"}
              </p>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 text-center">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.currentStreak}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 text-center">
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.wordsMastered}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Words Mastered</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{Math.floor(stats.totalStudyMinutes / 60)}h</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Study Time</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 text-center">
              <Trophy className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{userAchievements.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Achievements</p>
            </div>
          </div>

          <p className="text-sm text-gray-400 dark:text-gray-500 mt-4 text-center">
            Member since {memberSince}
          </p>
        </div>
      </motion.div>

      {/* Avatar Picker Modal */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAvatarPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Choose Your Avatar</h3>
              <div className="grid grid-cols-4 gap-4">
                {avatars.map((avatar) => (
                  <motion.button
                    key={avatar.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedAvatar(avatar.id);
                      setShowAvatarPicker(false);
                    }}
                    className={`relative aspect-square rounded-xl overflow-hidden border-4 transition-all ${
                      selectedAvatar === avatar.id
                        ? "border-purple-500 shadow-lg"
                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <Image src={avatar.image} alt={avatar.name} fill className="object-cover" />
                    {selectedAvatar === avatar.id && (
                      <div className="absolute inset-0 bg-purple-500/30 flex items-center justify-center">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                Click an avatar to select it
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Colors (shown when editing) */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-600" />
            Choose Theme Color
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {themeColors.map((color) => (
              <motion.button
                key={color.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTheme(color.id)}
                className={`w-12 h-12 rounded-full ${color.class} flex items-center justify-center transition-all ${
                  selectedTheme === color.id ? "ring-4 ring-offset-2 ring-purple-500" : ""
                }`}
                title={color.name}
              >
                {selectedTheme === color.id && <Check className="w-6 h-6 text-white" />}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Achievements ({userAchievements.length}/{allAchievements.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allAchievements.map((achievement) => {
            const isEarned = earnedAchievementIds.includes(achievement.achievementId);
            return (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.02 }}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  isEarned
                    ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700"
                    : "bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600 opacity-60"
                }`}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    isEarned ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-gray-200 dark:bg-slate-600"
                  }`}>
                    <Trophy className={`w-6 h-6 ${isEarned ? "text-yellow-500" : "text-gray-400"}`} />
                  </div>
                  <h4 className={`font-semibold text-sm ${isEarned ? "text-gray-800 dark:text-white" : "text-gray-500"}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {achievement.description}
                  </p>
                  {isEarned && (
                    <span className="absolute top-2 right-2">
                      <Check className="w-4 h-4 text-yellow-500" />
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        {allAchievements.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No achievements available yet. Keep practicing!
          </p>
        )}
      </motion.div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-green-500" />
          Learning Progress
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Current Phase</span>
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">Phase {progress?.currentPhase || 1}</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full gradient-bg rounded-full transition-all"
                style={{ width: `${progress?.phaseCompletion || 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {Math.round(progress?.phaseCompletion || 0)}% complete
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Spelling Accuracy</span>
              <span className="text-sm font-semibold text-green-600">{Math.round(progress?.spellingAccuracy || 0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Exercises Completed</span>
              <span className="text-sm font-semibold text-blue-600">{stats.exercisesCompleted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Writing Projects</span>
              <span className="text-sm font-semibold text-orange-600">{stats.writingProjectsCompleted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</span>
              <span className="text-sm font-semibold text-red-600">{stats.longestStreak} days 🔥</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
