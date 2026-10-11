# TrueLift – Solution Plan

**Goal:** For any promotion, estimate *true incremental* sales/margin by separating real new demand from (a) own-SKU cannibalization, (b) pull-forward, and (c) competitor/category gains. Then recommend a better promotion. The output feeds the React simulator in `solution-approach/`.

---

## 1. Dataset

### Primary: dunnhumby "Carbo-Loading" (public, free)
| Why it fits | Detail |
|---|---|
| Right structure | Weekly **store × UPC** sales, **price, base price, feature (mailer), display** flags |
| Natural SKU families | 4 categories (pasta, pasta sauce, syrup, pancake mix) with several brands and pack sizes, so own-SKU cannibalization is observable |
| Natural experiment | Different stores promote the same SKU in different weeks, which gives treated vs control stores for causal estimates |
| Size | ~2 years, tens of stores, hundreds of UPCs: laptop-friendly |

> Verify on download that the transactions table is store-week-UPC level (not household level), because the method depends on it.

### Secondary: dunnhumby "The Complete Journey"
Household baskets and coupons. Use it to **sanity-check switching behaviour** (did the same household move from SKU A to SKU B?). Optional.

### Validation data: synthetic "ground-truth" simulator (we generate it)
Real data never reveals the true cannibalization. We generate store-week sales with **known** baseline, elasticities, cannibalization and pull-forward. We then check that our pipeline **recovers the planted values**. This is the strongest credibility point for the jury.

### Considered and rejected
| Dataset | Reason |
|---|---|
| Favorita (Kaggle) | Only an `onpromotion` flag, no price or discount depth |
| M5 / Walmart | Prices but no promo flags |
| Nielsen / IRI scanner | Best data, but gated access |

**Decision: Carbo-Loading (real) + synthetic ground truth (validation). Complete Journey only if time permits.**

---

## 2. Pipeline and techniques

```
Data prep → Baseline (counterfactual) → Substitution → Causal incrementality
          → Decomposition & KPIs → Simulator + Optimizer → Validation → Integration
```

| # | Stage | Primary technique | Baseline / alternative to compare |
|---|---|---|---|
| 1 | **Data prep** | Join tables; discount % = 1 − price/base_price; promo = discount ≥ threshold or feature/display; SKU attributes (brand, size, variant); weekly panel | – |
| 2 | **Baseline demand** (what if no promo) | **LightGBM** trained on *non-promo* weeks: lags, rolling means, seasonality, store, SKU, price index | Rolling-median baseline, Prophet / ETS |
| 3 | **Substitution structure** | **Log-log demand with cross-price elasticities** (Ridge/Lasso, per category); SKU similarity from attributes | Multinomial / nested logit (brand → size) |
| 4 | **Causal incrementality** | **Difference-in-differences / event study** (promoting vs non-promoting stores); **Double ML** (`EconML LinearDML`) for the effect of promo on *sibling* SKU sales | Synthetic control; naive pre/post |
| 5 | **Pull-forward** | Post-promo dip: actual vs baseline in weeks +1 … +3 | – |
| 6 | **Decomposition & KPIs** | Net incremental units, cannibalization %, pull-forward %, incremental margin | – |
| 7 | **Simulator + optimizer** | Fit response curves: uplift and cannibalization = f(discount depth, duration, feature/display). Grid search / `scipy` constrained optimisation over discount → maximise incremental margin | Bayesian optimisation |
| 8 | **Recommendation rules** | STOP / MODIFY / SCALE by cannibalization % and net margin thresholds | – |

**Key definition**

```
Observed uplift      = Actual − Baseline            (promoted SKU)
Cannibalization      = − Σ (Actual − Baseline)      (sibling SKUs, same brand/category)
Pull-forward         = − Σ (Actual − Baseline)      (post-promo weeks)
True incremental     = Observed uplift − Cannibalization − Pull-forward
Cannibalization rate = Cannibalization / Observed uplift
```

Margin: Carbo-Loading has no cost data, so we **assume gross-margin %** per category and state it clearly.

---

## 3. Validation (how we prove it works)

1. **Synthetic recovery:** estimated cannibalization/pull-forward vs planted truth (error metric: MAE of cannibalization rate).
2. **Baseline accuracy:** WAPE/MAPE on held-out *non-promo* weeks, plus a placebo test (fake promo dates should give ≈ 0 uplift).
3. **Backtest:** hold out promo events and compare predicted vs actual net effect. Compare **naive uplift ranking vs TrueLift ranking** of promotions.
4. **Sanity vs literature:** do our own-pack cannibalization shares land in a plausible range (e.g., the ~22% same-brand pack-size finding)?
5. **Robustness:** vary promo threshold, baseline window and control-store set.

---

## 4. Build phases

| Phase | Deliverable | Output |
|---|---|---|
| **0 · Setup** | Python project (`pandas`, `lightgbm`, `statsmodels`, `econml`, `scikit-learn`), data download script | Reproducible environment |
| **1 · EDA & prep** | Clean weekly panel, promo flags, SKU families | Notebook + parquet |
| **2 · Baseline** | LightGBM baseline + benchmarks | Baseline accuracy table |
| **3 · Substitution + causal** | Cross-elasticity matrix, DiD, DML cannibalization estimates | Per-SKU cannibalization scores |
| **4 · Decomposition** | Promo-level true-lift table (the "5,000 → 2,000" view on real data) | `promo_results.parquet` |
| **5 · Simulator + optimizer** | Response curves + recommendation function | Python module / JSON |
| **6 · Validation** | Synthetic recovery + backtest report | Validation notebook |
| **7 · Integrate** | Replace synthetic `model.js` with real outputs (precomputed JSON, or small FastAPI) in the React app | Live demo on real data |

Suggested repo layout: `analysis/` (notebooks), `src/truelift/` (python package), `data/` (git-ignored), `outputs/` (JSON for the website).

---

## 5. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Few promos per SKU, so noisy estimates | Pool across stores; hierarchical/regularised models; report intervals |
| Promos overlap across SKUs and stores (confounding) | DML with rich controls; DiD against clean control stores; be explicit about assumptions |
| No cost/margin data | Assumed margin %, shown as an assumption in the UI |
| Causal claims overreach | Frame as "estimated" with validation on synthetic truth |
| Time | Core = phases 1–5 on one or two categories (e.g., pasta + sauce); extend later |
