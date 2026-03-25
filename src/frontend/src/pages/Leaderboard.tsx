import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { ScoreEntry } from "../backend.d";
import { useGlobalTop10, useTop10ByAgeGroup } from "../hooks/useQueries";
import type { AgeGroup } from "../types/game";
import { AGE_GROUP_CONFIG } from "../types/game";

function getDifficultyColor(d: string) {
  if (d === "hard") return "bg-brand-purple text-white";
  if (d === "medium") return "bg-brand-orange text-white";
  return "bg-brand-green text-white";
}

function formatDate(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  if (ms < 1_000_000_000_000) return "Recently";
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const AVATAR_COLORS = [
  "oklch(0.48 0.15 255)",
  "oklch(0.68 0.12 190)",
  "oklch(0.72 0.17 140)",
  "oklch(0.52 0.2 280)",
  "oklch(0.72 0.16 55)",
];

function LeaderboardList({
  entries,
  loading,
}: { entries: ScoreEntry[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="py-16 text-center" data-ocid="leaderboard.loading_state">
        <div className="text-4xl animate-bounce mb-3">⏳</div>
        <p className="text-navy/40 font-semibold">Loading scores...</p>
      </div>
    );
  }
  if (entries.length === 0) {
    return (
      <div className="py-16 text-center" data-ocid="leaderboard.empty_state">
        <div className="text-5xl mb-4">🏆</div>
        <p className="text-navy/40 font-semibold text-lg">No scores yet!</p>
        <p className="text-navy/30 text-sm">Be the first to claim glory.</p>
      </div>
    );
  }
  return (
    <div className="divide-y divide-border">
      {entries.map((entry, i) => (
        <motion.div
          key={`${entry.playerName}-${entry.ageGroup}-${i}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className={`flex items-center gap-4 px-6 py-4 ${i === 0 ? "bg-[oklch(0.97_0.03_85)]" : ""}`}
          data-ocid={`leaderboard.item.${i + 1}`}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
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
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black flex-shrink-0"
            style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
          >
            {entry.playerName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-navy truncate">
              {entry.playerName}
            </div>
            <div className="text-navy/40 text-xs font-semibold">
              {entry.ageGroup} · {formatDate(entry.timestamp)}
            </div>
          </div>
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${getDifficultyColor(entry.difficulty)}`}
          >
            {entry.difficulty}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="font-black text-navy text-lg">
              {Number(entry.score)}
            </span>
            <Star size={14} className="text-brand-orange" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AgeGroupTab({ group }: { group: AgeGroup }) {
  const { data = [], isLoading } = useTop10ByAgeGroup(group);
  return <LeaderboardList entries={data} loading={isLoading} />;
}

export function Leaderboard() {
  const { data: globalData = [], isLoading: globalLoading } = useGlobalTop10();
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Trophy size={32} className="text-brand-orange" />
            <h1 className="text-4xl font-black text-navy">Leaderboard</h1>
          </div>
          <p className="text-navy/50 font-semibold">
            Top players across all age groups
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-card-hover overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-4 pt-4 border-b border-border">
              <TabsList className="w-full bg-muted/50 h-auto p-1 grid grid-cols-5">
                <TabsTrigger
                  value="all"
                  className="text-xs font-bold"
                  data-ocid="leaderboard.all.tab"
                >
                  🌍 All
                </TabsTrigger>
                {(Object.keys(AGE_GROUP_CONFIG) as AgeGroup[]).map((g) => (
                  <TabsTrigger
                    key={g}
                    value={g}
                    className="text-xs font-bold"
                    data-ocid={`leaderboard.${g}.tab`}
                  >
                    {AGE_GROUP_CONFIG[g].emoji} {AGE_GROUP_CONFIG[g].label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent value="all" className="m-0">
              <LeaderboardList entries={globalData} loading={globalLoading} />
            </TabsContent>
            {(Object.keys(AGE_GROUP_CONFIG) as AgeGroup[]).map((g) => (
              <TabsContent key={g} value={g} className="m-0">
                <AgeGroupTab group={g} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
