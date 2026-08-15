import { Flame, Gem, CalendarHeart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function StatsHeader({ progress, onBadgesClick }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-maroon text-parchment flex items-center justify-center font-display text-sm sm:text-lg shadow-[0_2px_0_0_var(--color-maroon-deep)]">
          म
        </div>
        <div>
          <p className="font-display text-lg sm:text-2xl leading-none text-maroon-deep">{t('stats.mahaveerQuest')}</p>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-indigo/50">{t('stats.journeyThroughJina')}</p>
        </div>
      </div>
      <button
        onClick={onBadgesClick}
        className="flex items-center gap-3 sm:gap-4 rounded-full bg-white/70 border border-indigo/10 px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-white transition-colors"
      >
        <span className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold text-maroon-deep">
          <Gem size={14} className="sm:w-4 sm:h-4 text-marigold" strokeWidth={2.5} />
          {progress.totalScore}
        </span>
        <span className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold text-maroon-deep">
          <CalendarHeart size={14} className="sm:w-4 sm:h-4 text-lotus" strokeWidth={2.5} />
          {progress.currentStreakDays || 0}d
        </span>
        <span className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold text-maroon-deep">
          <Flame size={14} className="sm:w-4 sm:h-4 text-bad" strokeWidth={2.5} />
          {progress.badges.length}
        </span>
      </button>
    </div>
  )
}
