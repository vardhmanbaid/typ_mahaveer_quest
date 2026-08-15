import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameState } from '@/hooks/useGameState'
import { Home } from '@/components/screens/Home'
import { LevelMap } from '@/components/screens/LevelMap'
import { Quiz } from '@/components/screens/Quiz'
import { Result } from '@/components/screens/Result'
import { BadgesDialog } from '@/components/screens/BadgesDialog'

function Fade({ children, k }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={k}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const { progress, recordLevelResult, recordRandomResult, resetProgress } = useGameState()
  const [screen, setScreen] = useState('home') // home | levelmap | quiz | result
  const [quizConfig, setQuizConfig] = useState(null) // { mode, levelId }
  const [summary, setSummary] = useState(null)
  const [newBadges, setNewBadges] = useState([])
  const [badgesOpen, setBadgesOpen] = useState(false)
  const prevBadgesRef = useRef(progress.badges)

  const goHome = () => setScreen('home')
  const goLevelMap = () => setScreen('levelmap')

  function startLevel(levelId) {
    prevBadgesRef.current = progress.badges
    setNewBadges([])
    setQuizConfig({ mode: 'level', levelId })
    setScreen('quiz')
  }

  function startRandom() {
    prevBadgesRef.current = progress.badges
    setNewBadges([])
    setQuizConfig({ mode: 'random', levelId: null })
    setScreen('quiz')
  }

  function retryQuiz() {
    prevBadgesRef.current = progress.badges
    setNewBadges([])
    setScreen('quiz')
  }

  function finishLevel({ levelId, correct, wrong, score, bestStreakInSession }) {
    const prevBest = progress.levelBestScore[levelId] || 0
    recordLevelResult({ levelId, correct, wrong, score, bestStreakInSession })
    setSummary({ mode: 'level', levelId, correct, wrong, score, isHighScore: score > prevBest })
    setScreen('result')
  }

  function finishRandom({ correct, wrong, score, bestStreakInSession }) {
    const prevBest = progress.randomHighScore
    recordRandomResult({ correct, wrong, score, bestStreakInSession })
    setSummary({ mode: 'random', levelId: null, correct, wrong, score, isHighScore: score > prevBest })
    setScreen('result')
  }

  useEffect(() => {
    const before = prevBadgesRef.current || []
    const after = progress.badges || []
    const diff = after.filter((b) => !before.includes(b))
    if (diff.length && screen === 'result') setNewBadges(diff)
  }, [progress.badges, screen])

  return (
    <div className="min-h-screen">
      <Fade k={screen + (quizConfig ? quizConfig.mode + quizConfig.levelId : '')}>
        {screen === 'home' && (
          <Home
            progress={progress}
            onSelectLevelMode={goLevelMap}
            onSelectRandomMode={startRandom}
            onBadgesClick={() => setBadgesOpen(true)}
          />
        )}
        {screen === 'levelmap' && (
          <LevelMap progress={progress} onBack={goHome} onPlayLevel={startLevel} />
        )}
        {screen === 'quiz' && quizConfig && (
          <Quiz
            mode={quizConfig.mode}
            levelId={quizConfig.levelId}
            onExit={quizConfig.mode === 'level' ? goLevelMap : goHome}
            onFinishLevel={finishLevel}
            onFinishRandom={finishRandom}
          />
        )}
        {screen === 'result' && summary && (
          <Result
            summary={summary}
            newBadges={newBadges}
            onRetry={retryQuiz}
            onNextLevel={() => startLevel(summary.levelId + 1)}
            onBackToMap={goLevelMap}
            onHome={goHome}
          />
        )}
      </Fade>

      <BadgesDialog open={badgesOpen} onClose={() => setBadgesOpen(false)} earned={progress.badges} />
    </div>
  )
}
