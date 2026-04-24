import { BrowserRouter, Routes, Route, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Header from './components/layout/Header'
import Subheader from './components/layout/Subheader'
import Softbar from './components/layout/Softbar'
import BpmTabBar from './components/layout/BpmTabBar'
import CentralDeAcoes from './pages/CentralDeAcoes'
import VisaoGeralPage from './pages/VisaoGeralPage'
import ProcessosPage from './pages/ProcessosPage'
import ProcessoDetailPage from './pages/ProcessoDetailPage'
import FormulariosPage from './pages/FormulariosPage'
import BpmEditor from './components/bpm/editor/BpmEditor'
import BpmAiAssistant from './components/bpm/BpmAiAssistant'
import { processos } from './data/mockData'
import './App.css'

// ── Placeholder pages ──────────────────────────────────────
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{title}</h2>
      <p style={{ fontSize: 13 }}>Esta seção está em desenvolvimento.</p>
    </div>
  )
}

// ── Root layout ────────────────────────────────────────────
const MOCK_CONTRACTED = ['processos-digitais', 'obras']

function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Rotas que pertencem à área de Processos Inteligentes
  const isBpmRoute =
    location.pathname.startsWith('/processos') ||
    location.pathname.startsWith('/formularios')

  // Resolve nome do processo para breadcrumb de detalhe
  const resolveProcessoNome = (id: string) => {
    const p = processos.find(p => p.id === id)
    return p?.nome ?? id
  }

  // Breadcrumb dinâmico
  const breadcrumb = (() => {
    const root = { label: '1Doc', to: '/' }
    const procInteligentes = { label: 'Proc. Inteligentes', to: '/processos' }

    if (location.pathname === '/processos') {
      const tab = searchParams.get('tab')
      if (tab === 'automacoes') return [root, procInteligentes, { label: 'Automações' }]
      return [root, procInteligentes, { label: 'Visão Geral' }]
    }
    if (location.pathname === '/processos/fluxos') {
      return [root, procInteligentes, { label: 'Processos' }]
    }
    if (location.pathname === '/processos/novo') {
      return [root, procInteligentes, { label: 'Processos', to: '/processos/fluxos' }, { label: 'Novo Processo' }]
    }
    const matchDetalhe = location.pathname.match(/^\/processos\/([^/]+)$/)
    if (matchDetalhe) {
      const id = matchDetalhe[1]
      return [root, procInteligentes, { label: 'Processos', to: '/processos/fluxos' }, { label: resolveProcessoNome(id) }]
    }
    if (location.pathname.startsWith('/processos')) {
      return [root, procInteligentes, { label: 'Processos' }]
    }
    if (location.pathname.startsWith('/formularios')) {
      return [root, procInteligentes, { label: 'Formulários' }]
    }
    if (location.pathname === '/') return [{ label: 'Central de Ações' }]
    if (location.pathname.startsWith('/atividades')) return [{ label: 'Atividades' }]
    if (location.pathname.startsWith('/documentos')) return [{ label: 'Documentos' }]
    if (location.pathname.startsWith('/assinaturas')) return [{ label: 'Assinaturas' }]
    if (location.pathname.startsWith('/integracoes')) return [{ label: 'Integrações' }]
    if (location.pathname.startsWith('/relatorios')) return [{ label: 'Relatórios' }]
    if (location.pathname.startsWith('/configuracoes')) return [{ label: 'Configurações' }]
    return [{ label: 'Central de Ações' }]
  })()

  return (
    <div className="app-root">
      {/* Softbar — sempre em modo produto (navegação entre produtos 1Doc) */}
      <Softbar
        activeProductId={isBpmRoute ? 'processos-digitais' : 'processos-digitais'}
        clientProducts={MOCK_CONTRACTED}
        onProductChange={(id) => {
          if (id === 'processos-digitais') navigate('/')
        }}
      />

      {/* Conteúdo principal */}
      <div className="app-main">
        <Header />
        <Subheader breadcrumb={breadcrumb} />

        {/* Tab bar de Processos Inteligentes */}
        {isBpmRoute && <BpmTabBar />}

        {/* Assistente de IA — flutuante em todas as rotas BPM */}
        {isBpmRoute && <BpmAiAssistant />}

        <div className="bpm-main-content">
          <Routes>
            <Route path="/" element={<CentralDeAcoes />} />
            <Route path="/processos" element={<VisaoGeralPage />} />
            <Route path="/processos/fluxos" element={<ProcessosPage />} />
            <Route path="/processos/novo" element={<BpmEditor />} />
            <Route path="/processos/:id" element={<ProcessoDetailPage />} />
            <Route path="/formularios" element={<FormulariosPage />} />
            <Route path="/atividades" element={<PlaceholderPage title="Atividades" />} />
            <Route path="/documentos" element={<PlaceholderPage title="Documentos" />} />
            <Route path="/assinaturas" element={<PlaceholderPage title="Assinaturas" />} />
            <Route path="/comunicacao" element={<PlaceholderPage title="Comunicação" />} />
            <Route path="/integracoes" element={<PlaceholderPage title="Integrações" />} />
            <Route path="/relatorios" element={<PlaceholderPage title="Relatórios" />} />
            <Route path="/configuracoes" element={<PlaceholderPage title="Configurações" />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
