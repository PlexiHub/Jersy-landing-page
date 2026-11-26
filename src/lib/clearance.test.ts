import test from 'node:test';
import assert from 'node:assert/strict';
import {
  KITS,
  CONFIG,
  addItemToCart,
  calculateTotals,
  calculateUnitPreview,
  cleanBdPhone,
  discountPercent,
  displayTitle,
  formatCountdown,
  formatTk,
  getNextTierNudge,
  normalizeBdPhoneInput,
  sanitizePersistedState,
  sanitizePrintName,
  sanitizePrintNum,
  stockOf,
  tierFor,
  updateCartItemQty,
  validateCheckoutForm,
} from './clearance';

test('formatTk and basic kit helpers match original formatting', () => {
  assert.equal(formatTk(890), 'Tk 890');
  assert.equal(formatTk(1490), 'Tk 1,490');
  assert.equal(stockOf(KITS[0]), 12);
  assert.equal(discountPercent(KITS[0]), 40);
  assert.equal(displayTitle(KITS[0]), 'Barcelona 26/27');
  assert.equal(displayTitle(KITS[3]), 'Barcelona 2009');
});

test('bundle tiers and cart totals compute discounts and free delivery accurately', () => {
  assert.equal(tierFor(1).off, 0);
  assert.equal(tierFor(2).off, 100);
  assert.equal(tierFor(3).off, 150);
  assert.equal(tierFor(5).off, 150);

  // 1 Home shirt inside Dhaka
  const r1 = addItemToCart([], KITS[0], 'L', 1, null);
  assert.equal(r1.ok, true);
  if (!r1.ok) return;

  const t1 = calculateTotals(r1.cart, 'inside');
  assert.deepEqual(t1, { n: 1, sub: 890, disc: 0, ship: 70, total: 960 });

  // Add 1 Away shirt with custom print (total 2 shirts -> Tk 100 off each = Tk 200 discount)
  const r2 = addItemToCart(r1.cart, KITS[1], 'M', 1, { name: 'YAMAL', num: '19' });
  assert.equal(r2.ok, true);
  if (!r2.ok) return;

  const t2 = calculateTotals(r2.cart, 'outside');
  assert.deepEqual(t2, {
    n: 2,
    sub: 890 + 850 + CONFIG.printPrice,
    disc: 200,
    ship: 130,
    total: 890 + 850 + 250 - 200 + 130,
  });

  // Nudge at 2 shirts should recommend 1 more shirt to save Tk 250 + free delivery
  const nudge2 = getNextTierNudge(2);
  assert.deepEqual(nudge2, { more: 1, extraSavings: 250, freeDelivery: true });

  // Add 1 Retro shirt (total 3 shirts -> Tk 150 off each = Tk 450 discount + free shipping)
  const r3 = addItemToCart(r2.cart, KITS[3], 'L', 1, null);
  assert.equal(r3.ok, true);
  if (!r3.ok) return;

  const t3 = calculateTotals(r3.cart, 'outside');
  assert.deepEqual(t3, {
    n: 3,
    sub: 890 + 850 + 250 + 990,
    disc: 450,
    ship: 0,
    total: 890 + 850 + 250 + 990 - 450,
  });
  assert.equal(getNextTierNudge(3), null);
});

test('addItemToCart and updateCartItemQty enforce available stock per kit and size', () => {
  // Home XXL only has 1 in stock
  const first = addItemToCart([], KITS[0], 'XXL', 2, null);
  assert.equal(first.ok, true);
  if (!first.ok) return;
  assert.equal(first.addedQty, 1);

  const second = addItemToCart(first.cart, KITS[0], 'XXL', 1, null);
  assert.equal(second.ok, false);

  const inc = updateCartItemQty(first.cart, 0, 1);
  assert.equal(inc.ok, false);

  const dec = updateCartItemQty(first.cart, 0, -1);
  assert.equal(dec.ok, true);
  if (dec.ok) {
    assert.equal(dec.cart.length, 0);
  }
});

test('preview price includes print price and bundle discount', () => {
  const preview = calculateUnitPreview(KITS[0], true, 2, 0);
  // (890 + 250 - 100) * 2 = 2080
  assert.equal(preview.total, 2080);
  assert.equal(preview.activeTier.min, 2);
});

test('print and Bangladesh phone sanitization and checkout validation', () => {
  assert.equal(sanitizePrintName('pedri 8!'), 'PEDRI ');
  assert.equal(sanitizePrintNum('1a9b2'), '19');

  assert.equal(normalizeBdPhoneInput('০১৭১২৩৪৫৬৭৮'), '01712345678');
  assert.equal(cleanBdPhone('+88০১৮১২৩৪৫৬৭৮'), '01812345678');

  const invalid = validateCheckoutForm({
    name: 'A',
    phone: '01234567890',
    address: 'Dhaka',
    zone: 'inside',
  });
  assert.equal(invalid.valid, false);
  assert.deepEqual(invalid.errors, { name: true, phone: true, address: true });

  const valid = validateCheckoutForm({
    name: 'Ikram Hasan',
    phone: '+88০১৭১২৩৪৫৬৭৮',
    address: 'House 12, Road 4, Dhanmondi, Dhaka',
    zone: 'inside',
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.cleanPhone, '01712345678');
});

test('sanitizePersistedState recovers safely from invalid or over-stock localStorage payloads', () => {
  const hydrated = sanitizePersistedState({
    kitIndex: 1,
    size: 'XXL', // Away kit has 0 XXL -> should reset to null
    qty: 99,
    printEnabled: true,
    printName: 'gavi6',
    printNum: '06',
    view: 'back',
    cart: [
      { id: 'fcb-home-2627', size: 'XXL', qty: 5, print: null }, // stock is 1 -> clamps to 1
      { id: 'non-existent', size: 'M', qty: 1, print: null },
    ],
    form: {
      name: 'Rafiq',
      phone: '০১৭০০০০০০০০',
      address: 'Banani, Road 11, Dhaka',
      zone: 'outside',
    },
  });

  assert.equal(hydrated.kitIndex, 1);
  assert.equal(hydrated.size, null);
  assert.equal(hydrated.qty, 5);
  assert.equal(hydrated.printEnabled, true);
  assert.equal(hydrated.printName, 'GAVI');
  assert.equal(hydrated.printNum, '06');
  assert.equal(hydrated.view, 'back');
  assert.equal(hydrated.cart.length, 1);
  assert.equal(hydrated.cart[0].qty, 1);
  assert.equal(hydrated.form.phone, '01700000000');
  assert.equal(hydrated.form.zone, 'outside');
});

test('formatCountdown formats milliseconds into HH:MM:SS', () => {
  assert.equal(formatCountdown(18 * 3_600_000), '18:00:00');
  assert.equal(formatCountdown(3_661_000), '01:01:01');
  assert.equal(formatCountdown(-500), '00:00:00');
});
