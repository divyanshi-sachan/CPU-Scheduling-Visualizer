import { Suspense } from 'react';
import Simulator from '@/views/Simulator';

function SimulatorFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="font-mono text-white/50 text-sm">Loading simulator...</div>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<SimulatorFallback />}>
      <Simulator />
    </Suspense>
  );
}
