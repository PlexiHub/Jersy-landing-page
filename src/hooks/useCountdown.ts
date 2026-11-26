import { useEffect, useState } from 'react';
import { CONFIG, formatCountdown } from '@/src/lib/clearance';

const END_KEY = 'solobo_clear_end';

function resolveDeadline(): number {
  const fixed = CONFIG.endsAt ? Date.parse(CONFIG.endsAt) : 0;
  if (fixed && !Number.isNaN(fixed)) return fixed;

  let stored = 0;
  if (typeof window !== 'undefined') {
    try {
      stored = Number(window.localStorage.getItem(END_KEY)) || 0;
    } catch {
      stored = 0;
    }
  }

  if (!stored || stored < Date.now()) {
    stored = Date.now() + CONFIG.hours * 3_600_000;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(END_KEY, String(stored));
      } catch {
        // Ignore storage write errors
      }
    }
  }

  return stored;
}

export function useCountdown(): string {
  const [deadline] = useState<number>(resolveDeadline);
  const [label, setLabel] = useState<string>(() => formatCountdown(deadline - Date.now()));

  useEffect(() => {
    const tick = () => setLabel(formatCountdown(deadline - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deadline]);

  return label;
}
