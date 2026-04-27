import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTOMATION_MOCKS, type Automation } from '../data/automationMocks';
import './AutomacoesPage.css';

function Ico({ icon, style }: { icon: string; style?: React.CSSProperties }) {
  return (
    <span
      dangerouslySetInnerHTML={{ __html: `<i class="${icon}"></i>` }}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, flexShrink: 0, ...style }}
    />
  );
}

export default function AutomacoesPage() {
  const navigate = useNavigate();
  const [automacoes, setAutomacoes] = useState<Automation[]>(AUTOMATION_MOCKS);

  const toggleActive = (id: string) => {
    setAutomacoes(prev =>
      prev.map(a => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const handleDelete = (id: string) => {
    setAutomacoes(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="auto-page animate-fade-in">
      {/* Header */}
      <div className="auto-header">
        <div>
          <h1 className="auto-title">Automações</h1>
          <p className="auto-subtitle">
            Regras que disparam ações automaticamente nos seus processos.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/processos/automacoes/nova')}
        >
          <Ico icon="fa-regular fa-plus" />
          Nova Automação
        </button>
      </div>

      {/* Empty state */}
      {automacoes.length === 0 && (
        <div className="auto-empty">
          <div className="auto-empty-icon-wrap">
            <Ico icon="fa-regular fa-bolt" />
          </div>
          <div className="auto-empty-title">Nenhuma automação configurada</div>
          <div className="auto-empty-desc">
            Crie regras automáticas para agilizar os seus processos sem escrever código.
          </div>
          <button
            className="btn btn-primary"
            style={{ marginTop: 20 }}
            onClick={() => navigate('/processos/automacoes/nova')}
          >
            <Ico icon="fa-regular fa-plus" />
            Criar primeira automação
          </button>
        </div>
      )}

      {/* List */}
      {automacoes.length > 0 && (
        <div className="auto-list">
          {automacoes.map(auto => (
            <div key={auto.id} className="auto-card">
              {/* Icon */}
              <div className={`auto-card-icon ${auto.active ? 'auto-card-icon--active' : ''}`}>
                <Ico icon="fa-regular fa-bolt" />
              </div>

              {/* Content */}
              <div className="auto-card-content">
                <div className="auto-card-name">{auto.name}</div>
                <div className="auto-card-summary">{auto.summary}</div>
                {auto.conditionLabel && (
                  <div className="auto-card-condition">
                    <Ico icon="fa-regular fa-filter" />
                    {auto.conditionLabel}
                  </div>
                )}
                <div className="auto-card-meta">
                  <span>
                    <Ico icon="fa-regular fa-calendar" />
                    Criada em {auto.createdAt}
                  </span>
                  <span>
                    <Ico icon="fa-regular fa-bolt" />
                    Disparada {auto.firedCount}×
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="auto-card-actions">
                <button
                  className={`auto-toggle ${auto.active ? 'auto-toggle--on' : ''}`}
                  onClick={() => toggleActive(auto.id)}
                  title={auto.active ? 'Desativar automação' : 'Ativar automação'}
                >
                  <span className="auto-toggle-knob" />
                </button>
                <span
                  className={`badge ${auto.active ? 'badge-success' : 'badge-neutral'}`}
                >
                  {auto.active ? 'Ativa' : 'Inativa'}
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate('/processos/automacoes/nova')}
                  title="Editar"
                >
                  <Ico icon="fa-regular fa-pen-to-square" />
                </button>
                <button
                  className="btn btn-ghost btn-sm auto-btn-delete"
                  onClick={() => handleDelete(auto.id)}
                  title="Excluir"
                >
                  <Ico icon="fa-regular fa-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
