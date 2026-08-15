import { motion } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  Star,
  Sprout,
  Crown,
  DoorOpen,
  Flame,
  Sun,
  Flower2,
} from "lucide-react";
import { LEVELS } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const ICONS = {
  sprout: Sprout,
  crown: Crown,
  "door-open": DoorOpen,
  flame: Flame,
  sun: Sun,
  flower: Flower2,
};

const NODE_X = [22, 78, 22, 78, 22, 78]; // alternating left/right, in %
const ROW_H = 168; // px vertical spacing per level
const TOP_PAD = 40;

export function LevelMap({ progress, onBack, onPlayLevel }) {
  const { t } = useTranslation();

  const points = LEVELS.map((lvl, i) => ({
    x: NODE_X[i % NODE_X.length],
    y: TOP_PAD + i * ROW_H,
  }));

  const height = TOP_PAD + (LEVELS.length - 1) * ROW_H + 160;

  // Build a smooth SVG path (in percentage x / px y, using a 0-100 viewBox width)
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }

  return (
    <div className="h-screen flex flex-col mx-auto max-w-xl">
      <div className="px-5 py-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="font-display text-3xl text-maroon-deep leading-none">
              {t("levelMap.storyMode")}
            </h2>
            <p className="text-xs text-indigo/50 mt-1">
              {t("levelMap.garland")}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="p-2">
          <div className="relative mt-4" style={{ height }}>
            <svg
              viewBox={`0 0 100 ${height}`}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <path
                d={d}
                fill="none"
                stroke="#D9A441"
                strokeWidth="0.6"
                strokeDasharray="0.5 2.2"
                strokeLinecap="round"
                opacity="0.75"
              />
            </svg>

            {LEVELS.map((lvl, i) => {
              const Icon = ICONS[lvl.icon] || Flower2;
              const locked = lvl.id > progress.unlockedLevel;
              const stars = progress.levelStars[lvl.id] || 0;
              const isNext = lvl.id === progress.unlockedLevel;
              const pt = points[i];
              return (
                <motion.div
                  key={lvl.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-40"
                  style={{ left: `${pt.x}%`, top: pt.y }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: i * 0.07,
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                  }}
                >
                  <button
                    disabled={locked}
                    onClick={() => onPlayLevel(lvl.id)}
                    className={[
                      "relative h-20 w-20 rounded-full flex items-center justify-center border-4 transition-all",
                      locked
                        ? "bg-indigo/10 border-indigo/10 text-indigo/30 cursor-not-allowed"
                        : isNext
                          ? "bg-maroon border-marigold text-parchment shadow-[0_6px_0_0_var(--color-maroon-deep)] animate-glow-pulse"
                          : "bg-marigold border-marigold-light text-indigo shadow-[0_5px_0_0_#a97a26] hover:brightness-105 active:translate-y-0.5",
                    ].join(" ")}
                  >
                    {locked ? (
                      <Lock size={24} />
                    ) : (
                      <Icon size={26} strokeWidth={2} />
                    )}
                    <span className="absolute -bottom-2 -right-1 h-7 w-7 rounded-full bg-parchment border border-indigo/10 text-[11px] font-bold text-maroon-deep flex items-center justify-center">
                      {lvl.id}
                    </span>
                  </button>

                  <p
                    className={`mt-3 text-center font-label text-sm leading-tight ${locked ? "text-indigo/30" : "text-maroon-deep"}`}
                  >
                    {lvl.title}
                  </p>
                  {!locked && (
                    <div className="flex gap-0.5 mt-1">
                      {[0, 1, 2].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          className={
                            s < stars
                              ? "fill-marigold text-marigold"
                              : "text-indigo/15"
                          }
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
