"use client";

import { useState } from "react";
import { Anchor } from "lucide-react";

interface WelcomeScreenProps {
  onComplete: (name: string) => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-anchor-50 to-sand-50">
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-anchor-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Anchor className="w-14 h-14 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-anchor-700 mb-3">Anchor</h1>
        <p className="text-xl text-sage-600">Your daily memory companion</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <label className="block text-xl text-sage-700 mb-3 text-center">
          What should we call you?
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="input-large mb-6 text-center"
          autoFocus
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Get Started
        </button>
      </form>
    </div>
  );
}
