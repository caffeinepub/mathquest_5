# MathQuest

## Current State
New project. Empty backend and frontend.

## Requested Changes (Diff)

### Add
- Math game with 4 age groups: Kids (5-7), Junior (8-10), Teen (11-14), Adult (15+)
- Each age group has 3 difficulty levels: Easy, Medium, Hard
- Question types vary by age group:
  - Kids: addition, subtraction (single digits)
  - Junior: multiplication, division, mixed operations
  - Teen: fractions, percentages, basic algebra
  - Adult: algebra, geometry formulas, advanced arithmetic
- 10 questions per game session with timer per question
- Points system: correct answer earns points (bonus for fast answers)
- Leaderboard storing top scores per age group
- Decorative, colorful homepage with age group cards
- Player enters name before playing
- Game result screen showing score, accuracy, and leaderboard position

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Backend: store leaderboard entries (playerName, ageGroup, score, timestamp)
2. Backend: query top 10 per age group, submit score
3. Frontend: Decorative homepage with age group selection
4. Frontend: Difficulty selection screen
5. Frontend: Name entry modal
6. Frontend: Game screen with question, timer, answer input, progress bar
7. Frontend: Result screen with score breakdown and leaderboard
8. Frontend: Leaderboard page per age group
