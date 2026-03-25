import type { AgeGroup, Difficulty, Question } from "../types/game";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makePlausibleWrongs(
  correct: number,
  count: number,
  min: number,
  max: number,
): number[] {
  const wrongs = new Set<number>();
  const offsets = [-3, -2, -1, 1, 2, 3, -5, 5, -4, 4, -10, 10];
  for (const o of shuffle(offsets)) {
    const w = correct + o;
    if (w !== correct && w >= min && w <= max) wrongs.add(w);
    if (wrongs.size >= count) break;
  }
  while (wrongs.size < count) {
    const w = correct + randInt(-20, 20);
    if (w !== correct) wrongs.add(w);
  }
  return [...wrongs].slice(0, count);
}

function buildQuestion(
  text: string,
  correct: number,
  minAns = 0,
  maxAns = 200,
): Question {
  const wrongs = makePlausibleWrongs(correct, 3, minAns, maxAns);
  const allOptions = shuffle([correct, ...wrongs]);
  return {
    text,
    options: allOptions.map(String),
    correctIndex: allOptions.indexOf(correct),
  };
}

// Kids (5-7)
function kidsEasy(): Question {
  const a = randInt(1, 10);
  const b = randInt(1, 10);
  return buildQuestion(`${a} + ${b} = ?`, a + b, 0, 25);
}

function kidsMedium(): Question {
  if (randInt(0, 1) === 0) {
    const a = randInt(5, 20);
    const b = randInt(1, a);
    return buildQuestion(`${a} - ${b} = ?`, a - b, 0, 30);
  }
  const a = randInt(1, 20);
  const b = randInt(1, 20);
  return buildQuestion(`${a} + ${b} = ?`, a + b, 0, 45);
}

function kidsHard(): Question {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(10, 30);
    const b = randInt(1, a);
    return buildQuestion(`${a} - ${b} = ?`, a - b, 0, 40);
  }
  if (type === 1) {
    const a = randInt(1, 30);
    const b = randInt(1, 30);
    return buildQuestion(`${a} + ${b} = ?`, a + b, 0, 65);
  }
  const a = randInt(2, 5);
  const b = randInt(2, 6);
  return buildQuestion(`${a} × ${b} = ?`, a * b, 0, 40);
}

// Junior (8-10)
function juniorEasy(): Question {
  const a = randInt(1, 5);
  const b = randInt(1, 10);
  return buildQuestion(`${a} × ${b} = ?`, a * b, 0, 60);
}

function juniorMedium(): Question {
  if (randInt(0, 1) === 0) {
    const a = randInt(2, 12);
    const b = randInt(2, 12);
    return buildQuestion(`${a} × ${b} = ?`, a * b, 0, 150);
  }
  const b = randInt(2, 12);
  const result = randInt(2, 12);
  return buildQuestion(`${b * result} ÷ ${b} = ?`, result, 0, 60);
}

function juniorHard(): Question {
  const ops = ["+", "-", "×"];
  const op = ops[randInt(0, 2)];
  if (op === "+") {
    const a = randInt(15, 99);
    const b = randInt(15, 99);
    return buildQuestion(`${a} + ${b} = ?`, a + b, 0, 200);
  }
  if (op === "-") {
    const a = randInt(30, 99);
    const b = randInt(10, a);
    return buildQuestion(`${a} - ${b} = ?`, a - b, 0, 100);
  }
  const a = randInt(10, 25);
  const b = randInt(2, 9);
  return buildQuestion(`${a} × ${b} = ?`, a * b, 0, 250);
}

// Teen (11-14)
function teenEasy(): Question {
  const type = randInt(0, 2);
  if (type === 0) {
    const fracs: [string, number][] = [
      ["1/2 + 1/4", 75],
      ["3/4 - 1/4", 50],
      ["1/3 + 1/3", 67],
      ["1/2 + 1/8", 63],
    ];
    const [text, pct] = fracs[randInt(0, fracs.length - 1)];
    const wrongs = makePlausibleWrongs(pct, 3, 0, 100);
    const all = shuffle([pct, ...wrongs]);
    return {
      text: `${text} = ?% (of whole)`,
      options: all.map((v) => `${v}%`),
      correctIndex: all.indexOf(pct),
    };
  }
  if (type === 1) {
    const b = randInt(1, 20);
    const x = randInt(1, 20);
    return buildQuestion(`x + ${b} = ${x + b}\nFind x`, x, 0, 50);
  }
  const b = randInt(1, 15);
  const x = randInt(1, 20);
  return buildQuestion(`x - ${b} = ${x - b}\nFind x`, x, 0, 40);
}

function teenMedium(): Question {
  if (randInt(0, 1) === 0) {
    const pcts = [10, 20, 25, 50, 75];
    const pct = pcts[randInt(0, pcts.length - 1)];
    const num = randInt(2, 20) * 10;
    const ans = (pct * num) / 100;
    return buildQuestion(`${pct}% of ${num} = ?`, ans, 0, 300);
  }
  const a = randInt(2, 10);
  const b = randInt(1, 10);
  const c = randInt(1, 20);
  return buildQuestion(`${a} × ${b} + ${c} = ?`, a * b + c, 0, 150);
}

function teenHard(): Question {
  const type = randInt(0, 2);
  if (type === 0) {
    const x = randInt(2, 12);
    return buildQuestion(`x² = ${x * x}\nFind x (positive)`, x, 0, 20);
  }
  if (type === 1) {
    const l = randInt(5, 20);
    const w = randInt(3, 15);
    return buildQuestion(
      `Rectangle: length=${l}, width=${w}\nArea = ?`,
      l * w,
      0,
      400,
    );
  }
  const x = randInt(1, 15);
  const b = randInt(1, 20);
  return buildQuestion(`2x + ${b} = ${2 * x + b}\nFind x`, x, 0, 30);
}

// Adult (15+)
function adultEasy(): Question {
  if (randInt(0, 1) === 0) {
    const a = randInt(2, 6);
    const x = randInt(-10, 15);
    const b = randInt(-10, 10);
    return buildQuestion(`${a}x + ${b} = ${a * x + b}\nFind x`, x, -20, 30);
  }
  const a = randInt(-20, -1);
  const b = randInt(1, 30);
  return buildQuestion(`${a} + ${b} = ?`, a + b, -25, 35);
}

function adultMedium(): Question {
  if (randInt(0, 1) === 0) {
    const rate = [5, 10, 15, 20, 25][randInt(0, 4)];
    const principal = randInt(2, 10) * 100;
    const interest = (principal * rate) / 100;
    return buildQuestion(
      `Simple interest: Principal=${principal}, Rate=${rate}%\nInterest = ?`,
      interest,
      0,
      500,
    );
  }
  const a = randInt(2, 8);
  const b = randInt(1, 6);
  const x = randInt(1, 10);
  return buildQuestion(`${a}x + ${b}x = ${(a + b) * x}\nFind x`, x, 0, 20);
}

function adultHard(): Question {
  const type = randInt(0, 2);
  if (type === 0) {
    const pairs: [string, number][] = [
      ["log₁₀(100)", 2],
      ["log₁₀(1000)", 3],
      ["log₁₀(10)", 1],
      ["log₁₀(0.1)", -1],
    ];
    const [text, ans] = pairs[randInt(0, pairs.length - 1)];
    return buildQuestion(`${text} = ?`, ans, -3, 5);
  }
  if (type === 1) {
    const n = randInt(4, 10);
    return buildQuestion(
      `C(${n}, 2) = ?\n(Combinations)`,
      (n * (n - 1)) / 2,
      0,
      60,
    );
  }
  const r1 = randInt(-8, -1);
  const r2 = randInt(1, 8);
  const bCoef = -(r1 + r2);
  const cCoef = r1 * r2;
  const bStr = bCoef >= 0 ? `+ ${bCoef}` : `- ${Math.abs(bCoef)}`;
  const cStr = cCoef >= 0 ? `+ ${cCoef}` : `- ${Math.abs(cCoef)}`;
  return buildQuestion(`x² ${bStr}x ${cStr} = 0\nPositive root?`, r2, 0, 15);
}

const generators: Record<AgeGroup, Record<Difficulty, () => Question>> = {
  kids: { easy: kidsEasy, medium: kidsMedium, hard: kidsHard },
  junior: { easy: juniorEasy, medium: juniorMedium, hard: juniorHard },
  teen: { easy: teenEasy, medium: teenMedium, hard: teenHard },
  adult: { easy: adultEasy, medium: adultMedium, hard: adultHard },
};

export function generateQuestion(
  ageGroup: AgeGroup,
  difficulty: Difficulty,
): Question {
  return generators[ageGroup][difficulty]();
}

export function generateQuestions(
  ageGroup: AgeGroup,
  difficulty: Difficulty,
  count = 10,
): Question[] {
  return Array.from({ length: count }, () =>
    generateQuestion(ageGroup, difficulty),
  );
}
