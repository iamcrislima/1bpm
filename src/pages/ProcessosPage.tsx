import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import NovoProcessoModal from '../components/bpm/NovoProcessoModal'
import { processos } from '../data/mockData'
import './ProcessosPage.css'

// ── Constantes ──────────────────────────────────────────────

const statusLabel: Record<string, string> = {
  publicado: 'Publicado',
  rascunho: 'Rascunho',
  arquivado: 'Arquivado',
}
const statusClass: Record<string, string> = {
  publicado: 'badge-success',
  rascunho: 'badge-warning',
  arquivado: 'badge-neutral',
}

const ICONE_MAP: Record<string, string> = {
  leaf: '🌿',
  'shopping-cart': '🛒',
  'file-contract': '📋',
  users: '👥',
  'user-plus': '👤',
  'check-circle': '✅',
}

// ── Card de Processo ─────────────────────────────────────────

function ProcessoCard({ proc, style }: { proc: typeof processos[0]; style?: React.CSSProperties }) {
  const navigate = useNavigate()

  const handleEditar = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const dest = proc.templateKey
      ? `/processos/novo?template=${proc.templateKey}`
      : '/processos/novo'
    navigate(dest)
  }

  return (
    <Link
      to={`/processos/${proc.id}`}
      className="processo-card card card-hover animate-fade-in"
      style={style}
    >
      <div className="processo-card-header">
        <div className="processo-icone" style={{ background: proc.cor + '18', color: proc.cor }}>
          {ICONE_MAP[proc.icone] ?? '✅'}
        </div>
        <div className="processo-meta">
          <span className={`badge ${statusClass[proc.status]}`}>{statusLabel[proc.status]}</span>
          <span className="badge badge-neutral">{proc.versao}</span>
        </div>
      </div>

      <div className="processo-info">
        <h3 className="processo-nome">{proc.nome}</h3>
        <p className="processo-area">{proc.area} · {proc.setor}</p>
        <p className="processo-desc">{proc.descricao}</p>
      </div>

      <div className="processo-kpis">
        <div className="mini-kpi">
          <span className="mini-kpi-value">{proc.instanciasAtivas}</span>
          <span className="mini-kpi-label">Ativos</span>
        </div>
        <div className="mini-kpi">
          <span className="mini-kpi-value">{proc.tempoMedio}d</span>
          <span className="mini-kpi-label">Tempo médio</span>
        </div>
        <div className="mini-kpi">
          <span
            className="mini-kpi-value"
            style={{ color: proc.percentualSLA >= 85 ? 'var(--success)' : proc.percentualSLA >= 70 ? 'var(--warning)' : 'var(--danger)' }}
          >
            {proc.percentualSLA > 0 ? `${proc.percentualSLA}%` : '—'}
          </span>
          <span className="mini-kpi-label">SLA</span>
        </div>
      </div>

      {(proc.atrasados > 0 || proc.otimizaveis > 0) && (
        <div className="processo-alerts">
          {proc.atrasados > 0 && (
            <span className="badge badge-danger">⚠️ {proc.atrasados} atrasado{proc.atrasados > 1 ? 's' : ''}</span>
          )}
          {proc.otimizaveis > 0 && (
            <span className="badge badge-warning">🧠 {proc.otimizaveis} otimizável{proc.otimizaveis > 1 ? 'is' : ''}</span>
          )}
        </div>
      )}

      <div className="processo-footer">
        <span className="processo-responsavel">👤 {proc.responsavel}</span>
        <span className="processo-data">
          {new Date(proc.ultimaAtualizacao).toLocaleDateString('pt-BR')}
        </span>
        <button className="processo-editar-btn" onClick={handleEditar} title="Editar fluxo no editor BPM">
          <i className="fa-regular fa-pen-to-square" />
          Editar fluxo
        </button>
      </div>
    </Link>
  )
}

// ── Linha de lista ───────────────────────────────────────────

function ProcessoRow({ proc }: { proc: typeof processos[0] }) {
  return (
    <Link to={`/processos/${proc.id}`} className="processo-list-row">
      <div className="proc-row-icon" style={{ background: proc.cor + '18', color: proc.cor }}>
        {ICONE_MAP[proc.icone] ?? '✅'}
      </div>
      <div className="proc-row-info">
        <span className="proc-row-nome">{proc.nome}</span>
        <span className="proc-row-resp">{proc.responsavel}</span>
      </div>
      <span className={`badge ${statusClass[proc.status]}`}>{statusLabel[proc.status]}</span>
      <span className="proc-row-stat">{proc.instanciasAtivas} ativos</span>
      <span className="proc-row-stat">{proc.tempoMedio > 0 ? `${proc.tempoMedio}d` : '—'}</span>
      <span
        className="proc-row-stat"
        style={{
          fontWeight: 700,
          color: proc.percentualSLA >= 85 ? 'var(--success)' : proc.percentualSLA >= 70 ? 'var(--warning)' : proc.percentualSLA === 0 ? 'var(--text-tertiary)' : 'var(--danger)',
        }}
      >
        {proc.percentualSLA > 0 ? `${proc.percentualSLA}%` : '—'}
      </span>
      <span className="proc-row-date">{new Date(proc.ultimaAtualizacao).toLocaleDateString('pt-BR')}</span>
    </Link>
  )
}

// ── Página principal ─────────────────────────────────────────

type ViewMode = 'pastas' | 'compacta' | 'lista'

export default function ProcessosPage() {
  const [searchParams] = useSearchParams()

  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroArea, setFiltroArea] = useState('todas')
  const [view, setView] = useState<ViewMode>('pastas')
  const [showNovoModal, setShowNovoModal] = useState(false)

  const areasList = Array.from(new Set(processos.map(p => p.area)))

  // Pastas: primeira área expandida por padrão
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(
    () => new Set([areasList[0]])
  )

  const toggleArea = (area: string) => {
    setExpandedAreas(prev => {
      const next = new Set(prev)
      if (next.has(area)) next.delete(area)
      else next.add(area)
      return next
    })
  }

  // Sincroniza expansão quando filtroArea muda
  useEffect(() => {
    if (filtroArea === 'todas') setExpandedAreas(new Set([areasList[0]]))
    else setExpandedAreas(new Set([filtroArea]))
  }, [filtroArea]) // eslint-disable-line react-hooks/exhaustive-deps

  // Detecta ?pendencias=1 vindo da Visão Geral
  useEffect(() => {
    if (searchParams.get('pendencias') === '1') {
      setBusca('')
      setFiltroStatus('todos')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const applyFilters = (list: typeof processos) =>
    list.filter(p => {
      const matchBusca =
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.area.toLowerCase().includes(busca.toLowerCase())
      const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus
      const matchArea = filtroArea === 'todas' || p.area === filtroArea
      return matchBusca && matchStatus && matchArea
    })

  const filtrados = applyFilters(processos)

  return (
    <div className="processos-page animate-fade-in">

      {/* ── Toolbar ── */}
      <div className="processos-toolbar">
        <div className="toolbar-left">
          <div className="processos-busca-wrap">
            <i className="fa-regular fa-magnifying-glass processos-busca-icon" />
            <input
              className="input processos-busca"
              placeholder="Buscar processos..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          <select className="input select" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
            <option value="todos">Todos os status</option>
            <option value="publicado">Publicado</option>
            <option value="rascunho">Rascunho</option>
            <option value="arquivado">Arquivado</option>
          </select>
          <select className="input select" value={filtroArea} onChange={e => setFiltroArea(e.target.value)}>
            {(['todas', ...areasList]).map(a => (
              <option key={a} value={a}>{a === 'todas' ? 'Todas as áreas' : a}</option>
            ))}
          </select>
        </div>
        <div className="toolbar-right">
          <div className="view-toggle">
            <button
              className={`view-btn ${view === 'pastas' ? 'active' : ''}`}
              onClick={() => setView('pastas')}
              title="Visão em pastas"
            >
              <i className="fa-regular fa-folders" />
            </button>
            <button
              className={`view-btn ${view === 'compacta' ? 'active' : ''}`}
              onClick={() => setView('compacta')}
              title="Grade compacta"
            >
              <i className="fa-regular fa-grid-2" />
            </button>
            <button
              className={`view-btn ${view === 'lista' ? 'active' : ''}`}
              onClick={() => setView('lista')}
              title="Lista"
            >
              <i className="fa-regular fa-list" />
            </button>
          </div>
          <button className="btn btn-secondary" onClick={() => {}}>
            <i className="fa-regular fa-folder-plus" />
            Nova Área
          </button>
          <button className="btn btn-primary" onClick={() => setShowNovoModal(true)}>
            <i className="fa-regular fa-plus" />
            Novo Processo
          </button>
        </div>
      </div>

      {/* ── Resultados ── */}
      <div className="processos-count">
        {filtrados.length} processo{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
        {busca && <span> para "<strong>{busca}</strong>"</span>}
      </div>

      {/* ── VIEW: Pastas (accordion por área) ── */}
      {view === 'pastas' && (
        <div className="areas-panels">
          {areasList.map(area => {
            if (filtroArea !== 'todas' && filtroArea !== area) return null

            const areaProcs   = applyFilters(processos.filter(p => p.area === area))
            const totalArea   = processos.filter(p => p.area === area).length
            const atrasados   = processos.filter(p => p.area === area).reduce((acc, p) => acc + p.atrasados, 0)
            const isOpen      = expandedAreas.has(area)

            return (
              <div key={area} className={`area-panel${isOpen ? ' area-panel--open' : ''}`}>
                {/* Header clicável */}
                <button className="area-panel-header" onClick={() => toggleArea(area)}>
                  <div className="area-panel-header-left">
                    <i className={`fa-regular fa-chevron-right area-panel-chevron${isOpen ? ' area-panel-chevron--open' : ''}`} />
                    <i className={`fa-regular ${isOpen ? 'fa-folder-open' : 'fa-folder'} area-panel-folder-icon`} />
                    <span className="area-panel-name">{area}</span>
                    <span className="area-panel-count">{totalArea} processo{totalArea !== 1 ? 's' : ''}</span>
                    {atrasados > 0 && (
                      <span className="badge badge-danger area-panel-badge">
                        <i className="fa-regular fa-triangle-exclamation" />
                        {atrasados} em atraso
                      </span>
                    )}
                  </div>
                  <span className="area-panel-hint">{isOpen ? 'Recolher' : 'Expandir'}</span>
                </button>

                {/* Corpo expansível */}
                {isOpen && (
                  <div className="area-panel-body animate-fade-in">
                    {areaProcs.length > 0 ? (
                      <div className="processos-grid">
                        {areaProcs.map((proc, j) => (
                          <ProcessoCard
                            key={proc.id}
                            proc={proc}
                            style={{ animationDelay: `${j * 40}ms` }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="area-section-empty">
                        <i className="fa-regular fa-magnifying-glass" />
                        <span>Nenhum processo encontrado com os filtros aplicados nesta área.</span>
                      </div>
                    )}

                    <button className="area-add-btn" onClick={() => setShowNovoModal(true)}>
                      <i className="fa-regular fa-plus" />
                      Adicionar processo nesta área
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {/* Painel "Nova Área" */}
          <button className="area-new-card">
            <i className="fa-regular fa-plus area-new-card-icon" />
            <span className="area-new-card-label">Nova Área</span>
            <span className="area-new-card-desc">Agrupe processos por departamento ou função</span>
          </button>
        </div>
      )}

      {/* ── VIEW: Grade compacta (flat, sem agrupamento) ── */}
      {view === 'compacta' && (
        <div className="processos-grid processos-grid--compacta animate-fade-in">
          {filtrados.map((proc, i) => (
            <ProcessoCard key={proc.id} proc={proc} style={{ animationDelay: `${i * 30}ms` }} />
          ))}
        </div>
      )}

      {/* ── VIEW: Lista ── */}
      {view === 'lista' && (
        <div className="processos-list-view animate-fade-in">
          {/* Header da tabela */}
          <div className="processos-list-header">
            <div className="proc-row-icon" style={{ width: 32 }} />
            <div className="proc-row-info">
              <span>Processo</span>
            </div>
            <span>Status</span>
            <span>Instâncias</span>
            <span>Tempo médio</span>
            <span>SLA</span>
            <span>Atualizado</span>
          </div>

          {areasList.map(area => {
            const areaProcs = applyFilters(processos.filter(p => p.area === area))
            if (filtroArea !== 'todas' && filtroArea !== area) return null
            if (areaProcs.length === 0) return null

            return (
              <div key={area} className="processos-list-group">
                <div className="processos-list-group-label">{area}</div>
                {areaProcs.map(proc => (
                  <ProcessoRow key={proc.id} proc={proc} />
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Modal Novo Processo ── */}
      {showNovoModal && <NovoProcessoModal onClose={() => setShowNovoModal(false)} />}
    </div>
  )
}
