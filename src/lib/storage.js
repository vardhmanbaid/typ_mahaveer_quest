const KEY = 'mahaveerQuest.progress.v1'

export const DEFAULT_PROGRESS = {
  unlockedLevel: 1,          // highest level unlocked
  levelStars: {},            // { [levelId]: 0-3 }
  levelBestScore: {},        // { [levelId]: number }
  totalScore: 0,             // cumulative all-time score
  randomHighScore: 0,
  randomBestStreak: 0,
  gamesPlayed: 0,
  totalCorrect: 0,
  totalWrong: 0,
  currentStreakDays: 0,
  lastPlayedDate: null,      // yyyy-mm-dd
  badges: [],                // array of badge ids earned
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT_PROGRESS }
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_PROGRESS, ...parsed }
  } catch {
    return { ...DEFAULT_PROGRESS }
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress))
  } catch {
    // localStorage unavailable (private mode etc) - fail silently
  }
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

// Updates the daily-streak counter. Call once per session start.
export function bumpDailyStreak(progress) {
  const today = todayStr()
  if (progress.lastPlayedDate === today) return progress
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const nextStreak = progress.lastPlayedDate === yesterday ? (progress.currentStreakDays || 0) + 1 : 1
  return { ...progress, lastPlayedDate: today, currentStreakDays: nextStreak }
}

export function starsForAccuracy(correct, total) {
  if (total === 0) return 0
  const pct = correct / total
  if (pct === 1) return 3
  if (pct >= 0.7) return 2
  if (pct >= 0.4) return 1
  return 0
}
