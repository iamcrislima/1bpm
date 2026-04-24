import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export const TEMPLATES = [
  {
    key: 'compras',
    label: 'Aprovação de Compras',
    icon: 'fa-regular fa-cart-shopping',
    desc: 'Solicitação, aprovação e aquisição de materiais e serviços.',
    color: 'var(--bpm-purple)',
    bg: 'var(--bpm-indigo-light)',
  },
  {
    key: 'admissao',
    label: 'Admissão de Servidores',
    icon: 'fa-regular fa-user-plus',
    desc: 'Onboarding e admissão de novos servidores públicos.',
    color: 'var(--info)',
    bg: 'var(--info-light)',
  },
  {
    key: 'atendimento',
    label: 'Atendimento ao Cidadão',
    icon: 'fa-regular fa-headset',
    desc: 'Triagem e resolução de demandas dos cidadãos.',
    color: 'var(--warning)',
    bg: 'var(--warning-light)',
  },
  {
    key: 'contratos',
    label: 'Gestão de Contratos',
    icon: 'fa-regular fa-file-signature',
    desc: 'Elaboração, revisão e assinatura de contratos administrativos.',
    color: 'var(--success)',
    bg: 'var(--success-light)',
  },
]

interface Props {
  onClose: () => void
}

export default function NovoProcessoModal({ onClose }: Props) {
  const navigate = useNavigate()
  const overlayRef = useRef<HTMLDivElement>(null)

  const go = (to: string) => { onClose(); navigate(to) }

  return (
    <div
      className="np-modal-overlay"
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="np-modal">
        {/* Header */}
        <div className="np-modal-header">
          <div>
            <h2 className="np-modal-title">Novo Fluxo BPM</h2>
            <p className="np-modal-subtitle">Escolha como quer começar</p>
          </div>
          <button className="np-modal-close" onClick={onClose} aria-label="Fechar">
            <i className="fa-regular fa-xmark" />
          </button>
        </div>

        <div className="np-modal-body">
          {/* Do zero */}
          <button className="np-zero-btn" onClick={() => go('/processos/novo')}>
            <div className="np-zero-icon">
              <i className="fa-regular fa-plus" />
            </div>
            <div className="np-zero-text">
              <span className="np-zero-label">Começar do zero</span>
              <span className="np-zero-desc">Canvas em branco para criar um fluxo totalmente personalizado</span>
            </div>
            <i className="fa-regular fa-chevron-right np-zero-arrow" />
          </button>

          <div className="np-modal-divider"><span>ou use um template</span></div>

          {/* Templates */}
          <div className="np-templates-grid">
            {TEMPLATES.map(t => (
              <button
                key={t.key}
                className="np-template-card"
                onClick={() => go(`/processos/novo?template=${t.key}`)}
              >
                <div className="np-template-icon" style={{ background: t.bg, color: t.color }}>
                  <i className={t.icon} />
                </div>
                <div className="np-template-body">
                  <span className="np-template-label">{t.label}</span>
                  <span className="np-template-desc">{t.desc}</span>
                </div>
                <i className="fa-regular fa-arrow-right np-template-arrow" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
