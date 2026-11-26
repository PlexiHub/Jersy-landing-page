import { KITS, formatTk, stockOf } from '@/src/lib/clearance';
import { ShirtArtwork } from './ShirtArtwork';

interface KitRailProps {
  onSelectKit: (index: number) => void;
}

export function KitRail({ onSelectKit }: KitRailProps) {
  return (
    <section
      className="max-w-[1360px] mx-auto pt-16 px-6 max-[560px]:pt-12 max-[560px]:px-4"
      aria-labelledby="railH"
    >
      <div className="flex justify-between items-end max-[560px]:flex-col max-[560px]:items-start gap-6 mb-6">
        <h2
          id="railH"
          className="font-display font-extrabold text-[clamp(36px,4.2vw,64px)] leading-[0.92] uppercase max-w-[14ch]"
        >
          Every kit in the clearance
        </h2>
        <p className="text-ink-2 max-w-[40ch]">
          Mix kits in one order. Two or more and the bundle price kicks in automatically.
        </p>
      </div>

      <div className="grid grid-cols-4 max-[1040px]:grid-cols-2 max-[560px]:flex max-[560px]:overflow-x-auto max-[560px]:snap-x max-[560px]:snap-mandatory max-[560px]:-mx-4 max-[560px]:px-4 no-scrollbar gap-4">
        {KITS.map((item, i) => {
          const left = stockOf(item);
          return (
            <button
              key={item.id}
              type="button"
              disabled={!left}
              onClick={() => {
                onSelectKit(i);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`rounded-[24px] overflow-hidden bg-paper text-left flex flex-col max-[560px]:flex-[0_0_72%] max-[560px]:snap-start cursor-pointer transition-transform hover:-translate-y-0.5 ${
                left ? '' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div
                className="aspect-square grid place-items-center relative w-full"
                style={{ backgroundColor: item.stage, color: item.on }}
              >
                <ShirtArtwork
                  kit={item}
                  className="w-[72%] drop-shadow-[0_18px_22px_rgba(0,0,0,0.3)]"
                />
              </div>
              <div className="px-[18px] pt-4 pb-[18px] flex justify-between items-end gap-2 w-full">
                <div>
                  <b className="font-semibold block">{item.short}</b>
                  <small className="text-ink-2 text-[13px]">
                    {left ? `${left} left` : 'Sold out'}
                  </small>
                </div>
                <div className="font-display font-extrabold text-[26px] leading-none text-solobo-red text-right">
                  {formatTk(item.price)}
                  <s className="block font-sans font-normal text-[13px] leading-[1.3] text-ink-2">
                    {formatTk(item.was)}
                  </s>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
