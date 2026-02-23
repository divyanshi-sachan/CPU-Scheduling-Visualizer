'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ReadyQueueAnimationProps {
  runningPid: number | null;
  readyQueue: number[];
  isPreemption: boolean;
  pushedBackPid: number | null;
  stepLabel?: string;
}

export default function ReadyQueueAnimation({
  runningPid,
  readyQueue,
  isPreemption,
  pushedBackPid,
  stepLabel,
}: ReadyQueueAnimationProps) {
  return (
    <div className="w-full space-y-3">
      {stepLabel && (
        <p className="font-mono text-[10px] text-white/50 uppercase tracking-wider">{stepLabel}</p>
      )}

      {/* CPU + Running process */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider mr-1">CPU</span>
        <div className="flex items-center gap-2 min-h-[44px]">
          {runningPid !== null && runningPid > 0 ? (
            <motion.div
              key={`running-${runningPid}`}
              className="flex items-center justify-center min-w-[52px] h-11 rounded-lg font-mono font-semibold text-sm text-black bg-white border-2 border-white shadow-lg"
              initial={false}
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 4px 14px rgba(0,0,0,0.4)',
                  '0 0 0 3px rgba(255,255,255,0.5)',
                  '0 4px 14px rgba(0,0,0,0.4)',
                ],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              P{runningPid}
            </motion.div>
          ) : (
            <div className="min-w-[52px] h-11 rounded-lg bg-white/5 border border-dashed border-white/20 flex items-center justify-center font-mono text-[10px] text-white/40">
              —
            </div>
          )}
        </div>
        {isPreemption && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-2 py-1 rounded-md bg-white/10 border border-white/30 font-mono text-[10px] text-white/90 uppercase tracking-wider"
          >
            Preemption
          </motion.span>
        )}
      </div>

      {/* Ready queue label + blocks */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider mr-1">Ready queue</span>
        <div className="flex flex-wrap items-center gap-2 min-h-[44px]">
          <AnimatePresence mode="popLayout">
            {readyQueue.length === 0 ? (
              <motion.span
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-mono text-xs text-white/30"
              >
                (empty)
              </motion.span>
            ) : (
              readyQueue.map((pid) => (
                <motion.div
                  key={pid}
                  layout
                  initial={{ opacity: 0, scale: 0.8, x: -12 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="flex items-center justify-center min-w-[48px] h-10 rounded-lg font-mono text-sm font-medium text-white/90 bg-white/10 border border-white/20"
                >
                  P{pid}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pushed back indicator + animated block moving to queue */}
      <AnimatePresence>
        {pushedBackPid !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2 overflow-hidden"
          >
            <span className="font-mono text-[10px] text-white/70 uppercase tracking-wider">
              Pushed back to queue
            </span>
            <motion.div
              key={`pushed-${pushedBackPid}`}
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: 80, opacity: 0.9 }}
              transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
              className="flex items-center justify-center min-w-[48px] h-10 rounded-lg font-mono text-sm font-semibold text-white/90 bg-white/15 border-2 border-white/40"
            >
              P{pushedBackPid}
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/60 font-mono text-xs"
            >
              →
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
