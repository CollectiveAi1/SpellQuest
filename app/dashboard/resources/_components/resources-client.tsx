"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Library,
  Star,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Filter,
  Search,
  Clock,
  DollarSign,
  BookOpen,
  Gamepad2,
  PenTool,
  Target,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { resources } from "@/lib/curriculum-data";

interface ResourcesClientProps {
  userId: string;
  currentPhase: number;
  bookmarks: any[];
}

export default function ResourcesClient({
  userId,
  currentPhase,
  bookmarks,
}: ResourcesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [localBookmarks, setLocalBookmarks] = useState<string[]>(
    bookmarks?.map((b) => b?.resourceTitle) ?? []
  );

  const categories = [
    { id: "all", label: "All Resources", icon: Library },
    { id: "foundational_phonics", label: "Phonics", icon: BookOpen },
    { id: "spelling_rules_and_patterns", label: "Spelling Rules", icon: Target },
    { id: "vocabulary_building", label: "Vocabulary", icon: BookOpen },
    { id: "creative_writing", label: "Creative Writing", icon: PenTool },
    { id: "gamified_learning", label: "Games", icon: Gamepad2 },
  ];

  const getAllResources = () => {
    const all: any[] = [];
    resources?.forEach((category) => {
      category?.items?.forEach((item) => {
        all.push({ ...item, category: category?.category });
      });
    });
    return all;
  };

  const allResources = getAllResources();

  const filteredResources = allResources?.filter((resource) => {
    const matchesCategory = selectedCategory === "all" || resource?.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      resource?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      resource?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesBookmark = !showBookmarked || localBookmarks?.includes(resource?.title);
    return matchesCategory && matchesSearch && matchesBookmark;
  }) ?? [];

  const toggleBookmark = async (resourceTitle: string, resourceCategory: string) => {
    const isBookmarked = localBookmarks?.includes(resourceTitle);
    
    if (isBookmarked) {
      setLocalBookmarks((prev) => prev?.filter((t) => t !== resourceTitle) ?? []);
    } else {
      setLocalBookmarks((prev) => [...(prev ?? []), resourceTitle]);
    }

    try {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          resourceTitle,
          resourceCategory,
          action: isBookmarked ? "remove" : "add",
        }),
      });
      toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
    } catch (error) {
      toast.error("Failed to update bookmark");
    }
  };

  const getCostColor = (cost: string) => {
    if (cost?.toLowerCase()?.includes("free")) return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
    return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <Library className="w-8 h-8 text-purple-600" />
            Resource Library
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Curated learning resources to support your spelling journey
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowBookmarked(!showBookmarked)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
              showBookmarked
                ? "gradient-bg text-white"
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            <BookmarkCheck className="w-5 h-5" />
            Bookmarked ({localBookmarks?.length ?? 0})
          </motion.button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white border-0 focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories?.map((cat) => (
          <motion.button
            key={cat?.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCategory(cat?.id ?? "all")}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
              selectedCategory === cat?.id
                ? "gradient-bg text-white shadow-lg"
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700"
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat?.label}
          </motion.button>
        )) ?? []}
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources?.map((resource, i) => {
          const isBookmarked = localBookmarks?.includes(resource?.title);

          return (
            <motion.div
              key={resource?.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-1 line-clamp-1">
                    {resource?.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 })?.map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (resource?.qualityRating ?? 0)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleBookmark(resource?.title ?? "", resource?.category ?? "")}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-gray-400" />
                  )}
                </motion.button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">
                {resource?.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs">
                  {resource?.difficultyLevel}
                </span>
                <span className={`px-2 py-1 rounded-lg text-xs ${getCostColor(resource?.cost ?? "")}`}>
                  {resource?.cost?.includes("Free") ? "Free" : "Paid"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {resource?.timeCommitment}
                </span>
              </div>

              <motion.a
                href={resource?.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 gradient-bg text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg"
              >
                Visit Resource
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            </motion.div>
          );
        }) ?? []}
      </div>

      {filteredResources?.length === 0 && (
        <div className="text-center py-12">
          <Library className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No resources found</p>
        </div>
      )}
    </div>
  );
}
