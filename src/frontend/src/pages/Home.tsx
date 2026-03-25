import { useNavigate } from "@tanstack/react-router";
import { Star, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useGlobalTop10 } from "../hooks/useQueries";
import type { AgeGroup } from "../types/game";
import { AGE_GROUP_CONFIG } from "../types/game";

const MATH_SYMBOLS = [
  { sym: "π", id: "pi", top: "12%", left: "8%", delay: 0, size: "text-4xl" },
  {
    sym: "Σ",
    id: "sigma",
    top: "20%",
    left: "88%",
    delay: 0.5,
    size: "text-3xl",
  },
  { sym: "∞", id: "inf", top: "60%", left: "5%", delay: 1, size: "text-5xl" },
  {
    sym: "+",
    id: "plus",
    top: "75%",
    left: "92%",
    delay: 0.3,
    size: "text-4xl",
  },
  {
    sym: "÷",
    id: "div",
    top: "40%",
    left: "93%",
    delay: 0.8,
    size: "text-3xl",
  },
  {
    sym: "×",
    id: "mul",
    top: "80%",
    left: "12%",
    delay: 0.6,
    size: "text-4xl",
  },
  {
    sym: "√",
    id: "sqrt",
    top: "35%",
    left: "3%",
    delay: 1.2,
    size: "text-3xl",
  },
  {
    sym: "2²",
    id: "sq",
    top: "55%",
    left: "88%",
    delay: 0.9,
    size: "text-2xl",
  },
];

const CARD_COLORS: Record<AgeGroup, string> = {
  kids: "from-[oklch(0.72_0.17_140)] to-[oklch(0.62_0.15_140)]",
  junior: "from-[oklch(0.68_0.12_190)] to-[oklch(0.58_0.12_190)]",
  teen: "from-[oklch(0.52_0.2_280)] to-[oklch(0.42_0.18_280)]",
  adult: "from-[oklch(0.48_0.15_255)] to-[oklch(0.38_0.12_255)]",
};

function formatScore(score: bigint): string {
  return Number(score).toLocaleString();
}

function getDifficultyColor(d: string) {
  if (d === "hard") return "bg-[oklch(0.52_0.2_280)] text-white";
  if (d === "medium") return "bg-brand-orange text-white";
  return "bg-brand-green text-white";
}

export function Home() {
  const navigate = useNavigate();
  const { data: leaderboard = [] } = useGlobalTop10();

  const handlePlay = (group: AgeGroup) => {
    navigate({ to: "/play", search: { group } });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-cream overflow-hidden py-20 px-4">
        {/* Decorative blobs */}
        <div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "oklch(0.68 0.12 190)" }}
        />
        <div
          className="absolute top-10 right-0 w-80 h-80 rounded-full opacity-25 blur-3xl"
          style={{ background: "oklch(0.72 0.16 55)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: "oklch(0.72 0.17 140)" }}
        />
        <div
          className="absolute bottom-10 right-1/4 w-56 h-56 rounded-full opacity-20 blur-3xl"
          style={{ background: "oklch(0.52 0.2 280)" }}
        />

        {/* Floating math symbols */}
        {MATH_SYMBOLS.map((s) => (
          <span
            key={s.id}
            className={`absolute font-black text-navy/15 select-none pointer-events-none animate-float ${s.size}`}
            style={{
              top: s.top,
              left: s.left,
              animationDelay: `${s.delay}s`,
              animationDuration: `${3 + s.delay}s`,
            }}
          >
            {s.sym}
          </span>
        ))}

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm font-semibold text-navy">
              <Zap size={14} className="text-brand-orange" />
              Fun Math for Every Age Group
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-navy leading-tight mb-4">
              Master Math,{" "}
              <span className="text-brand-orange relative">
                Level Up
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <title>Decorative underline</title>
                  <path
                    d="M0 8 Q75 0 150 8 Q225 16 300 8"
                    stroke="oklch(0.68 0.12 190)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              <br className="hidden md:block" />
              Your Brain!
            </h1>
            <p className="text-navy/60 text-xl font-semibold mt-6 mb-8">
              Exciting math challenges from counting to calculus. Pick your
              level and compete globally!
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePlay("kids")}
              className="bg-navy text-cream font-black text-lg px-10 py-4 rounded-full shadow-card-hover hover:bg-brand-orange transition-colors"
              data-ocid="hero.primary_button"
            >
              🚀 Start Your Journey
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-navy py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { label: "Questions Daily", value: "10,000+", icon: "🎯" },
            { label: "Players Worldwide", value: "50,000+", icon: "🌍" },
            { label: "Age Groups", value: "4 Levels", icon: "🏆" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-cream font-black text-xl">{s.value}</div>
              <div className="text-cream/50 text-xs font-semibold">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Age group cards */}
      <section className="py-16 px-4 bg-cream" id="games">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-navy mb-3">
              Choose Your Adventure
            </h2>
            <p className="text-navy/50 font-semibold">
              Four levels designed for each stage of learning
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.keys(AGE_GROUP_CONFIG) as AgeGroup[]).map((group, i) => {
              const cfg = AGE_GROUP_CONFIG[group];
              return (
                <motion.div
                  key={group}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`bg-gradient-to-br ${CARD_COLORS[group]} rounded-2xl p-6 text-white shadow-card-hover cursor-pointer`}
                  onClick={() => handlePlay(group)}
                  data-ocid={`agegroup.card.${i + 1}`}
                >
                  <div className="text-5xl mb-4">{cfg.emoji}</div>
                  <div className="font-black text-2xl mb-1">{cfg.label}</div>
                  <div className="text-white/80 text-sm font-bold mb-1">
                    Ages {cfg.range}
                  </div>
                  <div className="text-white/70 text-sm mb-5">
                    {cfg.description}
                  </div>
                  <button
                    type="button"
                    className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold py-2 rounded-xl transition-colors text-sm"
                    data-ocid={`agegroup.play_button.${i + 1}`}
                  >
                    Play Now →
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leaderboard preview */}
      <section
        className="py-16 px-4"
        style={{ background: "oklch(0.91 0.03 85)" }}
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Trophy size={28} className="text-brand-orange" />
              <h2 className="text-4xl font-black text-navy">
                Global Top Players
              </h2>
            </div>
            <p className="text-navy/50 font-semibold">
              Can you make it to the top?
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {leaderboard.length === 0 ? (
              <div
                className="py-12 text-center text-navy/40 font-semibold"
                data-ocid="leaderboard.empty_state"
              >
                <div className="text-4xl mb-3">🏆</div>
                <p>No scores yet — be the first champion!</p>
              </div>
            ) : (
              leaderboard.slice(0, 5).map((entry, i) => (
                <motion.div
                  key={`${entry.playerName}-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`flex items-center gap-4 px-6 py-4 border-b border-border last:border-0 ${i === 0 ? "bg-[oklch(0.96_0.04_85)]" : ""}`}
                  data-ocid={`leaderboard.item.${i + 1}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                      i === 0
                        ? "bg-[oklch(0.72_0.16_55)] text-white"
                        : i === 1
                          ? "bg-[oklch(0.70_0.02_255)] text-white"
                          : i === 2
                            ? "bg-[oklch(0.62_0.10_55)] text-white"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </div>
                  <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-cream font-black text-sm">
                    {entry.playerName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-navy text-sm">
                      {entry.playerName}
                    </div>
                    <div className="text-navy/50 text-xs">
                      {entry.ageGroup} · {entry.difficulty}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${getDifficultyColor(entry.difficulty)}`}
                    >
                      {entry.difficulty}
                    </span>
                    <span className="font-black text-navy text-lg">
                      {formatScore(entry.score)}
                    </span>
                    <Star size={14} className="text-brand-orange" />
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate({ to: "/leaderboard" })}
              className="text-navy font-bold hover:text-brand-orange transition-colors text-sm"
              data-ocid="home.leaderboard.link"
            >
              View Full Leaderboard →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
