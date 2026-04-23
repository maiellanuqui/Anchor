"use client";

import { useState, useEffect } from "react";
import { Smile, Frown, Meh, Moon as MoonIcon, FileText, Download, Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface DailyNote {
  id: string;
  text: string;
  time: string;
}

interface JournalEntry {
  id: string;
  date: string;
  mood: "happy" | "okay" | "sad";
  sleep: number;
  notes: DailyNote[];
}

const moods = [
  { id: "happy" as const, icon: Smile, label: "Good", color: "bg-green-100 text-green-700" },
  { id: "okay" as const, icon: Meh, label: "Okay", color: "bg-yellow-100 text-yellow-700" },
  { id: "sad" as const, icon: Frown, label: "Difficult", color: "bg-red-100 text-red-700" },
];

export function HealthJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mood, setMood] = useState<"happy" | "okay" | "sad">("happy");
  const [sleep, setSleep] = useState(7);
  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [newNoteText, setNewNoteText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("anchorJournal");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const getTodayEntry = () => entries.find(e => 
    new Date(e.date).toDateString() === new Date().toDateString()
  );

  const resetForm = () => {
    setMood("happy");
    setSleep(7);
    setNotes([]);
    setNewNoteText("");
    setEditingId(null);
  };

  const startEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setMood(entry.mood);
    setSleep(entry.sleep);
    setNotes(entry.notes);
    setShowForm(true);
  };

  const saveEntry = () => {
    const todayEntry = getTodayEntry();
    
    if (editingId) {
      const updated = entries.map(e => 
        e.id === editingId ? { ...e, mood, sleep, notes } : e
      );
      setEntries(updated);
      localStorage.setItem("anchorJournal", JSON.stringify(updated));
    } else if (todayEntry) {
      const updated = entries.map(e => 
        e.id === todayEntry.id 
          ? { ...e, notes: [...e.notes, ...notes] } 
          : e
      );
      setEntries(updated);
      localStorage.setItem("anchorJournal", JSON.stringify(updated));
    } else {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        mood,
        sleep,
        notes,
      };
      const updated = [entry, ...entries];
      setEntries(updated);
      localStorage.setItem("anchorJournal", JSON.stringify(updated));
    }
    
    setShowForm(false);
    resetForm();
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem("anchorJournal", JSON.stringify(updated));
  };

  const addNoteToEntry = () => {
    if (!newNoteText.trim()) return;
    
    const note: DailyNote = {
      id: Date.now().toString(),
      text: newNoteText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    
    const todayEntry = getTodayEntry();
    if (todayEntry && !showForm) {
      const updated = entries.map(e => 
        e.id === todayEntry.id 
          ? { ...e, notes: [...e.notes, note] } 
          : e
      );
      setEntries(updated);
      localStorage.setItem("anchorJournal", JSON.stringify(updated));
    } else {
      setNotes([...notes, note]);
    }
    setNewNoteText("");
  };

  const removeNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const exportPDF = () => {
    const content = entries.map(e => {
      const date = new Date(e.date).toLocaleDateString();
      const moodLabel = moods.find(m => m.id === e.mood)?.label;
      const notesText = e.notes.map(n => `  ${n.time}: ${n.text}`).join("\n");
      return `${date}\nMood: ${moodLabel}\nSleep: ${e.sleep} hours\nNotes:\n${notesText || "  No notes"}\n---\n`;
    }).join("\n");
    
    const blob = new Blob([`ANCHOR HEALTH JOURNAL\n\n${content}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anchor-journal-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
  };

  const todayEntry = getTodayEntry();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-anchor-700">Health Journal</h2>
          <p className="text-sage-600">Track your daily wellbeing</p>
        </div>
        <button onClick={exportPDF} className="btn-secondary p-3">
          <Download className="w-6 h-6" />
        </button>
      </div>

      {!showForm && (
        <button 
          onClick={() => { resetForm(); setShowForm(true); }}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Plus className="w-6 h-6" />
          {todayEntry ? "Add Notes for Today" : "Log Today's Entry"}
        </button>
      )}

      {!showForm && todayEntry && (
        <div className="card bg-green-50 border-2 border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <CheckIcon />
              <span className="text-lg font-semibold text-green-700">
                Today logged!
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => startEdit(todayEntry)}
                className="p-2 text-sage-600 hover:text-anchor-600 hover:bg-anchor-100 rounded-xl transition-all"
              >
                <Pencil className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-sage-600">Mood: {moods.find(m => m.id === todayEntry.mood)?.label}</p>
          <p className="text-sage-600">Sleep: {todayEntry.sleep} hours</p>
          {todayEntry.notes.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-semibold text-sage-500">Notes:</p>
              {todayEntry.notes.map((note) => (
                <p key={note.id} className="text-sage-600 bg-white p-2 rounded-lg text-sm">
                  <span className="text-anchor-600 font-medium">{note.time}</span> — {note.text}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {!showForm && todayEntry && (
        <div className="card">
          <p className="text-lg text-sage-700 mb-3 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add another note
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="What's happening now?"
              className="input-large flex-1"
              onKeyPress={(e) => e.key === "Enter" && addNoteToEntry()}
            />
            <button 
              onClick={addNoteToEntry}
              disabled={!newNoteText.trim()}
              className="btn-primary px-4 disabled:opacity-50"
            >
              <Check className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-sage-700">
              {editingId ? "Edit Entry" : "How are you today?"}
            </h3>
            <button 
              onClick={() => { setShowForm(false); resetForm(); }}
              className="p-2 text-sage-400 hover:text-sage-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-lg text-sage-600 mb-3">Mood</p>
            <div className="flex gap-3">
              {moods.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 transition-all
                      ${mood === m.id ? m.color + " ring-2 ring-offset-2 ring-sage-300" : "bg-sage-100 text-sage-600"}`}
                  >
                    <Icon className="w-8 h-8" />
                    <span className="font-semibold">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg text-sage-600 mb-3 flex items-center gap-2">
              <MoonIcon className="w-5 h-5" />
              Sleep: {sleep} hours
            </p>
            <input
              type="range"
              min="0"
              max="12"
              value={sleep}
              onChange={(e) => setSleep(parseInt(e.target.value))}
              className="w-full h-3 bg-sage-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="mb-4">
            <p className="text-lg text-sage-600 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Notes
            </p>
            
            {notes.length > 0 && (
              <div className="space-y-2 mb-3">
                {notes.map((note) => (
                  <div key={note.id} className="flex items-center gap-2 bg-sage-50 p-3 rounded-xl">
                    <span className="text-anchor-600 font-medium text-sm">{note.time}</span>
                    <span className="text-sage-700 flex-1">{note.text}</span>
                    <button 
                      onClick={() => removeNote(note.id)}
                      className="p-1 text-sage-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add a note..."
                className="input-large flex-1"
                onKeyPress={(e) => e.key === "Enter" && (setNotes([...notes, { id: Date.now().toString(), text: newNoteText, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]), setNewNoteText(""))}
              />
              <button 
                onClick={() => {
                  if (!newNoteText.trim()) return;
                  setNotes([...notes, { id: Date.now().toString(), text: newNoteText, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
                  setNewNoteText("");
                }}
                disabled={!newNoteText.trim()}
                className="btn-secondary px-4 disabled:opacity-50"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={saveEntry} className="btn-primary flex-1">
              {editingId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-anchor-700">Recent Entries</h3>
          {entries.slice(0, 5).map((entry) => {
            const MoodIcon = moods.find(m => m.id === entry.mood)?.icon || Smile;
            const isToday = new Date(entry.date).toDateString() === new Date().toDateString();
            return (
              <div key={entry.id} className={`card py-4 ${isToday ? "border-2 border-anchor-200" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${moods.find(m => m.id === entry.mood)?.color}`}>
                      <MoodIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sage-700">
                        {new Date(entry.date).toLocaleDateString()}
                        {isToday && <span className="ml-2 text-anchor-600 text-sm">(Today)</span>}
                      </p>
                      <p className="text-sm text-sage-500">
                        Sleep: {entry.sleep}h • {entry.notes.length} notes
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => startEdit(entry)}
                      className="p-2 text-sage-400 hover:text-anchor-600 hover:bg-anchor-50 rounded-xl transition-all"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 text-sage-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {entry.notes.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {entry.notes.slice(0, 3).map((note) => (
                      <p key={note.id} className="text-sage-600 bg-sage-50 p-2 rounded-lg text-sm">
                        <span className="text-anchor-600 font-medium">{note.time}</span> — {note.text}
                      </p>
                    ))}
                    {entry.notes.length > 3 && (
                      <p className="text-sage-500 text-sm italic">
                        + {entry.notes.length - 3} more notes
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
