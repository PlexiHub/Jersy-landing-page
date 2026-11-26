import { Button } from '@/components/ui/button';
import { formatTk, type Kit, type SizeKey } from '@/src/lib/clearance';

interface FloatingControlsProps {
  showMobileBar: boolean;
  kit: Kit;
  size: SizeKey | null;
  previewTotal: number;
  onBarCtaClick: () => void;
}

export function FloatingControls({
  showMobileBar,
  kit,
  size,
  previewTotal,
  onBarCtaClick,
}: FloatingControlsProps) {
  return (
    <>
      {/* Mobile sticky buy bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 bg-paper border-t border-rule px-4 pt-[10px] pb-[calc(10px+env(safe-area-inset-bottom))] hidden max-[1040px]:flex gap-3 items-center transition-transform duration-300 ease-[cubic-bezier(.2,.7,.1,1)] ${
          showMobileBar ? 'translate-y-0' : 'translate-y-[105%]'
        }`}
      >
        <div className="leading-[1.05]">
          <b className="font-display font-black text-[28px] leading-none text-solobo-red block">
            {formatTk(previewTotal)}
          </b>
          <small className="text-[12px] text-ink-2">
            {kit.short} · {size ? `size ${size}` : 'pick a size'}
          </small>
        </div>
        <Button
          type="button"
          onClick={onBarCtaClick}
          className="flex-1 h-[52px] rounded-[14px] bg-solobo-red hover:bg-solobo-red-press active:scale-[0.985] text-white font-bold text-[17px] border-0 cursor-pointer"
        >
          Order now
        </Button>
      </div>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/8801XXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed right-5 bottom-6 max-[1040px]:bottom-[92px] max-[560px]:bottom-[96px] max-[560px]:right-[14px] z-[39] w-[52px] h-[52px] max-[560px]:w-[46px] max-[560px]:h-[46px] rounded-full bg-[#25D366] text-white grid place-items-center shadow-[0_8px_20px_rgba(0,0,0,0.18)] hover:brightness-95 transition"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-[26px]">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1.9 2 1.2 2.3 1.4.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.7-.1 1.3z" />
        </svg>
      </a>
    </>
  );
}
