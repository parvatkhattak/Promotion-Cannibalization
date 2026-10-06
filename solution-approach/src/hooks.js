import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/** True while a scene is on screen. */
export const SceneCtx = createContext(true)
export const useActive = () => useContext(SceneCtx)

/**
 * Hook for managing a story scene.
 * Returns { ref, active, phase } where:
 * - ref: attach to <Scene ref={ref}>
 * - active: boolean indicating whether the scene is currently in viewport
 * - phase: sequenced step index (starts at 0 when entered, advances through times)
 */
export function useScene(times = []) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.15 })
  const [phase, setPhase] = useState(0)
  const key = times.join(',')

  useEffect(() => {
    if (!inView) {
      setPhase(0)
      return undefined
    }
    // Scene entered viewport
    const ts = times.map((t, i) => setTimeout(() => setPhase(i + 1), t))
    return () => ts.forEach(clearTimeout)
  }, [inView, key])

  return { ref, active: inView, phase }
}

/** Eased count-up from `from` to `to` whenever `run` is true. */
export function useCountUp(to, { from = 0, run = true, duration = 1400 } = {}) {
  const [v, setV] = useState(from)
  useEffect(() => {
    if (!run) {
      setV(from)
      return undefined
    }
    let raf
    const t0 = performance.now()
    const tick = (t) => {
      const p = Math.min((t - t0) / duration, 1)
      setV(from + (to - from) * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, from, run, duration])
  return v
}
