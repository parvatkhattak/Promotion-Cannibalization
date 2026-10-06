/**
 * Illustrative synthetic promotion model used by the live simulator.
 * It is NOT fitted to real data; it encodes the qualitative behaviour we expect:
 *  - uplift rises with discount but with diminishing returns
 *  - the share of that uplift cannibalized from sibling SKUs rises quickly with depth of discount
 *  - deep discounts erode unit margin
 */
export const SKUS = [
  { id: '1l', name: 'Family Pack 1L', price: 120, cost: 72, e: 1.9, off: 0 },
  { id: '750', name: '750ml Pack', price: 100, cost: 60, e: 1.6, off: -0.05 },
  { id: '500', name: '500ml Pack', price: 70, cost: 42, e: 1.3, off: -0.12 },
  { id: 'prem', name: 'Premium 750ml', price: 150, cost: 80, e: 1.1, off: -0.2 },
  { id: '2l', name: '2L Value Pack', price: 180, cost: 117, e: 1.5, off: -0.15 },
]
export const RETAILERS = [
  { id: 'mt', name: 'Modern Trade', m: 1 },
  { id: 'gt', name: 'General Trade', m: 0.85 },
  { id: 'ec', name: 'E-commerce', m: 1.15 },
]
export const REGIONS = [
  { id: 's', name: 'South India', m: 1 },
  { id: 'n', name: 'North India', m: 0.95 },
  { id: 'w', name: 'West India', m: 1.05 },
  { id: 'e', name: 'East India', m: 0.9 },
]

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

export function evaluate({ sku, d, days, ret, reg }) {
  const s = SKUS.find((x) => x.id === sku)
  const r = RETAILERS.find((x) => x.id === ret)
  const g = REGIONS.find((x) => x.id === reg)
  const durFactor = 1 + 0.02 * (Math.min(days, 21) - 7)
  const uplift = s.e * d * (1 - d / 80) * r.m * g.m * durFactor
  const share = clamp(-0.052 + 0.0356 * d + s.off, 0.05, 0.9)
  const cannib = uplift * share
  const incr = uplift - cannib
  const baseUnits = 100000 * (days / 7)
  const unitMargin = s.price * (1 - d / 100) - s.cost
  const margin = ((baseUnits * incr) / 100) * unitMargin
  return { uplift, cannib, incr, margin, share, unitMargin }
}

/** Search discount depth that maximises incremental margin. */
export function recommend(input) {
  let best = null
  for (let d = 5; d <= 30; d += 1) {
    const e = evaluate({ ...input, d })
    if (!best || e.margin > best.margin) best = { d, ...e }
  }
  return best
}

export const lakh = (v) => `₹${(v / 1e5).toFixed(2)} L`
