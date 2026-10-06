import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Scene, Reveal, Title, Tag, useScene } from '../ui'
import { SKUS, RETAILERS, REGIONS, evaluate, recommend, lakh } from '../model'

/* ───────── 10 · THE SIMULATOR ───────── */
function Tween({ value, dec = 0, prefix = '', suffix = '', sign = false }) {
  const [v, setV] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    const from = prev.current
    const t0 = performance.now()
    let raf
    const tick = (t) => {
      const p = Math.min((t - t0) / 700, 1)
      setV(from + (value - from) * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
      else prev.current = value
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      prev.current = value
    }
  }, [value])
  return (
    <span className="num">
      {sign && v > 0 ? '+' : ''}
      {prefix}
      {v.toFixed(dec)}
      {suffix}
    </span>
  )
}

function Meter({ label, value, max = 45, tone }) {
  return (
    <div className="meter">
      <div className="meter-h">
        <span>{label}</span>
        <b className={tone}>
          <Tween value={value} dec={1} suffix="%" sign={tone === 'green'} />
        </b>
      </div>
      <div className="meter-t">
        <motion.i className={tone} animate={{ width: `${Math.min(100, (value / max) * 100)}%` }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }} />
      </div>
    </div>
  )
}

function Plan({ title, badge, d, e, rec, delta }) {
  return (
    <motion.div className={`card plan ${rec ? 'rec' : ''}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="plan-h">
        <span>{title}</span>
        <em>{badge}</em>
      </div>
      <div className="plan-d">
        <Tween value={d} suffix="%" /> <small>discount</small>
      </div>
      <Meter label="Expected sales uplift" value={e.uplift} tone="cyan" />
      <Meter label="Cannibalization" value={e.cannib} tone="red" />
      <Meter label="Net incremental sales" value={e.incr} tone="green" />
      <div className="plan-m">
        <small>Incremental margin</small>
        <b>{lakh(e.margin)}</b>
        {delta !== undefined && (
          <span className={delta >= 0 ? 'green' : 'red'}>
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(0)}% vs current plan
          </span>
        )}
      </div>
    </motion.div>
  )
}

export function Simulator() {
  const { ref, active } = useScene()
  const [f, setF] = useState({ sku: '1l', d: 20, days: 7, ret: 'mt', reg: 's' })
  const [state, setState] = useState('idle') // idle | scanning | done
  const set = (k) => (ev) => setF((o) => ({ ...o, [k]: ev.target.type === 'range' ? +ev.target.value : ev.target.value }))

  const run = () => {
    setState('scanning')
    setTimeout(() => setState('done'), 1400)
  }
  const cur = evaluate(f)
  const rec = recommend(f)
  const delta = cur.margin > 0 ? ((rec.margin - cur.margin) / cur.margin) * 100 : 100

  return (
    <Scene ref={ref} id="simulator" label="Live Simulator" className="sim-scene" active={active}>
      <Title eyebrow="Try it live" show={active}>
        What if we <span className="grad">change the promotion</span>?
      </Title>
      <Tag>Synthetic demo model · illustrative numbers</Tag>
      <div className="sim">
        <Reveal show={active} delay={0.2} className="card controls">
          <label>
            Select SKU
            <select value={f.sku} onChange={set('sku')}>
              {SKUS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="lab-row">Discount <b>{f.d}%</b></span>
            <input type="range" min="5" max="30" value={f.d} onChange={set('d')} />
            <span className="range-ends"><i>5%</i><i>30%</i></span>
          </label>
          <label>
            <span className="lab-row">Duration <b>{f.days} days</b></span>
            <input type="range" min="3" max="21" value={f.days} onChange={set('days')} />
          </label>
          <label>
            Retailer
            <select value={f.ret} onChange={set('ret')}>
              {RETAILERS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          <label>
            Region
            <select value={f.reg} onChange={set('reg')}>
              {REGIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          <button className="cta" onClick={run} disabled={state === 'scanning'}>
            {state === 'scanning' ? 'Simulating…' : state === 'done' ? '↻ Re-simulate' : 'SIMULATE PROMOTION'}
          </button>
        </Reveal>
        <div className="sim-out">
          <AnimatePresence mode="wait">
            {state === 'idle' && (
              <motion.div key="i" className="card sim-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="pulse-ring" />
                <p>Pick a SKU, set the discount, and press <b>Simulate</b>.</p>
              </motion.div>
            )}
            {state === 'scanning' && (
              <motion.div key="s" className="card sim-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="scanner"><span /><span /><span /><span /><span /></div>
                <p>Building counterfactual · scoring cannibalization · searching discount depths…</p>
              </motion.div>
            )}
            {state === 'done' && (
              <motion.div key="d" className="plans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Plan title="Current plan" badge="what you planned" d={f.d} e={cur} />
                <Plan title="Recommended plan" badge="TrueLift" d={rec.d} e={rec} rec delta={delta} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Reveal show={state === 'done'} className="center quote-card">
        <p>
          “Don’t maximize sales uplift. <span className="grad">Maximize incremental value.</span>”
        </p>
      </Reveal>
    </Scene>
  )
}

/* ───────── 11 · SKU RELATIONSHIP GRAPH ───────── */
const nodes = {
  '500': { x: 110, y: 90, n: '500ml' },
  prem: { x: 490, y: 90, n: 'Premium 750ml' },
  '1l': { x: 300, y: 215, n: '1L' },
  '750': { x: 110, y: 340, n: '750ml' },
  '2l': { x: 490, y: 340, n: '2L' },
}
const risk = {
  '1l': { '750': 'HIGH', '500': 'MEDIUM', prem: 'LOW', '2l': 'LOW' },
  '750': { '1l': 'HIGH', '500': 'HIGH', prem: 'MEDIUM', '2l': 'LOW' },
  '500': { '750': 'HIGH', '1l': 'MEDIUM', prem: 'LOW', '2l': 'LOW' },
  prem: { '750': 'MEDIUM', '1l': 'LOW', '500': 'LOW', '2l': 'LOW' },
  '2l': { '1l': 'MEDIUM', '750': 'LOW', '500': 'LOW', prem: 'LOW' },
}
const RC = { HIGH: '#ff5470', MEDIUM: '#ffb347', LOW: '#2ee59d' }
const names = { '500': '500ml', '750': '750ml', '1l': '1L', '2l': '2L', prem: 'Premium 750ml' }

export function Graph() {
  const { ref, active } = useScene()
  const [sel, setSel] = useState('1l')
  const r = risk[sel]
  return (
    <Scene ref={ref} id="graph" label="Portfolio Graph" active={active}>
      <Title eyebrow="Model the portfolio, not the SKU" show={active}>
        Promote one pack. <span className="grad">Watch the others light up.</span>
      </Title>
      <div className="two graph">
        <Reveal show={active} delay={0.2} className="card graph-card">
          <svg viewBox="0 0 600 430" className="svg-graph">
            {Object.keys(nodes).flatMap((a) =>
              Object.keys(nodes)
                .filter((b) => a < b)
                .map((b) => {
                  const lvl = a === sel ? r[b] : b === sel ? r[a] : null
                  return (
                    <line
                      key={a + b}
                      x1={nodes[a].x}
                      y1={nodes[a].y}
                      x2={nodes[b].x}
                      y2={nodes[b].y}
                      className={lvl ? 'edge on' : 'edge'}
                      stroke={lvl ? RC[lvl] : undefined}
                      strokeWidth={lvl === 'HIGH' ? 6 : lvl === 'MEDIUM' ? 4 : lvl ? 2.5 : 1.5}
                    />
                  )
                }),
            )}
            {Object.entries(nodes).map(([id, n]) => {
              const lvl = id === sel ? null : r[id]
              const color = id === sel ? '#8b6cff' : RC[lvl]
              return (
                <g key={id} className="node" onClick={() => setSel(id)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setSel(id)}>
                  {id !== sel && <circle cx={n.x} cy={n.y} r="44" fill={color} opacity="0.18" className="halo" />}
                  {id === sel && <circle cx={n.x} cy={n.y} r="44" fill="none" stroke="#8b6cff" strokeWidth="2" className="sel-ring" />}
                  <circle cx={n.x} cy={n.y} r="34" fill="#0d1226" stroke={color} strokeWidth="3" />
                  <text x={n.x} y={n.y + 5} textAnchor="middle" className="node-t">{n.n.replace('Premium ', 'Prem. ')}</text>
                </g>
              )
            })}
          </svg>
          <div className="hint">Click any pack to promote it</div>
        </Reveal>
        <Reveal show={active} delay={0.4} x={40} className="card risk-card">
          <small>Promoting</small>
          <h3 className="grad">{names[sel]}</h3>
          <div className="risk-h">Cannibalization risk</div>
          {Object.entries(r)
            .sort((a, b) => ['HIGH', 'MEDIUM', 'LOW'].indexOf(a[1]) - ['HIGH', 'MEDIUM', 'LOW'].indexOf(b[1]))
            .map(([id, lvl]) => (
              <motion.div layout key={id} className="risk-row" transition={{ duration: 0.4 }}>
                <span>{names[id]}</span>
                <b className={`pill ${lvl === 'HIGH' ? 'red' : lvl === 'MEDIUM' ? 'amber' : 'green'}`}>{lvl}</b>
              </motion.div>
            ))}
        </Reveal>
      </div>
      <Reveal show={active} delay={0.6} className="center fine">
        We aren’t treating each SKU independently, we’re modelling the <b>portfolio</b>. Illustrative relationships.
      </Reveal>
    </Scene>
  )
}
