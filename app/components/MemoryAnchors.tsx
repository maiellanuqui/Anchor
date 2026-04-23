"use client";

import { useState, useEffect } from "react";
import { Sparkles, CheckCircle, RefreshCw, Sun, Moon } from "lucide-react";

const wordPool = [
  "apple", "chair", "blue", "table", "green", "window", "happy", "book",
  "red", "door", "smile", "cat", "yellow", "flower", "warm", "coffee",
  "soft", "bird", "orange", "tree", "calm", "pillow", "purple", "shoes",
];

export function MemoryAnchors() {
  const [phase, setPhase] = useState<"morning" | "evening" | "complete">("morning");
  const [todaysWords, setTodaysWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [history, setHistory] = useState<{date: string; score: number}[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("anchorWords");
    const savedDate = localStorage.getItem("anchorWordsDate");
    const today = new Date().toDateString();
    
    if (saved && savedDate === today) {
      setTodaysWords(JSON.parse(saved));
      const eveningDone = localStorage.getItem("anchorEveningDone") === today;
      setPhase(eveningDone ? "complete" : "evening");
    } else {
      generateNewWords();
    }
    
    const savedHistory = localStorage.getItem("anchorHistory");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const generateNewWords = () => {
    const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    setTodaysWords(selected);
    const today = new Date().toDateString();
    localStorage.setItem("anchorWords", JSON.stringify(selected));
    localStorage.setItem("anchorWordsDate", today);
    localStorage.removeItem("anchorEveningDone");
    setPhase("morning");
    setScore(null);
    setUserInput("");
  };

  const handleRecallSubmit = () => {
    const recalled = userInput.toLowerCase().split(/[\s,]+/).filter(w => w);
    const correct = todaysWords.filter(w => recalled.includes(w.toLowerCase()));
    const newScore = correct.length;
    setScore(newScore);
    
    const today = new Date().toDateString();
    localStorage.setItem("anchorEveningDone", today);
    
    const newEntry = { date: today, score: newScore };
    const updated = [...history, newEntry].slice(-14);
    setHistory(updated);
    localStorage.setItem("anchorHistory", JSON.stringify(updated));
    setPhase("complete");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-anchor-700 mb-2">Memory Anchors</h2>
        <p className="text-sage-600">Daily word recall exercise</p>
      </div>

      {phase === "morning" && (
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-anchor-100 rounded-full flex items-center justify-center">
              <Sun className="w-8 h-8 text-anchor-600" />
            </div>
          </div>
          <p className="text-xl text-sage-700 mb-6">
            Today&apos;s memory words are:
          </p>
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            {todaysWords.map((word, i) => (
              <div 
                key={i}
                className="bg-anchor-500 text-white text-2xl font-bold py-4 px-6 rounded-2xl shadow-lg"
              >
                {word}
              </div>
            ))}
          </div>
          <p className="text-lg text-sage-600 mb-6">
            Try to remember these words. We&apos;ll ask you tonight!
          </p>
          <button onClick={() => setPhase("evening")} className="btn-primary">
            I&apos;ll Remember These
          </button>
        </div>
      )}

      {phase === "evening" && (
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
              <Moon className="w-8 h-8 text-sage-600" />
            </div>
          </div>
          <p className="text-xl text-sage-700 mb-6">
            What words do you remember?
          </p>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type the words you remember..."
            className="input-large mb-4"
          />
          <button 
            onClick={handleRecallSubmit}
            disabled={!userInput.trim()}
            className="btn-primary w-full disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      )}

      {phase === "complete" && score !== null && (
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-sage-700 mb-2">
            You remembered {score} of 3 words!
          </p>
          <p className="text-lg text-sage-600 mb-4">
            The words were: {todaysWords.join(", ")}
          </p>
          <button onClick={generateNewWords} className="btn-secondary flex items-center justify-center gap-2 mx-auto">
            <RefreshCw className="w-5 h-5" />
            New Words Tomorrow
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-anchor-700 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Your Progress
          </h3>
          <div className="flex gap-2 flex-wrap">
            {history.slice(-7).map((entry, i) => (
              <div 
                key={i}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold
                  ${entry.score === 3 ? "bg-green-500 text-white" :
                    entry.score === 2 ? "bg-yellow-400 text-white" :
                    entry.score === 1 ? "bg-orange-400 text-white" :
                    "bg-sage-200 text-sage-600"}`}
              >
                {entry.score}
              </div>
            ))}
          </div>
          <p className="text-sm text-sage-500 mt-3">
            Last {Math.min(history.length, 7)} days
          </p>
        </div>
      )}
    </div>
  );
}
