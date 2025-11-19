import { useEffect, useRef, useState, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import { Canvas } from '@react-three/fiber'
import { Grid } from '@react-three/drei'

/********************
 * GLOBAL HOOKS
 ********************/
function useCustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [trail, setTrail] = useState([])
  const [interactive, setInteractive] = useState(false)
  useEffect(() => {
    const move = (e) => {
      const x = e.clientX
      const y = e.clientY
      setPos({ x, y })
      setTrail((t) => [...t, { x, y }].slice(-4))
    }
    const onOver = (e) => setInteractive(!!e.target.closest('a,button,input,textarea,select,[data-interactive]'))
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', onOver)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', onOver) }
  }, [])
  return { pos, trail, interactive }
}

function useInView(options) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true) }, options || { threshold: 0.2 })
    obs.observe(node)
    return () => obs.disconnect()
  }, [options])
  return { ref, inView }
}

/********************
 * NAVBAR + PROGRESS
 ********************/
function TopProgressBar() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2px] bg-transparent">
      <div className="h-full bg-[linear-gradient(90deg,#38bdf8,#8b5cf6,#f472b6)]" style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }} />
    </div>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  useEffect(() => {
    const sections = ['features', 'templates', 'how-it-works', 'pricing', 'testimonials', 'faq']
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }), { threshold: 0.45 })
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])
  const LinkEl = ({ href, children }) => (
    <a href={href} className={`relative text-[16px] ${active === href.replace('#','') ? 'bg-clip-text text-transparent bg-[linear-gradient(135deg,#60A5FA,#A78BFA)]' : 'text-white/70 hover:text-white'} transition`}>
      <span className="after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-[2px] after:w-0 hover:after:w-3/4 after:bg-white/70 after:transition-all">{children}</span>
    </a>
  )
  return (
    <div className={`fixed top-0 left-0 right-0 z-[1000] transition-colors ${scrolled ? 'backdrop-blur-xl bg-[rgba(10,14,30,0.75)] border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-[1200px] mx-auto h-20 px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3" onClick={(e)=>{e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' });}}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-slate-900 font-bold">{'</>'}</div>
          <span className="text-white font-bold text-xl">DEV AI</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          <LinkEl href="#features">Features</LinkEl>
          <LinkEl href="#templates">Templates</LinkEl>
          <LinkEl href="#how-it-works">Como Funciona</LinkEl>
          <LinkEl href="#pricing">Preços</LinkEl>
          <LinkEl href="#testimonials">Depoimentos</LinkEl>
          <LinkEl href="#faq">FAQ</LinkEl>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <a data-interactive href="#" className="px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:text-white hover:bg-white/5">Entrar</a>
          <a data-interactive href="#pricing" className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-[0_10px_40px_rgba(99,102,241,0.45)]">Começar Grátis</a>
        </div>
        <button aria-label="menu" className="md:hidden w-10 h-10 grid place-items-center rounded-lg bg-white/5 border border-white/10" onClick={()=>setOpen(true)}>
          <span className="block w-6 h-0.5 bg-white mb-1"/><span className="block w-6 h-0.5 bg-white mb-1"/><span className="block w-6 h-0.5 bg-white"/>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.25 }} className="fixed inset-0 bg-[rgba(10,10,20,0.9)] backdrop-blur-xl md:hidden">
            <div className="absolute top-4 right-4">
              <button aria-label="close" className="w-10 h-10 grid place-items-center rounded-lg bg-white/10 border border-white/20" onClick={()=>setOpen(false)}>✕</button>
            </div>
            <div className="h-full w-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-6 text-xl">
                {['#features','#templates','#how-it-works','#pricing','#testimonials','#faq'].map(href => (
                  <a key={href} onClick={()=>setOpen(false)} href={href} className="text-white/80 hover:text-white">{href.replace('#','')}</a>
                ))}
                <a onClick={()=>setOpen(false)} href="#" className="px-5 py-3 rounded-xl border border-white/20 text-white/80 hover:text-white hover:bg-white/5">Entrar</a>
                <a onClick={()=>setOpen(false)} href="#pricing" className="px-5 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white">Começar Grátis</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/********************
 * LOADING OVERLAY
 ********************/
function LoadingOverlay({ onDone }) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const id = setTimeout(() => { setVisible(false); onDone?.() }, 1000)
    return () => clearTimeout(id)
  }, [onDone])
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-[2000] grid place-items-center bg-[linear-gradient(135deg,#060914,#0b1020_40%,#110a22)]">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 grid place-items-center text-slate-900 font-bold">{'</>'}</div>
              <div className="text-white font-bold text-2xl">DEV AI</div>
            </div>
            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
              <motion.div className="h-full bg-gradient-to-r from-sky-500 via-violet-500 to-pink-500" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 0.9 }} />
            </div>
            <div className="mt-3 text-white/70">Carregando experiência...</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/********************
 * HERO
 ********************/
function GlowBadge() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/40 bg-blue-500/15 text-blue-200 backdrop-blur-md shadow-[0_0_60px_rgba(59,130,246,0.45)]">
      <span>🚀 100% em Português • 100% Open Code</span>
    </motion.div>
  )
}
function GradientHeadline() {
  return (
    <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-[conic-gradient(from_140deg,#60A5FA,#A78BFA,#EC4899,#60A5FA)]">
      Transforme Ideias em Apps Web Funcionais em Minutos
    </motion.h1>
  )
}
function Subheadline() {
  return (
    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="text-base md:text-lg text-white/75 max-w-xl mt-6">
      Converse com IA em português, veja código sendo gerado em tempo real, e exporte tudo pronto. Sem programação necessária.
    </motion.p>
  )
}
function CTAs() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="flex flex-col sm:flex-row items-center gap-4 mt-8">
      <a data-interactive href="#features" className="px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-[0_20px_60px_rgba(99,102,241,0.65)] hover:scale-[1.05] transition-transform">
        Começar Grátis →
      </a>
      <button data-interactive className="px-8 py-4 rounded-xl text-lg font-semibold bg-white/5 border border-white/20 hover:bg-white/10 transition">
        ▶ Ver Demo (2 min)
      </button>
    </motion.div>
  )
}
function SocialProof() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="mt-8 flex items-center gap-3 text-sm text-white/70">
      <div className="flex -space-x-3">
        {[1,2,3,4,5].map(i => (
          <img key={i} src={`https://i.pravatar.cc/40?img=${i}`} alt="avatar" className="w-8 h-8 rounded-full border border-white/20" />
        ))}
      </div>
      <span>✨ Usado por 1.200+ criadores</span>
    </motion.div>
  )
}
function Logo() {
  const [clicks, setClicks] = useState(0)
  const [boom, setBoom] = useState(false)
  useEffect(() => { if (clicks >= 5) { setBoom(true); const id = setTimeout(() => { setBoom(false); setClicks(0) }, 1200); return () => clearTimeout(id) } }, [clicks])
  return (
    <div className="relative">
      <button data-interactive onClick={()=>setClicks(c=>c+1)} className="flex items-center gap-3">
        <motion.div animate={boom ? { rotate: 360 } : { rotate: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 10 }} className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-slate-900 font-bold">{'</>'}</motion.div>
        <span className="text-white font-bold text-xl">DEV AI</span>
      </button>
      {boom && Array.from({ length: 18 }).map((_, i) => (
        <motion.span key={i} className="pointer-events-none absolute w-2 h-2 rounded-full" style={{ left: 16, top: 16, background: i % 2 ? '#60A5FA' : '#A78BFA' }} animate={{ x: (Math.cos(i)*80), y: (Math.sin(i*1.5)*80), opacity: [1, 0] }} transition={{ duration: 0.8 }} />
      ))}
    </div>
  )
}

function ThreeGrid({ scroll }) {
  return (
    <Canvas camera={{ position: [0, 2.2, 5], fov: 50 }} gl={{ antialias: true }}>
      <Suspense fallback={null}>
        <Grid
          position={[0, -1.2 + scroll * 0.004, 0]}
          args={[100, 100]}
          cellSize={0.8}
          cellThickness={0.6}
          sectionSize={4}
          sectionThickness={1}
          sectionColor="#7c3aed"
          cellColor="#3b82f6"
          fadeDistance={30}
          fadeStrength={1.5}
          infinite
        />
      </Suspense>
    </Canvas>
  )
}
function Hero3D() {
  const [offset, setOffset] = useState(0)
  useEffect(() => { const onScroll = () => setOffset(window.scrollY); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll) }, [])
  const translate = useMemo(() => `translateY(${-(offset * 0.12)}px)`, [offset])
  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] lg:h-full" style={{ transform: translate }}>
      <div className="absolute inset-0 opacity-[0.45]">
        <ThreeGrid scroll={offset} />
      </div>
      <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1020] via-transparent to-transparent opacity-70" />
    </div>
  )
}
function HolographicCodeCard() {
  const [text, setText] = useState('')
  const code = `import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [react()],\n})`
  useEffect(() => { let i = 0; const id = setInterval(() => { setText(code.slice(0, i)); i = (i + 1) % (code.length + 1) }, 26); return () => clearInterval(id) }, [])
  return (
    <motion.pre whileHover={{ rotateX: 8, rotateY: -8 }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-xl p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 text-white shadow-[0_0_100px_rgba(168,85,247,0.5)]" style={{ perspective: 1000 }}>
      <div className="text-xs text-white/60 mb-3">vite.config.ts</div>
      <code className="text-sm leading-6">{text}<span className="animate-pulse">▋</span></code>
    </motion.pre>
  )
}
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_10%_10%,rgba(59,130,246,0.2),transparent),radial-gradient(1200px_700px_at_90%_30%,rgba(168,85,247,0.2),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#060914,transparent_35%,#0b1020_100%)]" />
      <div className="relative z-10 flex-1 w-full px-6 sm:px-10 lg:px-16 py-10 lg:py-24">
        <div className="flex items-center justify-between"><Logo /></div>
        <div className="mt-10 md:mt-16">
          <GlowBadge />
          <GradientHeadline />
          <Subheadline />
          <CTAs />
          <SocialProof />
        </div>
      </div>
      <div className="relative z-10 flex-1 w-full px-0 lg:px-0 py-10 lg:py-16">
        <div className="relative h-[50vh] md:h-[70vh] lg:h-[90vh]">
          <Hero3D />
          <HolographicCodeCard />
        </div>
      </div>
      <ScrollIndicator />
    </section>
  )
}
function ScrollIndicator() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs flex flex-col items-center gap-2">
      <span>scroll</span>
      <motion.div className="w-[2px] h-8 bg-white/30 rounded" animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 1.2 }} />
    </div>
  )
}

/********************
 * FEATURES
 ********************/
function CardBase({ children, className = '', style }) {
  return (
    <motion.div whileHover={{ y: -8 }} className={`relative rounded-3xl p-10 bg-slate-900/60 border border-white/10 backdrop-blur-xl transition-all ${className}`} style={style}>
      <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: 'linear-gradient(120deg, rgba(96,165,250,0.16), rgba(167,139,250,0.16))', maskImage: 'linear-gradient(black, transparent 70%)' }} />
      {children}
    </motion.div>
  )
}
function TypingEditor() {
  const sample = `// React + TypeScript example\nimport { useState } from 'react'\n\ntype Todo = { id: number; text: string; done: boolean }\n\nexport default function App(){\n  const [todos, setTodos] = useState<Todo[]>([])\n  return (<ul>{todos.map(t=> <li key={t.id}>{t.text}</li>)}</ul>)\n}`
  const [content, setContent] = useState('')
  useEffect(() => { let i = 0; const id = setInterval(() => { setContent(sample.slice(0, i)); i = (i + 2) % (sample.length + 1) }, 16); return () => clearInterval(id) }, [])
  return (<pre className="text-sm text-white/90 font-mono leading-6 whitespace-pre-wrap">{content}<span className="animate-pulse">▋</span></pre>)
}
function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_20%,rgba(99,102,241,0.2),transparent),radial-gradient(1000px_600px_at_80%_60%,rgba(14,165,233,0.16),transparent)]" />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10">
        <h2 className="text-center text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-[linear-gradient(135deg,#60A5FA,#A78BFA,#EC4899)] mb-16">Por Que Desenvolvedores Amam o DEV AI</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 auto-rows-[1fr]">
          <CardBase className="md:col-span-2">
            <div className="text-4xl">⚡</div>
            <h3 className="mt-4 text-2xl font-semibold text-white">Geração de Código Instantânea</h3>
            <p className="mt-2 text-white/70">Descreva em português e veja React + TypeScript sendo escrito em tempo real. Zero configuração.</p>
            <div className="mt-6 bg-slate-950/60 rounded-xl border border-white/10 p-4"><TypingEditor /></div>
          </CardBase>
          <CardBase className="bg-gradient-to-br from-emerald-500/10 to-yellow-400/10">
            <div className="text-4xl">🇧🇷</div>
            <h3 className="mt-4 text-2xl font-semibold text-white">100% em Português</h3>
            <p className="mt-2 text-white/70">Primeira plataforma AI para desenvolvimento em português nativo.</p>
            <div className="mt-6 h-24 rounded-lg bg-[conic-gradient(at_50%_50%,rgba(16,185,129,0.3),rgba(234,179,8,0.3),rgba(16,185,129,0.3))] animate-pulse" />
          </CardBase>
          <CardBase>
            <div className="text-4xl">📦</div>
            <h3 className="mt-4 text-2xl font-semibold text-white">Export Completo</h3>
            <p className="mt-2 text-white/70">Baixe o código completo. Rode em qualquer lugar.</p>
            <motion.div className="mt-6 w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>⬇️</motion.div>
          </CardBase>
          <CardBase className="md:col-span-2">
            <div className="text-4xl">👁️</div>
            <h3 className="mt-4 text-2xl font-semibold text-white">Preview em Tempo Real</h3>
            <p className="mt-2 text-white/70">Desktop, tablet e mobile sincronizados.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <motion.div whileHover={{ scale: 1.03 }} className="aspect-video rounded-lg bg-white/5 border border-white/10" />
              <motion.div whileHover={{ scale: 1.03 }} className="aspect-[3/4] rounded-lg bg-white/5 border border-white/10" />
              <motion.div whileHover={{ scale: 1.03 }} className="aspect-[9/16] rounded-lg bg-white/5 border border-white/10" />
            </div>
          </CardBase>
          <CardBase className="bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10">
            <div className="text-4xl">🎨</div>
            <h3 className="mt-4 text-2xl font-semibold text-white">Templates Profissionais</h3>
            <p className="mt-2 text-white/70">Landing pages, dashboards, portfolios.</p>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6].map(i => (<motion.div key={i} className="aspect-video rounded-md bg-white/5" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.08 }} />))}
            </div>
          </CardBase>
          <CardBase className="bg-gradient-to-br from-blue-600/20 to-cyan-500/10">
            <div className="text-4xl">⚡</div>
            <h3 className="mt-4 text-2xl font-semibold text-white">Deploy Automático</h3>
            <p className="mt-2 text-white/70">Um clique e seu app online.</p>
            <motion.div className="mt-6 h-24 rounded-lg bg-[radial-gradient(circle,#60A5FA,transparent_60%)]" animate={{ boxShadow: ['0 0 0px rgba(59,130,246,0.0)', '0 0 90px rgba(59,130,246,0.75)', '0 0 0px rgba(59,130,246,0.0)'] }} transition={{ repeat: Infinity, duration: 1.4 }} />
          </CardBase>
        </div>
      </div>
    </section>
  )
}

/********************
 * TEMPLATES CAROUSEL + DEVICE PREVIEW
 ********************/
function TemplatesCarouselSection() {
  const items = Array.from({ length: 8 }).map((_, i) => ({ id: i, title: `Template ${i + 1}`, img: `https://picsum.photos/seed/template${i}/800/450` }))
  const [offset, setOffset] = useState(0)
  const [paused, setPaused] = useState(false)
  const speed = 0.8
  useEffect(() => { const id = setInterval(() => { if (!paused) setOffset(v => v - speed) }, 16); return () => clearInterval(id) }, [paused])
  const list = [...items, ...items]
  const [current, setCurrent] = useState(0)
  return (
    <section id="templates" className="relative py-24 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_10%,rgba(99,102,241,0.18),transparent),radial-gradient(1000px_600px_at_20%_70%,rgba(14,165,233,0.14),transparent)]" />
      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <h2 className="text-center text-3xl md:text-5xl font-extrabold text-white mb-12">Modelos Prontos para Usar</h2>
        <div className="overflow-hidden group" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
          <div className="flex gap-6" style={{ transform: `translateX(${offset}px)` }}>
            {list.map((it, i) => (
              <div key={i} className="min-w-[280px] md:min-w-[420px] rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="aspect-video w-full bg-slate-800/40"><img src={it.img} alt={it.title} className="w-full h-full object-cover" loading="lazy" /></div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">{it.title}</div>
                    <div className="text-white/60 text-sm">Landing • Dashboard • Portfolio</div>
                  </div>
                  <button data-interactive onClick={()=>setCurrent(i % items.length)} className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20">Preview</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <DeviceFrame type="desktop" active={current} items={items} />
          <DeviceFrame type="tablet" active={current} items={items} />
          <DeviceFrame type="mobile" active={current} items={items} />
        </div>
      </div>
    </section>
  )
}
function DeviceFrame({ type, active, items }) {
  const img = items[active]?.img
  const base = 'rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl overflow-hidden relative'
  const dims = type === 'desktop' ? 'aspect-[16/10]' : type === 'tablet' ? 'aspect-[3/4]' : 'aspect-[9/16]'
  const radius = type === 'mobile' ? 'rounded-[28px]' : type === 'tablet' ? 'rounded-[24px]' : 'rounded-[16px]'
  return (
    <motion.div whileHover={{ rotateX: type==='desktop'?4:3, rotateY: type==='desktop'?-4:-3, scale: 1.02 }} className={`${base} ${dims} ${radius}`}>
      {type !== 'mobile' && (
        <div className="absolute top-0 left-0 right-0 h-8 bg-white/5 border-b border-white/10 flex items-center gap-2 px-3">
          <span className="w-3 h-3 rounded-full bg-red-400/80" /><span className="w-3 h-3 rounded-full bg-yellow-400/80" /><span className="w-3 h-3 rounded-full bg-emerald-400/80" />
        </div>
      )}
      {type === 'mobile' && (<div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-1.5 rounded-full bg-white/20" />)}
      <img src={img} alt={`${type} preview`} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/25 via-transparent to-transparent" />
    </motion.div>
  )
}

/********************
 * HOW IT WORKS
 ********************/
function StepNumber({ n }) { return (<div className="relative select-none"><span className="block text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-[linear-gradient(135deg,#60A5FA,#A78BFA)]" style={{ WebkitTextStroke: '2px rgba(167,139,250,0.6)' }}>{n}</span></div>) }
function ChatBubbleTyping({ text }) {
  const [content, setContent] = useState('')
  useEffect(() => { let i = 0; const id = setInterval(() => { setContent(text.slice(0, i)); i = Math.min(i + 1, text.length); if (i === text.length) clearInterval(id) }, 20); return () => clearInterval(id) }, [text])
  return (
    <div className="flex items-start gap-3"><div className="w-8 h-8 rounded-full bg-white/10 border border-white/20" /><div className="max-w-[320px] md:max-w-[420px] rounded-2xl px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/15 shadow-[0_10px_50px_rgba(99,102,241,0.35)]"><p className="text-white/90 text-sm md:text-base">{content}<span className="animate-pulse">▋</span></p></div></div>
  )
}
function CodeWriter({ lines = 8, progress = 78 }) {
  const [tick, setTick] = useState(0)
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 240); return () => clearInterval(id) }, [])
  return (
    <div className="w-full rounded-xl bg-slate-950/70 border border-white/10 p-4">
      <div className="flex gap-2 mb-3"><span className="w-3 h-3 rounded-full bg-red-400/80" /><span className="w-3 h-3 rounded-full bg-yellow-400/80" /><span className="w-3 h-3 rounded-full bg-emerald-400/80" /></div>
      <div className="font-mono text-xs md:text-sm text-white/80 space-y-1">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center gap-2"><span className="text-white/30 w-6 text-right">{i + 1}</span><span className="flex-1"><span className="text-sky-300">const</span> <span className="text-pink-300">comp</span> = <span className="text-emerald-300">() =&gt;</span> <span className="text-white">{'{'}</span>{i < (tick % (lines + 1)) ? <span className="text-white/70"> ...</span> : <span className="opacity-30"> //</span>}</span></div>
        ))}
      </div>
      <div className="mt-4 h-2 w-full rounded bg-white/10 overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${progress}%` }} /></div>
      <div className="mt-1 text-right text-xs text-white/60">Gerando componentes... {progress}%</div>
    </div>
  )
}
function SplitPreview() {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-slate-950/60">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-4 font-mono text-xs md:text-sm text-white/80 space-y-1">{`<Hero title=\"DEV AI\" />`}<div className="mt-2">color: <span className="text-sky-300">#60A5FA</span> → <span className="text-fuchsia-300">#A78BFA</span></div><div className="mt-2">button: <span className="text-emerald-300">primary</span></div></div>
        <div className="relative min-h-[140px] md:min-h-[180px] bg-gradient-to-br from-slate-800/40 to-slate-900/60">
          <motion.div className="absolute w-6 h-6 rounded-full bg-white/90 text-slate-800 flex items-center justify-center text-xs" animate={{ x: [20, 120, 60, 160], y: [20, 30, 80, 40] }} transition={{ repeat: Infinity, duration: 3.2 }}>⌁</motion.div>
          <div className="absolute inset-0 flex items-center justify-center"><div className="px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-white/80">Preview</div></div>
        </div>
      </div>
    </div>
  )
}
function SuccessVisual() {
  return (
    <div className="relative w-full rounded-xl border border-white/10 bg-slate-950/60 p-6 overflow-hidden">
      <motion.div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-3xl shadow-[0_0_60px_rgba(16,185,129,0.7)]" animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>✓</motion.div>
      <div className="mt-4 text-center text-white/80">seuapp.vercel.app</div>
      <motion.div className="absolute -top-4 right-6 text-3xl" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.1 }}>⬇️</motion.div>
      {Array.from({ length: 18 }).map((_, i) => (<motion.span key={i} className="absolute w-2 h-2 rounded-sm" style={{ left: `${(i * 11) % 100}%`, top: -10, background: i % 2 ? '#60A5FA' : '#A78BFA' }} animate={{ y: [0, 180], rotate: [0, 180] }} transition={{ repeat: Infinity, duration: 1.5 + (i % 5) * 0.22, delay: i * 0.07 }} />))}
    </div>
  )
}
function Connector({ progress }) { return (<div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 h-full w-1 md:w-[3px]"><div className="relative h-full"><div className="absolute left-1/2 -translate-x-1/2 w-[3px] h-full bg-white/5 rounded" /><motion.div className="absolute left-1/2 -translate-x-1/2 w-[3px] bg-gradient-to-b from-blue-500 to-purple-500 rounded" style={{ height: `${progress * 100}%` }} /></div></div>) }
function Step({ index, side, visual, title, description }) {
  const { ref, inView } = useInView({ threshold: 0.2 })
  const isLeft = side === 'left'
  return (
    <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      <motion.div initial={{ opacity: 0, x: isLeft ? -40 : 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5 }} className={`order-1 ${isLeft ? '' : 'md:order-2'}`}>{visual}</motion.div>
      <motion.div initial={{ opacity: 0, x: isLeft ? 40 : -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.04 }} className={`order-2 ${isLeft ? '' : 'md:order-1'}`}>
        <div className="flex items-start gap-4"><StepNumber n={index} /><div><h3 className="text-2xl md:text-3xl font-semibold text-white">{title}</h3><p className="mt-2 text-white/70 max-w-prose">{description}</p></div></div>
      </motion.div>
    </div>
  )
}
function HowItWorksSection() {
  const containerRef = useRef(null)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handler = () => {
      const el = containerRef.current; if (!el) return
      const rect = el.getBoundingClientRect(); const vh = window.innerHeight
      const total = rect.height - vh * 0.2; const passed = Math.min(Math.max(vh * 0.8 - rect.top, 0), total)
      setProgress(total > 0 ? passed / total : 0)
    }
    handler(); window.addEventListener('scroll', handler, { passive: true }); window.addEventListener('resize', handler)
    return () => { window.removeEventListener('scroll', handler); window.removeEventListener('resize', handler) }
  }, [])
  return (
    <section id="how-it-works" ref={containerRef} className="relative py-28 md:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_10%,rgba(99,102,241,0.18),transparent),radial-gradient(1000px_600px_at_20%_70%,rgba(14,165,233,0.14),transparent)]" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <h2 className="text-center text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-[linear-gradient(135deg,#60A5FA,#A78BFA)] mb-16">Do Zero ao Deploy em 4 Passos</h2>
        <div className="relative">
          <Connector progress={progress} />
          <div className="space-y-24">
            <Step index="01" side="left" visual={<ChatBubbleTyping text="Crie uma landing page para minha startup de IA" />} title="Descreva Sua Ideia" description="Converse naturalmente em português. Quanto mais detalhes, melhor o resultado." />
            <Step index="02" side="right" visual={<CodeWriter />} title="IA Gera Código Profissional" description="Claude AI analisa seu pedido e escreve React + TypeScript otimizado." />
            <Step index="03" side="left" visual={<SplitPreview />} title="Visualize e Ajuste em Tempo Real" description="Cada mudança reflete instantaneamente. 'Mude a cor para azul', 'Adicione um footer'." />
            <Step index="04" side="right" visual={<SuccessVisual />} title="Exporte ou Publique" description="Baixe todo o código ou publique com um clique." />
          </div>
        </div>
        <div className="mt-16 flex justify-center"><a data-interactive href="#pricing" className="group inline-flex items-center gap-3 px-8 py-5 rounded-2xl text-[20px] font-semibold bg-[linear-gradient(90deg,#2563EB,#7C3AED,#DB2777)] text-white shadow-[0_0_70px_rgba(124,58,237,0.7)] hover:shadow-[0_0_90px_rgba(124,58,237,0.9)] transition-transform hover:scale-[1.02]">Experimentar Agora - Grátis <span className="text-2xl group-hover:translate-x-1 transition-transform">🚀</span></a></div>
      </div>
    </section>
  )
}

/********************
 * PRICING
 ********************/
function PricingSection() {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const onMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect(); if (!rect) return
    const x = (e.clientX - rect.left) / rect.width; const y = (e.clientY - rect.top) / rect.height
    setTilt({ ry: (x - 0.5) * 10, rx: -(y - 0.5) * 10 })
  }
  const onLeave = () => setTilt({ rx: 0, ry: 0 })
  return (
    <section id="pricing" className="relative py-28 md:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_30%_10%,rgba(99,102,241,0.18),transparent),radial-gradient(1000px_600px_at_80%_70%,rgba(14,165,233,0.14),transparent)]" />
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <h2 className="text-center text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-[linear-gradient(135deg,#60A5FA,#A78BFA)] mb-14">Comece Grátis, Cresça Quando Quiser</h2>
        <div className="relative flex justify-center">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.span key={i} className="pointer-events-none absolute w-2 h-2 rounded-full" style={{ background: i % 2 ? '#60A5FA' : '#A78BFA', left: `${(i * 7) % 100}%`, top: `${(i * 13) % 100}%`, filter: 'blur(0.5px)' }} animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 2.4 + (i % 5) * 0.2, delay: i * 0.07 }} />
          ))}
          <motion.div ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }} className="relative w-full max-w-[500px] rounded-[32px] p-[2px] bg-[conic-gradient(from_0deg,rgba(99,102,241,0.8),rgba(168,85,247,0.8),rgba(219,39,119,0.8),rgba(99,102,241,0.8))] animate-[spin_8s_linear_infinite]">
            <div className="rounded-[30px] p-12 bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-[0_0_110px_rgba(99,102,241,0.55),0_0_150px_rgba(168,85,247,0.4)] relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(600px_200px at 50% -20%, rgba(255,255,255,0.08), transparent)' }} />
              <div className="mb-6 flex justify-center"><span className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-[0_0_30px_rgba(16,185,129,0.7)]">GRÁTIS PARA SEMPRE</span></div>
              <div className="flex items-end justify-center gap-2"><div className="text-transparent bg-clip-text bg-[linear-gradient(135deg,#FDE68A,#F59E0B)] text-[56px] md:text-[72px] leading-none font-black">R$ 0</div><div className="pb-2 text-white/70">/mês</div></div>
              <div className="mt-2 text-center text-white/70">Perfeito para começar e validar ideias</div>
              <ul className="mt-8 space-y-3">{['50 mensagens com IA por mês','1 projeto ativo','Export de código ilimitado','3 templates profissionais','Preview em tempo real','Suporte via comunidade Discord','Atualizações gratuitas'].map((t) => (<li key={t} className="flex items-center gap-3 text-[16px] text-white/90"><motion.span className="grid place-items-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white" whileHover={{ scale: 1.2 }}>✓</motion.span><span>{t}</span></li>))}</ul>
              <a data-interactive href="#" className="mt-10 block w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-[18px] grid place-items-center shadow-[0_20px_70px_rgba(99,102,241,0.65)] hover:shadow-[0_20px_90px_rgba(99,102,241,0.85)] transition-transform hover:scale-[1.02]">Criar Conta Gratuita →</a>
              <div className="mt-3 text-center text-sm text-white/60">Sem cartão de crédito. Sem pegadinhas.</div>
            </div>
          </motion.div>
        </div>
        <div className="mt-10 text-center text-sm text-white/50">💎 Planos Pro e Enterprise em breve com mais recursos</div>
      </div>
    </section>
  )
}

/********************
 * TESTIMONIALS (auto-scroll with hover pause)
 ********************/
function TestimonialsSection() {
  const testimonials = [
    { quote: 'Criei a landing page da minha startup em 10 minutos. Inacreditável!', author: 'João Silva', role: 'Founder @ TechStart' },
    { quote: 'Finalmente uma ferramenta em português que realmente funciona. Game changer!', author: 'Maria Santos', role: 'Designer Freelancer' },
    { quote: 'Economizei R$ 15.000 que gastaria com dev. Perfeito para MVPs.', author: 'Pedro Costa', role: 'Empreendedor' },
    { quote: 'Fluxo suave e resultados profissionais. Recomendo!', author: 'Ana Paula', role: 'PM @ SaaS Co.' },
  ]
  const [offset, setOffset] = useState(0)
  const [paused, setPaused] = useState(false)
  const speed = 0.9
  useEffect(() => { const id = setInterval(() => { if (!paused) setOffset(o => o - speed) }, 16); return () => clearInterval(id) }, [paused])
  const cards = [...testimonials, ...testimonials, ...testimonials]
  return (
    <section id="testimonials" className="relative py-24 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_10%,rgba(99,102,241,0.18),transparent),radial-gradient(1000px_600px_at_80%_70%,rgba(14,165,233,0.14),transparent)]" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <h2 className="text-center text-3xl md:text-5xl font-extrabold text-white mb-10">Criadores Adoram o DEV AI</h2>
        <div className="overflow-hidden" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
          <div className="flex gap-6" style={{ transform: `translateX(${offset}px)` }}>
            {cards.map((t, i) => (
              <div key={i} className="min-w-[280px] md:min-w-[360px] bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 relative">
                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ border: '1px solid', borderImage: 'linear-gradient(120deg,rgba(96,165,250,0.4),rgba(167,139,250,0.4)) 1' }} />
                <div className="flex items-center gap-2 text-yellow-300">{'★★★★★'}</div>
                <p className="mt-3 italic text-lg text-white/90">“{t.quote}”</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20" />
                  <div>
                    <div className="text-white font-semibold">{t.author}</div>
                    <div className="text-white/60 text-sm">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/********************
 * FAQ
 ********************/
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef(null)
  const height = open ? contentRef.current?.scrollHeight || 0 : 0
  return (
    <div className="border-b border-white/10">
      <button data-interactive onClick={()=>setOpen(!open)} className="w-full py-5 flex items-center justify-between text-left hover:bg-white/5 px-2 rounded">
        <span className="text-white/90 text-base md:text-lg">{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-white/60 text-2xl leading-none">+</motion.span>
      </button>
      <motion.div initial={false} animate={{ height }} className="overflow-hidden"><div ref={contentRef} className="pb-5 px-2 text-white/70">{a}</div></motion.div>
    </div>
  )
}
function FAQSection() {
  const items = [
    { q: 'Preciso saber programar?', a: 'Não! Você conversa em português e a IA gera todo o código. Perfeito para não-desenvolvedores.' },
    { q: 'O código gerado é meu?', a: 'Sim, 100%. Você pode exportar, modificar e usar comercialmente sem restrições.' },
    { q: 'Funciona para qualquer tipo de aplicação?', a: 'Atualmente focamos em landing pages, dashboards e portfolios. Mais tipos em breve.' },
    { q: 'Qual IA vocês usam?', a: 'Claude 3.5 Sonnet da Anthropic, treinado para gerar código React + TypeScript de alta qualidade.' },
    { q: 'Posso fazer upgrade depois?', a: 'Planos pagos estão chegando em breve com mais mensagens, projetos ilimitados e deploy automático.' },
    { q: 'Como funciona o suporte?', a: 'Comunidade Discord ativa com respostas rápidas. Documentação completa disponível 24/7.' },
  ]
  return (
    <section id="faq" className="relative py-24 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_10%,rgba(99,102,241,0.18),transparent),radial-gradient(1000px_600px_at_20%_70%,rgba(14,165,233,0.14),transparent)]" />
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <h2 className="text-center text-3xl md:text-5xl font-extrabold text-white mb-10">Perguntas Frequentes</h2>
        <div className="divide-y divide-transparent">{items.map((it) => (<FAQItem key={it.q} q={it.q} a={it.a} />))}</div>
      </div>
    </section>
  )
}

/********************
 * FINAL CTA + FOOTER
 ********************/
function FinalCTA() {
  return (
    <section className="relative py-[120px] bg-[linear-gradient(135deg,#0f1c3a,#3b82f6_30%,#7c3aed_80%)]">
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(1000px_600px_at_50%_0%,white,transparent)]" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="text-5xl md:text-[56px]">🚀</div>
        <h3 className="mt-4 text-3xl md:text-[56px] font-extrabold text-white">Pronto para Criar Seu Primeiro App?</h3>
        <p className="mt-4 text-white/80 text-lg md:text-[20px]">Junte-se a milhares de criadores transformando ideias em realidade</p>
        <a data-interactive href="#pricing" className="mt-8 inline-block px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-lg md:text-xl shadow-[0_30px_80px_rgba(255,255,255,0.25)] hover:scale-[1.03] transition">Começar Gratuitamente</a>
      </div>
    </section>
  )
}
function Footer() {
  return (
    <footer className="relative bg-[#0a0f1d] py-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-slate-900 font-bold">{'</>'}</div><span className="text-white font-bold text-xl">DEV AI</span></div>
          <p className="mt-3 text-white/70">Desenvolvimento web com IA em português</p>
          <div className="mt-4 flex items-center gap-3 text-white/70">
            <a data-interactive href="#" className="hover:-translate-y-0.5 hover:text-white transition">𝕏</a>
            <a data-interactive href="#" className="hover:-translate-y-0.5 hover:text-white transition">GitHub</a>
            <a data-interactive href="#" className="hover:-translate-y-0.5 hover:text-white transition">Discord</a>
            <a data-interactive href="#" className="hover:-translate-y-0.5 hover:text-white transition">LinkedIn</a>
          </div>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Produto</div>
          <ul className="space-y-2">{['Features','Pricing','Templates','Documentação','Changelog','Roadmap'].map((t,i)=>(<li key={i}><a data-interactive href="#" className="text-white/70 hover:text-white hover:underline transition">{t}</a></li>))}</ul>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Recursos</div>
          <ul className="space-y-2">{['Blog','Tutoriais','Comunidade','Suporte','Status'].map((t,i)=>(<li key={i}><a data-interactive href="#" className="text-white/70 hover:text-white hover:underline transition">{t}</a></li>))}</ul>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Legal</div>
          <ul className="space-y-2">{['Termos de Uso','Privacidade','Cookies'].map((t,i)=>(<li key={i}><a data-interactive href="#" className="text-white/70 hover:text-white hover:underline transition">{t}</a></li>))}</ul>
        </div>
      </div>
      <div className="mt-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="max-w-6xl mx-auto px-6 mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white/60">
        <div>© 2025 DEV AI. Feito com 💙 no Brasil.</div>
        <div>Powered by Claude AI + React</div>
      </div>
    </footer>
  )
}

/********************
 * EASTER EGGS
 ********************/
function useEasterEggs() {
  useEffect(() => {
    let seq = []
    const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
    const onKey = (e) => { seq.push(e.key); seq = seq.slice(-10); if (konami.every((k, i) => seq[i] === k)) alert('🎉 Easter egg encontrado! Você é curioso hein?') }
    let devSeq = []; let last = 0
    const onKeyDev = (e) => { const now = Date.now(); if (now - last > 800) devSeq = []; last = now; devSeq.push(e.key.toLowerCase()); if (devSeq.slice(-3).join('') === 'dev') console.log('👨‍💻 Olá developer! Gostou do código? Estamos contratando!') }
    window.addEventListener('keydown', onKey); window.addEventListener('keydown', onKeyDev)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('keydown', onKeyDev) }
  }, [])
}

/********************
 * SCROLL TO TOP + APP
 ********************/
function ScrollToTopBtn() {
  const [show, setShow] = useState(false)
  useEffect(() => { const onScroll = () => setShow(window.scrollY > 500); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll) }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.button data-interactive onClick={()=>window.scrollTo({ top: 0, behavior: 'smooth' })} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="fixed bottom-6 right-6 z-[1500] w-12 h-12 rounded-xl bg-[linear-gradient(135deg,#2563EB,#7C3AED)] text-white shadow-[0_10px_30px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 transition">↑</motion.button>
      )}
    </AnimatePresence>
  )
}

function CustomCursorLayer() {
  const { pos, trail, interactive } = useCustomCursor()
  return (
    <div className="pointer-events-none fixed inset-0 z-[3000]">
      {trail.map((p, i) => (
        <motion.span key={i} className="absolute block w-4 h-4 rounded-full opacity-50" style={{ left: p.x - 8, top: p.y - 8, background: 'radial-gradient(circle at 30% 30%, #60A5FA, #A78BFA 60%, transparent 70%)' }} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0.3, 0], scale: [1, 0.6] }} transition={{ duration: 0.5 }} />
      ))}
      <motion.span className="absolute rounded-full" style={{ left: pos.x - 8, top: pos.y - 8, width: 16, height: 16, background: 'linear-gradient(135deg,#60A5FA,#A78BFA)', opacity: 0.9 }} animate={{ scale: interactive ? 2 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} />
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  useEasterEggs()
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#0b1020,#0c0720_40%,#130d2e)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />
      <TopProgressBar />
      <Navbar />
      {!loaded && <LoadingOverlay onDone={()=>setLoaded(true)} />}
      <div className="relative">
        <Hero />
        <FeaturesSection />
        <TemplatesCarouselSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTA />
        <Footer />
      </div>
      <ScrollToTopBtn />
      <CustomCursorLayer />
    </div>
  )
}
