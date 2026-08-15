import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import confetti from 'canvas-confetti'
import { Star, Gem, Flame, Check, X, RotateCcw, Home as HomeIcon, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BADGES } from '@/data/badges'
import { LEVELS, TOTAL_LEVELS } from '@/data/questions'
import { starsForAccuracy } from '@/lib/storage'

export function Result({ summary, newBadges, onRetry, onNextLevel, onHome, onBackToMap }) {
  const { t } = useTranslation()
  const { mode, levelId, correct, wrong, score, isHighScore } = summary
  const total = correct + wrong
  const stars = mode === 'level' ? starsForAccuracy(correct, total) : null
  const hasNext = mode === 'level' && levelId < TOTAL_LEVELS
  const levelTitle = mode === 'level' ? LEVELS.find((l) => l.id === levelId)?.title : null

  useEffect(() => {
    if (mode === 'level' && stars >= 2) {
      const t = setTimeout(() => {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.4 }, colors: ['#D9A441', '#7A1F2B', '#EFC975'] })
      }, 200)
      return () => clearTimeout(t)
    }
  }, [mode, stars])

  return (
    <div className="mx-auto max-w-lg h-screen px-4 sm:px-5 py-6 sm:py-10 flex flex-col items-center text-center overflow-y-auto">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-marigold to-maroon flex items-center justify-center shadow-lg mb-3 sm:mb-5 flex-shrink-0"
      >
        <Gem size={32} className="sm:w-10 sm:h-10 text-parchment" />
      </motion.div>

      <p className="font-label text-marigold text-xs tracking-[0.25em] uppercase leading-relaxed">
        {mode === 'level' ? t('result.levelComplete', { level: levelId }) : t('result.sessionComplete')}
      </p>
      <h1 className="font-display text-3xl sm:text-4xl text-maroon-deep mt-1 leading-snug">
        {mode === 'level' ? levelTitle : t('result.wellWandered')}
      </h1>

      {mode === 'level' && (
        <div className="flex gap-1.5 mt-3 sm:mt-4 justify-center">
          {[0, 1, 2].map((s) => (
            <motion.div key={s} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.15 + s * 0.15, type: 'spring' }}>
              <Star size={28} className={`sm:w-9 sm:h-9 ${s < stars ? 'fill-marigold text-marigold' : 'text-indigo/15'}`} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mt-5 sm:mt-7">
        <Card><CardContent className="p-3 sm:p-4">
          <p className="text-xl sm:text-2xl font-display text-maroon-deep">{score}</p>
          <p className="text-[10px] sm:text-[11px] text-indigo/50 uppercase tracking-wide">{t('result.points')}</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 sm:p-4">
          <p className="text-xl sm:text-2xl font-display text-ok flex items-center justify-center gap-0.5 sm:gap-1"><Check size={16} className="sm:w-4.5 sm:h-4.5" />{correct}</p>
          <p className="text-[10px] sm:text-[11px] text-indigo/50 uppercase tracking-wide">{t('result.correct')}</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 sm:p-4">
          <p className="text-xl sm:text-2xl font-display text-bad flex items-center justify-center gap-0.5 sm:gap-1"><X size={16} className="sm:w-4.5 sm:h-4.5" />{wrong}</p>
          <p className="text-[10px] sm:text-[11px] text-indigo/50 uppercase tracking-wide">{t('result.wrong')}</p>
        </CardContent></Card>
      </div>

      {isHighScore && (
        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm font-semibold text-maroon-deep bg-marigold/15 border border-marigold/40 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
          <Flame size={13} className="sm:w-4 sm:h-4" /> {t('result.newHighScore')}
        </div>
      )}

      {newBadges?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full mt-4 sm:mt-6">
          <p className="text-xs uppercase tracking-wide text-indigo/50 mb-2">{t('result.badgeEarned')}</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
            {newBadges.map((id) => (
              <span key={id} className="rounded-full bg-maroon text-parchment px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-label">
                🏅 {t(`badges.${id}`)}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      <div className="w-full mt-6 sm:mt-9 space-y-2 sm:space-y-3">
        {mode === 'level' && hasNext && (
          <Button size="lg" className="w-full h-12 sm:h-14 text-sm sm:text-lg" onClick={onNextLevel}>
            {t('result.continueToLevel', { next: levelId + 1 })} <ArrowRight size={14} className="sm:w-4.5 sm:h-4.5" />
          </Button>
        )}
        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" size="lg" className="flex-1 h-12 sm:h-14 text-sm sm:text-lg" onClick={onRetry}>
            <RotateCcw size={14} className="sm:w-4 sm:h-4" /> {t('result.retry')}
          </Button>
          <Button variant="subtle" size="lg" className="flex-1 h-12 sm:h-14 text-sm sm:text-lg" onClick={mode === 'level' ? onBackToMap : onHome}>
            {mode === 'level' ? t('result.levelMap') : <><HomeIcon size={14} className="sm:w-4 sm:h-4" /> {t('result.home')}</>}
          </Button>
        </div>
        {mode === 'level' && (
          <button onClick={onHome} className="text-xs text-indigo/40 underline underline-offset-2">{t('result.backToHome')}</button>
        )}
      </div>
    </div>
  )
}
