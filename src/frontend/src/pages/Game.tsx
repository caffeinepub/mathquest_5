import { useNavigate, useSearch } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { generateQuestions } from "../lib/mathGenerator";
import type { AgeGroup, Difficulty, Question } from "../types/game";
import { AGE_GROUP_CONFIG, DIFFICULTY_CONFIG } from "../types/game";

const TIMER_SECONDS = 12;
const TOTAL_QUESTIONS = 10;

type AnswerState = "idle" | "correct" | "wrong";

export function Game() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/game" }) as {
    group?: AgeGroup;
    difficulty?: Difficulty;
    name?: string;
  };

  const ageGroup: AgeGroup = search.group ?? "kids";
  const difficulty: Difficulty = search.difficulty ?? "easy";
  const playerName = search.name ?? "Player";

  const [questions] = useState<Question[]>(() =>
    generateQuestions(ageGroup, difficulty, TOTAL_QUESTIONS),
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [timeBonus, setTimeBonus] = useState(0);

  const scoreRef = useRef(0);
  const correctCountRef = useRef(0);
  const timeBonusRef = useRef(0);
  const timeLeftRef = useRef(TIMER_SECONDS);
  const answerStateRef = useRef<AnswerState>("idle");
  const currentQRef = useRef(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handledRef = useRef(false);

  scoreRef.current = score;
  correctCountRef.current = correctCount;
  timeBonusRef.current = timeBonus;
  timeLeftRef.current = timeLeft;
  answerStateRef.current = answerState;
  currentQRef.current = currentQ;

  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const ageGroupRef = useRef(ageGroup);
  ageGroupRef.current = ageGroup;
  const difficultyRef = useRef(difficulty);
  difficultyRef.current = difficulty;
  const playerNameRef = useRef(playerName);
  playerNameRef.current = playerName;

  const cfg = AGE_GROUP_CONFIG[ageGroup];
  const dcfg = DIFFICULTY_CONFIG[difficulty];
  const question = questions[currentQ];

  const handleAnswer = (idx: number) => {
    if (answerStateRef.current !== "idle" || handledRef.current) return;
    handledRef.current = true;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);

    setSelectedIdx(idx);

    const sc = scoreRef.current;
    const cc = correctCountRef.current;
    const tb = timeBonusRef.current;
    const tl = timeLeftRef.current;
    const isCorrect = idx === question.correctIndex;
    let pts = 0;
    let bonus = 0;

    if (isCorrect) {
      pts = dcfg.basePoints;
      const elapsed = TIMER_SECONDS - tl;
      if (elapsed < TIMER_SECONDS / 3) bonus = 5;
      else if (elapsed < (TIMER_SECONDS * 2) / 3) bonus = 2;
      pts += bonus;
      setAnswerState("correct");
      setPointsEarned(pts);
      setScore(sc + pts);
      setCorrectCount(cc + 1);
      setTimeBonus(tb + bonus);
    } else {
      setAnswerState("wrong");
      setPointsEarned(0);
    }

    const newSc = isCorrect ? sc + pts : sc;
    const newCc = isCorrect ? cc + 1 : cc;
    const newTb = isCorrect ? tb + bonus : tb;

    advanceTimeoutRef.current = setTimeout(() => {
      const nextQ = currentQRef.current + 1;
      if (nextQ >= TOTAL_QUESTIONS) {
        const finalScore = newSc + (newCc === TOTAL_QUESTIONS ? 50 : 0);
        navigateRef.current({
          to: "/results",
          search: {
            group: ageGroupRef.current,
            difficulty: difficultyRef.current,
            name: playerNameRef.current,
            score: String(finalScore),
            correct: String(newCc),
            total: String(TOTAL_QUESTIONS),
            timeBonus: String(newTb),
            isPerfect: String(newCc === TOTAL_QUESTIONS),
          },
        });
      } else {
        setCurrentQ(nextQ);
        setAnswerState("idle");
        setSelectedIdx(null);
        setTimeLeft(TIMER_SECONDS);
        setPointsEarned(0);
        handledRef.current = false;
      }
    }, 1500);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: currentQ is the intentional timer reset trigger
  useEffect(() => {
    handledRef.current = false;

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          if (!handledRef.current) {
            handledRef.current = true;
            setAnswerState("wrong");
            advanceTimeoutRef.current = setTimeout(() => {
              const nextQ = currentQRef.current + 1;
              const sc = scoreRef.current;
              const cc = correctCountRef.current;
              const tb = timeBonusRef.current;
              if (nextQ >= TOTAL_QUESTIONS) {
                navigateRef.current({
                  to: "/results",
                  search: {
                    group: ageGroupRef.current,
                    difficulty: difficultyRef.current,
                    name: playerNameRef.current,
                    score: String(sc),
                    correct: String(cc),
                    total: String(TOTAL_QUESTIONS),
                    timeBonus: String(tb),
                    isPerfect: "false",
                  },
                });
              } else {
                setCurrentQ(nextQ);
                setAnswerState("idle");
                setSelectedIdx(null);
                setTimeLeft(TIMER_SECONDS);
                setPointsEarned(0);
                handledRef.current = false;
              }
            }, 1500);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, [currentQ]);

  const timerPct = (timeLeft / TIMER_SECONDS) * 100;
  const timerColor =
    timerPct > 50
      ? "oklch(0.72 0.17 140)"
      : timerPct > 25
        ? "oklch(0.72 0.16 55)"
        : "oklch(0.577 0.245 27.325)";

  const optionColors = [
    "oklch(0.68 0.12 190)",
    "oklch(0.72 0.16 55)",
    "oklch(0.52 0.2 280)",
    "oklch(0.48 0.15 255)",
  ];

  return (
    <div className="min-h-screen bg-cream py-6 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-navy text-cream text-xs font-bold px-3 py-1 rounded-full">
              {cfg.emoji} {cfg.label}
            </span>
            <span
              className="text-white text-xs font-bold px-3 py-1 rounded-full"
              style={{
                backgroundColor:
                  optionColors[
                    Object.keys(DIFFICULTY_CONFIG).indexOf(difficulty)
                  ],
              }}
            >
              ⚡ {difficulty}
            </span>
          </div>
          <div className="flex items-center gap-3 text-navy">
            <span className="font-black text-lg">⭐ {score}</span>
            <span
              className="font-semibold text-navy/50 text-sm"
              data-ocid="game.question.panel"
            >
              Q {currentQ + 1}/{TOTAL_QUESTIONS}
            </span>
          </div>
        </div>

        <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-navy"
            animate={{ width: `${(currentQ / TOTAL_QUESTIONS) * 100}%` }}
            transition={{ duration: 0.3 }}
            data-ocid="game.progress.panel"
          />
        </div>

        <div className="h-3 bg-muted rounded-full mb-6 overflow-hidden">
          <motion.div
            key={`timer-${currentQ}`}
            className="h-full rounded-full"
            style={{ backgroundColor: timerColor, width: `${timerPct}%` }}
            animate={{ width: `${timerPct}%`, backgroundColor: timerColor }}
            transition={{ duration: 0.2 }}
            data-ocid="game.timer.panel"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-2xl shadow-card p-8 mb-6 text-center border-4 transition-colors ${
              answerState === "correct"
                ? "border-brand-green"
                : answerState === "wrong"
                  ? "border-destructive"
                  : "border-transparent"
            }`}
            data-ocid="game.question.card"
          >
            <div className="text-navy/40 text-sm font-semibold mb-3">
              Solve this:
            </div>
            <pre className="text-3xl md:text-4xl font-black text-navy whitespace-pre-wrap font-nunito">
              {question.text}
            </pre>
            <AnimatePresence>
              {answerState !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 font-black text-lg ${answerState === "correct" ? "text-brand-green" : "text-destructive"}`}
                >
                  {answerState === "correct"
                    ? `✓ Correct! +${pointsEarned} pts 🎉`
                    : `✗ Wrong! Answer: ${question.options[question.correctIndex]}`}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-4" data-ocid="game.answers.panel">
          {question.options.map((opt, idx) => {
            let borderClass = "border-2 border-transparent";
            if (answerState !== "idle") {
              if (idx === question.correctIndex) {
                borderClass =
                  "border-4 border-brand-green ring-4 ring-brand-green/20";
              } else if (idx === selectedIdx) {
                borderClass =
                  "border-4 border-destructive ring-4 ring-destructive/20";
              }
            }
            return (
              <motion.button
                type="button"
                key={`q${currentQ}-opt-${opt}`}
                whileHover={answerState === "idle" ? { scale: 1.03 } : {}}
                whileTap={answerState === "idle" ? { scale: 0.97 } : {}}
                onClick={() => handleAnswer(idx)}
                disabled={answerState !== "idle"}
                className={`py-5 px-4 rounded-xl font-black text-xl transition-all shadow-card text-white ${borderClass} ${
                  answerState === "idle"
                    ? "hover:opacity-90 cursor-pointer"
                    : "cursor-default"
                }`}
                style={{ backgroundColor: optionColors[idx] }}
                data-ocid={`game.answer.button.${idx + 1}`}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>

        <div className="text-center mt-4 text-navy/40 font-bold text-sm">
          ⏱ {timeLeft}s remaining
        </div>
      </div>
    </div>
  );
}
