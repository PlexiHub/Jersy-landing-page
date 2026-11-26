import { useEffect, useRef, useState } from 'react';
import {
  discountPercent,
  stageKickerLabel,
  stockOf,
  type Kit,
  type ShirtSide,
} from '@/src/lib/clearance';
import { ShirtArtwork } from './ShirtArtwork';

interface ProductStageProps {
  kit: Kit;
  view: ShirtSide;
  backPreview: { name: string; num: string };
  onViewChange: (view: ShirtSide) => void;
}

export function ProductStage({
  kit,
  view,
  backPreview,
  onViewChange,
}: ProductStageProps) {
  const [renderedKit, setRenderedKit] = useState(kit);
  const [renderedView, setRenderedView] = useState(view);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    setIsTransitioning(true);
    const timer = window.setTimeout(() => {
      setRenderedKit(kit);
      setRenderedView(view);
      setIsTransitioning(false);
    }, 200);

    return () => window.clearTimeout(timer);
  }, [kit, view]);

  const left = stockOf(kit);
  const offPct = discountPercent(kit);

  return (
    <div
      id="stage"
      className="sticky top-6 max-[1040px]:relative max-[1040px]:top-0 rounded-[28px] max-[560px]:rounded-[24px] overflow-hidden aspect-[5/5.2] min-h-[520px] max-[1040px]:aspect-square max-[1040px]:min-h-0 max-[560px]:aspect-[4/5] isolate transition-[background-color,color] duration-500 ease-[cubic-bezier(.2,.7,.1,1)]"
      style={{ backgroundColor: 'var(--kit-stage)', color: 'var(--kit-on)' }}
    >
      <div
        aria-hidden="true"
        className="stage-stroke-num absolute right-[-3%] top-[52%] -translate-y-1/2 font-display font-black text-[clamp(300px,42vw,640px)] leading-[0.8] tracking-[-0.03em] opacity-[0.22] -z-10 select-none transition-opacity duration-300"
      >
        {backPreview.num || '10'}
      </div>

      <div className="absolute inset-x-6 top-6 max-[560px]:inset-x-4 max-[560px]:top-4 flex justify-between items-start gap-3">
        <p className="font-display font-extrabold text-[clamp(32px,3.6vw,52px)] leading-[0.92] uppercase max-w-[9ch]">
          {stageKickerLabel(kit)}
          <small className="block font-sans font-medium text-[14px] leading-[1.3] normal-case opacity-75 mt-[10px] max-w-none max-[560px]:max-w-[20ch]">
            {kit.note}
          </small>
        </p>

        <div
          className="flex bg-black/22 rounded-full p-1 backdrop-blur-[6px]"
          role="group"
          aria-label="Shirt view"
        >
          {(['front', 'back'] as const).map((side) => {
            const active = view === side;
            return (
              <button
                key={side}
                type="button"
                aria-pressed={active}
                onClick={() => onViewChange(side)}
                className="px-4 py-2 rounded-full font-semibold text-[14px] cursor-pointer transition-colors"
                style={
                  active
                    ? { backgroundColor: 'var(--kit-on)', color: 'var(--kit-stage)', opacity: 1 }
                    : { color: 'var(--kit-on)', opacity: 0.75 }
                }
              >
                {side === 'front' ? 'Front' : 'Back'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-[16%_10%_10%] max-[560px]:inset-[22%_6%_20%] grid place-items-center">
        <ShirtArtwork
          kit={renderedKit}
          side={renderedView}
          back={backPreview}
          className={`w-full h-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)] transition-[transform,opacity] ease-[cubic-bezier(.2,.7,.1,1)] ${
            isTransitioning
              ? 'opacity-0 translate-y-3 scale-[0.97] duration-[250ms]'
              : 'opacity-100 translate-y-0 scale-100 duration-500'
          }`}
        />
      </div>

      <div className="absolute left-6 right-6 bottom-[22px] max-[560px]:left-4 max-[560px]:right-4 max-[560px]:bottom-[14px] flex justify-between items-end gap-3 text-[14px]">
        <div className="font-display font-black text-[64px] max-[560px]:text-[48px] leading-[0.8] tracking-[-0.01em]">
          {offPct}% off
          <small className="block font-sans font-semibold text-[14px] leading-[1.2] mt-[6px] opacity-80">
            {left ? `${left} left in stock` : 'Sold out'}
          </small>
        </div>
      </div>
    </div>
  );
}
