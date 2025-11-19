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
  const code = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`
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

export default function App() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#0b1020,#0c0720_40%,#130d2e)] relative overflow-hidden">
      {/* subtle grid */}
      <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />

      <Hero />
      <FeaturesSection />
    </div>
  )
}
