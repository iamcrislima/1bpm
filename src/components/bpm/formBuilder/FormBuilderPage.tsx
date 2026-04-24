import { useState, useCallback } from 'react';
import {
  FIELD_CATALOG, FIELD_CATEGORIES, FORM_TEMPLATES,
  createField, type FormFieldData, type FormTemplate,
} from './fieldTypes';
import './formBuilderPage.css';

// ── Utilitários ───────────────────────────────────────────────
function fieldDef(type: string) {
  return FIELD_CATALOG.find(f => f.type === type);
}

// ── Preview de campo no canvas ────────────────────────────────
function FieldPreview({ field }: { field: FormFieldData }) {
  const { type, titulo, placeholder, opcoes, textoFixo, alertaTipo, nivelTitulo, labelBotao, estilobotao } = field;

  if (type === 'heading') {
    const Tag = `h${nivelTitulo}` as 'h1' | 'h2' | 'h3' | 'h4';
    return <Tag className="fp-preview-heading">{textoFixo || 'Título'}</Tag>;
  }
  if (type === 'paragraph') {
    return <p className="fp-preview-paragraph">{textoFixo || 'Texto do parágrafo...'}</p>;
  }
  if (type === 'divider') {
    return <div className="fp-preview-divider" />;
  }
  if (type === 'spacer') {
    return <div className="fp-preview-spacer"><span>espaçador</span></div>;
  }
  if (type === 'alert') {
    const alertColors: Record<string, string> = {
      info: '#dbeafe', aviso: '#fef3c7', erro: '#fee2e2', sucesso: '#dcfce7',
    };
    const alertIcons: Record<string, string> = {
      info: 'fa-regular fa-circle-info',
      aviso: 'fa-regular fa-triangle-exclamation',
      erro: 'fa-regular fa-circle-xmark',
      sucesso: 'fa-regular fa-circle-check',
    };
    return (
      <div className="fp-preview-alert" style={{ background: alertColors[alertaTipo] }}>
        <i className={alertIcons[alertaTipo]} />
        <span>{textoFixo || 'Mensagem de alerta'}</span>
      </div>
    );
  }
  if (type === 'image') {
    return (
      <div className="fp-preview-image-placeholder">
        <i className="fa-regular fa-image" />
        <span>Imagem</span>
      </div>
    );
  }
  if (type === 'map') {
    return (
      <div className="fp-preview-image-placeholder" style={{ background: '#dcfce7' }}>
        <i className="fa-regular fa-map" style={{ color: '#0f6b3e' }} />
        <span>Mapa / Localização</span>
      </div>
    );
  }
  if (type === 'signature') {
    return (
      <div className="fp-preview-image-placeholder" style={{ background: '#fffbeb', minHeight: 60 }}>
        <i className="fa-regular fa-signature" style={{ color: '#d97706' }} />
        <span>Área de assinatura</span>
      </div>
    );
  }
  if (type === 'radio' || type === 'checkbox') {
    return (
      <div className="fp-preview-options">
        {(opcoes || []).slice(0, 3).map((op, i) => (
          <label key={i} className="fp-preview-option">
            <input type={type === 'radio' ? 'radio' : 'checkbox'} disabled />
            <span>{op}</span>
          </label>
        ))}
        {(opcoes || []).length > 3 && <span className="fp-preview-more">+{opcoes.length - 3} mais</span>}
      </div>
    );
  }
  if (type === 'select' || type === 'combobox') {
    return (
      <select className="fp-preview-select" disabled>
        <option>{placeholder || 'Selecione...'}</option>
        {(opcoes || []).slice(0, 2).map((op, i) => <option key={i}>{op}</option>)}
      </select>
    );
  }
  if (type === 'toggle') {
    return (
      <div className="fp-preview-toggle">
        <span className="fp-preview-toggle-track" /><span>Não / Sim</span>
      </div>
    );
  }
  if (type === 'rating') {
    return (
      <div className="fp-preview-rating">
        {[1,2,3,4,5].map(i => <i key={i} className="fa-regular fa-star" style={{ color: '#f59e0b' }} />)}
      </div>
    );
  }
  if (type === 'textarea') {
    return <textarea className="fp-preview-input" style={{ height: 64, resize: 'none' }} placeholder={placeholder || 'Texto longo...'} disabled />;
  }
  if (type === 'file' || type === 'files') {
    return (
      <div className="fp-preview-file">
        <i className="fa-regular fa-cloud-arrow-up" />
        <span>{type === 'files' ? 'Arrastar arquivos ou clique para selecionar' : 'Selecionar arquivo'}</span>
      </div>
    );
  }
  if (type === 'hidden') {
    return <div className="fp-preview-hidden"><i className="fa-regular fa-eye-slash" /><span>Campo oculto (invisível para o usuário)</span></div>;
  }
  if (type === 'terms' || type === 'lgpd') {
    return (
      <label className="fp-preview-terms">
        <input type="checkbox" disabled />
        <span>{textoFixo || (type === 'lgpd' ? 'Autorizo o uso dos meus dados (LGPD)' : 'Concordo com os termos')}</span>
      </label>
    );
  }
  if (type === 'link') {
    return <a className="fp-preview-link" href="#"><i className="fa-regular fa-link" /> {field.textoLink || 'Clique aqui'}</a>;
  }
  if (type === 'button') {
    const cls = estilobotao === 'primario' ? 'fp-preview-btn--primary'
              : estilobotao === 'perigo'   ? 'fp-preview-btn--danger'
              : 'fp-preview-btn--secondary';
    return <button className={`fp-preview-btn ${cls}`} disabled>{labelBotao || 'Enviar'}</button>;
  }
  if (type === 'currency') {
    return <input className="fp-preview-input" placeholder="R$ 0,00" disabled />;
  }
  if (type === 'password') {
    return <input className="fp-preview-input" type="password" placeholder="••••••••" disabled />;
  }
  if (type === 'date') {
    return <input className="fp-preview-input" type="date" disabled />;
  }
  if (type === 'time') {
    return <input className="fp-preview-input" type="time" disabled />;
  }
  if (type === 'datetime') {
    return <input className="fp-preview-input" type="datetime-local" disabled />;
  }
  if (type === 'number' || type === 'percent') {
    return <input className="fp-preview-input" type="number" placeholder={placeholder || (type === 'percent' ? '0 – 100' : '0')} disabled />;
  }
  if (type === 'table') {
    return (
      <div className="fp-preview-table">
        <div className="fp-preview-table-header"><span>Coluna 1</span><span>Coluna 2</span><span>Coluna 3</span></div>
        <div className="fp-preview-table-row"><span>—</span><span>—</span><span>—</span></div>
      </div>
    );
  }
  if (type === 'subform') {
    return (
      <div className="fp-preview-hidden" style={{ background: '#ede9fe' }}>
        <i className="fa-regular fa-layer-group" style={{ color: '#7c3aed' }} />
        <span>Sub-formulário incorporado</span>
      </div>
    );
  }
  if (type === 'container') {
    return (
      <div className="fp-preview-container">
        <div className="fp-preview-container-col" />
        <div className="fp-preview-container-col" />
      </div>
    );
  }
  // default: text/mask/cpf/cnpj/cep/phone
  const def = fieldDef(type);
  const ph = type === 'cpf'  ? '000.000.000-00'
           : type === 'cnpj' ? '00.000.000/0000-00'
           : type === 'cep'  ? '00000-000'
           : type === 'phone'? '(00) 00000-0000'
           : placeholder || def?.label || '';
  return <input className="fp-preview-input" placeholder={ph} disabled />;
}

// ── Painel de propriedades do campo ───────────────────────────
function FieldProperties({
  field,
  onChange,
  onDuplicate,
  onDelete,
}: {
  field: FormFieldData;
  onChange: (f: FormFieldData) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [tab, setTab] = useState<'geral' | 'avancado' | 'condicoes'>('geral');
  const def = fieldDef(field.type);
  const update = (patch: Partial<FormFieldData>) => onChange({ ...field, ...patch });

  const isLayout = ['heading', 'paragraph', 'divider', 'spacer', 'alert', 'image', 'link'].includes(field.type);
  const hasOpcoes = ['select', 'radio', 'checkbox', 'combobox'].includes(field.type);

  return (
    <div className="fbp-panel">
      {/* Cabeçalho */}
      <div className="fbp-panel-header">
        <div className="fbp-panel-header-info">
          <div className="fbp-panel-icon" style={{ background: def?.bg, color: def?.color }}>
            <i className={def?.icon} />
          </div>
          <div>
            <div className="fbp-panel-type">{def?.label}</div>
            <div className="fbp-panel-name">{field.titulo}</div>
          </div>
        </div>
        <div className="fbp-panel-header-actions">
          <button className="fbp-icon-btn" title="Duplicar" onClick={onDuplicate}><i className="fa-regular fa-copy" /></button>
          <button className="fbp-icon-btn red" title="Excluir" onClick={onDelete}><i className="fa-regular fa-trash" /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="fbp-tabs">
        {(['geral', 'avancado', 'condicoes'] as const).map(t => (
          <button key={t} className={`fbp-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'geral' ? 'Geral' : t === 'avancado' ? 'Avançado' : 'Condições'}
          </button>
        ))}
      </div>

      <div className="fbp-panel-body">
        {/* ── ABA GERAL ── */}
        {tab === 'geral' && (
          <>
            {/* Campos de layout com texto fixo */}
            {(field.type === 'heading' || field.type === 'paragraph' || field.type === 'terms' || field.type === 'lgpd') && (
              <div className="fbp-field">
                <label className="fbp-label">Texto</label>
                <textarea
                  className="fbp-textarea"
                  rows={3}
                  value={field.textoFixo}
                  onChange={e => update({ textoFixo: e.target.value })}
                />
              </div>
            )}
            {field.type === 'heading' && (
              <div className="fbp-field">
                <label className="fbp-label">Nível</label>
                <div className="fbp-radio-row">
                  {[1,2,3,4].map(n => (
                    <label key={n} className="fbp-radio-chip">
                      <input type="radio" checked={field.nivelTitulo === n} onChange={() => update({ nivelTitulo: n as 1|2|3|4 })} />
                      H{n}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {field.type === 'alert' && (
              <>
                <div className="fbp-field">
                  <label className="fbp-label">Tipo de alerta</label>
                  <div className="fbp-radio-row">
                    {[{v:'info',l:'Info'},{v:'aviso',l:'Aviso'},{v:'erro',l:'Erro'},{v:'sucesso',l:'Sucesso'}].map(o => (
                      <label key={o.v} className="fbp-radio-chip">
                        <input type="radio" checked={field.alertaTipo === o.v} onChange={() => update({ alertaTipo: o.v as any })} />
                        {o.l}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="fbp-field">
                  <label className="fbp-label">Mensagem</label>
                  <textarea className="fbp-textarea" rows={2} value={field.textoFixo} onChange={e => update({ textoFixo: e.target.value })} />
                </div>
              </>
            )}
            {field.type === 'link' && (
              <>
                <div className="fbp-field">
                  <label className="fbp-label">URL</label>
                  <input className="fbp-input" value={field.urlLink} onChange={e => update({ urlLink: e.target.value })} placeholder="https://..." />
                </div>
                <div className="fbp-field">
                  <label className="fbp-label">Texto do link</label>
                  <input className="fbp-input" value={field.textoLink} onChange={e => update({ textoLink: e.target.value })} />
                </div>
              </>
            )}
            {field.type === 'image' && (
              <>
                <div className="fbp-field">
                  <label className="fbp-label">URL da imagem</label>
                  <input className="fbp-input" value={field.srcImagem} onChange={e => update({ srcImagem: e.target.value })} placeholder="https://..." />
                </div>
                <div className="fbp-field">
                  <label className="fbp-label">Texto alternativo</label>
                  <input className="fbp-input" value={field.altImagem} onChange={e => update({ altImagem: e.target.value })} />
                </div>
              </>
            )}
            {field.type === 'button' && (
              <>
                <div className="fbp-field">
                  <label className="fbp-label">Rótulo do botão</label>
                  <input className="fbp-input" value={field.labelBotao} onChange={e => update({ labelBotao: e.target.value })} />
                </div>
                <div className="fbp-field">
                  <label className="fbp-label">Estilo</label>
                  <div className="fbp-radio-row">
                    {[{v:'primario',l:'Primário'},{v:'secundario',l:'Secundário'},{v:'perigo',l:'Perigo'}].map(o => (
                      <label key={o.v} className="fbp-radio-chip">
                        <input type="radio" checked={field.estilobotao === o.v} onChange={() => update({ estilobotao: o.v as any })} />
                        {o.l}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="fbp-field">
                  <label className="fbp-label">Tipo</label>
                  <select className="fbp-select" value={field.tipoBotao} onChange={e => update({ tipoBotao: e.target.value as any })}>
                    <option value="submit">Enviar (submit)</option>
                    <option value="reset">Limpar (reset)</option>
                    <option value="button">Ação personalizada</option>
                  </select>
                </div>
              </>
            )}

            {/* Campos comuns (não-layout) */}
            {!isLayout && field.type !== 'button' && (
              <>
                <div className="fbp-row-2">
                  <div className="fbp-field">
                    <label className="fbp-label">Título <span className="fbp-required">*</span></label>
                    <input className="fbp-input" value={field.titulo} onChange={e => update({ titulo: e.target.value })} />
                  </div>
                  <div className="fbp-field">
                    <label className="fbp-label">Nome (chave) <span className="fbp-required">*</span></label>
                    <input className="fbp-input" value={field.nome} onChange={e => update({ nome: e.target.value.replace(/\s/g, '_') })} />
                  </div>
                </div>

                <div className="fbp-toggles-row">
                  <label className="fbp-toggle-label">
                    <span>Obrigatório</span>
                    <div className={`fbp-toggle ${field.obrigatorio ? 'on' : ''}`} onClick={() => update({ obrigatorio: !field.obrigatorio })}>
                      <div className="fbp-toggle-thumb" />
                    </div>
                  </label>
                  <label className="fbp-toggle-label">
                    <span>Desabilitado</span>
                    <div className={`fbp-toggle ${field.desabilitado ? 'on' : ''}`} onClick={() => update({ desabilitado: !field.desabilitado })}>
                      <div className="fbp-toggle-thumb" />
                    </div>
                  </label>
                  <label className="fbp-toggle-label">
                    <span>Somente leitura</span>
                    <div className={`fbp-toggle ${field.somenteLeitura ? 'on' : ''}`} onClick={() => update({ somenteLeitura: !field.somenteLeitura })}>
                      <div className="fbp-toggle-thumb" />
                    </div>
                  </label>
                </div>

                <div className="fbp-field">
                  <label className="fbp-label">Colunas (largura)</label>
                  <div className="fbp-cols-picker">
                    {[1,2,3].map(c => (
                      <button key={c} className={`fbp-col-btn ${field.colunas === c ? 'active' : ''}`} onClick={() => update({ colunas: c as 1|2|3 })}>
                        {c === 1 ? '⅓ largura' : c === 2 ? '⅔ largura' : 'Largura total'}
                      </button>
                    ))}
                  </div>
                </div>

                {!['file','files','signature','toggle','rating','radio','checkbox','select','combobox','hidden'].includes(field.type) && (
                  <div className="fbp-row-2">
                    <div className="fbp-field">
                      <label className="fbp-label">Placeholder</label>
                      <input className="fbp-input" value={field.placeholder} onChange={e => update({ placeholder: e.target.value })} />
                    </div>
                    <div className="fbp-field">
                      <label className="fbp-label">Valor padrão</label>
                      <input className="fbp-input" value={field.valorPadrao} onChange={e => update({ valorPadrao: e.target.value })} />
                    </div>
                  </div>
                )}

                <div className="fbp-field">
                  <label className="fbp-label">Texto de ajuda</label>
                  <input className="fbp-input" value={field.textoAjuda} onChange={e => update({ textoAjuda: e.target.value })} placeholder="Instrução exibida abaixo do campo" />
                </div>
                <div className="fbp-row-2">
                  <div className="fbp-field">
                    <label className="fbp-label">Posição da ajuda</label>
                    <select className="fbp-select" value={field.posicaoAjuda} onChange={e => update({ posicaoAjuda: e.target.value as any })}>
                      <option value="abaixo">Abaixo</option>
                      <option value="direita">Direita</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ── ABA AVANÇADO ── */}
        {tab === 'avancado' && (
          <>
            {/* Opções para select/radio/checkbox */}
            {hasOpcoes && (
              <div className="fbp-field">
                <label className="fbp-label">Opções disponíveis</label>
                <div className="fbp-options-list">
                  {(field.opcoes || []).map((op, i) => (
                    <div key={i} className="fbp-option-row">
                      <input
                        className="fbp-input"
                        value={op}
                        onChange={e => {
                          const next = [...(field.opcoes || [])];
                          next[i] = e.target.value;
                          update({ opcoes: next });
                        }}
                        placeholder={`Opção ${i + 1}`}
                      />
                      <button className="fbp-icon-btn red" onClick={() => {
                        update({ opcoes: (field.opcoes || []).filter((_, idx) => idx !== i) });
                      }}><i className="fa-regular fa-xmark" /></button>
                    </div>
                  ))}
                  <button className="fbp-add-option-btn" onClick={() => update({ opcoes: [...(field.opcoes || []), ''] })}>
                    <i className="fa-regular fa-plus" /> Adicionar opção
                  </button>
                </div>
              </div>
            )}

            {/* Máscara */}
            {['mask', 'cpf', 'cnpj', 'cep', 'phone'].includes(field.type) && (
              <div className="fbp-field">
                <label className="fbp-label">Máscara</label>
                <input className="fbp-input" value={field.mascara} onChange={e => update({ mascara: e.target.value })} placeholder="Ex: ###.###.###-##" />
                <div className="fbp-hint"># = dígito numérico, A = letra</div>
              </div>
            )}

            {/* Arquivo */}
            {(field.type === 'file' || field.type === 'files') && (
              <>
                <div className="fbp-field">
                  <label className="fbp-label">Tipos aceitos</label>
                  <input className="fbp-input" value={field.aceitarTipos} onChange={e => update({ aceitarTipos: e.target.value })} placeholder=".pdf,.doc,.docx,.jpg" />
                </div>
                <div className="fbp-row-2">
                  <div className="fbp-field">
                    <label className="fbp-label">Máx. de arquivos</label>
                    <input className="fbp-input" type="number" min={1} value={field.maxArquivos} onChange={e => update({ maxArquivos: parseInt(e.target.value) || 1 })} />
                  </div>
                  <div className="fbp-field">
                    <label className="fbp-label">Tamanho máx. (MB)</label>
                    <input className="fbp-input" type="number" min={1} value={field.maxTamanhoMb} onChange={e => update({ maxTamanhoMb: parseInt(e.target.value) || 1 })} />
                  </div>
                </div>
              </>
            )}

            {/* Validação custom */}
            {!isLayout && (
              <div className="fbp-field">
                <label className="fbp-label">Validação personalizada</label>
                <input className="fbp-input" value={field.validacaoCustom} onChange={e => update({ validacaoCustom: e.target.value })} placeholder="Ex: valor > 0" />
                <div className="fbp-hint">Expressão avaliada no momento do envio</div>
              </div>
            )}

            {field.type === 'text' && (
              <div className="fbp-field">
                <label className="fbp-label">Máscara personalizada</label>
                <input className="fbp-input" value={field.mascara} onChange={e => update({ mascara: e.target.value })} placeholder="Ex: ##/##/####" />
              </div>
            )}
          </>
        )}

        {/* ── ABA CONDIÇÕES ── */}
        {tab === 'condicoes' && (
          <div className="fbp-field">
            <label className="fbp-label">Exibir este campo quando</label>
            <textarea
              className="fbp-textarea"
              rows={3}
              value={field.condicaoExibir}
              onChange={e => update({ condicaoExibir: e.target.value })}
              placeholder="Ex: tipoPessoa == 'juridica'"
            />
            <div className="fbp-hint">
              Use o nome do campo e operadores: == != &gt; &lt; &gt;= &lt;=<br />
              Ex: <code>estadoCivil == 'casado'</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Template picker ───────────────────────────────────────────
function TemplatePicker({ onSelect, onBlank }: { onSelect: (t: FormTemplate) => void; onBlank: () => void }) {
  return (
    <div className="fbp-template-overlay">
      <div className="fbp-template-card">
        <div className="fbp-template-header">
          <h2>Como deseja começar?</h2>
          <p>Escolha um modelo ou comece do zero</p>
        </div>
        <div className="fbp-template-grid">
          {/* Opção em branco */}
          <button className="fbp-template-item fbp-template-blank" onClick={onBlank}>
            <div className="fbp-template-item-icon">
              <i className="fa-regular fa-plus" />
            </div>
            <div className="fbp-template-item-info">
              <span className="fbp-template-item-name">Formulário em branco</span>
              <span className="fbp-template-item-desc">Comece do zero</span>
            </div>
          </button>

          {/* Templates */}
          {FORM_TEMPLATES.map(t => (
            <button key={t.id} className="fbp-template-item" onClick={() => onSelect(t)}>
              <div className="fbp-template-item-icon" style={{ background: '#dce6f5', color: '#0058db' }}>
                <i className={t.icon} />
              </div>
              <div className="fbp-template-item-info">
                <span className="fbp-template-item-name">{t.nome}</span>
                <span className="fbp-template-item-desc">{t.descricao}</span>
              </div>
              <span className="fbp-template-item-badge">{t.fields.length} campos</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────
interface FormBuilderPageProps {
  nomeTarefa?: string;
  onClose: () => void;
  onSave: (fields: FormFieldData[]) => void;
  initialFields?: FormFieldData[];
}

export default function FormBuilderPage({ nomeTarefa, onClose, onSave, initialFields }: FormBuilderPageProps) {
  const [fields, setFields] = useState<FormFieldData[]>(initialFields ?? []);
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [showPicker, setShowPicker]   = useState(initialFields == null || initialFields.length === 0);
  const [isTemplate, setIsTemplate]   = useState(false);
  const [buscaPaleta, setBuscaPaleta] = useState('');
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [isDragFromPalette, setIsDragFromPalette] = useState(false);
  const [paletteDragType, setPaletteDragType] = useState('');

  const selectedField = fields.find(f => f.id === selectedId) ?? null;

  // ── Drag from palette ──────────────────────────────────────
  const onPaletteDragStart = (type: string) => {
    setIsDragFromPalette(true);
    setPaletteDragType(type);
  };

  const onCanvasDragOver = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  }, []);

  const onCanvasDrop = useCallback((e: React.DragEvent, insertAt: number) => {
    e.preventDefault();
    if (isDragFromPalette && paletteDragType) {
      const newField = createField(paletteDragType);
      setFields(prev => {
        const next = [...prev];
        next.splice(insertAt, 0, newField);
        return next;
      });
      setSelectedId(newField.id);
      setIsDragFromPalette(false);
      setPaletteDragType('');
    }
    setDragOverIdx(null);
  }, [isDragFromPalette, paletteDragType]);

  const onCanvasDropEnd = () => {
    setDragOverIdx(null);
    setIsDragFromPalette(false);
  };

  // ── Canvas drop zone (appends at end) ─────────────────────
  const onZoneDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOverIdx(fields.length); };
  const onZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isDragFromPalette && paletteDragType) {
      const nf = createField(paletteDragType);
      setFields(prev => [...prev, nf]);
      setSelectedId(nf.id);
      setIsDragFromPalette(false);
      setPaletteDragType('');
    }
    setDragOverIdx(null);
  };

  // ── Field actions ──────────────────────────────────────────
  const updateField = (updated: FormFieldData) =>
    setFields(prev => prev.map(f => f.id === updated.id ? updated : f));

  const deleteField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const duplicateField = (id: string) => {
    const src = fields.find(f => f.id === id);
    if (!src) return;
    const dup = createField(src.type, { ...src, id: '', titulo: src.titulo + ' (cópia)' });
    const idx = fields.findIndex(f => f.id === id);
    setFields(prev => {
      const next = [...prev];
      next.splice(idx + 1, 0, dup);
      return next;
    });
    setSelectedId(dup.id);
  };

  const moveField = (id: string, dir: -1 | 1) => {
    setFields(prev => {
      const idx = prev.findIndex(f => f.id === id);
      if (idx < 0) return prev;
      const to = idx + dir;
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[to]] = [next[to], next[idx]];
      return next;
    });
  };

  // ── Template actions ───────────────────────────────────────
  const loadTemplate = (t: FormTemplate) => {
    setFields(t.fields);
    setSelectedId(null);
    setShowPicker(false);
  };

  const startBlank = () => { setFields([]); setSelectedId(null); setShowPicker(false); };

  // ── Paleta filtrada ────────────────────────────────────────
  const filteredCatalog = FIELD_CATALOG.filter(f =>
    f.label.toLowerCase().includes(buscaPaleta.toLowerCase()) ||
    f.categoria.toLowerCase().includes(buscaPaleta.toLowerCase())
  );
  const filteredCategories = FIELD_CATEGORIES.filter(cat =>
    filteredCatalog.some(f => f.categoria === cat)
  );

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="fb-overlay">
      {showPicker && <TemplatePicker onSelect={loadTemplate} onBlank={startBlank} />}

      {/* Header */}
      <div className="fb-header">
        <div className="fb-header-left">
          <button className="fb-back-btn" onClick={onClose}>
            <i className="fa-regular fa-xmark" />
          </button>
          <div className="fb-header-title">
            <i className="fa-regular fa-file-pen" />
            <span>{nomeTarefa ? `Formulário — ${nomeTarefa}` : 'Formulário'}</span>
            <span className="fb-header-count">{fields.length} campo{fields.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="fb-header-right">
          <label className="fb-template-toggle">
            <div className={`fbp-toggle ${isTemplate ? 'on' : ''}`} onClick={() => setIsTemplate(v => !v)}>
              <div className="fbp-toggle-thumb" />
            </div>
            <span>Salvar como modelo</span>
          </label>
          <button className="fb-btn-secondary" onClick={() => setShowPicker(true)}>
            <i className="fa-regular fa-layer-group" />
            Modelos
          </button>
          <button className="fb-btn-primary" onClick={() => onSave(fields)}>
            <i className="fa-regular fa-floppy-disk" />
            Salvar formulário
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="fb-workspace">
        {/* ── Paleta ── */}
        <aside className="fb-sidebar">
          <div className="fb-sidebar-search">
            <i className="fa-regular fa-magnifying-glass" />
            <input
              placeholder="Buscar campo..."
              value={buscaPaleta}
              onChange={e => setBuscaPaleta(e.target.value)}
            />
          </div>
          <div className="fb-palette">
            {filteredCategories.map(cat => (
              <div key={cat} className="fb-palette-cat">
                <div className="fb-palette-cat-title">{cat}</div>
                <div className="fb-palette-items">
                  {filteredCatalog.filter(f => f.categoria === cat).map(f => (
                    <div
                      key={f.type}
                      className="fb-palette-item"
                      draggable
                      onDragStart={() => onPaletteDragStart(f.type)}
                      onDragEnd={onCanvasDropEnd}
                      onClick={() => {
                        const nf = createField(f.type);
                        setFields(prev => [...prev, nf]);
                        setSelectedId(nf.id);
                      }}
                      title={f.descricao}
                    >
                      <div className="fb-palette-icon" style={{ background: f.bg, color: f.color }}>
                        <i className={f.icon} />
                      </div>
                      <span>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Canvas ── */}
        <main
          className="fb-canvas"
          onDragOver={onZoneDragOver}
          onDrop={onZoneDrop}
        >
          {fields.length === 0 ? (
            <div className="fb-canvas-empty">
              <i className="fa-regular fa-arrow-left" />
              <p>Arraste um campo da paleta ou clique nele para começar</p>
            </div>
          ) : (
            <div className="fb-canvas-fields">
              {fields.map((field, idx) => {
                const def = fieldDef(field.type);
                const isSelected = selectedId === field.id;
                const isHidden = field.type === 'hidden';
                const isDrop = dragOverIdx === idx;

                return (
                  <div key={field.id}>
                    {/* Drop indicator */}
                    {isDrop && <div className="fb-drop-indicator" />}

                    <div
                      className={`fb-field-card${isSelected ? ' selected' : ''}${isHidden ? ' hidden-field' : ''}`}
                      onDragOver={e => onCanvasDragOver(e, idx)}
                      onDrop={e => onCanvasDrop(e, idx)}
                      onClick={() => setSelectedId(isSelected ? null : field.id)}
                    >
                      {/* Badge de tipo */}
                      <div className="fb-field-type-badge" style={{ background: def?.bg, color: def?.color }}>
                        <i className={def?.icon} />
                        <span>{def?.label}</span>
                        {field.obrigatorio && <span className="fb-required-dot">*</span>}
                      </div>

                      {/* Título do campo (exceto layout puro) */}
                      {!['divider','spacer','alert','image','link','paragraph','heading','button'].includes(field.type) && (
                        <div className="fb-field-title">{field.titulo}</div>
                      )}

                      {/* Preview */}
                      <div className="fb-field-preview">
                        <FieldPreview field={field} />
                      </div>

                      {/* Ajuda */}
                      {field.textoAjuda && (
                        <div className="fb-field-hint"><i className="fa-regular fa-circle-info" />{field.textoAjuda}</div>
                      )}

                      {/* Toolbar (visível quando selecionado) */}
                      {isSelected && (
                        <div className="fb-field-toolbar" onClick={e => e.stopPropagation()}>
                          <button className="fb-field-tool" title="Mover para cima" onClick={() => moveField(field.id, -1)} disabled={idx === 0}>
                            <i className="fa-regular fa-arrow-up" />
                          </button>
                          <button className="fb-field-tool" title="Mover para baixo" onClick={() => moveField(field.id, 1)} disabled={idx === fields.length - 1}>
                            <i className="fa-regular fa-arrow-down" />
                          </button>
                          <div className="fb-field-tool-sep" />
                          <button className="fb-field-tool" title="Duplicar" onClick={() => duplicateField(field.id)}>
                            <i className="fa-regular fa-copy" />
                          </button>
                          <button className="fb-field-tool red" title="Excluir" onClick={() => deleteField(field.id)}>
                            <i className="fa-regular fa-trash" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* Drop zone final */}
              <div
                className={`fb-drop-zone${dragOverIdx === fields.length ? ' active' : ''}`}
                onDragOver={onZoneDragOver}
                onDrop={onZoneDrop}
              >
                <i className="fa-regular fa-plus" />
                <span>Arraste um campo aqui</span>
              </div>
            </div>
          )}
        </main>

        {/* ── Painel de propriedades ── */}
        <aside className="fb-properties">
          {selectedField ? (
            <FieldProperties
              field={selectedField}
              onChange={updateField}
              onDuplicate={() => duplicateField(selectedField.id)}
              onDelete={() => deleteField(selectedField.id)}
            />
          ) : (
            <div className="fb-properties-empty">
              <i className="fa-regular fa-hand-pointer" />
              <p>Clique em um campo no canvas para configurá-lo</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
