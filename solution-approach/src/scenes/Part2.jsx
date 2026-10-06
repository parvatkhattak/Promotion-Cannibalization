import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Scene, Reveal, Num, Title, Tag, ease, useScene } from '../ui'

/* ───────── 7 · HOW TRUELIFT THINKS ───────── */
const inputs = ['Sales', 'Price', 'Discount', 'Promotion type', 'SKU', 'Retailer', 'Region', 'Calendar / seasonality', 'Competitor signals']
const base = [10200, 10400, 10300, 10600, 10500, 10500, 10600, 10400, 10500, 10600, 10400, 10500]
const actual = base.map((v, i) => (i === 4 ? 13800 : i === 5 ? 15000 : i === 6 ? 14600 : i === 7 ? 12400 : v))
const X = (i) => 30 + (i * 580) / 11
const Y = (v) => 240 - ((v - 8000) / 8000) * 200
const line = (arr) => arr.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ')

function gapPath() {
  const idx = [3, 4, 5, 6, 7, 8]
  const top = idx.map((i, k) => `${k ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(actual[i]).toFixed(1)}`).join(' ')
  const bottom = [...idx].reverse().map((i) => `L${X(i).toFixed(1)} ${Y(base[i]).toFixed(1)}`).join(' ')
  return `${top} ${bottom} Z`
}

export function Thinks() {
  const { ref, active, phase: p } = useScene([900, 3000, 5200, 7000])
  return (
    <Scene ref={ref} id="thinks" label="How It Thinks" active={active}>
      <Title eyebrow="How TrueLift thinks" show={active}>
        Follow one promotion, <span className="grad">step by step</span>.
      </Title>
      <div className="step-h"><b>01</b> Understand the promotion</div>
      <div className="chips">
        {inputs.map((c, i) => (
          <motion.span
            key={c}
            className="chip-in"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={p >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.8 }}
            transition={{ delay: i * 0.07, duration: 0.5, ease }}
          >
            {c}
          </motion.span>
        ))}
      </div>
      <div className="step-h"><b>02</b> Build the counterfactual</div>
      <Reveal show={p >= 2} className="center narr tight">
        “What would have happened if this promotion <b>had never happened</b>?”
      </Reveal>
      <div className="two cf">
        <Reveal show={p >= 2} className="card chart-card">
          <svg viewBox="0 0 640 270" className="svg-chart" role="img" aria-label="Actual versus baseline sales">
            {[0, 1, 2, 3].map((g) => (
              <line key={g} x1="30" x2="610" y1={40 + g * 66} y2={40 + g * 66} className="gridline" />
            ))}
            <motion.path d={gapPath()} className="gap-area" initial={{ opacity: 0 }} animate={{ opacity: p >= 4 ? 1 : 0 }} transition={{ duration: 1 }} />
            <motion.path d={line(base)} className="line-base" initial={{ pathLength: 0 }} animate={{ pathLength: p >= 3 ? 1 : 0 }} transition={{ duration: 1.8, ease: 'easeInOut' }} />
            <motion.path d={line(actual)} className="line-act" initial={{ pathLength: 0 }} animate={{ pathLength: p >= 2 ? 1 : 0 }} transition={{ duration: 1.8, ease: 'easeInOut' }} />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: p >= 4 ? 1 : 0 }}>
              <text x={X(5.5)} y={Y(15400)} textAnchor="middle" className="svg-note green">+4,500 uplift</text>
            </motion.g>
            <text x="30" y="262" className="svg-axis">Week 1</text>
            <text x="560" y="262" className="svg-axis">Week 12</text>
          </svg>
          <div className="legend"><span className="lg act" />Actual sales <span className="lg base" />Predicted baseline (no promotion)</div>
        </Reveal>
        <div className="stack">
          <Reveal show={p >= 2} x={40} className="card universe a">
            <small>Universe A · promotion happened</small>
            <b>Sales = <Num to={15000} run={p >= 2} /></b>
          </Reveal>
          <Reveal show={p >= 3} x={40} className="card universe b">
            <small>Universe B · promotion didn’t happen</small>
            <b>Predicted = <Num to={10500} run={p >= 3} /></b>
          </Reveal>
          <Reveal show={p >= 4} x={40} className="card universe c">
            <small>Observed uplift</small>
            <b className="green"><Num to={4500} run={p >= 4} sign /></b>
          </Reveal>
        </div>
      </div>
    </Scene>
  )
}

/* ───────── 8 · WHERE THE UPLIFT CAME FROM ───────── */
const streams = [
  { t: 'New category demand', v: 1500, c: 'green', y: 50 },
  { t: 'Competitor switching', v: 1000, c: 'green', y: 150 },
  { t: 'Own-portfolio cannibalization', v: -1700, c: 'red', y: 250 },
  { t: 'Pull-forward effect', v: -300, c: 'amber', y: 350 },
]
const COLORS = { green: '#2ee59d', red: '#ff5470', amber: '#ffb347' }

export function Streams() {
  const { ref, active, phase: p } = useScene([1200, 3200, 6800])
  return (
    <Scene ref={ref} id="streams" label="Uplift Decomposition" active={active}>
      <Title eyebrow="Detect where the uplift came from" show={active}>
        One uplift. <span className="grad">Four very different stories.</span>
      </Title>
      <Tag>Illustrative numbers</Tag>
      <div className="flow">
        <Reveal show={active} className="flow-src">
          <div className="src-orb">
            <b>
              <Num to={4500} sign />
            </b>
            <small>promotion uplift</small>
          </div>
        </Reveal>
        <svg className="flow-svg" viewBox="0 0 300 400" width="300" height="400" aria-hidden="true">
          {streams.map((s, i) => (
            <g key={s.t}>
              <motion.path
                id={`stream-${i}`}
                d={`M0 200 C 150 200, 150 ${s.y}, 300 ${s.y}`}
                fill="none"
                stroke={COLORS[s.c]}
                strokeWidth={Math.max(3, Math.abs(s.v) / 140)}
                strokeLinecap="round"
                strokeOpacity="0.55"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: p >= 1 ? 1 : 0 }}
                transition={{ duration: 1.4, delay: i * 0.25, ease: 'easeInOut' }}
              />
              {p >= 1 &&
                [0, 1, 2, 3, 4].map((k) => (
                  <circle key={k} r="4.5" fill={COLORS[s.c]}>
                    <animateMotion dur="3s" begin={`${1.2 + i * 0.25 + k * 0.6}s`} repeatCount="indefinite">
                      <mpath href={`#stream-${i}`} />
                    </animateMotion>
                  </circle>
                ))}
            </g>
          ))}
        </svg>
        <div className="flow-dst">
          {streams.map((s, i) => (
            <Reveal key={s.t} show={p >= 1} delay={0.6 + i * 0.25} x={40} y={0} className={`dst ${s.c}`}>
              <div className="dst-in">
                <b>
                  <Num to={s.v} run={p >= 1} sign />
                </b>
                <span>{s.t}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal show={p >= 3} className="center result">
        <small>True incremental value</small>
        <b>
          <Num to={500} run={p >= 3} sign />
        </b>
        <span>units, not 4,500</span>
      </Reveal>
    </Scene>
  )
}

/* ───────── 9 · INTELLIGENCE ENGINE ───────── */
const layers = [
  { n: '01', t: 'Baseline Engine', d: 'Predicts expected sales without promotion.', tech: ['Time-series forecasting', 'Gradient boosting', 'Hierarchical forecasting'] },
  { n: '02', t: 'Substitution Engine', d: 'Finds how SKUs relate: 1L Cola ↔ 750ml Cola, Premium ↔ Regular Shampoo, Family ↔ Single Pack.', tech: ['Cross-price elasticity', 'SKU similarity', 'Substitution graphs'] },
  { n: '03', t: 'Incrementality Engine', d: 'Estimates what actually changed because of the promotion.', tech: ['Causal inference', 'Uplift modeling', 'Difference-in-differences', 'Double ML'] },
  { n: '04', t: 'Decision Engine', d: 'Goes beyond “18% cannibalization” to “what should we do next?”', tech: ['Optimization', 'Simulation', 'Recommendations'] },
]

export function Engine() {
  const { ref, active } = useScene()
  const [hi, setHi] = useState(0)
  useEffect(() => {
    if (!active) return undefined
    const id = setInterval(() => setHi((h) => (h + 1) % layers.length), 2600)
    return () => clearInterval(id)
  }, [active])
  return (
    <Scene ref={ref} id="engine" label="Intelligence Engine" active={active}>
      <Title eyebrow="Under the hood" show={active}>
        The <span className="grad">Promotion Intelligence Engine</span>
      </Title>
      <div className="cards4 layers">
        {layers.map((l, i) => (
          <Reveal key={l.n} show={active} delay={0.2 + i * 0.15} className={`card layer ${hi === i ? 'on' : ''}`}>
            <div className="layer-n">{l.n}</div>
            <h3>{l.t}</h3>
            <p>{l.d}</p>
            <div className="techs">
              {l.tech.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
      <div className="pipe"><motion.span animate={active ? { left: ['0%', '100%'] } : {}} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} /></div>
      <Reveal show={active} delay={0.8} className="center fine">
        Recent research applies double machine learning to identify causal spillovers (cannibalization and complementarity) between promoted and non-promoted products.{' '}
        <a href="https://www.sciencedirect.com/science/article/abs/pii/S0306457326001445" target="_blank" rel="noreferrer">Source ↗</a>
      </Reveal>
    </Scene>
  )
}
