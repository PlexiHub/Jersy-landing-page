import { Button } from '@/components/ui/button';
import { formatTk } from '@/src/lib/clearance';

interface ClosingCtaProps {
  kitPrice: number;
  onOrderClick: () => void;
}

export function ClosingCta({ kitPrice, onOrderClick }: ClosingCtaProps) {
  return (
    <section
      className="max-w-[1360px] mx-auto mt-16 px-6 pb-[120px] max-[560px]:px-4 max-[560px]:pb-[110px]"
      aria-label="Order"
    >
      <div
        className="rounded-[28px] py-14 px-10 max-[560px]:py-9 max-[560px]:px-6 flex max-[560px]:flex-col justify-between items-center max-[560px]:items-start gap-6 transition-[background-color,color] duration-500"
        style={{ backgroundColor: 'var(--kit-stage)', color: 'var(--kit-on)' }}
      >
        <h2 className="font-display font-black text-[clamp(44px,6vw,96px)] leading-[0.86] uppercase">
          Last kits.
          <br />
          Last call.
        </h2>
        <Button
          type="button"
          onClick={onOrderClick}
          className="h-[58px] px-8 max-[560px]:w-full flex-none rounded-[14px] bg-solobo-red hover:bg-solobo-red-press active:scale-[0.985] text-white font-bold text-[17px] flex items-center justify-center gap-[10px] border-0 cursor-pointer"
        >
          Order now{' '}
          <span className="font-display font-extrabold text-[20px] leading-none opacity-90">
            {formatTk(kitPrice)}
          </span>
        </Button>
      </div>
      <p className="text-center text-[13px] text-ink-2 mt-5">
        Solobo Sports · Questions? Call 01XXXXXXXXX
      </p>
    </section>
  );
}
