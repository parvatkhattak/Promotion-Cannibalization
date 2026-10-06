import { useEffect, useState } from 'react'
import { Hook, Shelf, Illusion, Sources, WhyNot, Reveal6 } from './scenes/Part1'
import { Thinks, Streams, Engine } from './scenes/Part2'
import { Simulator, Graph } from './scenes/Part3'
import { Evidence, Action, Impact, Difference, Architecture, Roadmap, Finale } from './scenes/Part4'

const scenes = [
  { id: 'hook', label: 'The Sale', C: Hook },
  { id: 'shelf', label: 'The Shelf', C: Shelf },
  { id: 'illusion', label: 'The Illusion', C: Illusion },
  { id: 'sources', label: 'Where Sales Come From', C: Sources },
  { id: 'whynot', label: 'Why Metrics Fail', C: WhyNot },
  { id: 'reveal', label: 'TrueLift', C: Reveal6 },
  { id: 'thinks', label: 'How It Thinks', C: Thinks },
  { id: 'streams', label: 'Uplift Decomposition', C: Streams },
  { id: 'engine', label: 'Intelligence Engine', C: Engine },
  { id: 'simulator', label: 'Live Simulator', C: Simulator },
  { id: 'graph', label: 'Portfolio Graph', C: Graph },
  { id: 'evidence', label: 'Real-world Evidence', C: Evidence },
  { id: 'action', label: 'Analytics to Action', C: Action },
  { id: 'impact', label: 'Business Impact', C: Impact },
  { id: 'difference', label: 'What Makes Us Different', C: Difference },
  { id: 'architecture', label: 'Architecture', C: Architecture },
  { id: 'roadmap', label: 'Prototype Roadmap', C: Roadmap },
  { id: 'finale', label: 'The Finale', C: Finale },
]

export default function App() {
  const [cur, setCur] = useState(0)
  const [progress, setProgress] = useState(0)

  const go = (i) => {
    const n = Math.max(0, Math.min(scenes.length - 1, i))
    document.getElementById(scenes[n].id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // which scene is in the middle of the viewport
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setCur(scenes.findIndex((s) => s.id === e.target.id))
        }),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    scenes.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      setProgress(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight))
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  // presenter keyboard controls (ArrowRight / ArrowLeft for next/prev)
  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.key === 'ArrowRight') {
        go(cur + 1)
      } else if (e.key === 'ArrowLeft') {
        go(cur - 1)
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  })

  return (
    <>
      <div className="bg" aria-hidden="true">
        <div className="grid-bg" />
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />
      </div>
      <div className="progress" style={{ transform: `scaleX(${progress})` }} />
      <div className="brand" onClick={() => go(0)}>
        TRUE<span>LIFT</span>
      </div>
      <div className="counter">
        <b>{String(cur + 1).padStart(2, '0')}</b> / {scenes.length} · {scenes[cur].label}
      </div>
      <nav className="dots-nav" aria-label="Story navigation">
        {scenes.map((s, i) => (
          <button key={s.id} className={i === cur ? 'on' : ''} onClick={() => go(i)} aria-label={s.label} title={s.label} />
        ))}
      </nav>
      <main>
        {scenes.map(({ id, C }) => (
          <C key={id} />
        ))}
      </main>
    </>
  )
}
