import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { processos, fluxos, versoes, regras } from '../data/mockData'
import FlowCanvas from '../components/bpm/FlowCanvas'
import './ProcessoDetailPage.css'

const TABS = [
  { id: 'visao-geral',  label: 'Visão geral',           icon: 'fa-regular fa-chart-pie' },
  { id: 'fluxo',        label: 'Fluxo do processo',      icon: 'fa-regular fa-diagram-project' },
  { id: 'formulario',   label: 'Formulário',             icon: 'fa-regular fa-clipboard-list' },
  { id: 'regras',       label: 'Regras e automações',    icon: 'fa-regular fa-bolt' },
  { id: 'sla',          label: 'Prazos e SLAs',          icon: 'fa-regular fa-clock' },
  { id: 'historico',    label: 'Histórico e Versões',    icon: 'fa-regular fa-clock-rotate-left' },
  { id: 'performance',  label: 'Performance',            icon: 'fa-regular fa-chart-line' },
]

export default function ProcessoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState('visao-geral')

  const processo = processos.find(p => p.id === id) || processos[0]
  const fluxo = fluxos.find(f => f.processoId === processo.id)
  const versoesProcesso = versoes[processo.id] || []
  const regrasProcesso = regras[processo.id] || []

  const etapas = fluxo?.etapas.filter(e => e.tipo === 'tarefa') || []

  return (
    <div className="processo-detail animate-fade-in">
      {/* Page Header */}
      <div className="processo-page-header">
        <div className="processo-header-left">
          <div className="processo-title-row">
            <h1 className="processo-title">{processo.nome}</h1>
            <span className="badge badge-success" style={{fontSize:12, padding:'3px 10px'}}>● Publicado</span>
          </div>
          <p className="processo-subtitle">{processo.descricao}</p>
        </div>
        <div className="processo-header-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/processos')}>
            <i className="fa-regular fa-chevron-left" />
            Voltar
          </button>
          <button className="btn btn-secondary">
            <i className="fa-regular fa-arrow-up-right-from-square" />
            Exportar
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              const dest = processo.templateKey
                ? `/processos/novo?template=${processo.templateKey}`
                : '/processos/novo'
              navigate(dest)
            }}
          >
            <i className="fa-regular fa-pen-to-square" />
            Editar fluxo
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="processo-tabs-bar">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`processo-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <i className={t.icon} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="processo-tab-content">

        {/* ── TAB 1: Visão Geral ── */}
        {tab === 'visao-geral' && (
          <div className="tab-visao-geral animate-fade-in">
            {/* KPIs */}
            <div className="vg-kpis">
              <div className="vg-kpi-card vg-kpi-card--primary">
                <div className="vg-kpi-icon-wrap" style={{ background: 'var(--primary-light)', color: 'var(--primary-pure)' }}>
                  <i className="fa-regular fa-hourglass-half" />
                </div>
                <div className="vg-kpi-label">Tempo total</div>
                <div className="vg-kpi-value">{processo.tempoMedio}<span className="vg-kpi-unit"> dias</span></div>
                <div className="vg-kpi-sub">Média dos últimos 6 meses</div>
              </div>
              <div className="vg-kpi-card vg-kpi-card--warning">
                <div className="vg-kpi-icon-wrap" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
                  <i className="fa-regular fa-triangle-exclamation" />
                </div>
                <div className="vg-kpi-label">SLA a vencer</div>
                <div className="vg-kpi-value">40<span className="vg-kpi-unit"> dias</span></div>
                <div className="vg-kpi-sub">Vence em 04/08/2024</div>
              </div>
              <div className="vg-kpi-card vg-kpi-card--info">
                <div className="vg-kpi-icon-wrap" style={{ background: 'var(--bpm-sky-light)', color: 'var(--bpm-sky)' }}>
                  <i className="fa-regular fa-layer-group" />
                </div>
                <div className="vg-kpi-label">Instâncias ativas</div>
                <div className="vg-kpi-value">{processo.instanciasAtivas}</div>
                <div className="vg-kpi-sub">+12% em relação ao mês anterior</div>
              </div>
              <div className="vg-kpi-card vg-kpi-card--success">
                <div className="vg-kpi-icon-wrap" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                  <i className="fa-regular fa-circle-check" />
                </div>
                <div className="vg-kpi-label">Taxa de conclusão</div>
                <div className="vg-kpi-value">{processo.taxaConclusao}<span className="vg-kpi-unit">%</span></div>
                <div className="vg-kpi-sub">% em relação ao total aberto</div>
              </div>
            </div>

            {/* Info + Docs */}
            <div className="vg-body">
              <div className="vg-col-left">
                {/* Info */}
                <div className="card card-body vg-info">
                  <div className="vg-info-row">
                    <div className="vg-info-item">
                      <span className="vg-info-label">⚠️ Tarefa identificada</span>
                      <span className="vg-info-value">{processo.atrasados > 0 ? `${processo.atrasados} atrasada${processo.atrasados > 1 ? 's':''}`:'Nenhuma'}</span>
                    </div>
                    <div className="vg-info-item">
                      <span className="vg-info-label">🏢 Setor responsável</span>
                      <span className="vg-info-value">{processo.setor}</span>
                    </div>
                    <div className="vg-info-item">
                      <span className="vg-info-label">Aguardar pagamento</span>
                      <span className="vg-info-value">Etapa com menor tempo: 30 dias</span>
                    </div>
                    <div className="vg-info-item">
                      <span className="vg-info-label">📅 Última atualização</span>
                      <span className="vg-info-value">{new Date(processo.ultimaAtualizacao).toLocaleDateString('pt-BR')} 16:33</span>
                    </div>
                    <div className="vg-info-item">
                      <span className="vg-info-label">👤 Responsável</span>
                      <span className="vg-info-value">{processo.responsavel}</span>
                    </div>
                    <div className="vg-info-item">
                      <span className="vg-info-label">📍 Status atual</span>
                      <span className="vg-info-value">Setor de Licenciamento</span>
                    </div>
                  </div>
                </div>

                {/* Aplicações e Integrações */}
                <div className="card card-body">
                  <h3 className="vg-section-title">Aplicações e Integrações</h3>
                  <div className="vg-integrações">
                    {['Ciudadão', 'Pagamento', 'Assinaltura', 'Notificações', 'e-mail', 'Estação'].map(app => (
                      <div key={app} className="integracao-item">
                        <div className="integracao-icon">🔗</div>
                        <span>{app}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="vg-col-right">
                {/* Documentos Relacionados */}
                <div className="card card-body vg-side-card">
                  <div className="vg-side-card-header">
                    <div className="vg-side-card-icon" style={{ background: 'var(--bpm-indigo-light)', color: 'var(--bpm-indigo)' }}>
                      <i className="fa-regular fa-paperclip" />
                    </div>
                    <h3 className="vg-section-title">Documentos relacionados</h3>
                  </div>
                  <div className="vg-documentos">
                    {[
                      { nome: 'Lei Complementar nº 140/2011', tipo: 'Lei' },
                      { nome: 'Resolução COAMRA nº 237/1997', tipo: 'Resolução' },
                    ].map(doc => (
                      <div key={doc.nome} className="vg-doc-item">
                        <div className="vg-doc-icon">
                          <i className="fa-regular fa-file-lines" />
                        </div>
                        <div className="vg-doc-body">
                          <a href="#" className="vg-doc-link">{doc.nome}</a>
                          <span className="vg-doc-tipo">{doc.tipo}</span>
                        </div>
                      </div>
                    ))}
                    <button className="btn btn-ghost btn-sm vg-ver-todos">Ver todos →</button>
                  </div>
                </div>

                {/* Etapas do processo */}
                <div className="card card-body vg-side-card">
                  <div className="vg-side-card-header">
                    <div className="vg-side-card-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                      <i className="fa-regular fa-list-check" />
                    </div>
                    <h3 className="vg-section-title">Etapas do processo</h3>
                  </div>
                  <div className="etapas-list">
                    {etapas.map((etapa, i) => (
                      <div key={etapa.id} className="etapa-item">
                        <div className="etapa-num">{i + 1}</div>
                        <div className="etapa-body">
                          <div className="etapa-nome">{etapa.nome}</div>
                          <div className="etapa-resp">
                            <i className="fa-regular fa-user" style={{ fontSize: 10 }} />
                            {etapa.responsavel}
                            <span className="etapa-sep">·</span>
                            <i className="fa-regular fa-clock" style={{ fontSize: 10 }} />
                            {etapa.prazo} dias
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-ghost btn-sm vg-ver-todos" onClick={() => setTab('fluxo')}>
                    <i className="fa-regular fa-diagram-project" />
                    Ver fluxo completo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: Fluxo do Processo ── */}
        {tab === 'fluxo' && fluxo && (
          <div className="tab-fluxo animate-fade-in">
            <div className="fluxo-toolbar">
              <div className="fluxo-toolbar-left">
                <button className="btn btn-secondary btn-sm">⊞ Modo simples</button>
                <button className="btn btn-ghost btn-sm">⊟ Modo avançado</button>
              </div>
              <div className="fluxo-toolbar-right">
                <span className="badge badge-neutral">100%</span>
                <button className="btn btn-ghost btn-sm">⊕</button>
                <button className="btn btn-ghost btn-sm">⊖</button>
                <button className="btn btn-ghost btn-sm">⤢</button>
              </div>
            </div>
            <FlowCanvas etapas={fluxo.etapas} />
          </div>
        )}

        {/* ── TAB 3: Formulário ── */}
        {tab === 'formulario' && (
          <div className="tab-formulario animate-fade-in">
            <div className="formulario-layout">
              <div className="formulario-etapas-col">
                <h3 className="col-title">Etapas do processo</h3>
                <div className="form-etapas-list">
                  {(['Analisar solicitação', 'Emitir taxa', 'Aguardar pagamento', 'Emitir licença'] as const).map((e, i) => (
                    <div key={e} className={`form-etapa-item ${i === 0 ? 'active' : ''}`}>
                      <div className="form-etapa-num">{i + 1}</div>
                      <span>{e}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="formulario-campos-col">
                <div className="formulario-campos-header">
                  <div>
                    <h3 className="col-title">Campos do etapa: Analisar solicitação</h3>
                    <p style={{fontSize:'var(--font-size-xs)', color:'var(--text-tertiary)'}}>
                      Configure os campos que serão exibidos nesta etapa do processo
                    </p>
                  </div>
                  <button className="btn btn-primary btn-sm">+ Adicionar campo</button>
                </div>

                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome do Campo</th>
                      <th>Tipo</th>
                      <th>Obrigatório</th>
                      <th>Visível</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { nome: 'Nome do requerente', tipo: 'Texto curto', obrig: 'Sim' },
                      { nome: 'CPF / CNPJ', tipo: 'Texto curto', obrig: 'Sim' },
                      { nome: 'Atividade desenvolvida', tipo: 'Texto longo', obrig: 'Sim' },
                      { nome: 'Endereço do empreendimento', tipo: 'Texto longo', obrig: 'Sim' },
                      { nome: 'Coordenadas geográficas', tipo: 'Texto curto', obrig: 'Não' },
                      { nome: 'Documentos anexos', tipo: 'Arquivo', obrig: 'Sim' },
                      { nome: 'Solicitação de revisão', tipo: 'Assinatura', obrig: 'Sim' },
                    ].map((campo, i) => (
                      <tr key={i}>
                        <td style={{color:'var(--text-tertiary)'}}>{i + 1}</td>
                        <td style={{fontWeight:500}}>{campo.nome}</td>
                        <td><span className="badge badge-neutral">{campo.tipo}</span></td>
                        <td>
                          <span className={`badge ${campo.obrig === 'Sim' ? 'badge-danger' : 'badge-neutral'}`}>{campo.obrig}</span>
                        </td>
                        <td>
                          <div className="toggle-switch active" style={{transform:'scale(0.8)'}} />
                        </td>
                        <td>
                          <div style={{display:'flex', gap:4}}>
                            <button className="btn btn-ghost btn-sm">✏️</button>
                            <button className="btn btn-ghost btn-sm">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="formulario-config-col">
                <h3 className="col-title">Configurações da etapa</h3>
                <div className="config-section">
                  <div className="config-label">Regras de edição</div>
                  <button className="btn btn-secondary btn-sm w-full">Definir validações e restrições do campo →</button>
                </div>
                <div className="config-section">
                  <div className="config-label">Solicitações</div>
                  <button className="btn btn-secondary btn-sm w-full">Defina regras condicionadas para exibir campos →</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: Regras e Automações ── */}
        {tab === 'regras' && (
          <div className="tab-regras animate-fade-in">
            <div className="regras-layout">
              <div className="regras-col">
                <div className="regras-col-header">
                  <h3 className="col-title">Regras do processo</h3>
                  <button className="btn btn-secondary btn-sm">+ Nova regra</button>
                </div>
                <div className="regras-list">
                  {regrasProcesso.map(regra => (
                    <div key={regra.id} className={`regra-item card card-body ${!regra.ativa ? 'inativa' : ''}`}>
                      <div className="regra-header">
                        <div className={`toggle-switch ${regra.ativa ? 'active' : ''}`} style={{transform:'scale(0.85)'}} />
                        <span className="badge badge-primary">{regra.acao}</span>
                      </div>
                      <p className="regra-desc">
                        <strong>Se</strong> {regra.descricao.split(' - ')[0].replace('Se ', '')}
                      </p>
                      <p className="regra-acao-desc"><strong>Então:</strong> {regra.acao.toLowerCase()}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="regras-col">
                <div className="regras-col-header">
                  <h3 className="col-title">Automações</h3>
                  <button className="btn btn-secondary btn-sm">+ Nova automação</button>
                </div>
                <div className="automacao-empty">
                  <div className="automacao-empty-icon">⚡</div>
                  <p>Nenhuma automação configurada</p>
                  <button className="btn btn-primary btn-sm">Criar automação</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: Prazos e SLAs ── */}
        {tab === 'sla' && (
          <div className="tab-sla animate-fade-in">
            {/* Resumo */}
            <div className="sla-resumo">
              <div className="sla-kpi">
                <div className="sla-kpi-label">Resumo do prazo</div>
                <div className="sla-kpi-value">{processo.tempoMedio} dias úteis</div>
              </div>
              <div className="sla-kpi">
                <div className="sla-kpi-label">Tempo médio real</div>
                <div className="sla-kpi-value">52 dias</div>
              </div>
              <div className="sla-kpi">
                <div className="sla-kpi-label">% dentro do SLA</div>
                <div className="sla-kpi-value sla-warn">{processo.percentualSLA}%</div>
                <div className="sla-progress">
                  <div className="sla-bar" style={{width: `${processo.percentualSLA}%`, background: processo.percentualSLA >= 85 ? 'var(--success)' : processo.percentualSLA >= 70 ? 'var(--warning)' : 'var(--danger)'}} />
                </div>
              </div>
              <div className="sla-kpi">
                <div className="sla-kpi-label">Alertas vencidos</div>
                <div className="sla-kpi-value sla-danger">{processo.atrasados}</div>
              </div>
              <div className="sla-kpi">
                <div className="sla-kpi-label">Total de etapas</div>
                <div className="sla-kpi-value">6</div>
              </div>
            </div>

            {/* Tabela por etapa */}
            <div className="card" style={{overflow:'hidden'}}>
              <div className="card-header">
                <h3 style={{fontSize:'var(--font-size-base)', fontWeight:600}}>Prazos por etapa</h3>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Etapa</th>
                    <th>Prazo definido</th>
                    <th>Tempo médio</th>
                    <th>% dentro do SLA</th>
                    <th>Alerta</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { nome:'1. Analisar solicitação', prazo:'3 dias úteis', medio:'2 dias', sla:'92%', alerta:'1 dia antes' },
                    { nome:'2. Emitir taxa', prazo:'2 dias úteis', medio:'2 dias', sla:'95%', alerta:'1 dia antes' },
                    { nome:'3. Aguardar pagamento', prazo:'10 dias úteis', medio:'12 dias', sla:'58%', alerta:'1 dia antes' },
                    { nome:'3.1 Solicitar correção', prazo:'3 dias úteis', medio:'1 dia', sla:'99%', alerta:'1 dia antes' },
                    { nome:'4. Emitir licença', prazo:'5 dias úteis', medio:'5 dias', sla:'88%', alerta:'1 dia antes' },
                  ].map((linha, i) => (
                    <tr key={i}>
                      <td style={{fontWeight:500}}>{linha.nome}</td>
                      <td>{linha.prazo}</td>
                      <td>{linha.medio}</td>
                      <td>
                        <span style={{
                          fontWeight:700,
                          color: parseInt(linha.sla) >= 85 ? 'var(--success)' : parseInt(linha.sla) >= 70 ? 'var(--warning)' : 'var(--danger)'
                        }}>{linha.sla}</span>
                      </td>
                      <td><span className="badge badge-neutral">{linha.alerta}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sla-config">
              <div className="sla-config-label">Configurações do SLA</div>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <label className="visual-toggle" style={{color:'var(--text-sm)'}}>
                  <span style={{fontSize:'var(--font-size-sm)'}}>Contar apenas dias úteis</span>
                </label>
                <div className="toggle-switch active" />
              </div>
              <div style={{fontSize:'var(--font-size-xs)', color:'var(--text-tertiary)'}}>
                Início da contagem: A partir da data de abertura do processo
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 6: Histórico / Versões ── */}
        {tab === 'historico' && (
          <div className="tab-historico animate-fade-in">
            <div className="historico-header-row">
              <div>
                <h3 style={{fontWeight:600}}>Versão atual</h3>
                <p style={{fontSize:'var(--font-size-sm)', color:'var(--text-secondary)'}}>
                  {versoesProcesso[0]?.numero} · {versoesProcesso[0]?.data}
                </p>
              </div>
              <button className="btn btn-secondary">Comparar versões</button>
            </div>

            <div className="versoes-timeline">
              {versoesProcesso.map((v, i) => (
                <div key={v.numero} className={`versao-item ${v.ativa ? 'ativa' : ''}`}>
                  <div className="versao-dot" />
                  {i < versoesProcesso.length - 1 && <div className="versao-linha" />}
                  <div className="versao-corpo">
                    <div className="versao-header">
                      <span className="versao-num">{v.numero}</span>
                      {v.ativa && <span className="badge badge-success">Atual</span>}
                      <span className="versao-data">{v.data}</span>
                      <span className="versao-autor">por {v.autor}</span>
                    </div>
                    <p className="versao-desc">{v.descricao}</p>
                    {!v.ativa && (
                      <button className="btn btn-ghost btn-sm">Restaurar esta versão</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="card card-body">
              <h3 style={{fontWeight:600, marginBottom:12}}>Alterações desta versão</h3>
              <div className="alteracoes-list">
                {[
                  { tipo:'add', desc: 'Adicionado passo "Solicitar correção" logo após "Analisar solicitação"' },
                  { tipo:'edit', desc: 'SLA da etapa "Aguardar pagamento" alterado de 15 dias para 10 dias' },
                  { tipo:'edit', desc: 'Responsável da etapa "Emitir licença" alterado para "Diretor de Meio Ambiente"' },
                ].map((alt, i) => (
                  <div key={i} className="alteracao-item">
                    <span className={`alteracao-tip ${alt.tipo}`}>{alt.tipo === 'add' ? '+' : '~'}</span>
                    <span>{alt.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 7: Performance ── */}
        {tab === 'performance' && (
          <div className="tab-performance animate-fade-in">
            <div className="perf-header">
              <div>
                <div style={{fontSize:'var(--font-size-xs)', color:'var(--text-tertiary)', marginBottom:4}}>Período de análise</div>
                <div style={{fontWeight:600}}>Últimos 6 meses</div>
              </div>
              <button className="btn btn-secondary btn-sm">↗ Exportar relatório</button>
            </div>

            <div className="perf-kpis">
              {[
                { label:'Processos iniciados', value:'720', sub:'+12%', color:'var(--primary-pure)' },
                { label:'Tempo médio total', value:`${processo.tempoMedio} dias`, sub:'+7.4%', color:'var(--text-primary)' },
                { label:'% dentro do SLA', value:`${processo.percentualSLA}%`, sub:'-3%', color: processo.percentualSLA >= 85 ? 'var(--success)' : 'var(--warning)' },
                { label:'Taxa de conclusão', value:`${processo.taxaConclusao}%`, sub:'Estável', color:'var(--success)' },
              ].map(kpi => (
                <div key={kpi.label} className="perf-kpi card card-body">
                  <div className="perf-kpi-label">{kpi.label}</div>
                  <div className="perf-kpi-value" style={{color:kpi.color}}>{kpi.value}</div>
                  <div className="perf-kpi-sub">{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Gargalos */}
            <div className="perf-section">
              <h3 className="perf-section-title">Tempo médio por etapa (dias)</h3>
              <div className="card card-body">
                <div className="perf-bars">
                  {[
                    { nome:'Analisar solicitação', valor:2.1, max:5 },
                    { nome:'Emitir taxa', valor:2.0, max:5 },
                    { nome:'Aguardar pagamento', valor:12.3, max:15, gargalo:true },
                    { nome:'Solicitar correção', valor:1.0, max:5 },
                    { nome:'Emitir licença', valor:5.2, max:8 },
                  ].map(etapa => (
                    <div key={etapa.nome} className="perf-bar-item">
                      <div className="perf-bar-label">{etapa.nome}</div>
                      <div className="perf-bar-track">
                        <div
                          className="perf-bar-fill"
                          style={{
                            width: `${(etapa.valor / etapa.max) * 100}%`,
                            background: etapa.gargalo ? 'var(--danger)' : 'var(--primary-pure)'
                          }}
                        />
                      </div>
                      <div className="perf-bar-val" style={{color: etapa.gargalo ? 'var(--danger)' : 'inherit'}}>
                        {etapa.valor}d {etapa.gargalo && '⚠️'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Evolução gráfico simplificado */}
            <div className="perf-section">
              <h3 className="perf-section-title">Evolução do tempo total (dias)</h3>
              <div className="card card-body">
                <div className="perf-chart">
                  {[58, 54, 52, 49, 53, 47].map((v, i) => (
                    <div key={i} className="perf-chart-col">
                      <div className="perf-chart-bar" style={{height: `${(v/60)*100}%`}} />
                      <div className="perf-chart-label">
                        {['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar'][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 32% abaixo do esperado */}
            <div className="card card-body perf-destaque">
              <div className="perf-destaque-num">32%</div>
              <div className="perf-destaque-desc">
                Redução no tempo total nos últimos <strong>2 trimestres</strong>
                <br />
                <span style={{color:'var(--text-tertiary)', fontSize:'var(--font-size-xs)'}}>
                  Média de centro de etapa: 12 dias
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
