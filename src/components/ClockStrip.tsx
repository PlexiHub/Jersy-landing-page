import { useCountdown } from '@/src/hooks/useCountdown';

export function ClockStrip() {
  const clock = useCountdown();

  return (
    <div className="bg-ink text-white text-[14px]">
      <div className="max-w-[1360px] mx-auto px-6 py-[10px] max-[560px]:px-4 max-[560px]:py-[9px] flex justify-between items-center gap-4">
        <div className="font-display font-extrabold text-[22px] leading-none tracking-[0.02em]">
          SOLOBO<span className="text-solobo-red">.</span>
        </div>
        <div className="flex items-center gap-3" role="timer" aria-live="off">
          <span className="text-[#B9BCC6] max-[560px]:hidden">Clearance prices end in</span>
          <span
            id="clock"
            className="font-display font-extrabold text-[22px] leading-none tabular-nums tracking-[0.04em]"
          >
            {clock}
          </span>
        </div>
      </div>
    </div>
  );
}
