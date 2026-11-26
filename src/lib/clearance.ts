export type SizeKey = 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type ShirtSide = 'front' | 'back';
export type DeliveryZone = 'inside' | 'outside';

export interface KitLook {
  pattern: 'stripes' | 'halves' | 'solid';
  a: string;
  b: string;
  trim: string;
  text: string;
}

export interface Kit {
  id: string;
  name: string;
  short: string;
  note: string;
  price: number;
  was: number;
  sizes: Record<SizeKey, number>;
  image: string;
  imageBack: string;
  look: KitLook;
  stage: string;
  on: string;
}

export interface BundleTier {
  min: number;
  off: number;
  label: string;
  note: string;
}

export interface ClearanceConfig {
  hours: number;
  endsAt: string | null;
  shipping: Record<DeliveryZone, number>;
  freeShippingFrom: number;
  tiers: BundleTier[];
  printPrice: number;
  defaultBack: { name: string; num: string };
  orderEndpoint: string;
}

export interface PrintConfig {
  name: string;
  num: string;
}

export interface CartItem {
  key: string;
  id: string;
  size: SizeKey;
  qty: number;
  print: PrintConfig | null;
}

export interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  zone: DeliveryZone;
}

export interface PersistedState {
  kitIndex: number;
  size: SizeKey | null;
  qty: number;
  printEnabled: boolean;
  printName: string;
  printNum: string;
  view: ShirtSide;
  cart: CartItem[];
  form: CheckoutForm;
}

export interface OrderTotals {
  n: number;
  sub: number;
  disc: number;
  ship: number;
  total: number;
}

export interface PlacedOrder {
  firstName: string;
  phone: string;
  total: number;
  itemCount: number;
}

export const SIZE_KEYS: SizeKey[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const CONFIG: ClearanceConfig = {
  hours: 18,
  endsAt: null,
  shipping: { inside: 70, outside: 130 },
  freeShippingFrom: 3,
  tiers: [
    { min: 1, off: 0, label: '1 shirt', note: 'Clearance price' },
    { min: 2, off: 100, label: '2 shirts', note: 'Tk 100 off each' },
    { min: 3, off: 150, label: '3+', note: 'Tk 150 off each, free delivery' },
  ],
  printPrice: 250,
  defaultBack: { name: 'SOLOBO', num: '10' },
  orderEndpoint: '',
};

export const KITS: Kit[] = [
  {
    id: 'fcb-home-2627',
    name: 'Barcelona Home 26/27',
    short: 'Home',
    note: 'Blaugrana stripes, gold trim',
    price: 890,
    was: 1490,
    sizes: { S: 0, M: 3, L: 5, XL: 3, XXL: 1 },
    image: '',
    imageBack: '',
    look: { pattern: 'stripes', a: '#A2214A', b: '#1A3F94', trim: '#E9B526', text: '#E9B526' },
    stage: '#0E1F4D',
    on: '#FFFFFF',
  },
  {
    id: 'fcb-away-2627',
    name: 'Barcelona Away 26/27',
    short: 'Away',
    note: 'Sunflower with garnet detail',
    price: 850,
    was: 1450,
    sizes: { S: 1, M: 2, L: 2, XL: 1, XXL: 0 },
    image: '',
    imageBack: '',
    look: { pattern: 'solid', a: '#F2CF3A', b: '#F2CF3A', trim: '#8E1638', text: '#8E1638' },
    stage: '#4A0C22',
    on: '#F2CF3A',
  },
  {
    id: 'fcb-third-2627',
    name: 'Barcelona Third 26/27',
    short: 'Third',
    note: 'Carbon black, red flash',
    price: 850,
    was: 1450,
    sizes: { S: 0, M: 0, L: 2, XL: 2, XXL: 0 },
    image: '',
    imageBack: '',
    look: { pattern: 'solid', a: '#1C1D22', b: '#1C1D22', trim: '#E3141F', text: '#F4F4F5' },
    stage: '#2A2B31',
    on: '#FFFFFF',
  },
  {
    id: 'fcb-retro-09',
    name: 'Barcelona Retro 2009',
    short: 'Retro 09',
    note: 'The treble season, half-and-half',
    price: 990,
    was: 1690,
    sizes: { S: 1, M: 2, L: 3, XL: 2, XXL: 1 },
    image: '',
    imageBack: '',
    look: { pattern: 'halves', a: '#A2214A', b: '#1A3F94', trim: '#E9B526', text: '#E9B526' },
    stage: '#5A0E27',
    on: '#FFFFFF',
  },
];

export const DEFAULT_FORM: CheckoutForm = {
  name: '',
  phone: '',
  address: '',
  zone: 'inside',
};

export const DEFAULT_PERSISTED_STATE: PersistedState = {
  kitIndex: 0,
  size: null,
  qty: 1,
  printEnabled: false,
  printName: '',
  printNum: '',
  view: 'front',
  cart: [],
  form: DEFAULT_FORM,
};

export function formatTk(n: number): string {
  return 'Tk ' + Math.round(n).toLocaleString('en-IN');
}

export function stockOf(kit: Kit): number {
  return Object.values(kit.sizes).reduce((sum, count) => sum + count, 0);
}

export function discountPercent(kit: Kit): number {
  if (kit.was <= 0) return 0;
  return Math.round((1 - kit.price / kit.was) * 100);
}

export function displayTitle(kit: Kit): string {
  return kit.name.replace(/ (Home|Away|Third|Retro)/, '').trim();
}

export function stageKickerLabel(kit: Kit): string {
  return kit.short + (kit.short.length < 6 ? ' kit' : '');
}

export function cartTotalQty(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

export function tierFor(qty: number, tiers: BundleTier[] = CONFIG.tiers): BundleTier {
  const sortedDesc = [...tiers].sort((a, b) => b.min - a.min);
  return sortedDesc.find((tier) => qty >= tier.min) ?? tiers[0];
}

export function calculateUnitPreview(
  kit: Kit,
  printEnabled: boolean,
  qty: number,
  existingCartQty: number,
  config: ClearanceConfig = CONFIG
): { total: number; activeTier: BundleTier } {
  const unit = kit.price + (printEnabled ? config.printPrice : 0);
  const projectedCount = existingCartQty + qty;
  const activeTier = tierFor(projectedCount, config.tiers);
  const each = unit - activeTier.off;
  return { total: each * qty, activeTier };
}

export function calculateTotals(
  cart: CartItem[],
  zone: DeliveryZone,
  kits: Kit[] = KITS,
  config: ClearanceConfig = CONFIG
): OrderTotals {
  const n = cartTotalQty(cart);
  const tier = tierFor(n, config.tiers);
  let sub = 0;

  for (const item of cart) {
    const found = kits.find((k) => k.id === item.id);
    if (!found) continue;
    sub += (found.price + (item.print ? config.printPrice : 0)) * item.qty;
  }

  const disc = n > 0 ? tier.off * n : 0;
  const ship = n === 0 ? 0 : n >= config.freeShippingFrom ? 0 : config.shipping[zone];

  return {
    n,
    sub,
    disc,
    ship,
    total: sub - disc + ship,
  };
}

export function getNextTierNudge(
  currentQty: number,
  config: ClearanceConfig = CONFIG
): { more: number; extraSavings: number; freeDelivery: boolean } | null {
  if (currentQty <= 0) return null;
  const next = config.tiers.find((tier) => tier.min > currentQty);
  if (!next) return null;

  const currentTier = tierFor(currentQty, config.tiers);
  const more = next.min - currentQty;
  const extraSavings = next.off * next.min - currentTier.off * currentQty;

  return {
    more,
    extraSavings,
    freeDelivery: next.min >= config.freeShippingFrom,
  };
}

export function sanitizePrintName(raw: string): string {
  return raw.replace(/[^a-zA-Z .'-]/g, '').toUpperCase().slice(0, 12);
}

export function sanitizePrintNum(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 2);
}

const BANGLA_DIGITS = '০১২৩৪৫৬৭৮৯';

export function normalizeBdPhoneInput(raw: string): string {
  return raw
    .replace(/[০-৯]/g, (digit) => String(BANGLA_DIGITS.indexOf(digit)))
    .replace(/[^\d+]/g, '')
    .slice(0, 14);
}

export function cleanBdPhone(raw: string): string {
  return normalizeBdPhoneInput(raw).trim().replace(/^\+?88/, '');
}

export function validateCheckoutForm(form: CheckoutForm): {
  valid: boolean;
  errors: { name?: boolean; phone?: boolean; address?: boolean };
  cleanPhone: string;
} {
  const name = form.name.trim();
  const cleanPhone = cleanBdPhone(form.phone);
  const address = form.address.trim();

  const errors: { name?: boolean; phone?: boolean; address?: boolean } = {};
  if (name.length < 2) errors.name = true;
  if (!/^01[3-9]\d{8}$/.test(cleanPhone)) errors.phone = true;
  if (address.length < 10) errors.address = true;

  return {
    valid: !errors.name && !errors.phone && !errors.address,
    errors,
    cleanPhone,
  };
}

export function buildCartItemKey(kitId: string, size: SizeKey, print: PrintConfig | null): string {
  return [kitId, size, print ? `${print.name}#${print.num}` : ''].join('|');
}

export function addItemToCart(
  cart: CartItem[],
  kit: Kit,
  size: SizeKey,
  qty: number,
  print: PrintConfig | null
): { ok: true; cart: CartItem[]; addedQty: number } | { ok: false; reason: 'max-stock'; max: number } {
  const max = kit.sizes[size] ?? 0;
  const existingForSize = cart
    .filter((item) => item.id === kit.id && item.size === size)
    .reduce((sum, item) => sum + item.qty, 0);

  if (existingForSize >= max || max <= 0) {
    return { ok: false, reason: 'max-stock', max };
  }

  const addedQty = Math.min(Math.max(1, qty), max - existingForSize);
  const key = buildCartItemKey(kit.id, size, print);
  const existingIndex = cart.findIndex((item) => item.key === key);

  if (existingIndex >= 0) {
    const nextCart = cart.map((item, idx) =>
      idx === existingIndex ? { ...item, qty: item.qty + addedQty } : item
    );
    return { ok: true, cart: nextCart, addedQty };
  }

  return {
    ok: true,
    cart: [...cart, { key, id: kit.id, size, qty: addedQty, print }],
    addedQty,
  };
}

export function updateCartItemQty(
  cart: CartItem[],
  index: number,
  delta: number,
  kits: Kit[] = KITS
): { ok: true; cart: CartItem[] } | { ok: false; reason: 'max-stock'; max: number } {
  const target = cart[index];
  if (!target) return { ok: true, cart };

  const nextQty = target.qty + delta;
  if (nextQty <= 0) {
    return { ok: true, cart: cart.filter((_, i) => i !== index) };
  }

  const kit = kits.find((k) => k.id === target.id);
  if (!kit) return { ok: true, cart: cart.filter((_, i) => i !== index) };

  const max = kit.sizes[target.size] ?? 0;
  const otherQtySameSize = cart.reduce((sum, item, i) => {
    if (i === index) return sum;
    return item.id === target.id && item.size === target.size ? sum + item.qty : sum;
  }, 0);

  if (otherQtySameSize + nextQty > max) {
    return { ok: false, reason: 'max-stock', max };
  }

  return {
    ok: true,
    cart: cart.map((item, i) => (i === index ? { ...item, qty: nextQty } : item)),
  };
}

export function sanitizePersistedState(raw: unknown, kits: Kit[] = KITS): PersistedState {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_PERSISTED_STATE;
  }

  const record = raw as Record<string, unknown>;

  const rawKitIndex = typeof record.kitIndex === 'number' && Number.isInteger(record.kitIndex)
    ? record.kitIndex
    : 0;
  const kitIndex = rawKitIndex >= 0 && rawKitIndex < kits.length && stockOf(kits[rawKitIndex]) > 0
    ? rawKitIndex
    : 0;

  const activeKit = kits[kitIndex];
  const rawSize = typeof record.size === 'string' && SIZE_KEYS.includes(record.size as SizeKey)
    ? (record.size as SizeKey)
    : null;
  const size = rawSize && activeKit.sizes[rawSize] > 0 ? rawSize : null;

  const maxQty = size ? activeKit.sizes[size] : 5;
  const rawQty = typeof record.qty === 'number' && Number.isInteger(record.qty) ? record.qty : 1;
  const qty = Math.min(Math.max(1, rawQty), Math.max(1, maxQty));

  const printEnabled = Boolean(record.printEnabled);
  const printName = typeof record.printName === 'string' ? sanitizePrintName(record.printName) : '';
  const printNum = typeof record.printNum === 'string' ? sanitizePrintNum(record.printNum) : '';
  const view: ShirtSide = record.view === 'back' ? 'back' : 'front';

  const cart: CartItem[] = [];
  if (Array.isArray(record.cart)) {
    const usedByKitSize: Record<string, number> = {};
    for (const entry of record.cart) {
      if (!entry || typeof entry !== 'object') continue;
      const item = entry as Record<string, unknown>;
      const kit = kits.find((k) => k.id === item.id);
      if (!kit) continue;
      if (typeof item.size !== 'string' || !SIZE_KEYS.includes(item.size as SizeKey)) continue;
      const itemSize = item.size as SizeKey;
      const maxStock = kit.sizes[itemSize] ?? 0;
      if (maxStock <= 0) continue;

      const bucketKey = `${kit.id}|${itemSize}`;
      const used = usedByKitSize[bucketKey] ?? 0;
      const remaining = maxStock - used;
      if (remaining <= 0) continue;

      const requestedQty = typeof item.qty === 'number' && Number.isInteger(item.qty) ? item.qty : 1;
      const clampedQty = Math.min(Math.max(1, requestedQty), remaining);

      let print: PrintConfig | null = null;
      if (item.print && typeof item.print === 'object') {
        const p = item.print as Record<string, unknown>;
        const pName = typeof p.name === 'string' ? sanitizePrintName(p.name) : '';
        const pNum = typeof p.num === 'string' ? sanitizePrintNum(p.num) : '';
        if (pName || pNum) {
          print = { name: pName, num: pNum };
        }
      }

      const key = buildCartItemKey(kit.id, itemSize, print);
      const existing = cart.find((c) => c.key === key);
      if (existing) {
        existing.qty += clampedQty;
      } else {
        cart.push({ key, id: kit.id, size: itemSize, qty: clampedQty, print });
      }
      usedByKitSize[bucketKey] = used + clampedQty;
    }
  }

  const rawForm = record.form && typeof record.form === 'object'
    ? (record.form as Record<string, unknown>)
    : {};
  const form: CheckoutForm = {
    name: typeof rawForm.name === 'string' ? rawForm.name.slice(0, 100) : '',
    phone: typeof rawForm.phone === 'string' ? normalizeBdPhoneInput(rawForm.phone) : '',
    address: typeof rawForm.address === 'string' ? rawForm.address.slice(0, 300) : '',
    zone: rawForm.zone === 'outside' ? 'outside' : 'inside',
  };

  return {
    kitIndex,
    size,
    qty,
    printEnabled,
    printName,
    printNum,
    view,
    cart,
    form,
  };
}

export function formatCountdown(remainingMs: number): string {
  const safe = Math.max(0, remainingMs);
  const pad = (n: number) => String(n).padStart(2, '0');
  const hours = Math.floor(safe / 3_600_000);
  const mins = Math.floor((safe % 3_600_000) / 60_000);
  const secs = Math.floor((safe % 60_000) / 1000);
  return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
}
