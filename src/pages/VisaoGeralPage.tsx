import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { processos, dashboard } from '../data/mockData'
import NovoProcessoModal from '../components/bpm/NovoProcessoModal'
import AutomacoesPage from './AutomacoesPage'
import AutomacaoErrorBoundary from '../components/layout/AutomacaoErrorBoundary'
import './VisaoGeralPage.css'

// ── Mock: fila de tarefas aguardando ação do usuário ────────
const MINHA_FILA = [
  {
    id: 'fila-1',
    nome: 'Licenciamento Ambiental',
    numero: '2026/0842',
    area: 'Meio Ambiente',
    prazo: 2,
    urgente: true,
    processoId: 'licenciamento-ambiental',
    etapa: 'Aguardando parecer técnico',
  },
  {
    id: 'fila-2',
    nome: 'Gestão de Contratos',
    numero: '2026/0311',
    area: 'Jurídico',
    prazo: 5,
    urgente: false,
    processoId: 'gestao-contratos',
    etapa: 'Revisão jurídica',
  },
  {
    id: 'fila-3',
    nome: 'Ouvidoria',
    numero: '2026/1105',
    area: 'Atendimento ao Cidadão',
    prazo: 1,
    urgente: true,
    processoId: 'ouvidoria',
    etapa: 'Análise da manifestação',
  },
  {
    id: 'fila-4',
    nome: 'Admissão de Servidores',
    numero: '2026/0028',
    area: 'Recursos Humanos',
    prazo: 7,
    urgente: false,
    processoId: 'admissao-servidores',
    etapa: 'Validação de documentos',
  },
]

// ── Volume por área (instâncias ativas) ─────────────────────
const volumePorArea = (() => {
  const areaMap = new Map<string, number>()
  processos.forEach(p => {
    areaMap.set(p.area, (areaMap.get(p.area) ?? 0) + p.instanciasAtivas)
  })
  const entries = Array.from(areaMap.entries())
    .map(([area, total]) => ({ area, total }))
    .sort((a, b) => b.total - a.total)
  const max = entries[0]?.total ?? 1
  return { entries, max }
})()

// ── Paleta de cores por área ────────────────────────────────
const AREA_COLORS: Record<string, string> = {
  'Atendimento ao Cidadão': 'var(--warning)',
  'Meio Ambiente':          'var(--success)',
  'Administrativo':         'var(--primary-pure)',
  'Jurídico':               'var(--danger)',
  'Recursos Humanos':       'var(--info)',
}

export default function VisaoGeralPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showNovoModal, setShowNovoModal] = useState(false)
  const tab = searchParams.get('tab')

  if (tab === 'automacoes') {
    return (
      <AutomacaoErrorBoundary>
        <AutomacoesPage />
      </AutomacaoErrorBoundary>
    )
  }

  const kpis = [
    {
      label: 'Processos ativos',
      value: dashboard.instanciasAtivas,
      icon: 'fa-regular fa-gauge',
      bg: 'var(--primary-light)',
      color: 'var(--primary-pure)',
    },
    {
      label: 'Em atraso',
      value: dashboard.atrasados,
      icon: 'fa-regular fa-triangle-exclamation',
      bg: 'var(--danger-light)',
      color: 'var(--danger)',
    },
    {
      label: 'Aguardando minha ação',
      value: MINHA_FILA.length,
      icon: 'fa-regular fa-clock',
      bg: 'var(--warning-light)',
      color: 'var(--warning)',
    },
    {
      label: 'Publicados',
      value: dashboard.publicados,
      icon: 'fa-regular fa-circle-check',
      bg: 'var(--success-light)',
      color: 'var(--success)',
    },
  ]

  return (
    <div key="visao-geral" className="vg-page animate-fade-in">

      {/* ── KPIs ── */}
      <div className="vg-kpis">
        {kpis.map(kpi => (
          <div key={kpi.label} className="vg-kpi-card">
            <div className="vg-kpi-icon" style={{ background: kpi.bg, color: kpi.color }}>
              <i className={kpi.icon} />
            </div>
            <div className="vg-kpi-body">
              <div className="vg-kpi-value">{kpi.value}</div>
              <div className="vg-kpi-label">{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Corpo: Minha Fila + Volume por Área ── */}
      <div className="vg-body">

        {/* Minha fila */}
        <div className="vg-card vg-fila">
          <div className="vg-card-header">
            <div className="vg-card-title-row">
              <i className="fa-regular fa-inbox" />
              <h2 className="vg-card-title">Minha fila</h2>
              <span className="vg-card-count">{MINHA_FILA.length}</span>
            </div>
            <Link to="/processos/fluxos" className="vg-card-link">
              Ver todos <i className="fa-regular fa-arrow-right" />
            </Link>
          </div>

          <div className="vg-fila-list">
            {MINHA_FILA.map(item => (
              <Link
                key={item.id}
                to={`/processos/${item.processoId}`}
                className="vg-fila-item"
              >
                {/* Status dot */}
                <div className={`vg-fila-dot ${item.urgente ? 'vg-fila-dot--urgente' : ''}`} />

                {/* Conteúdo principal */}
                <div className="vg-fila-main">
                  <div className="vg-fila-nome">
                    {item.nome}
                    <span className="vg-fila-numero">{item.numero}</span>
                  </div>
                  <div className="vg-fila-etapa">{item.etapa}</div>
                </div>

                {/* Meta: área + prazo */}
                <div className="vg-fila-meta">
                  <span className="badge badge-neutral vg-fila-area">{item.area}</span>
                  <span
                    className={`vg-fila-prazo ${item.prazo <= 2 ? 'vg-fila-prazo--urgente' : ''}`}
                  >
                    <i className="fa-regular fa-clock" />
                    {item.prazo === 1 ? '1 dia' : `${item.prazo} dias`}
                  </span>
                </div>

                <i className="fa-regular fa-chevron-right vg-fila-arrow" />
              </Link>
            ))}
          </div>
        </div>

        {/* Volume por área */}
        <div className="vg-card vg-volume">
          <div className="vg-card-header">
            <div className="vg-card-title-row">
              <i className="fa-regular fa-chart-bar" />
              <h2 className="vg-card-title">Volume por área</h2>
            </div>
            <span className="vg-card-subtitle">Instâncias ativas</span>
          </div>

          <div className="vg-bars">
            {volumePorArea.entries.map(({ area, total }) => (
              <div key={area} className="vg-bar-row">
                <span className="vg-bar-label">{area}</span>
                <div className="vg-bar-track">
                  <div
                    className="vg-bar-fill"
                    style={{
                      width: `${(total / volumePorArea.max) * 100}%`,
                      background: AREA_COLORS[area] ?? 'var(--primary-pure)',
                    }}
                  />
                </div>
                <span className="vg-bar-value">{total}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Ações Rápidas ── */}
      <div className="vg-actions-strip">
        <div className="vg-actions-label">Ações rápidas</div>
        <div className="vg-actions-row">
          <button
            className="vg-action-btn vg-action-btn--primary"
            onClick={() => setShowNovoModal(true)}
          >
            <i className="fa-regular fa-diagram-project" />
            Novo Fluxo
          </button>

          <button
            className="vg-action-btn"
            onClick={() => navigate('/formularios?action=new')}
          >
            <i className="fa-regular fa-clipboard-list" />
            Novo Formulário
          </button>

          <button
            className="vg-action-btn vg-action-btn--warning"
            onClick={() => navigate('/processos/fluxos?pendencias=1')}
          >
            <i className="fa-regular fa-triangle-exclamation" />
            Ver Pendências
            {dashboard.atrasados > 0 && (
              <span className="vg-action-badge">{dashboard.atrasados}</span>
            )}
          </button>
        </div>
      </div>

      {showNovoModal && <NovoProcessoModal onClose={() => setShowNovoModal(false)} />}
    </div>
  )
}
