import { useEffect, useRef, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import {
  CONFIG,
  KITS,
  calculateTotals,
  formatTk,
  getNextTierNudge,
  normalizeBdPhoneInput,
  validateCheckoutForm,
  type CartItem,
  type CheckoutForm,
  type PlacedOrder,
} from '@/src/lib/clearance';
import { ShirtArtwork } from './ShirtArtwork';

interface OrderDrawerProps {
  open: boolean;
  cart: CartItem[];
  form: CheckoutForm;
  placedOrder: PlacedOrder | null;
  onOpenChange: (open: boolean) => void;
  onUpdateForm: (patch: Partial<CheckoutForm>) => void;
  onRemoveItem: (index: number) => void;
  onAdjustItemQty: (index: number, delta: number) => void;
  onAddAnotherFromNudge: () => void;
  onOrderSuccess: (order: PlacedOrder) => void;
  onContinueShopping: () => void;
}

function useIsCompactViewport(): boolean {
  const [compact, setCompact] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 560px)').matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 560px)');
    const onChange = (event: MediaQueryListEvent) => setCompact(event.matches);
    setCompact(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return compact;
}

export function OrderDrawer({
  open,
  cart,
  form,
  placedOrder,
  onOpenChange,
  onUpdateForm,
  onRemoveItem,
  onAdjustItemQty,
  onAddAnotherFromNudge,
  onOrderSuccess,
  onContinueShopping,
}: OrderDrawerProps) {
  const isCompact = useIsCompactViewport();
  const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; address?: boolean }>({});
  const [submitting, setSubmitting] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);

  const totals = calculateTotals(cart, form.zone);
  const nudge = getNextTierNudge(totals.n);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.length) {
      toast('Your order is empty.');
      return;
    }

    const result = validateCheckoutForm(form);
    setErrors(result.errors);

    if (!result.valid) {
      if (result.errors.name) nameRef.current?.focus();
      else if (result.errors.phone) phoneRef.current?.focus();
      else if (result.errors.address) addressRef.current?.focus();
      return;
    }

    const payload = {
      customer: {
        name: form.name.trim(),
        phone: result.cleanPhone,
        address: form.address.trim(),
        zone: form.zone,
      },
      items: cart.map((item) => ({
        product_id: item.id,
        size: item.size,
        qty: item.qty,
        print: item.print,
      })),
      subtotal: totals.sub,
      discount: totals.disc,
      shipping: totals.ship,
      total: totals.total,
      payment: 'COD',
      source: 'clearance-landing',
      page: window.location.pathname,
    };

    setSubmitting(true);
    try {
      if (CONFIG.orderEndpoint) {
        const res = await fetch(CONFIG.orderEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        console.log('[demo] order payload', payload);
        await new Promise((resolve) => window.setTimeout(resolve, 700));
      }

      onOrderSuccess({
        firstName: form.name.trim().split(/\s+/)[0] || form.name.trim(),
        phone: result.cleanPhone,
        total: totals.total,
        itemCount: totals.n,
      });
    } catch {
      toast('Order not sent. Check your connection and try again, or message us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isCompact ? 'bottom' : 'right'}
        showCloseButton={false}
        className={
          isCompact
            ? 'data-[side=bottom]:h-[92dvh] rounded-t-[24px] bg-paper p-0 gap-0 border-0 flex flex-col overflow-hidden'
            : 'data-[side=right]:w-full data-[side=right]:sm:max-w-[480px] bg-paper p-0 gap-0 border-0 flex flex-col overflow-hidden'
        }
      >
        {/* Header */}
        <div className="flex justify-between items-center py-5 px-6 border-b border-rule shrink-0">
          <SheetTitle className="font-display font-extrabold text-[30px] leading-none uppercase text-ink">
            Your order
          </SheetTitle>
          <SheetDescription className="sr-only">
            Review your selected Barcelona 26/27 kits and enter your Bangladesh cash on delivery details.
          </SheetDescription>
          <SheetClose
            aria-label="Close"
            className="w-10 h-10 rounded-full bg-chalk text-[20px] text-ink grid place-items-center cursor-pointer hover:bg-rule/60 transition"
          >
            ×
          </SheetClose>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pt-5 pb-6">
          {placedOrder ? (
            <div className="py-12 px-2 text-center">
              <div className="w-[72px] h-[72px] mx-auto mb-[18px] rounded-full bg-solobo-go grid place-items-center">
                <svg
                  width="34"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3"
                  aria-hidden="true"
                >
                  <path d="m5 12 5 5 9-10" />
                </svg>
              </div>
              <h3 className="font-display font-extrabold text-[40px] leading-none uppercase text-ink">
                Order placed
              </h3>
              <p className="text-ink-2 mt-[10px] mx-auto max-w-[34ch]">
                Thanks, {placedOrder.firstName}. We&apos;ll call {placedOrder.phone} shortly to
                confirm. Pay {formatTk(placedOrder.total)} when it arrives.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={onContinueShopping}
                className="mt-7 h-12 px-6 rounded-[14px] border-[1.5px] border-ink bg-transparent hover:bg-chalk/50 text-ink font-semibold text-[15px] cursor-pointer"
              >
                Back to kits
              </Button>
            </div>
          ) : (
            <>
              {/* Cart lines */}
              <div className="grid gap-[10px]">
                {cart.length > 0 ? (
                  cart.map((item, idx) => {
                    const kit = KITS.find((k) => k.id === item.id);
                    if (!kit) return null;
                    const unit = kit.price + (item.print ? CONFIG.printPrice : 0);
                    return (
                      <div
                        key={item.key}
                        className="grid grid-cols-[64px_1fr_auto] gap-3 items-center"
                      >
                        <div
                          className="w-16 h-16 rounded-[12px] grid place-items-center shrink-0"
                          style={{ backgroundColor: kit.stage }}
                        >
                          <ShirtArtwork kit={kit} className="w-[78%]" />
                        </div>

                        <div className="min-w-0">
                          <b className="font-semibold text-[15px] block leading-[1.25] text-ink">
                            {kit.name}
                          </b>
                          <small className="text-[13px] text-ink-2 block">
                            Size {item.size} · Qty {item.qty}
                            {item.print
                              ? ` · Print ${item.print.name} ${item.print.num}`.trimEnd()
                              : ''}
                          </small>
                          <div className="inline-flex items-center gap-1.5 mt-1.5">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${kit.short} size ${item.size}`}
                              onClick={() => onAdjustItemQty(idx, -1)}
                              className="w-6 h-6 rounded-[6px] border border-rule text-[14px] leading-none grid place-items-center text-ink hover:border-ink cursor-pointer"
                            >
                              −
                            </button>
                            <span className="text-[13px] font-semibold w-5 text-center tabular-nums">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${kit.short} size ${item.size}`}
                              onClick={() => onAdjustItemQty(idx, 1)}
                              className="w-6 h-6 rounded-[6px] border border-rule text-[14px] leading-none grid place-items-center text-ink hover:border-ink cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-right font-semibold text-ink">
                          {formatTk(unit * item.qty)}
                          <button
                            type="button"
                            aria-label={`Remove ${kit.short} size ${item.size}`}
                            onClick={() => onRemoveItem(idx)}
                            className="block ml-auto text-[12px] text-ink-2 underline font-normal mt-0.5 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-7 text-center border-[1.5px] border-dashed border-rule rounded-[16px] text-ink-2">
                    Your order is empty. Pick a kit and size to start.
                  </div>
                )}
              </div>

              {/* Bundle nudge */}
              {nudge && (
                <div className="mt-[14px] py-3 px-[14px] rounded-[12px] bg-solobo-go-bg text-solobo-go-ink text-[14px] font-medium flex justify-between gap-[10px] items-center">
                  <span>
                    Add {nudge.more} more shirt{nudge.more > 1 ? 's' : ''} and save{' '}
                    {formatTk(nudge.extraSavings)}
                    {nudge.freeDelivery ? ' plus free delivery' : ''}.
                  </span>
                  <button
                    type="button"
                    onClick={onAddAnotherFromNudge}
                    className="font-bold underline whitespace-nowrap cursor-pointer"
                  >
                    Add a kit
                  </button>
                </div>
              )}

              {/* Summary */}
              {cart.length > 0 && (
                <div className="grid gap-2 mt-[18px] pt-4 border-t border-rule text-[15px]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatTk(totals.sub)}</span>
                  </div>
                  {totals.disc > 0 && (
                    <div className="flex justify-between text-solobo-go font-semibold">
                      <span>Bundle saving, {totals.n} shirts</span>
                      <span>−{formatTk(totals.disc)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>{totals.n > 0 && totals.ship === 0 ? 'Free' : formatTk(totals.ship)}</span>
                  </div>
                  <div className="flex justify-between items-baseline font-bold text-[17px] pt-[10px] mt-1 border-t border-rule">
                    <span>Total to pay on delivery</span>
                    <span className="font-display font-black text-[32px] leading-none">
                      {formatTk(totals.total)}
                    </span>
                  </div>
                </div>
              )}

              {/* Delivery Form */}
              <form id="orderForm" className="mt-6 grid gap-[14px]" onSubmit={handleSubmit} noValidate>
                <h3 className="font-semibold text-[15px] text-ink">Where should we deliver?</h3>

                <div>
                  <Label htmlFor="name" className="block text-[14px] font-medium mb-[6px] text-ink">
                    Full name
                  </Label>
                  <Input
                    ref={nameRef}
                    id="name"
                    autoComplete="name"
                    value={form.name}
                    aria-invalid={Boolean(errors.name)}
                    onChange={(e) => {
                      onUpdateForm({ name: e.target.value });
                      if (errors.name) setErrors((prev) => ({ ...prev, name: false }));
                    }}
                    className={`w-full h-[52px] border-[1.5px] rounded-[12px] px-[14px] text-[16px] md:text-[16px] bg-white focus-visible:border-ink focus-visible:ring-0 ${
                      errors.name ? 'border-solobo-red' : 'border-rule'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[13px] text-solobo-red mt-[5px]">Enter your name.</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="block text-[14px] font-medium mb-[6px] text-ink">
                    Mobile number
                  </Label>
                  <Input
                    ref={phoneRef}
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    maxLength={14}
                    value={form.phone}
                    aria-invalid={Boolean(errors.phone)}
                    onChange={(e) => {
                      onUpdateForm({ phone: normalizeBdPhoneInput(e.target.value) });
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: false }));
                    }}
                    className={`w-full h-[52px] border-[1.5px] rounded-[12px] px-[14px] text-[16px] md:text-[16px] bg-white focus-visible:border-ink focus-visible:ring-0 ${
                      errors.phone ? 'border-solobo-red' : 'border-rule'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[13px] text-solobo-red mt-[5px]">
                      Enter an 11-digit number starting with 01.
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="addr" className="block text-[14px] font-medium mb-[6px] text-ink">
                    Full address
                  </Label>
                  <Textarea
                    ref={addressRef}
                    id="addr"
                    autoComplete="street-address"
                    placeholder="House, road, area, thana, district"
                    value={form.address}
                    aria-invalid={Boolean(errors.address)}
                    onChange={(e) => {
                      onUpdateForm({ address: e.target.value });
                      if (errors.address) setErrors((prev) => ({ ...prev, address: false }));
                    }}
                    className={`w-full min-h-[80px] border-[1.5px] rounded-[12px] px-[14px] py-3 text-[16px] md:text-[16px] bg-white resize-y focus-visible:border-ink focus-visible:ring-0 ${
                      errors.address ? 'border-solobo-red' : 'border-rule'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-[13px] text-solobo-red mt-[5px]">
                      Enter your full address so the rider can find you.
                    </p>
                  )}
                </div>

                <fieldset className="border-0 p-0 m-0">
                  <legend className="text-[14px] font-medium mb-[6px] text-ink">
                    Delivery area
                  </legend>
                  <div className="grid grid-cols-2 gap-2">
                    <label
                      className={`relative border-[1.5px] rounded-[12px] py-3 px-[14px] cursor-pointer block transition ${
                        form.zone === 'inside'
                          ? 'border-ink shadow-[inset_0_0_0_1px_#15171D]'
                          : 'border-rule'
                      } has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-solobo-red has-[:focus-visible]:outline-offset-2`}
                    >
                      <input
                        type="radio"
                        name="zone"
                        value="inside"
                        checked={form.zone === 'inside'}
                        onChange={() => onUpdateForm({ zone: 'inside' })}
                        className="absolute opacity-0"
                      />
                      <b className="flex justify-between gap-2 font-semibold text-[15px] text-ink">
                        <span>Inside Dhaka</span>
                        <span className="whitespace-nowrap">
                          {totals.n >= CONFIG.freeShippingFrom
                            ? 'Free'
                            : formatTk(CONFIG.shipping.inside)}
                        </span>
                      </b>
                      <small className="text-ink-2 text-[13px]">1–2 days</small>
                    </label>

                    <label
                      className={`relative border-[1.5px] rounded-[12px] py-3 px-[14px] cursor-pointer block transition ${
                        form.zone === 'outside'
                          ? 'border-ink shadow-[inset_0_0_0_1px_#15171D]'
                          : 'border-rule'
                      } has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-solobo-red has-[:focus-visible]:outline-offset-2`}
                    >
                      <input
                        type="radio"
                        name="zone"
                        value="outside"
                        checked={form.zone === 'outside'}
                        onChange={() => onUpdateForm({ zone: 'outside' })}
                        className="absolute opacity-0"
                      />
                      <b className="flex justify-between gap-2 font-semibold text-[15px] text-ink">
                        <span>Outside Dhaka</span>
                        <span className="whitespace-nowrap">
                          {totals.n >= CONFIG.freeShippingFrom
                            ? 'Free'
                            : formatTk(CONFIG.shipping.outside)}
                        </span>
                      </b>
                      <small className="text-ink-2 text-[13px]">2–4 days</small>
                    </label>
                  </div>
                </fieldset>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        {!placedOrder && (
          <div className="px-6 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] border-t border-rule shrink-0 bg-paper">
            <Button
              type="submit"
              form="orderForm"
              disabled={submitting}
              className="w-full h-[58px] rounded-[14px] bg-solobo-red hover:bg-solobo-red-press active:scale-[0.985] text-white font-bold text-[17px] flex items-center justify-center gap-[10px] border-0 cursor-pointer"
            >
              {submitting ? 'Placing order…' : 'Place order'}{' '}
              <span className="font-display font-extrabold text-[20px] leading-none opacity-90">
                {formatTk(totals.total)}
              </span>
            </Button>
            <p className="text-center text-[13px] text-ink-2 mt-2">
              Cash on delivery. We&apos;ll call to confirm.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
