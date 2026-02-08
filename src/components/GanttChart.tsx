import { motion } from 'framer-motion';

const PROCESS_COLORS = [
  'rgba(255,255,255,0.95)',
  'rgba(255,255,255,0.75)',
  'rgba(255,255,255,0.55)',
  'rgba(255,255,255,0.4)',
  'rgba(255,255,255,0.3)',
  'rgba(255,255,255,0.25)',
  'rgba(255,255,255,0.2)',
  'rgba(255,255,255,0.15)',
];

export interface GanttEntry {
  pid: number;
  start: number;
  end: number;
}

export interface IdleSegment {
  start: number;
  end: number;
}

interface GanttChartProps {
  data: GanttEntry[];
  maxTime: number;
  height?: number;
  /** When true, shows an "IDLE" row for periods when the CPU is not running any process */
  showIdle?: boolean;
}

function computeIdleSegments(data: GanttEntry[], maxTime: number): IdleSegment[] {
  const segments = [...data].filter((d) => d.pid > 0).sort((a, b) => a.start - b.start);
  if (segments.length === 0) return maxTime > 0 ? [{ start: 0, end: maxTime }] : [];
  const idle: IdleSegment[] = [];
  if (segments[0].start > 0) idle.push({ start: 0, end: segments[0].start });
  for (let i = 1; i < segments.length; i++) {
    const prevEnd = segments[i - 1].end;
    const currStart = segments[i].start;
    if (currStart > prevEnd) idle.push({ start: prevEnd, end: currStart });
  }
  const lastEnd = segments[segments.length - 1].end;
  if (lastEnd < maxTime) idle.push({ start: lastEnd, end: maxTime });
  return idle;
}

export default function GanttChart({ data, maxTime, height = 280, showIdle = true }: GanttChartProps) {
  const scale = maxTime <= 0 ? 0 : 100 / maxTime;
  const pids = [...new Set(data.map((d) => d.pid))].filter((p) => p > 0).sort((a, b) => a - b);
  const idleSegments = showIdle ? computeIdleSegments(data, maxTime) : [];
  const rowCount = pids.length + (idleSegments.length > 0 ? 1 : 0);
  const rowHeight = Math.max(32, (height - 50) / Math.max(1, rowCount));

  // Context switches: boundaries where consecutive segments (by time) have different PIDs
  const sortedByTime = [...data].filter((d) => d.pid > 0).sort((a, b) => a.start - b.start);
  const contextSwitchTimes: number[] = [];
  for (let i = 1; i < sortedByTime.length; i++) {
    if (sortedByTime[i].pid !== sortedByTime[i - 1].pid) {
      contextSwitchTimes.push(sortedByTime[i].start);
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[400px]">
        <div className="flex border-b border-white/10 pb-2 mb-2">
          <div className="w-16 flex-shrink-0 text-white/40 font-mono text-xs">PID</div>
          <div className="flex-1 relative" style={{ height: 24 }}>
            {Array.from({ length: Math.ceil(maxTime) + 1 }).map((_, i) => (
              <span
                key={i}
                className="absolute text-white/35 font-mono text-xs"
                style={{ left: `${i * scale}%` }}
              >
                {i}
              </span>
            ))}
          </div>
        </div>
        {pids.length === 0 ? (
          <div className="text-white/40 text-sm font-mono py-4">No process data</div>
        ) : (
          pids.map((pid, rowIndex) => {
            const bars = data.filter((d) => d.pid === pid);
            const color = PROCESS_COLORS[pid % PROCESS_COLORS.length];
            return (
              <motion.div
                key={pid}
                className="flex items-center mb-1"
                style={{ height: rowHeight }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
              >
                <div className="w-16 flex-shrink-0 font-mono text-sm text-white/70">P{pid}</div>
                <div className="flex-1 relative h-full rounded overflow-hidden bg-white/5">
                  {bars.map((bar, i) => (
                    <motion.div
                      key={`${pid}-${i}`}
                      className="absolute top-1 bottom-1 rounded flex items-center justify-center text-xs font-mono font-medium text-black origin-left z-[1]"
                      style={{
                        left: `${bar.start * scale}%`,
                        width: `${Math.max((bar.end - bar.start) * scale, 2)}%`,
                        backgroundColor: color,
                        minWidth: 24,
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 + rowIndex * 0.05 + i * 0.03 }}
                    >
                      {bar.end - bar.start}
                    </motion.div>
                  ))}
                  {/* Context-switch markers on top so they're visible */}
                  {contextSwitchTimes.length > 0 && maxTime > 0 && (
                    <div className="absolute inset-0 pointer-events-none z-[2] flex">
                      {contextSwitchTimes.map((t) => (
                        <div
                          key={t}
                          className="absolute top-0 bottom-0 w-0.5 bg-amber-400/90"
                          style={{ left: `${(t / maxTime) * 100}%` }}
                          title={`Context switch at t=${t}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
        {idleSegments.length > 0 && (
          <motion.div
            className="flex items-center mb-1"
            style={{ height: rowHeight }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: pids.length * 0.05 }}
          >
            <div className="w-16 flex-shrink-0 font-mono text-xs text-white/40">IDLE</div>
            <div className="flex-1 relative h-full rounded overflow-hidden bg-white/5">
              {idleSegments.map((seg, i) => (
                <motion.div
                  key={`idle-${i}`}
                  className="absolute top-1 bottom-1 rounded z-[1] border border-dashed border-white/20 bg-white/[0.06]"
                  style={{
                    left: `${(seg.start / maxTime) * 100}%`,
                    width: `${Math.max(((seg.end - seg.start) / maxTime) * 100, 1)}%`,
                    minWidth: 16,
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + pids.length * 0.05 }}
                  title={`CPU idle t=${seg.start}–${seg.end}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
