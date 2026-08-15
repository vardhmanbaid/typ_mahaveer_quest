import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { BADGES } from '@/data/badges'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'

export function BadgesDialog({ open, onClose, earned }) {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="font-display text-xl sm:text-2xl text-maroon-deep">आपके बैज</h3>
        <button onClick={onClose} className="text-indigo/40 hover:text-indigo"><X size={18} className="sm:w-5 sm:h-5" /></button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 max-h-[60vh] overflow-y-auto">
        {Object.values(BADGES).map((b) => {
          const has = earned.includes(b.id)
          return (
            <div
              key={b.id}
              className={`rounded-lg sm:rounded-xl border p-2 sm:p-3 text-center ${has ? 'border-marigold bg-marigold/10' : 'border-indigo/10 bg-indigo/5 opacity-50'}`}
            >
              <div className="text-xl sm:text-2xl mb-1">{has ? '🏅' : '🔒'}</div>
              <p className="font-label text-xs sm:text-sm text-maroon-deep">{t(`badges.${b.id}`)}</p>
              <p className="text-[10px] sm:text-[11px] text-indigo/50 mt-0.5">{t(`badges.${b.id}Desc`)}</p>
            </div>
          )
        })}
      </div>
      <Button className="w-full mt-4 sm:mt-5 h-11 sm:h-14" onClick={onClose}>बंद करें</Button>
    </Dialog>
  )
}
