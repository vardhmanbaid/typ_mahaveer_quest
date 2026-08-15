import { useCallback, useEffect, useState } from 'react'
import { loadProgress, saveProgress, bumpDailyStreak, starsForAccuracy } from '@/lib/storage'
import { TOTAL_LEVELS } from '@/data/questions'

export function useGameState() {
  const [progress, setProgress] = useState(loadProgress)

  useEffect(() => {
    setProgress((p) => bumpDailyStreak(p))
  }, [])

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const awardBadge = useCallback((id, list) => {
    if (list.includes(id)) return list
    return [...list, id]
  }, [])

  const recordLevelResult = useCallback(({ levelId, correct, wrong, score, bestStreakInSession }) => {
    setProgress((p) => {
      const stars = starsForAccuracy(correct, correct + wrong)
      const prevStars = p.levelStars[levelId] || 0
      const prevBest = p.levelBestScore[levelId] || 0
      let badges = [...p.badges]
      if (levelId === 1) badges = awardBadge('first_step', badges)
      if (levelId >= 4) badges = awardBadge('half_journey', badges)
      if (Math.max(stars, prevStars) === 3) badges = awardBadge('perfectionist', badges)
      if (bestStreakInSession >= 5) badges = awardBadge('streak_5', badges)
      if (bestStreakInSession >= 10) badges = awardBadge('streak_10', badges)
      const completedAll = levelId === TOTAL_LEVELS && Math.max(stars, prevStars) > 0
      if (completedAll) badges = awardBadge('enlightened', badges)
      if ((p.currentStreakDays || 0) >= 3) badges = awardBadge('loyal_seeker', badges)

      return {
        ...p,
        unlockedLevel: Math.max(p.unlockedLevel, Math.min(levelId + 1, TOTAL_LEVELS)),
        levelStars: { ...p.levelStars, [levelId]: Math.max(prevStars, stars) },
        levelBestScore: { ...p.levelBestScore, [levelId]: Math.max(prevBest, score) },
        totalScore: p.totalScore + score,
        gamesPlayed: p.gamesPlayed + 1,
        totalCorrect: p.totalCorrect + correct,
        totalWrong: p.totalWrong + wrong,
        badges,
      }
    })
  }, [awardBadge])

  const recordRandomResult = useCallback(({ correct, wrong, score, bestStreakInSession }) => {
    setProgress((p) => {
      let badges = [...p.badges]
      if (score >= 100) badges = awardBadge('random_master', badges)
      if (bestStreakInSession >= 5) badges = awardBadge('streak_5', badges)
      if (bestStreakInSession >= 10) badges = awardBadge('streak_10', badges)
      if ((p.currentStreakDays || 0) >= 3) badges = awardBadge('loyal_seeker', badges)
      return {
        ...p,
        randomHighScore: Math.max(p.randomHighScore, score),
        randomBestStreak: Math.max(p.randomBestStreak, bestStreakInSession),
        totalScore: p.totalScore + score,
        gamesPlayed: p.gamesPlayed + 1,
        totalCorrect: p.totalCorrect + correct,
        totalWrong: p.totalWrong + wrong,
        badges,
      }
    })
  }, [awardBadge])

  const resetProgress = useCallback(() => {
    localStorage.removeItem('mahaveerQuest.progress.v1')
    setProgress(loadProgress())
  }, [])

  return { progress, recordLevelResult, recordRandomResult, resetProgress }
}
