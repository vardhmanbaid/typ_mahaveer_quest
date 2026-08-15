import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import confetti from "canvas-confetti";
import {
  X,
  Flame,
  Gem,
  Check,
  XCircle,
  ArrowRight,
  Square,
} from "lucide-react";
import { QUESTIONS, QUESTIONS_BY_LEVEL, LEVELS } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleOptions(q) {
  const idx = q.options.map((_, i) => i);
  const order = shuffle(idx);
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    answer: order.indexOf(q.answer),
  };
}

export function Quiz({ mode, levelId, onExit, onFinishLevel, onFinishRandom }) {
  const { t } = useTranslation();
  const baseQuestions = useMemo(() => {
    if (mode === "level")
      return QUESTIONS_BY_LEVEL(levelId).map(shuffleOptions);
    return shuffle(QUESTIONS).map(shuffleOptions);
  }, [mode, levelId]);

  const [queue, setQueue] = useState(baseQuestions);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [floatTick, setFloatTick] = useState(null); // { id, text, positive }
  const [shakeKey, setShakeKey] = useState(0);
  const cardRef = useRef(null);

  const total = mode === "level" ? QUESTIONS_BY_LEVEL(levelId).length : null;
  const current = queue[index];
  const levelInfo =
    mode === "level" ? LEVELS.find((l) => l.id === levelId) : null;

  // extend random queue as needed so it never runs out
  useEffect(() => {
    if (mode !== "random") return;
    if (index >= queue.length - 5) {
      setQueue((q) => [...q, ...shuffle(QUESTIONS).map(shuffleOptions)]);
    }
  }, [index, mode, queue.length]);

  function handleAnswer(optIndex) {
    if (answered) return;
    setSelected(optIndex);
    setAnswered(true);
    const isCorrect = optIndex === current.answer;

    if (isCorrect) {
      const pts = 5;
      setScore((s) => s + pts);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
      setCorrectCount((c) => c + 1);
      setFloatTick({ id: Date.now(), text: "+5", positive: true });
      confetti({
        particleCount: 60,
        spread: 65,
        startVelocity: 32,
        origin: { y: 0.6 },
        colors: ["#D9A441", "#7A1F2B", "#EFC975", "#C97B84"],
      });
    } else {
      setScore((s) => s - 3);
      setStreak(0);
      setWrongCount((c) => c + 1);
      setFloatTick({ id: Date.now(), text: "-3", positive: false });
      setShakeKey((k) => k + 1);
    }
  }

  function goNext() {
    setAnswered(false);
    setSelected(null);
    setFloatTick(null);
    if (mode === "level" && index + 1 >= total) {
      onFinishLevel({
        levelId,
        correct: correctCount,
        wrong: wrongCount,
        score,
        bestStreakInSession: bestStreak,
      });
      return;
    }
    setIndex((i) => i + 1);
  }

  function stopRandom() {
    onFinishRandom({
      correct: correctCount,
      wrong: wrongCount,
      score,
      bestStreakInSession: bestStreak,
    });
  }

  if (!current) return null;

  const progressPct =
    mode === "level"
      ? (index / total) * 100
      : Math.min(100, (index % total) * total);

  return (
    <div className="mx-auto max-w-xl h-screen px-4 py-4 flex flex-col space-y-32 overflow-hidden">
      <div>
        {/* top bar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            aria-label={t("quiz.quit")}
          >
            <X size={20} />
          </Button>
          <div className="flex-1">
            <Progress value={progressPct} />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-maroon-deep min-w-[54px] justify-end">
            <Gem size={14} className="text-marigold" />
            {score}
          </div>
        </div>

        <div className="flex items-center justify-between mt-1.5 text-xs text-indigo/50 flex-shrink-0">
          <span>
            {mode === "level" ? (
              <>
                Level {levelId} · {levelInfo?.title} —{" "}
                {t("quiz.questionOf", { current: index + 1 })}
              </>
            ) : (
              <>
                {t("quiz.endlessWanderLabel")} —{" "}
                {t("quiz.questionOf", { current: index + 1 })}
              </>
            )}
          </span>
          {streak >= 2 && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 text-bad font-semibold"
            >
              <Flame size={12} /> {streak} {t("quiz.streak")}
            </motion.span>
          )}
        </div>
      </div>
      {/* question card - scrollable if needed */}
      <div className="flex flex-col min-h-0 py-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.28 }}
          >
            <div
              key={shakeKey}
              className={`rounded-2xl bg-white/80 border border-indigo/10 p-5 shadow-sm relative ${!answered ? "" : selected !== current.answer ? "animate-shake" : ""}`}
            >
              {floatTick && (
                <motion.span
                  key={floatTick.id}
                  className={`absolute right-5 top-3 font-display text-2xl font-bold pointer-events-none ${floatTick.positive ? "text-ok" : "text-bad"} animate-score-fly`}
                >
                  {floatTick.text}
                </motion.span>
              )}
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-marigold mb-2">
                {mode === "level" ? levelInfo?.theme : t("quiz.randomQuestion")}
              </p>
              <h2 className="font-display text-xl sm:text-2xl leading-tight text-indigo">
                {current.question}
              </h2>

              <div className="mt-4 grid gap-2">
                {current.options.map((opt, i) => {
                  const isCorrectOpt = i === current.answer;
                  const isSelected = i === selected;
                  let cls =
                    "border-indigo/12 bg-white hover:border-marigold hover:bg-marigold/5";
                  if (answered) {
                    if (isCorrectOpt) cls = "border-ok bg-ok/10 text-ok-800";
                    else if (isSelected) cls = "border-bad bg-bad/10";
                    else cls = "border-indigo/8 opacity-50";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={answered}
                      className={`text-left rounded-lg border-2 px-3 py-2.5 font-body text-sm transition-all flex items-center justify-between gap-2 ${cls}`}
                    >
                      <span>{opt}</span>
                      {answered && isCorrectOpt && (
                        <Check size={16} className="text-ok shrink-0" />
                      )}
                      {answered && isSelected && !isCorrectOpt && (
                        <XCircle size={16} className="text-bad shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-lg bg-parchment-dim border border-marigold/30 p-3 text-xs text-indigo/80">
                      <span className="font-label text-maroon-deep font-semibold mr-1">
                        {t("quiz.didYouKnow")}
                      </span>
                      {current.explanation}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* bottom action bar */}
      <div className="flex items-center gap-2 pt-2 flex-shrink-0">
        {mode === "random" && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={stopRandom}
          >
            <Square size={14} /> {t("quiz.stopHere")}
          </Button>
        )}
        <Button
          size="sm"
          className="flex-1"
          disabled={!answered}
          onClick={goNext}
        >
          {mode === "level" && index + 1 >= total
            ? t("quiz.finishLevel")
            : t("quiz.next")}{" "}
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
