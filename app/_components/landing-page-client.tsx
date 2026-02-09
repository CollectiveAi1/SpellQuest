"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  Rocket,
  Trophy,
  Gamepad2,
  BookOpen,
  Star,
  ChevronRight,
  Zap,
  Target,
  Award,
} from "lucide-react";

export default function LandingPageClient() {
  return (
    <>
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-10" />
        
        <nav className="relative z-10 max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold gradient-text">SpellQuest</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-purple-600 dark:text-purple-400 font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 gradient-bg text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Master Spelling Through{" "}
                <span className="gradient-text">Epic Adventures!</span>
              </h1>
              <p className="mt-6 text-lg lg:text-xl text-gray-600 dark:text-gray-300">
                A personalized 6-month spelling curriculum designed for creative
                writers. Learn through sports, gaming, and anime-themed activities!
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 gradient-bg text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Rocket className="w-5 h-5" />
                    Start Your Quest
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>30 min/day</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  <span>6 Phases</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <span>20+ Projects</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                <Image
                  src="https://cdn.abacus.ai/images/edf8a180-1c5e-427f-bcf4-b958f519eb58.png"
                  alt="Anime-style student studying"
                  fill
                  className="object-contain rounded-3xl"
                />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-10 -left-4 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg"
              >
                <Trophy className="w-8 h-8 text-yellow-500" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute bottom-10 -right-4 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg"
              >
                <Gamepad2 className="w-8 h-8 text-purple-500" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Why SpellQuest Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Evidence-based learning combined with fun themes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Personalized Path", description: "Diagnostic assessment creates a custom learning journey", color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
              { icon: Gamepad2, title: "Gaming Themes", description: "Learn through video game reviews and strategy guides", color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
              { icon: Trophy, title: "Sports Activities", description: "Create trading cards and write sports commentary", color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
              { icon: BookOpen, title: "Anime & Cartoon Projects", description: "Write character profiles and episode scripts", color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/30" },
              { icon: Award, title: "Achievement System", description: "Earn badges and track streaks", color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
              { icon: Zap, title: "Multi-Sensory Learning", description: "Visual, auditory, and kinesthetic activities", color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-hover bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"
              >
                <div className={`${feature.bg} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="gradient-bg rounded-3xl p-12 text-white relative overflow-hidden"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Become a Spelling Champion?</h2>
            <p className="text-lg opacity-90 mb-8">Join SpellQuest today and transform spelling practice into an adventure!</p>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl"
              >
                Start Free Today
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="font-bold text-gray-800 dark:text-white">SpellQuest</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2026 SpellQuest. Making spelling fun!
          </p>
        </div>
      </footer>
    </>
  );
}
