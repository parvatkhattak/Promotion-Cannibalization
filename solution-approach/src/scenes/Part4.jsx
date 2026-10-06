import { motion } from 'framer-motion'
import { Scene, Reveal, Num, Title, ease, useScene } from '../ui'

/* ───────── 12 · EVIDENCE ───────── */
function Ring({ pct, run }) {
  const c = 2 * Math.PI * 54
  return (
    <svg viewBox="0 0 140 140" className="ring-svg" aria-hidden="true">
      <circle cx="70" cy="70" r="54" className="ring-bg" />
      <motion.circle
        cx="70"
        cy="70"
        r="54"
        className="ring-fg"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: run ? c * (1 - pct / 100) : c }}
        transition={{ duration: 1.6, ease }}
        transform="rotate(-90 70 70)"
      />
    </svg>
  )
}

export function Evidence() {
  const { ref, active, phase: p } = useScene([1000, 2200, 3400, 5200])
  return (
    <Scene ref={ref} id="evidence" label="Real-world Evidence" active={active}>
      <Title eyebrow="We aren’t solving a theoretical problem" show={active}>
        Real-world <span className="grad">evidence</span>
      </Title>
      <div className="cards3 ev">
        <Reveal show={p >= 1} className="card case">
          <div className="case-n">CASE STUDY 01</div>
          <div className="ring-box">
            <Ring pct={22} run={p >= 1} />
            <b className="ring-v"><Num to={22} run={p >= 1} suffix="%" /></b>
          </div>
          <h3>of promotion uplift</h3>
          <p>
            A <i>Journal of Retailing</i> study of 132 brand-pack sizes across 12 grocery categories (US, UK, Australia) found that, on average, 22% of a promoted pack’s uplift came from <b>other pack sizes of the same brand</b>.
          </p>
          <div className="case-foot">The customer didn’t necessarily leave the brand. They changed the pack.</div>
          <a href="https://www.sciencedirect.com/science/article/pii/S002243591200005X" target="_blank" rel="noreferrer">Source ↗</a>
        </Reveal>
        <Reveal show={p >= 2} className="card case">
          <div className="case-n">CASE STUDY 02</div>
          <div className="big-stats">
            <div><b className="green"><Num to={2} run={p >= 2} prefix="+" suffix="%" /></b><small>sales</small></div>
            <div><b className="cyan"><Num to={3} run={p >= 2} prefix="+" suffix="%" /></b><small>household penetration</small></div>
          </div>
          <h3>Beyond basic promotion ROI</h3>
          <p>
            McKinsey describes a North American CPG company that moved past simple lift/ROI measures, which overlooked cannibalization and pantry loading, and gained incremental improvements.
          </p>
          <div className="case-foot">Industry evidence shows the size of the opportunity, not our claimed result.</div>
          <a href="https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/how-analytics-can-drive-growth-in-consumer-packaged-goods-trade-promotions" target="_blank" rel="noreferrer">Source ↗</a>
        </Reveal>
        <Reveal show={p >= 3} className="card case">
          <div className="case-n">CASE STUDY 03</div>
          <div className="big-stats single">
            <div><b className="violet">Millions</b><small>of product · promotion · timing combinations searched</small></div>
          </div>
          <h3>PepsiCo: optimization at scale</h3>
          <p>
            A 2026 paper on PepsiCo’s PromoAI combines ML promotional forecasts with mathematical optimization under business constraints.
          </p>
          <div className="case-foot">The industry is moving from reporting to AI-assisted optimization. Our opportunity: add the incrementality lens.</div>
          <a href="https://arxiv.org/abs/2606.17941" target="_blank" rel="noreferrer">Source ↗</a>
        </Reveal>
      </div>
      <Reveal show={p >= 4} className="card niq">
        <div className="niq-t">
          <small>NIQ · pet-food manufacturer</small>
          Pricing &amp; promotion analytics helped remove promotions that weren’t driving real uplift or incrementality, cutting wastage and avoiding portfolio cannibalization.{' '}
          <a href="https://nielseniq.com/global/en/insights/success-story/2021/pet-manufacturer-boost-roi-with-pricing-and-promotion-analytics/" target="_blank" rel="noreferrer">Source ↗</a>
        </div>
        <div className="niq-q">The best promotion isn’t the one with the highest uplift. <span className="grad">It’s the one that creates the most valuable incremental demand.</span></div>
      </Reveal>
    </Scene>
  )
}

/* ───────── 13 · FROM ANALYTICS TO ACTION ───────── */
const decisions = [
  { c: 'red', k: 'STOP', t: '20% discount on SKU A', d: 'High cannibalization.' },
  { c: 'amber', k: 'MODIFY', t: '15% discount on SKU B', d: 'Moderate incremental value.' },
  { c: 'green', k: 'SCALE', t: '10% discount on SKU C', d: 'High incrementality + strong margin.' },
]

export function Action() {
  const { ref, active, phase: p } = useScene([900, 2800, 4800])
  return (
    <Scene ref={ref} id="action" label="Analytics to Action" active={active}>
      <Title eyebrow="Monday morning · Revenue Growth Manager" show={active}>
        You open <span className="grad">TrueLift</span>.
      </Title>
      <div className="clutter">
        {['47 charts', '13 Excel sheets', '8 dashboards'].map((t, i) => (
          <Reveal key={t} show={p >= 1 && p < 2} delay={i * 0.12} className={`clut ${p >= 2 ? 'gone' : ''}`}>{t}</Reveal>
        ))}
        <Reveal show={p >= 1} className="not-this">You don’t get this.</Reveal>
      </div>
      <Reveal show={p >= 2} className="center narr"><b>You get 3 decisions.</b></Reveal>
      <div className="cards3 dec">
        {decisions.map((d, i) => (
          <Reveal key={d.k} show={p >= 2} delay={0.3 + i * 0.25} y={50} className={`card decision ${d.c}`}>
            <span className={`pill ${d.c}`}>{d.k}</span>
            <h3>{d.t}</h3>
            <p>{d.d}</p>
          </Reveal>
        ))}
      </div>
      <Reveal show={p >= 3} className="center quote-card">
        <p>From reporting <span className="strike">what happened</span> → <span className="grad">recommending what to do.</span></p>
      </Reveal>
    </Scene>
  )
}

/* ───────── 14 · BUSINESS IMPACT ───────── */
const chain = ['Promotion ROI', 'Incremental revenue', 'Incremental margin', 'Trade-spend efficiency', 'Speed of promotion planning']

export function Impact() {
  const { ref, active, phase: p } = useScene([800, 4600])
  return (
    <Scene ref={ref} id="impact" label="Business Impact" active={active}>
      <Title eyebrow="Business impact" show={active}>
        What <span className="grad">improves</span> when we measure what matters
      </Title>
      <div className="chain">
        {chain.map((c, i) => (
          <Reveal key={c} show={p >= 1} delay={i * 0.35} y={30} className="chain-item">
            <div className="chain-n">{i + 1}</div>
            <div className="chain-t">{c}</div>
            {i < chain.length - 1 && <span className="chain-arrow" style={{ animationDelay: `${i * 0.35}s` }}>→</span>}
          </Reveal>
        ))}
      </div>
      <Reveal show={p >= 2} className="center quote-card">
        <p>
          We don’t claim a percentage we haven’t validated.
          <br />
          <span className="grad">The prototype will quantify the opportunity using historical promotion data.</span>
        </p>
      </Reveal>
    </Scene>
  )
}

/* ───────── 15 · WHAT MAKES US DIFFERENT ───────── */
const compare = [
  ['Measures SKU uplift', 'Measures true incrementality'],
  ['Looks at the promoted SKU', 'Looks across the portfolio'],
  ['Descriptive', 'Predictive + prescriptive'],
  ['Post-promotion analysis', 'Pre-promotion simulation'],
  ['Maximizes sales uplift', 'Maximizes incremental value'],
  ['Static reports', 'Interactive decisions'],
]

export function Difference() {
  const { ref, active, phase: p } = useScene([700, 4200])
  return (
    <Scene ref={ref} id="difference" label="What Makes Us Different" active={active}>
      <Title eyebrow="What makes it different" show={active}>
        Traditional approach vs <span className="grad">TrueLift</span>
      </Title>
      <div className="compare">
        <div className="cmp-h"><span>Traditional approach</span><span className="grad">TrueLift</span></div>
        {compare.map(([a, b], i) => (
          <Reveal key={a} show={p >= 1} delay={i * 0.2} x={i % 2 ? 40 : -40} y={0} className="cmp-row">
            <span className="old">{a}</span>
            <span className="new">✓ {b}</span>
          </Reveal>
        ))}
      </div>
      <Reveal show={p >= 2} className="center quote-card">
        <p>
          “We don’t ask whether a promotion sold more.
          <br />
          <span className="grad">We ask whether it was worth promoting.</span>”
        </p>
      </Reveal>
    </Scene>
  )
}

/* ───────── 16 · ARCHITECTURE ───────── */
const arch = [
  { t: 'Data layer', n: ['Sales', 'Pricing', 'Promotions'] },
  { t: 'Feature engine', n: ['Features'] },
  { t: 'Models', n: ['Baseline model', 'SKU relationships'] },
  { t: 'Estimates', n: ['Counterfactual', 'Substitution'] },
  { t: 'Incrementality', n: ['Incrementality engine', 'Cannibalization score'] },
  { t: 'Optimization', n: ['Optimization engine'] },
  { t: 'Outputs', n: ['Promo simulator', 'Recommendation'] },
]

export function Architecture() {
  const { ref, active, phase: p } = useScene([600])
  return (
    <Scene ref={ref} id="architecture" label="Architecture" active={active}>
      <Title eyebrow="Only now, the architecture" show={active}>
        Simple enough to <span className="grad">explain</span>. Strong enough to <span className="grad">trust</span>.
      </Title>
      <div className="arch">
        {arch.map((col, i) => (
          <div key={col.t} className="arch-col-wrap">
            <Reveal show={p >= 1} delay={i * 0.25} y={30} className="arch-col">
              <div className="arch-t">{col.t}</div>
              {col.n.map((n) => (
                <div key={n} className="arch-node">{n}</div>
              ))}
            </Reveal>
            {i < arch.length - 1 && <span className="arch-arrow" style={{ animationDelay: `${i * 0.3}s` }}>→</span>}
          </div>
        ))}
      </div>
      <Reveal show={p >= 1} delay={2} className="center fine">
        The jury doesn’t need the model zoo yet. They need to see <b>why</b> the system works.
      </Reveal>
    </Scene>
  )
}

/* ───────── 17 · ROADMAP ───────── */
const phases = [
  { n: 'PHASE 1', t: 'Proof of Insight', c: 'cyan', s: ['Historical sales + promotions', 'Identify baseline', 'Detect cannibalization', 'Quantify incrementality'] },
  { n: 'PHASE 2', t: 'Decision Engine', c: 'violet', s: ['Simulate discount', 'Simulate duration', 'Compare SKUs', 'Recommend promotion'] },
  { n: 'PHASE 3', t: 'Enterprise Scale', c: 'green', s: ['Retailer-level optimization', 'Region-level optimization', 'Competitor signals', 'Automated promotion planning'] },
]

export function Roadmap() {
  const { ref, active, phase: p } = useScene([700, 2300, 3900])
  return (
    <Scene ref={ref} id="roadmap" label="Prototype Roadmap" active={active}>
      <Title eyebrow="Not just a cool visualization" show={active}>
        Our <span className="grad">prototype roadmap</span>
      </Title>
      <div className="road">
        <div className="road-line"><motion.i animate={{ width: `${Math.min(p, 3) * 33.4}%` }} transition={{ duration: 1.4, ease }} /></div>
        <div className="cards3">
          {phases.map((ph, i) => (
            <Reveal key={ph.n} show={p >= i + 1} y={40} className={`card phase ${ph.c}`}>
              <div className={`phase-n ${ph.c}`}>{ph.n}</div>
              <h3>{ph.t}</h3>
              <ul>
                {ph.s.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </Scene>
  )
}

/* ───────── 18 · FINALE ───────── */
const groups = [
  { k: 'Discounts', n: 22, color: '#ffb347', x: 8, y: 14 },
  { k: 'Cannibalization', n: 18, color: '#ff5470', x: 8, y: 80 },
  { k: 'Stockpiling', n: 12, color: '#8b6cff', x: 92, y: 14 },
  { k: 'Competitor switching', n: 10, color: '#22d3ee', x: 92, y: 80 },
  { k: 'True growth', n: 18, color: '#2ee59d', x: 50, y: 50 },
]
const dots = groups.flatMap((g, gi) => Array.from({ length: g.n }, (_, i) => ({ gi, i })))

function dotPos(d, idx, phase) {
  const startX = 40 + (idx % 10) * 2.2
  const startY = 30 + Math.floor(idx / 10) * 6
  if (phase < 2) return { left: `${startX}%`, top: `${startY}%` }
  const g = groups[d.gi]
  const jitterX = ((d.i * 37) % 11) - 5
  const jitterY = ((d.i * 53) % 9) - 4
  const scale = g.k === 'True growth' ? 0.5 : 1
  return { left: `${g.x + jitterX * scale * 0.9}%`, top: `${g.y + jitterY * scale * 1.2}%` }
}

export function Finale() {
  const { ref, active, phase: p } = useScene([1200, 3000, 6500, 9500, 12500])
  return (
    <Scene ref={ref} id="finale" label="The Finale" className="finale" active={active}>
      <div className="stage">
        <Reveal show={p >= 1 && p < 2} className="stage-title">₹100 million promotion spend</Reveal>
        {dots.map((d, idx) => {
          const pos = dotPos(d, idx, p)
          return (
            <motion.i
              key={idx}
              className="dot"
              style={{ background: p >= 2 ? groups[d.gi].color : '#cfd6ff', boxShadow: `0 0 10px ${p >= 2 ? groups[d.gi].color : '#8b6cff'}` }}
              initial={{ opacity: 0, left: pos.left, top: pos.top }}
              animate={{ opacity: p >= 1 ? 1 : 0, ...pos }}
              transition={{ duration: 1.6, delay: p >= 2 ? (idx % 12) * 0.08 : idx * 0.01, ease }}
            />
          )
        })}
        {groups.map((g) => (
          <Reveal key={g.k} show={p >= 3} className={`sink ${g.k === 'True growth' ? 'win' : ''}`} style={{ left: `${g.x}%`, top: `${g.y + (g.k === 'True growth' ? 16 : g.y < 50 ? -10 : 12)}%`, color: g.color }}>
            {g.k}
          </Reveal>
        ))}
      </div>
      <div className="center final-text">
        <Reveal show={p >= 4}><p className="fin-q">What if we stopped measuring promotions by how much they <span className="strike">sell</span>…</p></Reveal>
        <Reveal show={p >= 5}><p className="fin-q big">…and started measuring them by how much they <span className="grad">truly grow</span>?</p></Reveal>
        <Reveal show={p >= 5} delay={1.2}>
          <div className="final-logo">TRUE LIFT</div>
          <div className="final-sub">Turn promotion uplift into real growth.</div>
        </Reveal>
      </div>
    </Scene>
  )
}
