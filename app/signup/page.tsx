"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Sparkles, Rocket, Star, Zap } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      // Auto sign in after signup
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error(signInResult.error);
      } else {
        toast.success("Welcome to SpellQuest! Your adventure begins now!");
        router.replace("/dashboard");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row-reverse">
      {/* Right Side - Hero Section */}
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
            Begin Your Spelling Adventure Today!
          </p>

          <div className="space-y-4 text-left">
            {[
              { icon: Rocket, text: "6-phase personalized curriculum" },
              { icon: Star, text: "Gamified learning with achievements" },
              { icon: Zap, text: "Sports, gaming & anime themes" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4"
              >
                <item.icon className="w-6 h-6" />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 relative w-full h-40 rounded-2xl overflow-hidden">
            <Image
              src="https://cdn.abacus.ai/images/77e782fc-2161-4911-a796-2c1abeb07153.png"
              alt="Rocket launching - level up your spelling"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Floating decorations */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 right-10 w-16 h-16 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-20 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"
        />
      </div>

      {/* Left Side - Signup Form */}
      <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center bg-white dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Join thousands of spelling adventurers!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "STUDENT", label: "Student", emoji: "📚" },
                  { value: "PARENT", label: "Parent/Teacher", emoji: "👨‍👩‍👦" },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setRole(option.value)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      role === option.value
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <p className="text-sm font-medium mt-1 text-gray-800 dark:text-white">
                      {option.label}
                    </p>
                  </motion.button>
                ))}
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
                  <UserPlus className="w-5 h-5" />
                  Start My Adventure!
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
