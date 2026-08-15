import { Flame, Gem, CalendarHeart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function StatsHeader({ progress, onBadgesClick }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-maroon text-parchment flex items-center justify-center font-display text-lg shadow-[0_2px_0_0_var(--color-maroon-deep)]">
          म
        </div>
        <div>
          <p className="font-display text-2xl leading-none text-maroon-deep">{t('stats.mahaveerQuest')}</p>
          <p className="text-[11px] uppercase tracking-[0.15em] text-indigo/50">{t('stats.journeyThroughJina')}</p>
        </div>
      </div>
      <button
        onClick={onBadgesClick}
        className="flex items-center gap-4 rounded-full bg-white/70 border border-indigo/10 px-4 py-2 hover:bg-white transition-colors"
      >
        <span className="flex items-center gap-1.5 text-sm font-semibold text-maroon-deep">
          <Gem size={16} className="text-marigold" strokeWidth={2.5} />
          {progress.totalScore}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-maroon-deep">
          <CalendarHeart size={16} className="text-lotus" strokeWidth={2.5} />
          {progress.currentStreakDays || 0}d
        </span>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-maroon-deep">
          <Flame size={16} className="text-bad" strokeWidth={2.5} />
          {progress.badges.length}
        </span>
      </button>
    </div>
  )
}
