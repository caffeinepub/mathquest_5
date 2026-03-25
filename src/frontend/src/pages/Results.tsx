import { useNavigate, useSearch } from "@tanstack/react-router";
import { RotateCcw, Settings, Star, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSubmitScore, useTop10ByAgeGroup } from "../hooks/useQueries";
import type { AgeGroup, Difficulty } from "../types/game";
import { AGE_GROUP_CONFIG } from "../types/game";

const CONFETTI_COLORS = [
  "oklch(0.72 0.16 55)",
  "oklch(0.68 0.12 190)",
  "oklch(0.72 0.17 140)",
  "oklch(0.52 0.2 280)",
  "oklch(0.48 0.15 255)",
];

const CONFETTI_COUNT = 40;
const CONFETTI_IDS = Array.from(
  { length: CONFETTI_COUNT },
  (_, i) => `confetti-${i}`,
);

function Confetti({ active }: { active: boolean }) {
  const pieces = useRef(
    CONFETTI_IDS.map((id) => ({
      id,
      left: `${Math.random() * 100}%`,
      top: `-${Math.random() * 20}%`,
      bg: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      w: `${6 + Math.random() * 8}px`,
      h: `${6 + Math.random() * 8}px`,
      br: Math.random() > 0.5 ? "50%" : "2px",
      dur: `${1.5 + Math.random() * 2}s`,
      delay: `${Math.random() * 0.8}s`,
    })),
  );
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.current.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            top: p.top,
            background: p.bg,
            width: p.w,
            height: p.h,
            borderRadius: p.br,
            animationDuration: p.dur,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex justify-center gap-3 my-4">
      {[1, 2, 3].map((s) => (
        <motion.div
          key={s}
          initial={{ scale: 0, rotate: -30 }}
          animate={
            stars >= s
              ? { scale: 1, rotate: 0 }
              : { scale: 0.5, rotate: 0, opacity: 0.3 }
          }
          transition={{ delay: s * 0.2, type: "spring", stiffness: 300 }}
        >
          <Star
            size={48}
            className={
              stars >= s
                ? "text-brand-orange fill-brand-orange"
                : "text-muted-foreground"
            }
          />
        </motion.div>
      ))}
    </div>
  );
}

function getDifficultyColor(d: string) {
  if (d === "hard") return "bg-brand-purple text-white";
  if (d === "medium") return "bg-brand-orange text-white";
  return "bg-brand-green text-white";
}

export function Results() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/results" }) as {
    group?: string;
    difficulty?: string;
    name?: string;
    score?: string;
    correct?: string;
    total?: string;
    timeBonus?: string;
    isPerfect?: string;
  };

  const ageGroup = (search.group ?? "kids") as AgeGroup;
  const difficulty = search.difficulty ?? "easy";
  const playerName = search.name ?? "Player";
  const score = Number.parseInt(search.score ?? "0");
  const correct = Number.parseInt(search.correct ?? "0");
  const total = Number.parseInt(search.total ?? "10");
  const timeBonus = Number.parseInt(search.timeBonus ?? "0");
  const isPerfect = search.isPerfect === "true";

  const accuracy = Math.round((correct / total) * 100);
  const stars = accuracy >= 90 ? 3 : accuracy >= 60 ? 2 : 1;

  const [submitted, setSubmitted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const submitScore = useSubmitScore();
  const { data: ageGroupBoard = [], refetch } = useTop10ByAgeGroup(ageGroup);
  const cfg = AGE_GROUP_CONFIG[ageGroup];

  useEffect(() => {
    if (showLeaderboard) refetch();
  }, [showLeaderboard, refetch]);

  const handleSubmit = async () => {
    await submitScore.mutateAsync({
      playerName,
      ageGroup,
      difficulty,
      score: BigInt(score),
    });
    setSubmitted(true);
    setShowLeaderboard(true);
  };

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <Confetti active={stars >= 2} />
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-card-hover p-8 mb-6 text-center"
          data-ocid="results.panel"
        >
          <div className="text-5xl mb-3">
            {stars === 3 ? "🏆" : stars === 2 ? "🎉" : "💪"}
          </div>
          <h1 className="text-3xl font-black text-navy mb-1">
            {stars === 3
              ? "Math Champion!"
              : stars === 2
                ? "Well Done!"
                : "Keep Practicing!"}
          </h1>
          <p className="text-navy/50 font-semibold mb-2">
            Great effort, {playerName}!
          </p>

          <StarRating stars={stars} />

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-muted/40 rounded-xl p-4">
              <div className="text-3xl font-black text-navy">{score}</div>
              <div className="text-navy/50 text-sm font-semibold">
                Total Score
              </div>
            </div>
            <div className="bg-muted/40 rounded-xl p-4">
              <div className="text-3xl font-black text-navy">{accuracy}%</div>
              <div className="text-navy/50 text-sm font-semibold">Accuracy</div>
            </div>
            <div className="bg-muted/40 rounded-xl p-4">
              <div className="text-3xl font-black text-brand-green">
                {correct}/{total}
              </div>
              <div className="text-navy/50 text-sm font-semibold">Correct</div>
            </div>
            <div className="bg-muted/40 rounded-xl p-4">
              <div className="text-3xl font-black text-brand-orange">
                +{timeBonus}
              </div>
              <div className="text-navy/50 text-sm font-semibold">
                Speed Bonus
              </div>
            </div>
          </div>

          {isPerfect && (
            <div className="mt-4 bg-brand-orange/10 border border-brand-orange/30 rounded-xl p-3 text-brand-orange font-bold text-sm">
              🌟 Perfect Game Bonus! +50 pts
            </div>
          )}
        </motion.div>

        {!submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-navy rounded-2xl p-6 mb-5 text-cream text-center"
          >
            <Trophy size={28} className="mx-auto mb-2 text-brand-orange" />
            <h3 className="font-black text-lg mb-1">Submit to Leaderboard</h3>
            <p className="text-cream/60 text-sm mb-4">
              Share your score of {score} pts with the world!
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitScore.isPending}
              className="w-full bg-brand-orange text-white font-black py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              data-ocid="results.submit.primary_button"
            >
              {submitScore.isPending ? "Submitting..." : "🏆 Submit Score"}
            </button>
          </motion.div>
        )}

        {submitted && (
          <div
            className="text-center text-brand-green font-bold mb-4 text-sm"
            data-ocid="results.submit.success_state"
          >
            ✅ Score submitted successfully!
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/game",
                search: {
                  group: ageGroup,
                  difficulty: difficulty as Difficulty,
                  name: playerName,
                },
              })
            }
            className="flex items-center justify-center gap-2 bg-white border-2 border-navy text-navy font-bold py-3 rounded-xl hover:bg-navy hover:text-cream transition-colors"
            data-ocid="results.playagain.button"
          >
            <RotateCcw size={16} /> Play Again
          </button>
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/play", search: { group: ageGroup } })
            }
            className="flex items-center justify-center gap-2 bg-white border-2 border-navy text-navy font-bold py-3 rounded-xl hover:bg-navy hover:text-cream transition-colors"
            data-ocid="results.settings.button"
          >
            <Settings size={16} /> Change Settings
          </button>
        </div>

        <AnimatePresence>
          {showLeaderboard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-card overflow-hidden"
              data-ocid="results.leaderboard.panel"
            >
              <div className="bg-navy px-6 py-4">
                <h3 className="text-cream font-black text-lg">
                  {cfg.emoji} {cfg.label} Leaderboard
                </h3>
              </div>
              {ageGroupBoard.length === 0 ? (
                <div
                  className="py-8 text-center text-navy/40 font-semibold"
                  data-ocid="results.leaderboard.empty_state"
                >
                  No scores yet!
                </div>
              ) : (
                ageGroupBoard.map((entry, i) => (
                  <div
                    key={`${entry.playerName}-${i}`}
                    className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-0"
                    data-ocid={`results.leaderboard.item.${i + 1}`}
                  >
                    <span className="w-6 font-black text-navy/50 text-sm">
                      {i + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-cream text-xs font-black">
                      {entry.playerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-navy text-sm">
                        {entry.playerName}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${getDifficultyColor(entry.difficulty)}`}
                    >
                      {entry.difficulty}
                    </span>
                    <span className="font-black text-navy">
                      {Number(entry.score)}
                    </span>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
