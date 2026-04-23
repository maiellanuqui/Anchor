"use client";

import { Brain, BookHeart, Bell, BookOpen } from "lucide-react";

interface BottomNavProps {
  current: "memory" | "journal" | "reminders" | "resources";
  onNavigate: (view: "memory" | "journal" | "reminders" | "resources") => void;
}

const navItems = [
  { id: "memory" as const, icon: Brain, label: "Memory" },
  { id: "journal" as const, icon: BookHeart, label: "Journal" },
  { id: "reminders" as const, icon: Bell, label: "Reminders" },
  { id: "resources" as const, icon: BookOpen, label: "Resources" },
];

export function BottomNav({ current, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-sage-200 px-4 py-2">
      <div className="max-w-2xl mx-auto flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="w-7 h-7" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
