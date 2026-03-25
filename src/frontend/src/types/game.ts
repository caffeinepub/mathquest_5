export type AgeGroup = "kids" | "junior" | "teen" | "adult";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface GameSettings {
  ageGroup: AgeGroup;
  difficulty: Difficulty;
  playerName: string;
}

export interface GameResult {
  settings: GameSettings;
  totalScore: number;
  correctAnswers: number;
  totalQuestions: number;
  timeBonus: number;
  isPerfect: boolean;
}

export const AGE_GROUP_CONFIG: Record<
  AgeGroup,
  {
    label: string;
    range: string;
    emoji: string;
    description: string;
    colorClass: string;
    bgClass: string;
  }
> = {
  kids: {
    label: "Kids",
    range: "5–7",
    emoji: "🧒",
    description: "Simple Addition & Subtraction",
    colorClass: "text-brand-green",
    bgClass: "bg-brand-green",
  },
  junior: {
    label: "Junior",
    range: "8–10",
    emoji: "📚",
    description: "Multiplication & Division",
    colorClass: "text-brand-teal",
    bgClass: "bg-brand-teal",
  },
  teen: {
    label: "Teen",
    range: "11–14",
    emoji: "🔢",
    description: "Fractions & Algebra",
    colorClass: "text-brand-purple",
    bgClass: "bg-brand-purple",
  },
  adult: {
    label: "Adult",
    range: "15+",
    emoji: "🎓",
    description: "Advanced Mathematics",
    colorClass: "text-brand-blue",
    bgClass: "bg-brand-blue",
  },
};

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  {
    label: string;
    basePoints: number;
    description: string;
    color: string;
  }
> = {
  easy: {
    label: "Easy",
    basePoints: 10,
    description: "Perfect for warming up",
    color: "bg-brand-green",
  },
  medium: {
    label: "Medium",
    basePoints: 15,
    description: "A solid challenge",
    color: "bg-brand-orange",
  },
  hard: {
    label: "Hard",
    basePoints: 20,
    description: "For math champions",
    color: "bg-brand-purple",
  },
};
