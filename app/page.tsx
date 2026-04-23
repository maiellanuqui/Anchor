"use client";

import { useState, useEffect } from "react";
import { MemoryAnchors } from "./components/MemoryAnchors";
import { HealthJournal } from "./components/HealthJournal";
import { Reminders } from "./components/Reminders";
import { Resources } from "./components/Resources";
import { BottomNav } from "./components/BottomNav";
import { WelcomeScreen } from "./components/WelcomeScreen";

type View = "memory" | "journal" | "reminders" | "resources";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("memory");
  const [showWelcome, setShowWelcome] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("anchorUserName");
    if (saved) {
      setUserName(saved);
      setShowWelcome(false);
    }
  }, []);

  const handleWelcomeComplete = (name: string) => {
    setUserName(name);
    localStorage.setItem("anchorUserName", name);
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <main className="min-h-screen pb-24">
      <header className="bg-white shadow-sm px-6 py-5">
        <h1 className="text-3xl font-bold text-anchor-700">
          Hello, {userName}
        </h1>
        <p className="text-sage-600 text-lg mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      <div className="p-4 max-w-2xl mx-auto">
        {currentView === "memory" && <MemoryAnchors />}
        {currentView === "journal" && <HealthJournal />}
        {currentView === "reminders" && <Reminders />}
        {currentView === "resources" && <Resources />}
      </div>

      <BottomNav current={currentView} onNavigate={setCurrentView} />
    </main>
  );
}
