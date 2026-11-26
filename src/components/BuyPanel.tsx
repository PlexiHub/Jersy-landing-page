import { type RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  CONFIG,
  KITS,
  SIZE_KEYS,
  calculateUnitPreview,
  displayTitle,
  formatTk,
  stockOf,
  type Kit,
  type SizeKey,
} from '@/src/lib/clearance';
import { ShirtArtwork } from './ShirtArtwork';

interface BuyPanelProps {
  kitIndex: number;
  kit: Kit;
  size: SizeKey | null;
  qty: number;
  printEnabled: boolean;
  printName: string;
  printNum: string;
  cartCount: number;
  cartTotal: number;
  shakeSizes: boolean;
  sizesRef: RefObject<HTMLDivElement | null>;
  printNameRef: RefObject<HTMLInputElement | null>;
  orderNowRef: RefObject<HTMLButtonElement | null>;
  kitsRef: RefObject<HTMLDivElement | null>;
  onSelectKit: (index: number) => void;
  onSelectSize: (size: SizeKey) => void;
  onScrollToGuide: () => void;
  onTogglePrint: (checked: boolean) => void;
  onPrintNameChange: (val: string) => void;
  onPrintNumChange: (val: string) => void;
  onDecrementQty: () => void;
  onIncrementQty: () => void;
  onOrderNow: () => void;
  onAddAnother: () => void;
  onOpenCart: () => void;
}

export function BuyPanel({
  kitIndex,
  kit,
  size,
  qty,
  printEnabled,
  printName,
  printNum,
  cartCount,
  cartTotal,
  shakeSizes,
  sizesRef,
  printNameRef,
  orderNowRef,
  kitsRef,
  onSelectKit,
  onSelectSize,
  onScrollToGuide,
  onTogglePrint,
  onPrintNameChange,
  onPrintNumChange,
  onDecrementQty,
  onIncrementQty,
  onOrderNow,
  onAddAnother,
  onOpenCart,
}: BuyPanelProps) {
  const { total: previewTotal, activeTier } = calculateUnitPreview(
    kit,
    printEnabled,
    qty,
    cartCount
  );

  const selectedSizeStock = size ? kit.sizes[size] : 0;
  const sizeHint = size
    ? selectedSizeStock <= 2
      ? `Only ${selectedSizeStock} left in ${size}. Order now to hold it.`
      : `${size} is in stock.`
    : 'Between sizes? Take the larger one.';

  return (
    <div className="bg-paper rounded-[28px] max-[560px]:rounded-[24px] p-8 max-[560px]:p-[22px]">
      <h1 className="font-display font-extrabold text-[clamp(40px,4vw,60px)] leading-[0.92] uppercase tracking-[0.005em]">
        {displayTitle(kit)}
      </h1>
      <p className="text-ink-2 mt-[10px] max-w-[44ch]">
        Player-edition fit in breathable match fabric. Last stock of the season, priced to clear.
      </p>
      <div className="flex gap-4 mt-[14px] text-[14px] text-ink-2">
        <span>
          <b className="text-ink">4.8</b> average from <b className="text-ink">324</b> buyers
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-[14px] max-[560px]:flex-wrap max-[560px]:gap-x-3 max-[560px]:gap-y-1 mt-6 pt-6 border-t border-rule">
        <span className="font-display font-black text-[56px] max-[560px]:text-[48px] leading-[0.9] text-solobo-red whitespace-nowrap">
          {formatTk(kit.price)}
        </span>
        <span className="whitespace-nowrap text-[18px] text-ink-2 line-through">
          {formatTk(kit.was)}
        </span>
        <span className="ml-auto max-[560px]:ml-0 max-[560px]:w-full font-semibold text-solobo-go text-[15px]">
          You save {formatTk(kit.was - kit.price)}
        </span>
      </div>

      {/* Kit selector */}
      <div className="mt-7">
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="font-semibold text-[15px] leading-[1.2]">Kit</h2>
          <span className="text-[14px] text-ink-2 max-[560px]:hidden">{kit.short}</span>
        </div>
        <div
          ref={kitsRef}
          className="grid grid-cols-4 gap-2 max-[560px]:gap-[6px]"
          role="group"
          aria-label="Choose kit"
        >
          {KITS.map((item, i) => {
            const left = stockOf(item);
            const active = i === kitIndex;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                disabled={!left}
                aria-label={`${item.short}, ${formatTk(item.price)}${left ? '' : ' sold out'}`}
                onClick={() => onSelectKit(i)}
                className={`relative rounded-[16px] aspect-[1/1.12] grid place-items-center pt-[10px] px-[6px] pb-[26px] border-2 transition-[border-color,background-color] duration-200 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
                  active ? 'border-ink bg-white' : 'border-transparent bg-chalk'
                }`}
              >
                {left > 0 && left <= 6 && (
                  <span className="absolute top-[6px] right-[6px] text-[11px] font-bold bg-ink text-white rounded-full px-[7px] py-[1px]">
                    {left} left
                  </span>
                )}
                <ShirtArtwork kit={item} className="w-[84%]" />
                <span className="absolute inset-x-0 bottom-[7px] text-[12px] max-[560px]:text-[11px] font-semibold text-center">
                  {item.short}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size selector */}
      <div className="mt-7">
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="font-semibold text-[15px] leading-[1.2]">Size</h2>
          <button
            type="button"
            onClick={onScrollToGuide}
            className="text-[14px] text-ink-2 underline underline-offset-[3px] cursor-pointer"
          >
            Size guide
          </button>
        </div>
        <div
          ref={sizesRef}
          className={`grid grid-cols-5 gap-2 max-[560px]:gap-[6px] ${
            shakeSizes ? 'animate-shake-x' : ''
          }`}
          role="group"
          aria-label="Choose size"
        >
          {SIZE_KEYS.map((s) => {
            const count = kit.sizes[s];
            const active = size === s;
            return (
              <button
                key={s}
                type="button"
                disabled={!count}
                aria-pressed={active}
                aria-label={`${s}${count ? `, ${count} left` : ', sold out'}`}
                onClick={() => onSelectSize(s)}
                className={`size-hatched h-[52px] rounded-[12px] border-[1.5px] font-semibold relative transition-[border-color,background-color] duration-150 cursor-pointer disabled:cursor-not-allowed ${
                  active
                    ? 'bg-ink border-ink text-white'
                    : 'bg-white border-rule text-ink hover:not-disabled:border-ink'
                }`}
              >
                {s}
                {count > 0 && count <= 2 && (
                  <span
                    className={`block text-[11px] font-medium leading-none mt-[2px] ${
                      active ? 'text-[#FFB3B7]' : 'text-solobo-red'
                    }`}
                  >
                    {count} left
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-[13px] text-ink-2 mt-2 min-h-[20px]">{sizeHint}</p>
      </div>

      {/* Custom print */}
      <div className="mt-7">
        <div
          className={`border-[1.5px] rounded-[16px] p-4 transition-[border-color] duration-200 ${
            printEnabled ? 'border-ink' : 'border-rule'
          }`}
        >
          <div className="flex items-center gap-3 w-full text-left">
            <Switch
              id="printToggle"
              checked={printEnabled}
              onCheckedChange={onTogglePrint}
              aria-label={`Add your name and number · ${formatTk(CONFIG.printPrice)}`}
              className="data-[size=default]:h-[26px] data-[size=default]:w-[44px] bg-rule data-checked:bg-ink data-unchecked:bg-rule border-0 p-[3px] [&_[data-slot=switch-thumb]]:size-[20px] [&_[data-slot=switch-thumb]]:bg-white [&_[data-slot=switch-thumb]]:shadow-[0_1px_3px_rgba(0,0,0,0.25)] [&_[data-slot=switch-thumb]]:data-checked:translate-x-[18px] [&_[data-slot=switch-thumb]]:data-unchecked:translate-x-0 cursor-pointer"
            />
            <Label
              htmlFor="printToggle"
              className="flex flex-col items-start gap-0.5 cursor-pointer flex-1 font-normal"
            >
              <b className="block font-semibold text-[16px] leading-[1.4] text-ink">
                Add your name and number · {formatTk(CONFIG.printPrice)}
              </b>
              <small className="text-ink-2 text-[13px] leading-[1.35]">
                Official font. Preview it on the back of the shirt.
              </small>
            </Label>
          </div>

          {printEnabled && (
            <div className="grid grid-cols-[1fr_92px] gap-2 mt-[14px]">
              <div>
                <Label htmlFor="pName" className="sr-only">
                  Name
                </Label>
                <Input
                  ref={printNameRef}
                  id="pName"
                  maxLength={12}
                  placeholder="Name"
                  autoComplete="off"
                  value={printName}
                  onChange={(e) => onPrintNameChange(e.target.value)}
                  className="h-12 border-[1.5px] border-rule rounded-[12px] px-[14px] uppercase font-semibold tracking-[0.04em] bg-white text-[16px] md:text-[16px] focus-visible:border-ink focus-visible:ring-0"
                />
              </div>
              <div>
                <Label htmlFor="pNum" className="sr-only">
                  Number
                </Label>
                <Input
                  id="pNum"
                  maxLength={2}
                  inputMode="numeric"
                  placeholder="No."
                  value={printNum}
                  onChange={(e) => onPrintNumChange(e.target.value)}
                  className="h-12 border-[1.5px] border-rule rounded-[12px] px-[14px] uppercase font-semibold tracking-[0.04em] bg-white text-[16px] md:text-[16px] focus-visible:border-ink focus-visible:ring-0"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bundle tiers */}
      <div className="mt-7">
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="font-semibold text-[15px] leading-[1.2]">Buy more, pay less</h2>
          <span className="text-[14px] text-ink-2 max-[560px]:hidden">
            Applies to the whole order
          </span>
        </div>
        <div className="grid grid-cols-3 border-[1.5px] border-rule rounded-[16px] overflow-hidden">
          {CONFIG.tiers.map((tier) => {
            const isActive = tier.min === activeTier.min;
            return (
              <div
                key={tier.min}
                className={`py-3 px-[10px] text-[13px] border-l-[1.5px] border-rule first:border-l-0 transition-colors duration-200 ${
                  isActive ? 'bg-solobo-go-bg text-solobo-go-ink' : 'text-ink-2'
                }`}
              >
                <b
                  className={`block font-display font-extrabold text-[22px] leading-none mb-1 ${
                    isActive ? 'text-solobo-go' : 'text-ink'
                  }`}
                >
                  {tier.label}
                </b>
                {tier.note}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quantity & Primary CTA */}
      <div className="grid grid-cols-[auto_1fr] gap-[10px] mt-7">
        <div className="flex items-center border-[1.5px] border-rule rounded-[14px]">
          <button
            type="button"
            onClick={onDecrementQty}
            aria-label="Decrease quantity"
            className="w-[46px] h-[58px] text-[22px] cursor-pointer grid place-items-center"
          >
            −
          </button>
          <output
            aria-live="polite"
            className="w-[28px] text-center font-bold text-[17px]"
          >
            {qty}
          </output>
          <button
            type="button"
            onClick={onIncrementQty}
            aria-label="Increase quantity"
            className="w-[46px] h-[58px] text-[22px] cursor-pointer grid place-items-center"
          >
            +
          </button>
        </div>

        <Button
          ref={orderNowRef}
          type="button"
          onClick={onOrderNow}
          className="h-[58px] rounded-[14px] bg-solobo-red hover:bg-solobo-red-press active:scale-[0.985] text-white font-bold text-[17px] flex items-center justify-center gap-[10px] border-0 cursor-pointer transition-[background-color,transform] duration-150"
        >
          Order now{' '}
          <span className="font-display font-extrabold text-[20px] leading-none opacity-90">
            {formatTk(previewTotal)}
          </span>
        </Button>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onAddAnother}
        className="mt-[10px] w-full h-12 rounded-[14px] border-[1.5px] border-ink bg-transparent hover:bg-chalk/50 text-ink font-semibold text-[16px] cursor-pointer"
      >
        Add to order and pick another kit
      </Button>

      {cartCount > 0 && (
        <button
          type="button"
          onClick={onOpenCart}
          className="mt-3 w-full py-2.5 px-4 rounded-[12px] bg-solobo-go-bg text-solobo-go-ink text-[14px] font-semibold flex items-center justify-between cursor-pointer hover:brightness-95 transition"
        >
          <span>
            {cartCount} shirt{cartCount > 1 ? 's' : ''} saved in your order ({formatTk(cartTotal)})
          </span>
          <span className="underline underline-offset-2 font-bold">Review order</span>
        </button>
      )}

      {/* Promises */}
      <div className="grid grid-cols-3 max-[560px]:grid-cols-1 gap-3 max-[560px]:gap-[10px] mt-[22px] pt-5 border-t border-rule text-[13px] text-ink-2">
        <div>
          <b className="block text-ink text-[14px]">Pay on delivery</b>
          Nothing upfront
        </div>
        <div>
          <b className="block text-ink text-[14px]">Check before paying</b>
          Open it at the door
        </div>
        <div>
          <b className="block text-ink text-[14px]">Size exchange</b>
          Within 7 days
        </div>
      </div>
    </div>
  );
}
