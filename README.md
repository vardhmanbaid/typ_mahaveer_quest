# Mahaveer Quest

A gamified quiz app about the life of Bhagwan Mahaveer Swami, the 24th Tirthankara of Jainism — built with Vite + React + Tailwind (shadcn-style UI) + Framer Motion.

## Features

- **Story Mode** — 6 levels x 10 questions, walking chronologically through Mahaveer's life (birth -> royal life -> renunciation -> penance -> enlightenment -> nirvana), laid out on a garland-styled level map.
- **Endless Wander (Random Mode)** — unlimited random questions from the full question bank, play until you choose to stop.
- **Scoring** — +5 for a correct answer, -3 for a wrong one, with live streak tracking.
- **Gamification** — stars per level (based on accuracy), a badge collection, daily play-streak tracking, confetti and shake-feedback animations, high-score tracking — all persisted to localStorage, no backend required.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  data/questions.js     # the full question bank, grouped into 6 levels
  data/badges.js         # badge definitions
  lib/storage.js         # localStorage persistence helpers
  hooks/useGameState.js  # central game-state hook (score, levels, badges)
  components/ui/         # small shadcn-style primitives (Button, Card, Progress, Badge, Dialog)
  components/screens/    # Home, LevelMap, Quiz, Result, BadgesDialog
  App.jsx                # simple screen state-machine tying it all together
```

## Editing the questions

All content lives in src/data/questions.js. Each question is:

```js
{ id: 'q1', level: 1, question: '...', options: ['A', 'B', 'C', 'D'], answer: 0, explanation: '...' }
```

answer is the index of the correct option. Levels must have exactly 10 questions each to keep Story Mode consistent (QUESTIONS_PER_LEVEL).
