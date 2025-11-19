import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Spline from '@splinetool/react-spline'

// Custom cursor with trail
function CursorTrail() {
  const [points, setPoints] = useState([])
  useEffect(() => {
    const handler = (e) => {
      setPoints((prev) => {
        const next = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() + Math.random() }]
        return next.slice(-15)
      })
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      <AnimatePresence>
        {points.map((p, i) => (
          <motion.span
            key={p.id}
            className="absolute block w-3 h-3 rounded-full"
            style={{ left: p.x - 6, top: p.y - 6, background: 'radial-gradient(circle at 30% 30%, #60A5FA, #A78BFA 60%, transparent 70%)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.8 - i * 0.05, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.25 }}
          />
        ))}
      </AnimatePresence>
      <motion.span
        className="absolute block w-4 h-4 rounded-full border border-white/60"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ left: points[points.length - 1]?.x ?? -100, top: (points[points.length - 1]?.y ?? -100), transform: 'translate(-50%, -50%)' }}
      />
    </div>
  )
}

function GlowBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-200 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.25)]"
    >
      <span>🚀 100% em Português • 100% Open Code</span>
    </motion.div>
  )
}

function GradientHeadline() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-[linear-gradient(135deg,#60A5FA,#A78BFA,#EC4899)]"
    >
      Transforme Ideias em Apps Web Funcionais em Minutos
    </motion.h1>
  )
}

function Subheadline() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="text-base md:text-lg text-white/70 max-w-xl mt-6"
    >
      Converse com IA em português, veja código sendo gerado em tempo real, e exporte tudo pronto. Sem programação necessária.
    </motion.p>
  )
}

function CTAs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex flex-col sm:flex-row items-center gap-4 mt-8"
    >
      <a
        href="#features"
        className="px-8 py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-[0_10px_40px_rgba(99,102,241,0.5)] hover:scale-[1.03] transition-transform shadow-blue-500/30"
      >
        Começar Grátis →
      </a>
      <button className="px-8 py-4 rounded-xl text-lg font-semibold bg-white/5 border border-white/20 hover:bg-white/10 transition">
        ▶ Ver Demo (2 min)
      </button>
    </motion.div>
  )
}

function SocialProof() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mt-8 flex items-center gap-3 text-sm text-white/70"
    >
      <div className="flex -space-x-3">
        {[1,2,3,4,5].map(i => (
          <img key={i} src={`https://i.pravatar.cc/40?img=${i}`} alt="avatar" className="w-8 h-8 rounded-full border border-white/20" />
        ))}
      </div>
      <span>✨ Usado por 1.200+ criadores</span>
    </motion.div>
  )
}

function ScrollIndicator() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs flex flex-col items-center gap-2">
      <span>scroll</span>
      <motion.div
        className="w-[2px] h-8 bg-white/30 rounded"
        animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
      />
    </div>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-slate-900 font-bold">{'</>'}</div>
      <span className="text-white font-bold text-xl">DEV AI</span>
    </div>
  )
}

function Hero3D() {
  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] lg:h-full">
      <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1020] via-transparent to-transparent opacity-60"></div>
    </div>
  )
}

function HolographicCodeCard() {
  const [text, setText] = useState('')
  const code = `import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [react()],\n})`
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setText(code.slice(0, i))
      i = (i + 1) % (code.length + 1)
    }, 35)
    return () => clearInterval(id)
  }, [])
  return (
    <motion.pre
      whileHover={{ rotateX: 6, rotateY: -6 }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-xl p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 text-white shadow-[0_0_80px_rgba(168,85,247,0.35)]"
      style={{ perspective: 1000 }}
    >
      <div className="text-xs text-white/60 mb-3">vite.config.ts</div>
      <code className="text-sm leading-6">
        {text}
        <span className="animate-pulse">▋</span>
      </code>
    </motion.pre>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center">
      <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_10%_10%,rgba(59,130,246,0.12),transparent),radial-gradient(1000px_600px_at_90%_30%,rgba(168,85,247,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#0b1020,transparent_30%,#0b1020_100%)]" />

      <div className="relative z-10 flex-1 w-full px-6 sm:px-10 lg:px-16 py-10 lg:py-24">
        <div className="flex items-center justify-between">
          <Logo />
        </div>

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

      <CursorTrail />
    </section>
  )
}

// Feature cards helpers
function CardBase({ children, className = '', style }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`relative rounded-3xl p-10 bg-slate-900/60 border border-white/10 backdrop-blur-xl transition-all ${className}`}
      style={style}
    >
      <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: 'linear-gradient(120deg, rgba(96,165,250,0.08), rgba(167,139,250,0.08))', maskImage: 'linear-gradient(black, transparent 70%)' }} />
      {children}
    </motion.div>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_20%_20%,rgba(99,102,241,0.15),transparent),radial-gradient(900px_500px_at_80%_60%,rgba(14,165,233,0.12),transparent)]" />
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-10">
        <h2 className="text-center text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-[linear-gradient(135deg,#60A5FA,#A78BFA,#EC4899)] mb-16">Por Que Desenvolvedores Amam o DEV AI</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 auto-rows-[1fr]">
          {/* Card 1 - Large */}
          <CardBase className="md:col-span-2">
            <div className="text-4xl">⚡</div>
            <h3 className="mt-4 text-2xl font-semibold text-white">Geração de Código Instantânea</h3>
            <p className="mt-2 text-white/70">Descreva em português e veja React + TypeScript sendo escrito em tempo real. Zero configuração.</p>
            <div className="mt-6 bg-slate-950/60 rounded-xl border border-white/10 p-4">
              <TypingEditor />
            </div>
          </CardBase>

          {/* Card 2 */}
          <CardBase className="bg-gradient-to-br from-emerald-500/10 to-yellow-400/10">
            <div className="text-4xl">🇧🇷</div>
            <h3 className="mt-4 text-2xl font-semibold text-white">100% em Português</h3>
            <p className="mt-2 text-white/70">Primeira plataforma AI para desenvolvimento em português nativo. Sem traduções robóticas.</p>
            <div className="mt-6 h-24 rounded-lg bg-[conic-gradient(at_50%_50%,rgba(16,185,129,0.2),rgba(234,179,8,0.2),rgba(16,185,129,0.2))] animate-pulse" />
          </CardBase>

          {/* Card 3 */}
          <CardBase>
            <div className="text-4xl">📦</div>
            <h3 className="mt-4 text-2xl font-semibold text-white">Export Completo</h3>
            <p className="mt-2 text-white/70">Baixe o código completo. TypeScript, React, configurações. Rode em qualquer lugar.</p>
            <motion.div className="mt-6 w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
              ⬇️
            </motion.div>
          </CardBase>

          {/* Card 4 - Large */}
          <CardBase className="md:col-span-2">
            <div className="text-4xl">👁️</div>
            <h3 className="mt-4 text-2xl font-semibold text-white">Preview em Tempo Real</h3>
            <p className="mt-2 text-white/70">Veja cada mudança instantaneamente. Desktop, tablet, mobile. Tudo sincronizado.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <motion.div whileHover={{ scale: 1.03 }} className="aspect-video rounded-lg bg-white/5 border border-white/10" />
              <motion.div whileHover={{ scale: 1.03 }} className="aspect-[3/4] rounded-lg bg-white/5 border border-white/10" />
              <motion.div whileHover={{ scale: 1.03 }} className="aspect-[9/16] rounded-lg bg-white/5 border border-white/10" />
            </div>
          </CardBase>

          {/* Card 5 */}
          <CardBase className="bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10">
            <div className="text-4xl">🎨</div>
            <h3 className="mt-4 text-2xl font-semibold text-white">Templates Profissionais</h3>
            <p className="mt-2 text-white/70">Landing pages, dashboards, portfolios. Comece em segundos.</p>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6].map(i => (
                <motion.div key={i} className="aspect-video rounded-md bg-white/5" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }} />
              ))}
            </div>
          </CardBase>

          {/* Card 6 */}
          <CardBase className="bg-gradient-to-br from-blue-600/20 to-cyan-500/10">
            <div className="text-4xl">⚡</div>
            <h3 className="mt-4 text-2xl font-semibold text-white">Deploy Automático</h3>
            <p className="mt-2 text-white/70">Um clique. Seu app online. URL personalizada. SSL incluído.</p>
            <motion.div className="mt-6 h-24 rounded-lg bg-[radial-gradient(circle,#60A5FA,transparent_60%)]" animate={{ boxShadow: ['0 0 0px rgba(59,130,246,0.0)', '0 0 60px rgba(59,130,246,0.6)', '0 0 0px rgba(59,130,246,0.0)'] }} transition={{ repeat: Infinity, duration: 1.8 }} />
          </CardBase>
        </div>
      </div>
    </section>
  )
}

function TypingEditor() {
  const sample = `// React + TypeScript example\nimport { useState } from 'react'\n\ntype Todo = { id: number; text: string; done: boolean }\n\nexport default function App(){\n  const [todos, setTodos] = useState<Todo[]>([])\n  return (<ul>{todos.map(t=> <li key={t.id}>{t.text}</li>)}</ul>)\n}`
  const [content, setContent] = useState('')
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setContent(sample.slice(0, i))
      i = (i + 2) % (sample.length + 1)
    }, 20)
    return () => clearInterval(id)
  }, [])
  return (
    <pre className="text-sm text-white/90 font-mono leading-6 whitespace-pre-wrap">
      {content}
      <span className="animate-pulse">▋</span>
    </pre>
  )
}

// Hook: intersection observer
function useInView(options) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
      }
    }, options || { threshold: 0.2 })
    obs.observe(node)
    return () => obs.disconnect()
  }, [options])
  return { ref, inView }
}

function StepNumber({ n }) {
  return (
    <div className="relative select-none">
      <span className="block text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-[linear-gradient(135deg,#60A5FA,#A78BFA)]" style={{ WebkitTextStroke: '2px rgba(167,139,250,0.6)' }}>
        {n}
      </span>
    </div>
  )
}

function ChatBubbleTyping({ text }) {
  const [content, setContent] = useState('')
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setContent(text.slice(0, i))
      i = Math.min(i + 1, text.length)
      if (i === text.length) clearInterval(id)
    }, 25)
    return () => clearInterval(id)
  }, [text])
  return (
    <div className="flex items-start gap-3">
      <img src={`https://i.pravatar.cc/40?img=15`} className="w-8 h-8 rounded-full border border-white/20" />
      <div className="max-w-[320px] md:max-w-[420px] rounded-2xl px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/15 shadow-[0_10px_40px_rgba(99,102,241,0.25)]">
        <p className="text-white/90 text-sm md:text-base">
          {content}
          <span className="animate-pulse">▋</span>
        </p>
      </div>
    </div>
  )
}

function CodeWriter({ lines = 8, progress = 78 }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 300)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="w-full rounded-xl bg-slate-950/70 border border-white/10 p-4">
      <div className="flex gap-2 mb-3">
        <span className="w-3 h-3 rounded-full bg-red-400/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
      </div>
      <div className="font-mono text-xs md:text-sm text-white/80 space-y-1">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-white/30 w-6 text-right">{i + 1}</span>
            <span className="flex-1">
              <span className="text-sky-300">const</span>{' '}<span className="text-pink-300">comp</span>{' '}=
              {' '}<span className="text-emerald-300">() =&gt;</span>{' '}<span className="text-white">{'{'}</span>
              {i < (tick % (lines + 1)) ? <span className="text-white/70"> {/* typed */} ...</span> : <span className="opacity-30"> //</span>}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 w-full rounded bg-white/10 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-1 text-right text-xs text-white/60">Gerando componentes... {progress}%</div>
    </div>
  )
}

function SplitPreview() {
  const [cursor, setCursor] = useState({ x: 40, y: 30 })
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-slate-950/60">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-4 font-mono text-xs md:text-sm text-white/80 space-y-1">
          {`<Hero title=\"DEV AI\" />`}
          <div className="mt-2">color: <span className="text-sky-300">#60A5FA</span> → <span className="text-fuchsia-300">#A78BFA</span></div>
          <div className="mt-2">button: <span className="text-emerald-300">primary</span></div>
        </div>
        <div className="relative min-h-[140px] md:min-h-[180px] bg-gradient-to-br from-slate-800/40 to-slate-900/60">
          <motion.div
            className="absolute w-6 h-6 rounded-full bg-white/90 text-slate-800 flex items-center justify-center text-xs"
            animate={{ x: [20, 120, 60, 160], y: [20, 30, 80, 40] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            ⌁
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-white/80">Preview</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SuccessVisual() {
  return (
    <div className="relative w-full rounded-xl border border-white/10 bg-slate-950/60 p-6 overflow-hidden">
      <motion.div
        className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-3xl shadow-[0_0_40px_rgba(16,185,129,0.5)]"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        ✓
      </motion.div>
      <div className="mt-4 text-center text-white/80">seuapp.vercel.app</div>
      <motion.div className="absolute -top-4 right-6 text-3xl" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>⬇️</motion.div>
      {/* confetti */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{ left: `${(i * 11) % 100}%`, top: -10, background: i % 2 ? '#60A5FA' : '#A78BFA' }}
          animate={{ y: [0, 180], rotate: [0, 180] }}
          transition={{ repeat: Infinity, duration: 2 + (i % 5) * 0.3, delay: i * 0.1 }}
        />
      ))}
    </div>
  )
}

function Connector({ progress }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 top-0 h-full w-1 md:w-[3px]">
      <div className="relative h-full">
        <div className="absolute left-1/2 -translate-x-1/2 w-[3px] h-full bg-white/5 rounded" />
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-[3px] bg-gradient-to-b from-blue-500 to-purple-500 rounded"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}

function HowItWorksSection() {
  const containerRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handler = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height - vh * 0.2
      const passed = Math.min(Math.max(vh * 0.8 - rect.top, 0), total)
      setProgress(total > 0 ? passed / total : 0)
    }
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('scroll', handler)
      window.removeEventListener('resize', handler)
    }
  }, [])

  return (
    <section id="como-funciona" ref={containerRef} className="relative py-28 md:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_80%_10%,rgba(99,102,241,0.12),transparent),radial-gradient(900px_500px_at_20%_70%,rgba(14,165,233,0.1),transparent)]" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <h2 className="text-center text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-[linear-gradient(135deg,#60A5FA,#A78BFA)] mb-16">Do Zero ao Deploy em 4 Passos</h2>

        <div className="relative">
          <Connector progress={progress} />

          <div className="space-y-24">
            {/* Step 1 */}
            <Step
              index="01"
              side="left"
              visual={<ChatBubbleTyping text="Crie uma landing page para minha startup de IA" />}
              title="Descreva Sua Ideia"
              description="Converse naturalmente em português. Quanto mais detalhes, melhor o resultado."
            />

            {/* Step 2 */}
            <Step
              index="02"
              side="right"
              visual={<CodeWriter />}
              title="IA Gera Código Profissional"
              description="Claude AI analisa seu pedido e escreve React + TypeScript otimizado. Componentes reutilizáveis, código limpo."
            />

            {/* Step 3 */}
            <Step
              index="03"
              side="left"
              visual={<SplitPreview />}
              title="Visualize e Ajuste em Tempo Real"
              description="Cada mudança reflete instantaneamente. Não gostou? Só pedir ajustes. 'Mude a cor para azul', 'Adicione um footer'."
            />

            {/* Step 4 */}
            <Step
              index="04"
              side="right"
              visual={<SuccessVisual />}
              title="Exporte ou Publique"
              description="Baixe todo o código ou publique com um clique. Domínio gratuito incluído. Online em 30 segundos."
            />
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <a href="#" className="group inline-flex items-center gap-3 px-8 py-5 rounded-2xl text-[20px] font-semibold bg-[linear-gradient(90deg,#2563EB,#7C3AED,#DB2777)] text-white shadow-[0_0_40px_rgba(124,58,237,0.5)] hover:shadow-[0_0_60px_rgba(124,58,237,0.7)] transition-transform hover:scale-[1.02]">
            Experimentar Agora - Grátis <span className="text-2xl group-hover:translate-x-1 transition-transform">🚀</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function Step({ index, side, visual, title, description }) {
  const { ref, inView } = useInView({ threshold: 0.2 })
  const isLeft = side === 'left'
  return (
    <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      {/* Visual */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
        className={`order-1 ${isLeft ? '' : 'md:order-2'}`}
      >
        {visual}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? 40 : -40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.05 }}
        className={`order-2 ${isLeft ? '' : 'md:order-1'}`}
      >
        <div className="flex items-start gap-4">
          <StepNumber n={index} />
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white">{title}</h3>
            <p className="mt-2 text-white/70 max-w-prose">{description}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function PricingSection() {
  // hover tilt
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const onMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTilt({ ry: (x - 0.5) * 10, rx: -(y - 0.5) * 10 })
  }
  const onLeave = () => setTilt({ rx: 0, ry: 0 })

  return (
    <section className="relative py-28 md:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_30%_10%,rgba(99,102,241,0.12),transparent),radial-gradient(900px_500px_at_80%_70%,rgba(14,165,233,0.1),transparent)]" />
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <h2 className="text-center text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-[linear-gradient(135deg,#60A5FA,#A78BFA)] mb-14">Comece Grátis, Cresça Quando Quiser</h2>

        <div className="relative flex justify-center">
          {/* floating particles */}
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute w-2 h-2 rounded-full"
              style={{ background: i % 2 ? '#60A5FA' : '#A78BFA', left: `${(i * 7) % 100}%`, top: `${(i * 13) % 100}%`, filter: 'blur(0.5px)' }}
              animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 3 + (i % 5) * 0.3, delay: i * 0.1 }}
            />
          ))}

          <motion.div
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
            className="relative w-full max-w-[500px] rounded-[32px] p-[2px] bg-[conic-gradient(from_0deg,rgba(99,102,241,0.8),rgba(168,85,247,0.8),rgba(219,39,119,0.8),rgba(99,102,241,0.8))] animate-[spin_8s_linear_infinite]"
          >
            <div className="rounded-[30px] p-12 bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.35),0_0_120px_rgba(168,85,247,0.25)] relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(600px_200px at 50% -20%, rgba(255,255,255,0.08), transparent)' }} />

              <div className="mb-6 flex justify-center">
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-[0_0_20px_rgba(16,185,129,0.4)]">GRÁTIS PARA SEMPRE</span>
              </div>

              <div className="flex items-end justify-center gap-2">
                <div className="text-transparent bg-clip-text bg-[linear-gradient(135deg,#FDE68A,#F59E0B)] text-[56px] md:text-[72px] leading-none font-black">R$ 0</div>
                <div className="pb-2 text-white/70">/mês</div>
              </div>

              <div className="mt-2 text-center text-white/70">Perfeito para começar e validar ideias</div>

              <ul className="mt-8 space-y-3">
                {[
                  '50 mensagens com IA por mês',
                  '1 projeto ativo',
                  'Export de código ilimitado',
                  '3 templates profissionais',
                  'Preview em tempo real',
                  'Suporte via comunidade Discord',
                  'Atualizações gratuitas',
                ].map((t, i) => (
                  <li key={t} className="flex items-center gap-3 text-[16px] text-white/90">
                    <motion.span className="grid place-items-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white" whileHover={{ scale: 1.2 }}>✓</motion.span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <a href="#" className="mt-10 block w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-[18px] grid place-items-center shadow-[0_10px_40px_rgba(99,102,241,0.4)] hover:shadow-[0_10px_60px_rgba(99,102,241,0.6)] transition-transform hover:scale-[1.02]">
                Criar Conta Gratuita →
              </a>

              <div className="mt-3 text-center text-sm text-white/60">Sem cartão de crédito. Sem pegadinhas.</div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 text-center text-sm text-white/50">💎 Planos Pro e Enterprise em breve com mais recursos</div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#0b1020,#0c0720_40%,#130d2e)] relative overflow-hidden">
      {/* subtle grid */}
      <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />

      <Hero />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
    </div>
  )
}
