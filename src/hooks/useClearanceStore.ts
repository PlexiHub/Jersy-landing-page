import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_PERSISTED_STATE,
  KITS,
  type CartItem,
  type CheckoutForm,
  type PersistedState,
  type ShirtSide,
  type SizeKey,
  sanitizePersistedState,
  sanitizePrintName,
  sanitizePrintNum,
  stockOf,
} from '@/src/lib/clearance';

const STORAGE_KEY = 'solobo_fcb2627_state_v1';

function readPersistedState(): PersistedState {
  if (typeof window === 'undefined') return DEFAULT_PERSISTED_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PERSISTED_STATE;
    return sanitizePersistedState(JSON.parse(raw));
  } catch {
    return DEFAULT_PERSISTED_STATE;
  }
}

export function useClearanceStore() {
  const [state, setState] = useState<PersistedState>(readPersistedState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota / private mode failures
    }
  }, [state]);

  // Keep state synchronized across browser tabs
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        setState(sanitizePersistedState(JSON.parse(event.newValue)));
      } catch {
        // Ignore malformed cross-tab payloads
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const selectKit = useCallback((index: number) => {
    setState((prev) => {
      if (index < 0 || index >= KITS.length || !stockOf(KITS[index])) return prev;
      if (index === prev.kitIndex) return prev;
      return {
        ...prev,
        kitIndex: index,
        size: null,
        qty: 1,
      };
    });
  }, []);

  const selectSize = useCallback((size: SizeKey | null) => {
    setState((prev) => {
      const kit = KITS[prev.kitIndex];
      if (!size) return { ...prev, size: null, qty: 1 };
      const available = kit.sizes[size];
      if (!available) return prev;
      return {
        ...prev,
        size,
        qty: Math.min(prev.qty, available),
      };
    });
  }, []);

  const setQty = useCallback((qty: number) => {
    setState((prev) => ({
      ...prev,
      qty: Math.max(1, qty),
    }));
  }, []);

  const setView = useCallback((view: ShirtSide) => {
    setState((prev) => (prev.view === view ? prev : { ...prev, view }));
  }, []);

  const togglePrint = useCallback((nextValue?: boolean) => {
    setState((prev) => {
      const enabled = typeof nextValue === 'boolean' ? nextValue : !prev.printEnabled;
      return {
        ...prev,
        printEnabled: enabled,
        view: enabled ? 'back' : prev.view,
      };
    });
  }, []);

  const setPrintName = useCallback((raw: string) => {
    const cleaned = sanitizePrintName(raw);
    setState((prev) => ({
      ...prev,
      printName: cleaned,
      view: 'back',
    }));
  }, []);

  const setPrintNum = useCallback((raw: string) => {
    const cleaned = sanitizePrintNum(raw);
    setState((prev) => ({
      ...prev,
      printNum: cleaned,
      view: 'back',
    }));
  }, []);

  const setCart = useCallback((cart: CartItem[], options?: { resetQty?: boolean; resetSize?: boolean }) => {
    setState((prev) => ({
      ...prev,
      cart,
      qty: options?.resetQty ? 1 : prev.qty,
      size: options?.resetSize ? null : prev.size,
    }));
  }, []);

  const updateForm = useCallback((patch: Partial<CheckoutForm>) => {
    setState((prev) => ({
      ...prev,
      form: { ...prev.form, ...patch },
    }));
  }, []);

  const clearCartAfterOrder = useCallback(() => {
    setState((prev) => ({
      ...prev,
      cart: [],
      qty: 1,
    }));
  }, []);

  return {
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
  };
}
