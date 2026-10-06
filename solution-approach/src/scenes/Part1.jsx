import { AnimatePresence, motion } from 'framer-motion'
import { Scene, Reveal, Num, Title, Tag, ease, useScene } from '../ui'

/* ───────── 1 · THE HOOK ───────── */
function SkuCard({ name, p0, p1, s0, s1, pct, up, run, delay = 0 }) {
  return (
    <motion.div
      className={`card sku ${up ? 'up' : 'down'}`}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, ease }}
    >
      <div className="sku-name">{name}</div>
      <div className="sku-line">
        <span>Price</span>
        <b>
          {p0 === p1 ? `₹${p0}` : (
            <>
              ₹{p0} <i>→</i> ₹<Num to={p1} from={p0} run={run} duration={1200} />
            </>
          )}
        </b>
      </div>
      <div className="sku-line">
        <span>Sales</span>
        <b>
          <Num to={s1} from={s0} run={run} duration={1800} />
        </b>
      </div>
      <div className="sku-from">was {s0.toLocaleString('en-IN')}</div>
      <motion.div
        className="sku-badge"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 1.2, type: 'spring', stiffness: 260, damping: 14 }}
      >
        {up ? '+' : '−'}
        {pct}% {up ? 'SALES' : ''}
      </motion.div>
    </motion.div>
  )
}

export function Hook() {
  const { ref, active, phase: p } = useScene([2000, 4600, 8200, 10800])
  return (
    <Scene ref={ref} id="hook" label="The Sale" className="hook" active={active}>
      <AnimatePresence mode="wait">
        {p < 2 && (
          <motion.div key="t" className="center" exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }} transition={{ duration: 0.6 }}>
            <Reveal show={active}>
              <h1 className="mega">A promotion worked.</h1>
            </Reveal>
            <Reveal show={p >= 1} y={40}>
              <h1 className="mega grad">Or did it?</h1>
            </Reveal>
          </motion.div>
        )}
        {p >= 2 && (
          <motion.div key="c" className="center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <div className="cards3">
              <SkuCard name="SKU A" p0={100} p1={80} s0={10000} s1={15000} pct={50} up run={p >= 2} />
              {p >= 3 && <SkuCard name="SKU B" p0={100} p1={100} s0={8000} s1={5000} pct={37} run={p >= 3} />}
              {p >= 3 && <SkuCard name="SKU C" p0={100} p1={100} s0={6000} s1={4500} pct={25} run={p >= 3} delay={0.25} />}
            </div>
            <Reveal show={p >= 4} className="hook-end">
              <div className="wait">Wait.</div>
              <h2 className="title big">
                We didn’t necessarily create <span className="gold">₹5M</span> of new demand.
                <br />
                <span className="grad">We may have simply moved it.</span>
              </h2>
            </Reveal>
            <Tag>Illustrative example</Tag>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="scroll-hint">scroll or press → to begin the story</div>
    </Scene>
  )
}

/* ───────── 2 · THE SHELF ───────── */
const packs = [
  { n: '500ml Pack', price: 70, h: 120, k: 'p500' },
  { n: '750ml Pack', price: 100, h: 155, k: 'p750' },
  { n: '1L Family Pack', price: 120, h: 195, k: 'p1l' },
]

export function Shelf() {
  const { ref, active, phase: p } = useScene([1800, 4200, 7000])
  return (
    <Scene ref={ref} id="shelf" label="The Shelf" active={active}>
      <Title eyebrow="A simple story" show={active}>
        A family wants a <span className="grad">soft drink</span>.
      </Title>
      <div className="shelf">
        {packs.map((k, i) => {
          const promo = k.k === 'p1l'
          return (
            <Reveal key={k.n} show={active} delay={0.2 + i * 0.15} className="slot">
              <div className="bottle-wrap">
                <motion.div
                  className={`bottle ${k.k}`}
                  style={{ height: k.h }}
                  animate={promo && p >= 2 ? { scale: [1, 1.08, 1.04] } : { scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="cap" />
                  <div className="lbl">COLA</div>
                </motion.div>
                {promo && p >= 1 && (
                  <motion.div className="promo-burst" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: -12 }} transition={{ type: 'spring', stiffness: 220, damping: 12 }}>
                    PROMO
                  </motion.div>
                )}
              </div>
              <div className="shelf-name">{k.n}</div>
              <div className="price">
                {promo && p >= 1 ? (
                  <>
                    <s>₹120</s> <b className="green">₹90</b>
                  </>
                ) : (
                  <b>₹{k.price}</b>
                )}
              </div>
              <div className="delta-slot">
                {p >= 3 && promo && <span className="delta up">▲ 1L sales up</span>}
                {p >= 3 && k.k === 'p750' && <span className="delta down">▼ 750ml sales down</span>}
              </div>
            </Reveal>
          )
        })}
      </div>
      <Reveal show={p >= 2} className="center narr">
        A shopper who was <b>already planning to buy the brand</b> now grabs the promoted 1L pack.
      </Reveal>
      <Reveal show={p >= 3} className="center quote-card" delay={0.4}>
        <p>
          “The customer changed the SKU.
          <br />
          <span className="grad">Did the business gain a customer?</span>”
        </p>
      </Reveal>
    </Scene>
  )
}

/* ───────── 3 · THE ILLUSION ───────── */
const rows = [
  ['Promoted SKU', 10000, 15000],
  ['Other Brand SKUs', 20000, 17000],
  ['Total Brand', 30000, 32000],
]

export function Illusion() {
  const { ref, active, phase: p } = useScene([1500, 3600, 6200])
  return (
    <Scene ref={ref} id="illusion" label="The Illusion" active={active}>
      <Title eyebrow="The illusion" show={active}>
        +5,000 units. <span className="grad">+50% uplift.</span> Great, right?
      </Title>
      <Tag>Illustrative example</Tag>
      <div className="two">
        <Reveal show={active} delay={0.2} className="card table-card">
          <table className="tbl">
            <thead>
              <tr>
                <th />
                <th>Before</th>
                <th>During promo</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([n, a, b], i) => (
                <tr key={n} className={i === 2 ? 'total' : ''}>
                  <td>{n}</td>
                  <td>{a.toLocaleString('en-IN')}</td>
                  <td>
                    <Num to={b} from={a} />
                  </td>
                  <td className={b - a >= 0 ? 'green' : 'red'}>
                    {b - a >= 0 ? '+' : '−'}
                    {Math.abs(b - a).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <div className="stack">
          <Reveal show={p >= 1} x={40} className="card lens dash">
            <div className="lens-h">📊 What the marketing dashboard sees</div>
            <div className="lens-v green">
              +5,000 <small>promoted SKU</small>
            </div>
            <div className="chip green">+50% uplift · “Success”</div>
          </Reveal>
          <Reveal show={p >= 2} x={40} className="card lens engine">
            <div className="lens-h">🧠 What our engine sees</div>
            <div className="lens-v">
              <span className="green">+5,000</span> promoted · <span className="red">−3,000</span> other SKUs
            </div>
            <div className="chip gold">True brand incrementality ≈ +2,000</div>
          </Reveal>
        </div>
      </div>
      <Reveal show={p >= 3} className="split-wrap">
        <div className="split-label">5,000 extra units, where did they come from?</div>
        <div className="split">
          <motion.div className="seg red" initial={{ width: 0 }} animate={{ width: p >= 3 ? '60%' : 0 }} transition={{ duration: 1.2, ease }}>
            <span>3,000 stolen from our own portfolio</span>
          </motion.div>
          <motion.div className="seg green" initial={{ width: 0 }} animate={{ width: p >= 3 ? '40%' : 0 }} transition={{ duration: 1.2, delay: 0.3, ease }}>
            <span>2,000 truly incremental</span>
          </motion.div>
        </div>
        <p className="narr center">
          5,000 extra units were sold. <b className="gold">Only 2,000 were truly incremental to the brand.</b>
        </p>
      </Reveal>
    </Scene>
  )
}

/* ───────── 4 · WHERE DID IT COME FROM ───────── */
const sources = [
  { i: '🌱', t: 'New category demand', d: 'People who weren’t buying the category at all.', c: 'green', tag: 'Incremental' },
  { i: '⚔️', t: 'Competitor switching', d: 'Shoppers pulled over from rival brands.', c: 'green', tag: 'Incremental' },
  { i: '🔁', t: 'Own-SKU switching', d: 'Shoppers moving between our own products.', c: 'red', tag: 'Cannibalization' },
  { i: '📦', t: 'Stockpiling / pull-forward', d: 'Future purchases bought early at the discount.', c: 'amber', tag: 'Borrowed demand' },
]

export function Sources() {
  const { ref, active, phase: p } = useScene([1200, 3600])
  return (
    <Scene ref={ref} id="sources" label="Where Sales Come From" active={active}>
      <Title eyebrow="The real question" show={active}>
        Not “how much did it sell?”
        <br />
        <span className="grad">“Where did those sales come from?”</span>
      </Title>
      <div className="orb-center">
        <motion.div className="uplift-orb" animate={active ? { scale: [1, 1.06, 1] } : {}} transition={{ repeat: Infinity, duration: 3 }}>
          Promotion
          <br />
          uplift
        </motion.div>
      </div>
      <div className="cards4">
        {sources.map((s, i) => (
          <Reveal key={s.t} show={p >= 1} delay={i * 0.18} className={`card source ${s.c}`}>
            <div className="src-i">{s.i}</div>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
            <span className={`pill ${s.c}`}>{s.tag}</span>
          </Reveal>
        ))}
      </div>
      <Reveal show={p >= 2} className="center neq">
        Promotion Uplift <span className="neq-sign">≠</span> <span className="grad">Incremental Value</span>
      </Reveal>
      <Reveal show={p >= 2} className="center fine">
        Retail research confirms sales spikes arise from higher quantity, purchase acceleration/stockpiling, and switching between brands, stores, categories or SKUs of the same brand.{' '}
        <a href="https://doi.org/10.1016/j.jretconser.2019.101982" target="_blank" rel="noreferrer">Source ↗</a>
      </Reveal>
    </Scene>
  )
}

/* ───────── 5 · WHY CAN'T WE JUST CALCULATE IT ───────── */
const missing = [
  ['📉', 'Baseline demand', 'What would have happened without the promotion?'],
  ['🔀', 'SKU substitution', 'Did another SKU lose sales?'],
  ['🏷️', 'Price elasticity', 'How sensitive are shoppers to the discount?'],
  ['⏳', 'Promotion timing', 'Did shoppers pull future purchases into this week?'],
  ['🏬', 'Retailer / channel effects', 'Does cannibalization differ by store or channel?'],
]

export function WhyNot() {
  const { ref, active, phase: p } = useScene([1400, 3200, 6200])
  return (
    <Scene ref={ref} id="whynot" label="Why Metrics Fail" active={active}>
      <Title eyebrow="Why can’t we just calculate it?" show={active}>
        The dashboard says <span className="green">success</span>.
      </Title>
      <div className="dash-wrap">
        <Reveal show={active} delay={0.2} className="card dash-card">
          <div className="dash-top">
            <span>Traditional dashboard</span>
            <span className="dots"><i /><i /><i /></span>
          </div>
          <div className="dash-name">Promotion A</div>
          <div className="dash-grid">
            <div><small>Sales uplift</small><b className="green">+32%</b></div>
            <div><small>ROI</small><b className="green">2.4x</b></div>
            <div><small>Status</small><b className="status">🟢 SUCCESS</b></div>
          </div>
          <motion.div className="qmark" initial={{ opacity: 0, scale: 3 }} animate={p >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 3 }} transition={{ duration: 0.7, ease }}>
            ?
          </motion.div>
        </Reveal>
        <div className="missing">
          <Reveal show={p >= 1} className="missing-h">What’s missing?</Reveal>
          {missing.map(([i, t, d], k) => (
            <Reveal key={t} show={p >= 2} delay={k * 0.15} x={40} y={0} className="miss">
              <span>{i}</span>
              <div>
                <b>{t}</b>
                <small>{d}</small>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal show={p >= 3} className="center quote-card">
        <p>
          The problem isn’t lack of data.
          <br />
          <span className="grad">It’s lack of a connected view of the data.</span>
        </p>
      </Reveal>
    </Scene>
  )
}

/* ───────── 6 · THE REVEAL ───────── */
export function Reveal6() {
  const { ref, active, phase: p } = useScene([700, 2400])
  const letters = 'TRUE LIFT'.split('')
  return (
    <Scene ref={ref} id="reveal" label="TrueLift" className="reveal-scene" active={active}>
      <div className="center">
        <Reveal show={active} className="eyebrow">Introducing</Reveal>
        <div className="rings">
          {[0, 1, 2].map((r) => (
            <motion.span key={r} className="ring" animate={active ? { scale: [0.4, 2.2], opacity: [0.5, 0] } : { opacity: 0 }} transition={{ repeat: Infinity, duration: 4, delay: r * 1.3, ease: 'easeOut' }} />
          ))}
          <h1 className="logo-word">
            {letters.map((l, i) => (
              <motion.span
                key={i}
                className={l === ' ' ? 'sp' : ''}
                initial={{ opacity: 0, y: 60, rotateX: -90 }}
                animate={p >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 60, rotateX: -90 }}
                transition={{ delay: i * 0.08, duration: 0.7, ease }}
              >
                {l === ' ' ? '\u00a0' : l}
              </motion.span>
            ))}
          </h1>
        </div>
        <Reveal show={p >= 2} className="tagline">
          From promotion <span className="strike">uplift</span> to <span className="grad">true incremental growth.</span>
        </Reveal>
      </div>
    </Scene>
  )
}
