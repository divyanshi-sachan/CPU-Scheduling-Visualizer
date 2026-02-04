import { motion } from 'framer-motion';

const viewport = { once: true, amount: 0.2 };
const bars = [
  { w: 18, label: 'P1', color: 'bg-black' },
  { w: 14, label: 'P2', color: 'bg-black/80' },
  { w: 10, label: 'P3', color: 'bg-black/70' },
  { w: 20, label: 'P1', color: 'bg-black' },
  { w: 12, label: 'P2', color: 'bg-black/80' },
  { w: 16, label: 'P4', color: 'bg-black/60' },
];

export function GanttStripAnimated() {
  return (
    <motion.div
      className="rounded-2xl border border-black/10 bg-black/[0.04] p-5 sm:p-8 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.6 }}
    >
      <div className="flex gap-1 sm:gap-1.5 items-center h-14">
        {bars.map((b, i) => (
          <motion.div
            key={i}
            className={`h-10 rounded-lg ${b.color} flex items-center justify-center min-w-[2.5rem] font-mono text-xs font-medium text-white shadow-sm`}
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: `${b.w}%`, opacity: 1 }}
            viewport={viewport}
            transition={{
              type: 'spring',
              stiffness: 80,
              damping: 14,
              delay: 0.15 + i * 0.06,
            }}
          >
            {b.label}
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mt-3 flex justify-between font-mono text-[11px] text-black/40"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewport}
        transition={{ delay: 0.6 }}
      >
        <span>0</span>
        <span>Time →</span>
      </motion.div>
    </motion.div>
  );
}
