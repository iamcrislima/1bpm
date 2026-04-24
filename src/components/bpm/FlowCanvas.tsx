import { useState } from 'react'
import type { Etapa } from '../../data/mockData'
import './FlowCanvas.css'

interface Props {
  etapas: Etapa[]
}

const TIPO_CONFIG = {
  inicio: { shape: 'circle', color: '#0D9948', bg: '#DCFCE7', label: '▶', size: 36 },
  tarefa: { shape: 'rect', color: '#1A56DB', bg: '#EBF2FF', label: '', size: 0 },
  decisao: { shape: 'diamond', color: '#D97706', bg: '#FEF3C7', label: '◆', size: 36 },
  paralelo: { shape: 'diamond', color: '#7C3AED', bg: '#EDE9FE', label: '⊕', size: 36 },
  fim: { shape: 'circle', color: '#DC2626', bg: '#FEE2E2', label: '⬛', size: 36 },
}

export default function FlowCanvas({ etapas }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  const selectedEtapa = etapas.find(e => e.id === selected)

  // Build connections
  const connections: { from: Etapa; to: Etapa }[] = []
  etapas.forEach(etapa => {
    etapa.proximas?.forEach(nextId => {
      const next = etapas.find(e => e.id === nextId)
      if (next) connections.push({ from: etapa, to: next })
    })
  })

  const W = 140, H = 50 // node dimensions

  return (
    <div className="flow-canvas-wrapper">
      <div className="flow-canvas-area">
        <svg
          className="flow-svg"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          width="800"
          height="340"
        >
          {/* Connection lines */}
          {connections.map((conn, i) => {
            const fx = conn.from.x + (conn.from.tipo === 'tarefa' ? W / 2 : 18)
            const fy = conn.from.y + (conn.from.tipo === 'tarefa' ? H / 2 : 18)
            const tx = conn.to.x - (conn.to.tipo !== 'tarefa' ? -18 : 0)
            const ty = conn.to.y + (conn.to.tipo === 'tarefa' ? H / 2 : 18)
            const mx = (fx + tx) / 2
            return (
              <g key={i}>
                <path
                  d={`M${fx},${fy} C${mx},${fy} ${mx},${ty} ${tx},${ty}`}
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                  strokeDasharray={conn.from.id === 'analisar' && conn.to.id === 'solicitar' ? '4,3' : undefined}
                />
                {/* Arrow head */}
                <polygon
                  points={`${tx},${ty} ${tx - 7},${ty - 4} ${tx - 7},${ty + 4}`}
                  fill="#CBD5E1"
                />
              </g>
            )
          })}

          {/* Nodes */}
          {etapas.map(etapa => {
            const cfg = TIPO_CONFIG[etapa.tipo]
            const isSelected = selected === etapa.id

            if (etapa.tipo === 'inicio' || etapa.tipo === 'fim') {
              return (
                <g key={etapa.id} onClick={() => setSelected(etapa.id)} style={{ cursor: 'pointer' }}>
                  <circle
                    cx={etapa.x + 18}
                    cy={etapa.y + 18}
                    r={18}
                    fill={cfg.bg}
                    stroke={cfg.color}
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  <text
                    x={etapa.x + 18}
                    y={etapa.y + 22}
                    textAnchor="middle"
                    fontSize={12}
                    fill={cfg.color}
                  >{cfg.label}</text>
                </g>
              )
            }

            return (
              <g key={etapa.id} onClick={() => setSelected(etapa.id)} style={{ cursor: 'pointer' }}>
                <rect
                  x={etapa.x}
                  y={etapa.y}
                  width={W}
                  height={H}
                  rx={8}
                  fill={isSelected ? '#EBF2FF' : '#fff'}
                  stroke={isSelected ? '#1A56DB' : '#CBD5E1'}
                  strokeWidth={isSelected ? 2 : 1}
                  filter={isSelected ? 'drop-shadow(0 2px 6px rgba(26,86,219,0.2))' : undefined}
                />
                <text
                  x={etapa.x + W / 2}
                  y={etapa.y + 20}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  fill="#0F172A"
                  fontFamily="Inter, sans-serif"
                >
                  {etapa.nome.length > 16 ? etapa.nome.slice(0, 16) + '…' : etapa.nome}
                </text>
                <text
                  x={etapa.x + W / 2}
                  y={etapa.y + 34}
                  textAnchor="middle"
                  fontSize={9.5}
                  fill="#94A3B8"
                  fontFamily="Inter, sans-serif"
                >
                  {etapa.responsavel.length > 20 ? etapa.responsavel.slice(0, 20) + '…' : etapa.responsavel}
                </text>
                {etapa.prazo > 0 && (
                  <text
                    x={etapa.x + W - 8}
                    y={etapa.y + H - 6}
                    textAnchor="end"
                    fontSize={9}
                    fill="#1A56DB"
                    fontFamily="Inter, sans-serif"
                    fontWeight={600}
                  >
                    {etapa.prazo}d
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Zoom controls */}
      <div className="flow-zoom-controls">
        <button className="flow-zoom-btn" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>+</button>
        <span className="flow-zoom-val">{Math.round(zoom * 100)}%</span>
        <button className="flow-zoom-btn" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>−</button>
        <button className="flow-zoom-btn" onClick={() => setZoom(1)}>↺</button>
      </div>

      {/* Selected etapa detail panel */}
      {selectedEtapa && selectedEtapa.tipo === 'tarefa' && (
        <div className="flow-selected-panel animate-slide-in">
          <div className="flow-panel-header">
            <h4>{selectedEtapa.nome}</h4>
            <button onClick={() => setSelected(null)} className="flow-panel-close">✕</button>
          </div>
          <div className="flow-panel-body">
            <div className="flow-panel-row">
              <span className="flow-panel-label">Responsável</span>
              <span>{selectedEtapa.responsavel}</span>
            </div>
            <div className="flow-panel-row">
              <span className="flow-panel-label">Prazo da etapa</span>
              <span>{selectedEtapa.prazo} dias úteis</span>
            </div>
            <div className="flow-panel-row">
              <span className="flow-panel-label">Próximas etapas</span>
              <span>{selectedEtapa.proximas?.join(', ') || '—'}</span>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" style={{width:'100%'}}>Configurar etapa</button>
        </div>
      )}
    </div>
  )
}
