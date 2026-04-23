"use client";

import { useState, useEffect } from "react";
import { Plus, Bell, Pill, Droplets, Calendar, Trash2, Check } from "lucide-react";

interface Reminder {
  id: string;
  type: "medication" | "appointment" | "hydration" | "other";
  title: string;
  time: string;
  completed: boolean;
}

const reminderTypes = [
  { id: "medication" as const, icon: Pill, label: "Medication", color: "bg-blue-100 text-blue-700" },
  { id: "appointment" as const, icon: Calendar, label: "Appointment", color: "bg-purple-100 text-purple-700" },
  { id: "hydration" as const, icon: Droplets, label: "Hydration", color: "bg-cyan-100 text-cyan-700" },
  { id: "other" as const, icon: Bell, label: "Other", color: "bg-sage-100 text-sage-700" },
];

export function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newType, setNewType] = useState<"medication" | "appointment" | "hydration" | "other">("medication");
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("09:00");

  useEffect(() => {
    const saved = localStorage.getItem("anchorReminders");
    if (saved) setReminders(JSON.parse(saved));
  }, []);

  const addReminder = () => {
    const reminder: Reminder = {
      id: Date.now().toString(),
      type: newType,
      title: newTitle || reminderTypes.find(t => t.id === newType)?.label || "Reminder",
      time: newTime,
      completed: false,
    };
    const updated = [...reminders, reminder].sort((a, b) => a.time.localeCompare(b.time));
    setReminders(updated);
    localStorage.setItem("anchorReminders", JSON.stringify(updated));
    setShowForm(false);
    setNewTitle("");
  };

  const toggleComplete = (id: string) => {
    const updated = reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    setReminders(updated);
    localStorage.setItem("anchorReminders", JSON.stringify(updated));
  };

  const deleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    localStorage.setItem("anchorReminders", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-anchor-700">Reminders</h2>
          <p className="text-sage-600">Gentle daily reminders</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary p-3"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="text-xl font-bold text-sage-700 mb-4">New Reminder</h3>
          
          <div className="mb-4">
            <p className="text-lg text-sage-600 mb-3">Type</p>
            <div className="grid grid-cols-2 gap-3">
              {reminderTypes.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setNewType(t.id)}
                    className={`p-3 rounded-xl flex items-center gap-2 transition-all
                      ${newType === t.id ? t.color + " ring-2 ring-offset-2 ring-sage-300" : "bg-sage-100 text-sage-600"}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-lg text-sage-600 mb-2">What is it for?</p>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={reminderTypes.find(t => t.id === newType)?.label}
              className="input-large"
            />
          </div>

          <div className="mb-6">
            <p className="text-lg text-sage-600 mb-2">Time</p>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="input-large"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={addReminder} className="btn-primary flex-1">
              Add
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {reminders.length === 0 && !showForm && (
          <div className="card text-center py-12">
            <Bell className="w-16 h-16 text-sage-300 mx-auto mb-4" />
            <p className="text-xl text-sage-600">No reminders yet</p>
            <p className="text-sage-500">Tap + to add your first reminder</p>
          </div>
        )}

        {reminders.map((reminder) => {
          const typeConfig = reminderTypes.find(t => t.id === reminder.type);
          const Icon = typeConfig?.icon || Bell;
          return (
            <div 
              key={reminder.id} 
              className={`card py-4 flex items-center gap-4 ${reminder.completed ? "opacity-60" : ""}`}
            >
              <button
                onClick={() => toggleComplete(reminder.id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all
                  ${reminder.completed ? "bg-green-500 text-white" : "bg-sage-100 text-sage-400"}`}
              >
                <Check className="w-6 h-6" />
              </button>

              <div className={`p-3 rounded-xl ${typeConfig?.color}`}>
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <p className={`text-lg font-semibold ${reminder.completed ? "line-through text-sage-400" : "text-sage-700"}`}>
                  {reminder.title}
                </p>
                <p className="text-sage-500">{reminder.time}</p>
              </div>

              <button 
                onClick={() => deleteReminder(reminder.id)}
                className="p-3 text-sage-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
