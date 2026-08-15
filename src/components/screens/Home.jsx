import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Map, Shuffle, ChevronRight, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatsHeader } from '@/components/StatsHeader'
import { TOTAL_LEVELS } from '@/data/questions'

export function Home({ progress, onSelectLevelMode, onSelectRandomMode, onBadgesClick }) {
  const { t } = useTranslation()
  const levelsDone = Object.values(progress.levelStars).filter((s) => s > 0).length

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 space-y-8">
      <StatsHeader progress={progress} onBadgesClick={onBadgesClick} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pt-4 pb-2"
      >
        <p className="font-label text-marigold text-sm tracking-[0.3em] uppercase mb-2">{t('app.tagline')}</p>
        <h1 className="font-display text-5xl sm:text-6xl text-maroon-deep leading-[1.05]">
          भगवान महावीर के<br /> पथ पर चलें
        </h1>
        <p className="mt-4 text-indigo/70 max-w-md mx-auto">
          {t('home.description')}
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
          <Card
            className="cursor-pointer h-full overflow-hidden relative group"
            onClick={onSelectLevelMode}
          >
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-marigold/15 group-hover:scale-125 transition-transform duration-500" />
            <CardContent className="relative space-y-3">
              <div className="h-12 w-12 rounded-xl bg-maroon flex items-center justify-center text-parchment">
                <Map size={22} />
              </div>
              <div>
                <h3 className="font-display text-2xl text-maroon-deep">{t('home.storyMode')}</h3>
                <p className="text-sm text-indigo/60 mt-1 leading-relaxed">
                  {t('home.storyModeDesc', { total: TOTAL_LEVELS })}
                </p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-indigo/50">{levelsDone}/{TOTAL_LEVELS} {t('home.levelsClearedLabel')}</span>
                <ChevronRight size={18} className="text-maroon" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
          <Card
            className="cursor-pointer h-full overflow-hidden relative group"
            onClick={onSelectRandomMode}
          >
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-lotus/20 group-hover:scale-125 transition-transform duration-500" />
            <CardContent className="relative space-y-3">
              <div className="h-12 w-12 rounded-xl bg-marigold flex items-center justify-center text-indigo">
                <Shuffle size={22} />
              </div>
              <div>
                <h3 className="font-display text-2xl text-maroon-deep">{t('home.endlessWander')}</h3>
                <p className="text-sm text-indigo/60 mt-1 leading-relaxed">
                  {t('home.endlessWanderDesc')}
                </p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-indigo/50">{t('home.bestScore')}: {progress.randomHighScore} pts</span>
                <ChevronRight size={18} className="text-maroon" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="bg-indigo/5 border-indigo/10">
        <CardContent className="flex items-center gap-4">
          <Trophy size={26} className="text-marigold shrink-0" />
          <p className="text-sm text-indigo/70">
            {t('home.scoringInfo')}
          </p>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-indigo/40 pb-4">{t('home.progressSaved')}</p>
    </div>
  )
}
