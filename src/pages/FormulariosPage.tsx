import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FormBuilderModal, { type FormField } from '../components/bpm/formBuilder/FormBuilderModal';
import './FormulariosPage.css';

interface Formulario {
  id: string;
  nome: string;
  descricao: string;
  campos: FormField[];
  processos: number;
  atualizadoEm: string;
}

const mockFormularios: Formulario[] = [
  {
    id: 'f1',
    nome: 'Solicitação de Compra',
    descricao: 'Formulário de abertura de requisição de compras com dados do fornecedor.',
    campos: [],
    processos: 3,
    atualizadoEm: 'há 2 dias',
  },
  {
    id: 'f2',
    nome: 'Admissão de Funcionário',
    descricao: 'Coleta de dados pessoais, documentação e informações contratuais.',
    campos: [],
    processos: 1,
    atualizadoEm: 'há 5 dias',
  },
  {
    id: 'f3',
    nome: 'Atendimento ao Cidadão',
    descricao: 'Registro de solicitação de serviço público com dados de contato.',
    campos: [],
    processos: 2,
    atualizadoEm: 'há 1 semana',
  },
];

export default function FormulariosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formularios, setFormularios] = useState<Formulario[]>(mockFormularios);
  const [editando, setEditando] = useState<Formulario | null>(null);
  const [_criando, setCriando] = useState(false); void _criando;
  const [novoNome, setNovoNome] = useState('');
  const [showNomeInput, setShowNomeInput] = useState(false);

  // Abre input de nome automaticamente quando ?action=new está na URL
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setShowNomeInput(true);
      // Remove o parâmetro da URL sem recarregar
      setSearchParams({}, { replace: true });
    }
  }, []);

  const handleCriarNovo = () => {
    if (!novoNome.trim()) {
      setShowNomeInput(true);
      return;
    }
    const novo: Formulario = {
      id: `f${Date.now()}`,
      nome: novoNome.trim(),
      descricao: 'Formulário criado manualmente.',
      campos: [],
      processos: 0,
      atualizadoEm: 'agora',
    };
    setFormularios(prev => [novo, ...prev]);
    setNovoNome('');
    setShowNomeInput(false);
    setEditando(novo);
    setCriando(true);
  };

  const handleSalvarForm = (fields: FormField[]) => {
    if (!editando) return;
    setFormularios(prev =>
      prev.map(f => f.id === editando.id ? { ...f, campos: fields, atualizadoEm: 'agora' } : f)
    );
    setEditando(null);
    setCriando(false);
  };

  return (
    <div className="formularios-page animate-fade-in">
      {/* Header */}
      <div className="formularios-header">
        <div className="formularios-header-left">
          <h1 className="formularios-title">Formulários Dinâmicos</h1>
          <p className="formularios-subtitle">
            Crie e gerencie formulários reutilizáveis para qualquer etapa dos seus fluxos.
          </p>
        </div>
        <div className="formularios-header-right">
          {showNomeInput ? (
            <div className="novo-form-input-row">
              <input
                type="text"
                className="input"
                placeholder="Nome do formulário..."
                value={novoNome}
                onChange={e => setNovoNome(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCriarNovo()}
                autoFocus
                style={{ width: 240 }}
              />
              <button className="btn btn-primary" onClick={handleCriarNovo}>Criar e Editar</button>
              <button className="btn btn-secondary" onClick={() => { setShowNomeInput(false); setNovoNome(''); }}>Cancelar</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setShowNomeInput(true)}>
              <span style={{ fontSize: 16 }}>+</span>
              Novo Formulário
            </button>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="formularios-stats">
        <div className="form-stat">
          <span className="form-stat-value">{formularios.length}</span>
          <span className="form-stat-label">Formulários</span>
        </div>
        <div className="form-stat">
          <span className="form-stat-value">{formularios.reduce((acc, f) => acc + f.processos, 0)}</span>
          <span className="form-stat-label">Em uso em fluxos</span>
        </div>
        <div className="form-stat">
          <span className="form-stat-value">{formularios.filter(f => f.campos.length > 0).length}</span>
          <span className="form-stat-label">Configurados</span>
        </div>
      </div>

      {/* Grid de Formulários */}
      <div className="formularios-grid">
        {formularios.map(form => (
          <div key={form.id} className="form-card card">
            <div className="form-card-icon">
              <span>📋</span>
            </div>
            <div className="form-card-body">
              <h3 className="form-card-title">{form.nome}</h3>
              <p className="form-card-desc">{form.descricao}</p>
              <div className="form-card-meta">
                <span className="badge badge-neutral">
                  {form.campos.length > 0 ? `${form.campos.length} campos` : 'Sem campos'}
                </span>
                {form.processos > 0 && (
                  <span className="badge badge-primary">{form.processos} fluxo{form.processos > 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
            <div className="form-card-footer">
              <span className="form-card-date">Atualizado {form.atualizadoEm}</span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { setEditando(form); setCriando(false); }}
              >
                ✏️ Editar
              </button>
            </div>
          </div>
        ))}

        {/* Card "Criar novo" */}
        <div className="form-card form-card-new card" onClick={() => setShowNomeInput(true)}>
          <div className="form-card-new-inner">
            <span className="form-card-new-icon">+</span>
            <span>Criar novo formulário</span>
          </div>
        </div>
      </div>

      {/* Modal do construtor */}
      {editando && (
        <FormBuilderModal
          isOpen={!!editando}
          onClose={() => { setEditando(null); setCriando(false); }}
          initialFields={editando.campos}
          onSave={handleSalvarForm}
          taskName={editando.nome}
        />
      )}
    </div>
  );
}
