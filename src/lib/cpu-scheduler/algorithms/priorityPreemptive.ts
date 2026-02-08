import type { ProcessInput, GanttEntry, SimulationResult } from '../types';
import { computeMetrics } from '../metrics';

/**
 * Preemptive Priority: at each moment run the ready process with highest priority (lowest number).
 * Preemption occurs when a higher-priority process arrives.
 */
export function runPriorityPreemptive(processes: ProcessInput[]): SimulationResult {
  const ganttChart: GanttEntry[] = [];
  const remaining = processes.map((p) => ({
    ...p,
    remainingBurst: p.burstTime,
    priority: p.priority ?? 0,
  }));
  let currentTime = 0;
  let lastPid: number | null = null;

  while (true) {
    const ready = remaining.filter((p) => p.arrivalTime <= currentTime && p.remainingBurst > 0);
    if (ready.length === 0) {
      const left = remaining.filter((p) => p.remainingBurst > 0);
      if (left.length === 0) break;
      const nextArrival = Math.min(...left.map((p) => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }

    // Highest priority = lowest number
    const highest = ready.reduce((a, b) =>
      (a.priority ?? 0) <= (b.priority ?? 0) ? a : b
    );

    if (lastPid !== null && lastPid !== highest.pid) {
      ganttChart.push({ pid: -1, start: currentTime, end: currentTime, isContextSwitch: true });
    }
    lastPid = highest.pid;

    const runUntil = highest.remainingBurst;
    const nextArrivalTimes = remaining
      .filter((p) => p.remainingBurst > 0 && p.arrivalTime > currentTime)
      .map((p) => p.arrivalTime);
    const nextArrival =
      nextArrivalTimes.length > 0 ? Math.min(...nextArrivalTimes) : Infinity;
    const duration = Math.min(runUntil, nextArrival - currentTime);

    if (duration <= 0) {
      currentTime = nextArrival;
      continue;
    }

    const start = currentTime;
    highest.remainingBurst -= duration;
    currentTime += duration;
    ganttChart.push({ pid: highest.pid, start, end: currentTime });
    if (highest.remainingBurst <= 0) lastPid = null;
  }

  const { processes: processResults, metrics, contextSwitches } = computeMetrics(
    ganttChart,
    processes
  );
  return { ganttChart, processes: processResults, metrics, contextSwitches };
}
