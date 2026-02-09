"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Gamepad2, Trophy, BookOpen, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Welcome back! Let's continue your spelling adventure!");
        router.replace("/dashboard");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Hero Section */}
      <div className="lg:w-1/2 gradient-bg p-8 lg:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center z-10 max-w-md"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-10 h-10" />
            <h1 className="text-4xl lg:text-5xl font-bold">SpellQuest</h1>
          </div>
          <p className="text-xl lg:text-2xl mb-8 opacity-90">
            Your Interactive Spelling Adventure Awaits!
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"
            >
              <Gamepad2 className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Gaming Themes</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"
            >
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Sports Fun</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"
            >
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Anime Stories</p>
            </motion.div>
          </div>

          <div className="relative w-full h-48 rounded-2xl overflow-hidden">
            <Image
              src="https://cdn.abacus.ai/images/3de5e209-0a6b-46e4-b5c0-06d672b1da2b.png"
              alt="Colorful alphabet letters floating"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Floating decorations */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center bg-white dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Ready to continue your spelling adventure?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl gradient-bg text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Start Learning!
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              New to SpellQuest?{" "}
              <Link
                href="/signup"
                className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <p className="text-sm text-purple-700 dark:text-purple-300 text-center">
              🎮 Learn spelling through sports, gaming & anime themes!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
