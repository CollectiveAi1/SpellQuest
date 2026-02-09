"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  LayoutDashboard,
  ClipboardCheck,
  Calendar,
  Gamepad2,
  Trophy,
  BookOpen,
  PenTool,
  Library,
  BarChart3,
  Menu,
  X,
  User,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/profile", icon: User, label: "My Profile" },
  { href: "/dashboard/diagnostic", icon: ClipboardCheck, label: "Diagnostic" },
  { href: "/dashboard/schedule", icon: Calendar, label: "Daily Schedule" },
  { href: "/dashboard/exercises", icon: Gamepad2, label: "Exercises" },
  { href: "/dashboard/checkpoints", icon: Trophy, label: "Checkpoints" },
  { href: "/dashboard/writing", icon: PenTool, label: "Writing Projects" },
  { href: "/dashboard/resources", icon: Library, label: "Resources" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg"
      >
        <Menu className="w-6 h-6 text-gray-700 dark:text-white" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold gradient-text">SpellQuest</span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}          </nav>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-gradient-to-r from-purple-100 to-orange-100 dark:from-purple-900/20 dark:to-orange-900/20 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              🎮 Keep spelling, keep winning!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
