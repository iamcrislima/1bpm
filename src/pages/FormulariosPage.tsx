import { useState, lazy, Suspense, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FormFieldData } from '../components/bpm/formBuilder/fieldTypes';
import { FORM_MOCKS, type Formulario } from '../data/formMocks';
import './FormulariosPage.css';

const FormBuilderPage = lazy(() => import('../components/bpm/formBuilder/FormBuilderPage'));

// Categorias para filtro
const CATEGORIAS = ['Todos', ...Array.from(new Set(FORM_MOCKS.map(f => f.categoria)))];

export default function FormulariosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formularios, setFormularios]   = useState<Formulario[]>(FORM_MOCKS);
  const [editando, setEditando]         = useState<Formulario | null>(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const [busca, setBusca]               = useState('');

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      abrirNovo();
      setSearchParams({}, { replace: true });
    }
  }, []);

  const abrirNovo = () => {
    const novo: Formulario = {
      id:          `form-${Date.now()}`,
      templateId:  '',
      nome:        'Novo formulário',
      descricao:   'Formulário criado manualmente.',
      categoria:   'Geral',
      icon:        'fa-regular fa-file-pen',
      color:       '#0058db',
      bg:          '#dce6f5',
      campos:      [],
      processos:   0,
      atualizadoEm: 'agora',
    };
    setFormularios(prev => [novo, ...prev]);
    setEditando(novo);
  };

  const handleSalvar = (fields: FormFieldData[]) => {
    if (!editando) return;
    setFormularios(prev =>
      prev.map(f => f.id === editando.id ? { ...f, campos: fields, atualizadoEm: 'agora' } : f)
    );
    setEditando(null);
  };

  const handleFechar = () => {
    setFormularios(prev => prev.filter(f => f.id !== editando?.id || f.campos.length > 0));
    setEditando(null);
  };

  // ── Editor full-page (igual ao BpmEditor) ──
  if (editando) {
    return (
      <Suspense fallback={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, flexDirection: 'column' }}>
          <i className="fa-regular fa-spinner fa-spin" style={{ fontSize: 28, color: '#0058db' }} />
          <span style={{ fontSize: 14, color: '#7d7d7d' }}>Carregando editor...</span>
        </div>
      }>
        <FormBuilderPage
          nomeTarefa={editando.nome}
          initialFields={editando.campos.length > 0 ? editando.campos : undefined}
          onClose={handleFechar}
          onSave={handleSalvar}
        />
      </Suspense>
    );
  }

  // ── Filtro ──
  const formulariosFiltrados = formularios.filter(f => {
    const matchCat = categoriaAtiva === 'Todos' || f.categoria === categoriaAtiva;
    const matchBusca = !busca || f.nome.toLowerCase().includes(busca.toLowerCase()) || f.descricao.toLowerCase().includes(busca.toLowerCase());
    return matchCat && matchBusca;
  });

  const totalCampos = formularios.reduce((acc, f) => acc + f.campos.length, 0);
  const emUso       = formularios.reduce((acc, f) => acc + f.processos, 0);

  return (
    <div className="formularios-page animate-fade-in">

      {/* ── Hero Header ── */}
      <div className="formularios-hero">
        <div className="formularios-hero-left">
          <div className="formularios-hero-icon">
            <i className="fa-regular fa-file-pen" />
          </div>
          <div>
            <h1 className="formularios-title">Formulários Dinâmicos</h1>
            <p className="formularios-subtitle">
              Modelos prontos para os seus fluxos — 100% editáveis e reutilizáveis
            </p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={abrirNovo}>
          <i className="fa-regular fa-plus" />
          Novo Formulário
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="formularios-stats">
        <div className="form-stat">
          <span className="form-stat-value">{formularios.length}</span>
          <span className="form-stat-label">Formulários</span>
        </div>
        <div className="form-stat">
          <span className="form-stat-value">{emUso}</span>
          <span className="form-stat-label">Em uso em fluxos</span>
        </div>
        <div className="form-stat">
          <span className="form-stat-value">{totalCampos}</span>
          <span className="form-stat-label">Campos configurados</span>
        </div>
        <div className="form-stat">
          <span className="form-stat-value">{CATEGORIAS.length - 1}</span>
          <span className="form-stat-label">Categorias</span>
        </div>
      </div>

      {/* ── Filtros ── */}
      <div className="formularios-filtros">
        {/* Busca */}
        <div className="formularios-busca">
          <i className="fa-regular fa-magnifying-glass" style={{ color: '#9ca3af', fontSize: 13 }} />
          <input
            placeholder="Buscar formulário..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        {/* Categorias */}
        <div className="formularios-cats">
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              className={`formularios-cat-btn${categoriaAtiva === cat ? ' active' : ''}`}
              onClick={() => setCategoriaAtiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid de formulários ── */}
      <div className="formularios-grid">
        {formulariosFiltrados.map(form => (
          <div key={form.id} className="form-card">
            {/* Topo colorido com ícone */}
            <div className="form-card-top" style={{ background: form.bg }}>
              <div className="form-card-top-icon" style={{ background: form.color }}>
                <i className={form.icon} style={{ color: 'white', fontSize: 18 }} />
              </div>
              <span className="form-card-cat" style={{ color: form.color }}>
                {form.categoria}
              </span>
              {form.processos > 0 && (
                <span className="form-card-in-use">
                  <i className="fa-regular fa-diagram-project" style={{ fontSize: 9 }} />
                  {form.processos} fluxo{form.processos > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Corpo */}
            <div className="form-card-body">
              <h3 className="form-card-title">{form.nome}</h3>
              <p className="form-card-desc">{form.descricao}</p>
              {/* Preview de campos */}
              <div className="form-card-fields-preview">
                {form.campos
                  .filter(c => !['heading','paragraph','divider','spacer','alert','lgpd','terms'].includes(c.type))
                  .slice(0, 4)
                  .map(c => (
                    <span key={c.id} className="form-card-field-chip">
                      {c.titulo}
                    </span>
                  ))}
                {form.campos.filter(c => !['heading','paragraph','divider','spacer','alert','lgpd','terms'].includes(c.type)).length > 4 && (
                  <span className="form-card-field-chip more">
                    +{form.campos.filter(c => !['heading','paragraph','divider','spacer','alert','lgpd','terms'].includes(c.type)).length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="form-card-footer">
              <div className="form-card-footer-left">
                <span className="form-card-badge" style={{ background: form.bg, color: form.color }}>
                  {form.campos.length} campos
                </span>
                <span className="form-card-date">
                  <i className="fa-regular fa-clock" style={{ fontSize: 10 }} />
                  {form.atualizadoEm}
                </span>
              </div>
              <button
                className="form-card-edit-btn"
                onClick={() => setEditando(form)}
              >
                <i className="fa-regular fa-pen" style={{ fontSize: 11 }} />
                Editar
              </button>
            </div>
          </div>
        ))}

        {/* Card criar novo */}
        <div className="form-card form-card-new" onClick={abrirNovo}>
          <div className="form-card-new-inner">
            <div className="form-card-new-icon">
              <i className="fa-regular fa-plus" style={{ fontSize: 22, color: '#0058db' }} />
            </div>
            <span className="form-card-new-label">Criar novo formulário</span>
            <span className="form-card-new-hint">Comece do zero ou use um modelo</span>
          </div>
        </div>
      </div>

      {/* Estado vazio */}
      {formulariosFiltrados.length === 0 && (
        <div className="formularios-empty">
          <div className="formularios-empty-icon">
            <i className="fa-regular fa-file-slash" style={{ fontSize: 24, color: '#9ca3af' }} />
          </div>
          <p>Nenhum formulário encontrado</p>
          <span>Tente outra categoria ou termo de busca</span>
        </div>
      )}
    </div>
  );
}
