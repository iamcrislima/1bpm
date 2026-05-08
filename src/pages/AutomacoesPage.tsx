import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTOMATION_MOCKS, type Automation } from '../data/automationMocks';
import { Ico } from '../components/ui/Ico';
import './AutomacoesPage.css';

interface ConfirmState {
  id: string;
  action: 'toggle' | 'delete';
  message: string;
}

export default function AutomacoesPage() {
  const navigate = useNavigate();
  const [automacoes, setAutomacoes] = useState<Automation[]>(AUTOMATION_MOCKS);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const requestToggle = (id: string) => {
    const automacao = automacoes.find(a => a.id === id);
    if (!automacao) return;
    const action = automacao.active ? 'desativar' : 'ativar';
    setConfirmState({ id, action: 'toggle', message: `Deseja ${action} a automação "${automacao.name}"?` });
  };

  const requestDelete = (id: string) => {
    const automacao = automacoes.find(a => a.id === id);
    if (!automacao) return;
    setConfirmState({ id, action: 'delete', message: `Deseja excluir a automação "${automacao.name}"? Esta ação remove a regra da lista.` });
  };

  const handleConfirm = () => {
    if (!confirmState) return;
    if (confirmState.action === 'toggle') {
      setAutomacoes(prev =>
        prev.map(a => (a.id === confirmState.id ? { ...a, active: !a.active } : a))
      );
    } else {
      setAutomacoes(prev => prev.filter(a => a.id !== confirmState.id));
    }
    setConfirmState(null);
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

      {/* Inline confirmation dialog */}
      {confirmState && (
        <div className="auto-confirm-overlay" onClick={() => setConfirmState(null)}>
          <div className="auto-confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="auto-confirm-icon">
              <Ico icon={confirmState.action === 'delete' ? 'fa-regular fa-trash' : 'fa-regular fa-bolt'} />
            </div>
            <p className="auto-confirm-message">{confirmState.message}</p>
            <div className="auto-confirm-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmState(null)}>
                Cancelar
              </button>
              <button
                className={`btn ${confirmState.action === 'delete' ? 'btn-danger' : 'btn-primary'}`}
                onClick={handleConfirm}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

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
            <div
              key={auto.id}
              className="auto-card"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/processos/automacoes/${auto.id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigate(`/processos/automacoes/${auto.id}`);
                }
              }}
              aria-label={`Editar automação ${auto.name}`}
            >
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
                  onClick={(event) => {
                    event.stopPropagation();
                    requestToggle(auto.id);
                  }}
                  title={auto.active ? 'Desativar automação' : 'Ativar automação'}
                >
                  <span className="auto-toggle-knob" />
                </button>
                <span className={`badge ${auto.active ? 'badge-success' : 'badge-neutral'}`}>
                  {auto.active ? 'Ativa' : 'Inativa'}
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/processos/automacoes/${auto.id}`);
                  }}
                  title="Editar"
                >
                  <Ico icon="fa-regular fa-pen-to-square" />
                </button>
                <button
                  className="btn btn-ghost btn-sm auto-btn-delete"
                  onClick={(event) => {
                    event.stopPropagation();
                    requestDelete(auto.id);
                  }}
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
