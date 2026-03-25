import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import type { AgeGroup, Difficulty } from "../types/game";
import { AGE_GROUP_CONFIG, DIFFICULTY_CONFIG } from "../types/game";

export function Play() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/play" }) as { group?: AgeGroup };
  const [selectedGroup, setSelectedGroup] = useState<AgeGroup>(
    search.group ?? "kids",
  );
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [playerName, setPlayerName] = useState("");
  const [nameError, setNameError] = useState("");

  const handleStart = () => {
    if (!playerName.trim()) {
      setNameError("Please enter your name to continue!");
      return;
    }
    setNameError("");
    navigate({
      to: "/game",
      search: { group: selectedGroup, difficulty, name: playerName.trim() },
    });
  };

  const cfg = AGE_GROUP_CONFIG[selectedGroup];

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-navy mb-2">Game Setup</h1>
            <p className="text-navy/50 font-semibold">
              Customize your math adventure
            </p>
          </div>

          {/* Step 1: Name */}
          <div className="bg-white rounded-2xl shadow-card p-6 mb-5">
            <h2 className="font-black text-navy text-lg mb-4">👤 Your Name</h2>
            <Label
              htmlFor="player-name"
              className="font-semibold text-navy/70 mb-2 block"
            >
              Enter your player name
            </Label>
            <Input
              id="player-name"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                if (nameError) setNameError("");
              }}
              placeholder="e.g. MathWizard99"
              className="font-semibold text-navy border-2 focus:border-brand-orange rounded-xl"
              maxLength={30}
              data-ocid="setup.name.input"
            />
            {nameError && (
              <p
                className="text-destructive text-sm font-semibold mt-2"
                data-ocid="setup.name.error_state"
              >
                {nameError}
              </p>
            )}
          </div>

          {/* Step 2: Age Group */}
          <div className="bg-white rounded-2xl shadow-card p-6 mb-5">
            <h2 className="font-black text-navy text-lg mb-4">🎮 Age Group</h2>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(AGE_GROUP_CONFIG) as AgeGroup[]).map((group) => {
                const gcfg = AGE_GROUP_CONFIG[group];
                const isSelected = selectedGroup === group;
                return (
                  <button
                    type="button"
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? "border-navy bg-navy text-cream shadow-card"
                        : "border-border bg-muted/30 text-navy hover:border-navy/50"
                    }`}
                    data-ocid={`setup.agegroup.${group}.button`}
                  >
                    <div className="text-2xl mb-1">{gcfg.emoji}</div>
                    <div className="font-black text-sm">{gcfg.label}</div>
                    <div
                      className={`text-xs font-semibold ${isSelected ? "text-cream/70" : "text-navy/50"}`}
                    >
                      Ages {gcfg.range}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Difficulty */}
          <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
            <h2 className="font-black text-navy text-lg mb-4">⚡ Difficulty</h2>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => {
                const dcfg = DIFFICULTY_CONFIG[diff];
                const isSelected = difficulty === diff;
                const colors: Record<Difficulty, string> = {
                  easy: "border-brand-green bg-brand-green text-white",
                  medium: "border-brand-orange bg-brand-orange text-white",
                  hard: "border-brand-purple bg-brand-purple text-white",
                };
                const unselected =
                  "border-border bg-muted/30 text-navy hover:border-navy/50";
                return (
                  <button
                    type="button"
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${isSelected ? colors[diff] : unselected}`}
                    data-ocid={`setup.difficulty.${diff}.button`}
                  >
                    <div className="font-black text-sm mb-1">{dcfg.label}</div>
                    <div
                      className={`text-xs font-semibold ${isSelected ? "text-white/80" : "text-navy/50"}`}
                    >
                      {dcfg.basePoints} pts/q
                    </div>
                    <div
                      className={`text-xs mt-1 ${isSelected ? "text-white/70" : "text-navy/40"}`}
                    >
                      {dcfg.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary & Start */}
          <div className="bg-navy rounded-2xl p-6 text-cream">
            <h3 className="font-black text-lg mb-3">🎯 Ready to Play?</h3>
            <div className="flex gap-3 flex-wrap mb-5 text-sm">
              <span className="bg-white/10 px-3 py-1 rounded-full font-semibold">
                {cfg.emoji} {cfg.label} (Ages {cfg.range})
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-full font-semibold">
                ⚡ {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-full font-semibold">
                📋 10 Questions
              </span>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              className="w-full bg-brand-orange text-white font-black text-lg py-4 rounded-xl hover:opacity-90 transition-opacity"
              data-ocid="setup.start.submit_button"
            >
              🚀 Start Game!
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
