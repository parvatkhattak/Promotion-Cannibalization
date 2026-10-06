import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { SceneCtx, useActive, useCountUp, useScene } from './hooks'

export { useScene }
export const fmt = (n) => Math.round(n).toLocaleString('en-IN')
export const ease = [0.2, 0.8, 0.2, 1]

/** Full-screen story scene. Tracks visibility and passes ref */
export const Scene = forwardRef(function Scene({ id, label, className = '', active = true, children }, ref) {
  return (
    <SceneCtx.Provider value={active}>
      <section id={id} ref={ref} data-label={label} className={`scene ${className}`}>
        <div className="inner">{children}</div>
      </section>
    </SceneCtx.Provider>
  )
})

/** Fade/slide in when `show` is true, fade back out when false. */
export function Reveal({ show = true, delay = 0, y = 26, x = 0, scale = 1, className = '', style, children }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, x, scale }}
      animate={show ? { opacity: 1, y: 0, x: 0, scale: 1 } : { opacity: 0, y, x, scale }}
      transition={{ duration: 0.75, delay: show ? delay : 0, ease }}
    >
      {children}
    </motion.div>
  )
}

/** Animated number. Counts when the scene is active (or when `run` is passed). */
export function Num({ to, from = 0, run, prefix = '', suffix = '', dec = 0, duration = 1400, sign = false }) {
  const active = useActive()
  const v = useCountUp(to, { from, run: run === undefined ? active : run, duration })
  const body = dec ? v.toFixed(dec) : fmt(v)
  return (
    <span className="num">
      {sign && to > 0 ? '+' : ''}
      {prefix}
      {body}
      {suffix}
    </span>
  )
}

export function Title({ eyebrow, children, show = true, center = true }) {
  return (
    <Reveal show={show} className={center ? 'title-wrap center' : 'title-wrap'}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h2 className="title">{children}</h2>
    </Reveal>
  )
}

export const Tag = ({ children }) => <span className="illus">{children}</span>
