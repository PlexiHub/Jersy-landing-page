/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { BuyPanel } from '@/src/components/BuyPanel';
import { ClockStrip } from '@/src/components/ClockStrip';
import { ClosingCta } from '@/src/components/ClosingCta';
import { FaqSection } from '@/src/components/FaqSection';
import { FloatingControls } from '@/src/components/FloatingControls';
import { KitRail } from '@/src/components/KitRail';
import { MatchDaySpecs } from '@/src/components/MatchDaySpecs';
import { OrderDrawer } from '@/src/components/OrderDrawer';
import { ProductStage } from '@/src/components/ProductStage';
import { SizeGuide } from '@/src/components/SizeGuide';
import { useClearanceStore } from '@/src/hooks/useClearanceStore';
import {
  CONFIG,
  KITS,
  addItemToCart,
  calculateTotals,
  calculateUnitPreview,
  cartTotalQty,
  updateCartItemQty,
  type PlacedOrder,
} from '@/src/lib/clearance';

export default function App() {
  const {
    state,
    selectKit,
    selectSize,
    setQty,
    setView,
    togglePrint,
    setPrintName,
    setPrintNum,
    setCart,
    updateForm,
    clearCartAfterOrder,
  } = useClearanceStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const [showMobileBar, setShowMobileBar] = useState(false);
  const [shakeSizes, setShakeSizes] = useState(false);

  const sizesRef = useRef<HTMLDivElement>(null);
  const kitsRef = useRef<HTMLDivElement>(null);
  const printNameRef = useRef<HTMLInputElement>(null);
  const orderNowRef = useRef<HTMLButtonElement>(null);

  const activeKit = KITS[state.kitIndex] ?? KITS[0];

  // Sync dynamic CSS variables on :root for ProductStage and ClosingCta
  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--kit-stage', activeKit.stage);
    root.setProperty('--kit-on', activeKit.on);
    root.setProperty('--kit-trim', activeKit.look.trim);
  }, [activeKit]);

  // Show mobile sticky bar once primary CTA scrolls above viewport
  useEffect(() => {
    const el = orderNowRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      setShowMobileBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const backPreview = useMemo(() => {
    if (!state.printEnabled) return CONFIG.defaultBack;
    return {
      name: state.printName.trim() || CONFIG.defaultBack.name,
      num: state.printNum.trim() || CONFIG.defaultBack.num,
    };
  }, [state.printEnabled, state.printName, state.printNum]);

  const cartCount = useMemo(() => cartTotalQty(state.cart), [state.cart]);
  const cartSummary = useMemo(
    () => calculateTotals(state.cart, state.form.zone),
    [state.cart, state.form.zone]
  );
  const unitPreview = useMemo(
    () => calculateUnitPreview(activeKit, state.printEnabled, state.qty, cartCount),
    [activeKit, state.printEnabled, state.qty, cartCount]
  );

  const triggerSizePrompt = useCallback(() => {
    toast('Pick a size first.');
    sizesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setShakeSizes(false);
    window.requestAnimationFrame(() => {
      setShakeSizes(true);
      window.setTimeout(() => setShakeSizes(false), 320);
    });
  }, []);

  const addCurrentSelection = useCallback(
    (resetSizeAfter = false): boolean => {
      if (!state.size) {
        triggerSizePrompt();
        return false;
      }

      const printData = state.printEnabled
        ? { name: state.printName.trim().toUpperCase(), num: state.printNum.trim() }
        : null;

      if (printData && !printData.name && !printData.num) {
        toast('Type a name or number to print.');
        printNameRef.current?.focus();
        return false;
      }

      const result = addItemToCart(state.cart, activeKit, state.size, state.qty, printData);
      if (!result.ok) {
        toast(`All ${result.max} in ${state.size} are already in your order.`);
        return false;
      }

      setPlacedOrder(null);
      setCart(result.cart, { resetQty: true, resetSize: resetSizeAfter });
      return true;
    },
    [
      state.size,
      state.printEnabled,
      state.printName,
      state.printNum,
      state.cart,
      state.qty,
      activeKit,
      setCart,
      triggerSizePrompt,
    ]
  );

  const handleTogglePrint = useCallback(
    (checked: boolean) => {
      togglePrint(checked);
      if (checked) {
        window.setTimeout(() => printNameRef.current?.focus(), 60);
      }
    },
    [togglePrint]
  );

  const handleIncrementQty = useCallback(() => {
    const max = state.size ? activeKit.sizes[state.size] : 5;
    if (state.qty >= max) {
      toast(state.size ? `Only ${max} left in ${state.size}.` : 'Pick a size first.');
      return;
    }
    setQty(state.qty + 1);
  }, [state.size, state.qty, activeKit, setQty]);

  const handleDecrementQty = useCallback(() => {
    setQty(Math.max(1, state.qty - 1));
  }, [state.qty, setQty]);

  const handleOrderNow = useCallback(() => {
    if (!state.size && state.cart.length > 0) {
      setPlacedOrder(null);
      setDrawerOpen(true);
      return;
    }
    if (addCurrentSelection(false)) {
      setDrawerOpen(true);
    }
  }, [state.size, state.cart.length, addCurrentSelection]);

  const handleAddAnother = useCallback(() => {
    if (addCurrentSelection(true)) {
      toast('Added. Pick your next kit.');
      kitsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [addCurrentSelection]);

  const handleBarCta = useCallback(() => {
    if (state.size) {
      if (addCurrentSelection(false)) setDrawerOpen(true);
    } else if (state.cart.length > 0) {
      setPlacedOrder(null);
      setDrawerOpen(true);
    } else {
      addCurrentSelection(false);
    }
  }, [state.size, state.cart.length, addCurrentSelection]);

  const handleCloseCta = useCallback(() => {
    if (state.cart.length > 0) {
      setPlacedOrder(null);
      setDrawerOpen(true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast('Pick a kit and size to start.');
    }
  }, [state.cart.length]);

  const handleScrollToGuide = useCallback(() => {
    document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleRemoveCartItem = useCallback(
    (index: number) => {
      setCart(state.cart.filter((_, i) => i !== index));
    },
    [state.cart, setCart]
  );

  const handleAdjustCartItemQty = useCallback(
    (index: number, delta: number) => {
      const target = state.cart[index];
      if (!target) return;
      const result = updateCartItemQty(state.cart, index, delta);
      if (!result.ok) {
        toast(`Only ${result.max} left in ${target.size}.`);
        return;
      }
      setCart(result.cart);
    },
    [state.cart, setCart]
  );

  const handleAddAnotherFromNudge = useCallback(() => {
    setDrawerOpen(false);
    selectSize(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectSize]);

  const handleOrderSuccess = useCallback(
    (order: PlacedOrder) => {
      setPlacedOrder(order);
      clearCartAfterOrder();
    },
    [clearCartAfterOrder]
  );

  const handleContinueShopping = useCallback(() => {
    setDrawerOpen(false);
    window.setTimeout(() => setPlacedOrder(null), 250);
  }, []);

  const handleDrawerOpenChange = useCallback((nextOpen: boolean) => {
    setDrawerOpen(nextOpen);
    if (!nextOpen) {
      window.setTimeout(() => setPlacedOrder(null), 250);
    }
  }, []);

  return (
    <div className="min-h-screen bg-chalk text-ink">
      <ClockStrip />

      <main>
        {/* Drop: stage + buy panel */}
        <section
          className="max-w-[1360px] mx-auto p-6 max-[1040px]:p-4 grid grid-cols-[minmax(0,1.25fr)_minmax(380px,0.9fr)] max-[1040px]:grid-cols-1 gap-6 items-start"
          aria-label="Product"
        >
          <ProductStage
            kit={activeKit}
            view={state.view}
            backPreview={backPreview}
            onViewChange={setView}
          />

          <BuyPanel
            kitIndex={state.kitIndex}
            kit={activeKit}
            size={state.size}
            qty={state.qty}
            printEnabled={state.printEnabled}
            printName={state.printName}
            printNum={state.printNum}
            cartCount={cartCount}
            cartTotal={cartSummary.total}
            shakeSizes={shakeSizes}
            sizesRef={sizesRef}
            printNameRef={printNameRef}
            orderNowRef={orderNowRef}
            kitsRef={kitsRef}
            onSelectKit={selectKit}
            onSelectSize={selectSize}
            onScrollToGuide={handleScrollToGuide}
            onTogglePrint={handleTogglePrint}
            onPrintNameChange={setPrintName}
            onPrintNumChange={setPrintNum}
            onDecrementQty={handleDecrementQty}
            onIncrementQty={handleIncrementQty}
            onOrderNow={handleOrderNow}
            onAddAnother={handleAddAnother}
            onOpenCart={() => {
              setPlacedOrder(null);
              setDrawerOpen(true);
            }}
          />
        </section>

        <KitRail onSelectKit={selectKit} />
        <MatchDaySpecs />
        <SizeGuide />
        <FaqSection />
        <ClosingCta kitPrice={activeKit.price} onOrderClick={handleCloseCta} />
      </main>

      <FloatingControls
        showMobileBar={showMobileBar}
        kit={activeKit}
        size={state.size}
        previewTotal={unitPreview.total}
        onBarCtaClick={handleBarCta}
      />

      <OrderDrawer
        open={drawerOpen}
        cart={state.cart}
        form={state.form}
        placedOrder={placedOrder}
        onOpenChange={handleDrawerOpenChange}
        onUpdateForm={updateForm}
        onRemoveItem={handleRemoveCartItem}
        onAdjustItemQty={handleAdjustCartItemQty}
        onAddAnotherFromNudge={handleAddAnotherFromNudge}
        onOrderSuccess={handleOrderSuccess}
        onContinueShopping={handleContinueShopping}
      />

      <Toaster
        position="bottom-center"
        theme="dark"
        duration={2400}
        toastOptions={{
          style: {
            background: '#15171D',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 18px',
            fontWeight: 500,
            fontSize: '15px',
          },
        }}
      />
    </div>
  );
}
