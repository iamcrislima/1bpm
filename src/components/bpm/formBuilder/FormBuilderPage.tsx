import { useState, useCallback, useRef } from 'react';
import {
  FIELD_CATALOG, FIELD_CATEGORIES, FORM_TEMPLATES,
  createField, type FormFieldData, type FormTemplate,
} from './fieldTypes';
import './formBuilderPage.css';

// ── Helper FontAwesome (evita crash React 19 + FA) ─────────────
function Ico({ icon, style }: { icon: string; style?: React.CSSProperties }) {
  return (
    <span
      dangerouslySetInnerHTML={{ __html: `<i class="${icon}"></i>` }}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, flexShrink: 0, ...style }}
    />
  );
}

function fieldDef(type: string) {
  return FIELD_CATALOG.find(f => f.type === type);
}

// ── Proporção de colunas ────────────────────────────────────────
function propToGrid(prop?: string) {
  if (prop === '1/3+2/3') return '1fr 2fr';
  if (prop === '1/4+3/4') return '1fr 3fr';
  return '1fr 1fr';
}

// ── Preview compacto no canvas (usado nos cards do editor) ────
function CanvasFieldPreview({ field }: { field: FormFieldData }) {
  const { type, placeholder, opcoes } = field;

  const inputBase: React.CSSProperties = {
    width: '100%', height: 36, borderRadius: 6, border: '1px solid #d1d5db',
    background: '#f9fafb', boxSizing: 'border-box', display: 'flex',
    alignItems: 'center', paddingLeft: 10, paddingRight: 10,
    fontSize: 12, color: '#adb7c4', fontStyle: 'italic', gap: 6,
  };

  if (type === 'heading') {
    const sz = field.nivelTitulo === 1 ? 20 : field.nivelTitulo === 2 ? 17 : field.nivelTitulo === 3 ? 14 : 12;
    return <div style={{ fontWeight: 700, fontSize: sz, color: '#1a1a1a', padding: '2px 0' }}>{field.textoFixo || 'Título'}</div>;
  }
  if (type === 'paragraph') {
    return <p style={{ fontSize: 13, color: '#565656', margin: 0, lineHeight: 1.5 }}>{field.textoFixo || 'Texto do parágrafo...'}</p>;
  }
  if (type === 'divider') {
    return <div style={{ height: 1, background: '#e5e7eb', margin: '4px 0' }} />;
  }
  if (type === 'spacer') {
    return <div style={{ height: 20, background: 'repeating-linear-gradient(45deg,#f4f6f9,#f4f6f9 4px,#e5e7eb 4px,#e5e7eb 8px)', borderRadius: 4 }} />;
  }
  if (type === 'alert') {
    const bg = { info: '#dbeafe', aviso: '#fef3c7', erro: '#fee2e2', sucesso: '#dcfce7' }[field.alertaTipo] ?? '#dbeafe';
    const ic = { info: 'fa-regular fa-circle-info', aviso: 'fa-regular fa-triangle-exclamation', erro: 'fa-regular fa-circle-xmark', sucesso: 'fa-regular fa-circle-check' }[field.alertaTipo] ?? 'fa-regular fa-circle-info';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: bg, borderRadius: 6, padding: '8px 12px', fontSize: 12 }}>
        <Ico icon={ic} /><span>{field.textoFixo || 'Mensagem de alerta'}</span>
      </div>
    );
  }
  if (type === 'textarea') {
    return (
      <div style={{ width: '100%', height: 80, borderRadius: 6, border: '1px solid #d1d5db', background: '#f9fafb', padding: '8px 10px', fontSize: 12, color: '#adb7c4', fontStyle: 'italic', boxSizing: 'border-box', position: 'relative' }}>
        <span>{placeholder || 'Texto longo...'}</span>
        <div style={{ position: 'absolute', bottom: 4, right: 4, width: 8, height: 8, borderRight: '2px solid #d1d5db', borderBottom: '2px solid #d1d5db', borderRadius: '0 0 2px 0' }} />
      </div>
    );
  }
  if (type === 'select' || type === 'combobox') {
    return (
      <div style={{ ...inputBase, justifyContent: 'space-between' }}>
        <span>{placeholder || 'Escolha uma opção...'}</span>
        <Ico icon="fa-regular fa-chevron-down" style={{ color: '#d1d5db', fontSize: 10 }} />
      </div>
    );
  }
  if (type === 'date' || type === 'time' || type === 'datetime') {
    const ph = type === 'date' ? 'DD/MM/AAAA' : type === 'time' ? 'HH:MM' : 'DD/MM/AAAA HH:MM';
    const icon = type === 'time' ? 'fa-regular fa-clock' : 'fa-regular fa-calendar';
    return (
      <div style={{ ...inputBase, justifyContent: 'space-between' }}>
        <span>{ph}</span>
        <Ico icon={icon} style={{ color: '#d1d5db', fontSize: 12 }} />
      </div>
    );
  }
  if (type === 'radio' || type === 'checkbox') {
    const opts = (opcoes || []).slice(0, 3);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {opts.map((op, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#9ca3af' }}>
            <div style={{ width: 14, height: 14, border: '1.5px solid #d1d5db', borderRadius: type === 'radio' ? '50%' : 3, background: '#f9fafb', flexShrink: 0 }} />
            <span>{op}</span>
          </div>
        ))}
        {(opcoes || []).length > 3 && <span style={{ fontSize: 11, color: '#c4ccd6', paddingLeft: 21 }}>+{(opcoes.length - 3)} mais opções</span>}
      </div>
    );
  }
  if (type === 'file' || type === 'files') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '16px 12px', border: '1.5px dashed #d1d5db', borderRadius: 8, background: '#f9fafb', fontSize: 12, color: '#adb7c4', textAlign: 'center' }}>
        <Ico icon="fa-regular fa-cloud-arrow-up" style={{ fontSize: 20, color: '#d1d5db' }} />
        <span>Arraste um arquivo ou clique para selecionar</span>
      </div>
    );
  }
  if (type === 'signature') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 12px', border: '1.5px dashed #fbbf24', borderRadius: 8, fontSize: 12, color: '#d97706', background: '#fffbeb' }}>
        <Ico icon="fa-regular fa-signature" /><span>Área de assinatura digital</span>
      </div>
    );
  }
  if (type === 'number' || type === 'currency' || type === 'percent') {
    const icon = type === 'currency' ? 'fa-regular fa-circle-dollar' : type === 'percent' ? 'fa-regular fa-percent' : 'fa-regular fa-hashtag';
    const ph = type === 'currency' ? 'R$ 0,00' : type === 'percent' ? '0%' : placeholder || '0';
    return (
      <div style={{ ...inputBase }}>
        <Ico icon={icon} style={{ color: '#d1d5db', fontSize: 11 }} />
        <span>{ph}</span>
      </div>
    );
  }
  if (type === 'toggle') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#9ca3af' }}>
        <div style={{ width: 36, height: 20, borderRadius: 10, background: '#d1d5db', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 2, left: 2, width: 16, height: 16, borderRadius: '50%', background: 'white' }} />
        </div>
        <span>Não / Sim</span>
      </div>
    );
  }
  if (type === 'rating') {
    return (
      <div style={{ display: 'flex', gap: 4 }}>
        {[1,2,3,4,5].map(i => <Ico key={i} icon="fa-regular fa-star" style={{ color: '#f59e0b', fontSize: 16 }} />)}
      </div>
    );
  }
  if (type === 'terms' || type === 'lgpd') {
    return (
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#565656' }}>
        <div style={{ width: 14, height: 14, border: '1.5px solid #d1d5db', borderRadius: 3, background: '#f9fafb', flexShrink: 0, marginTop: 1 }} />
        <span>{field.textoFixo || (type === 'lgpd' ? 'Autorizo o uso dos meus dados (LGPD)' : 'Concordo com os termos')}</span>
      </label>
    );
  }
  if (type === 'button') {
    const bg = field.estilobotao === 'primario' ? '#0058db' : field.estilobotao === 'perigo' ? '#c0182d' : 'white';
    const color = field.estilobotao === 'secundario' ? '#0058db' : 'white';
    const border = field.estilobotao === 'secundario' ? '1.5px solid #0058db' : 'none';
    return <button disabled style={{ padding: '7px 18px', borderRadius: 7, background: bg, color, border, fontSize: 13, fontWeight: 600, cursor: 'default' }}>{field.labelBotao || 'Enviar'}</button>;
  }
  if (type === 'link') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
        <Ico icon="fa-regular fa-link" style={{ color: '#0058db' }} />
        <span style={{ color: '#0058db', textDecoration: 'underline' }}>{field.textoLink || 'Clique aqui'}</span>
      </div>
    );
  }

  // default: text, cpf, cnpj, cep, phone, mask, password, hidden, map, etc.
  const maskPh = type === 'cpf' ? '000.000.000-00' : type === 'cnpj' ? '00.000.000/0000-00' : type === 'cep' ? '00000-000' : type === 'phone' ? '(00) 00000-0000' : null;
  return (
    <div style={{ ...inputBase }}>
      {type === 'password' && <Ico icon="fa-regular fa-lock" style={{ color: '#d1d5db', fontSize: 11 }} />}
      <span>{maskPh || placeholder || 'Texto curto...'}</span>
    </div>
  );
}

// ── Preview completo (modo Pré-visualização) ───────────────────
function PreviewFieldContent({ field }: { field: FormFieldData }) {
  const { type } = field;
  if (!type) return null;

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 44, border: '1.5px solid #d1d5db', borderRadius: 8,
    padding: '0 14px', fontSize: 14, fontFamily: "'Open Sans', sans-serif",
    color: '#9ca3af', background: '#fafafa', boxSizing: 'border-box',
    outline: 'none', cursor: 'default',
  };

  if (type === 'heading') {
    const level = field.nivelTitulo ?? 1;
    const sizes: Record<number, number> = { 1: 22, 2: 18, 3: 15, 4: 13 };
    const text = field.titulo || field.textoFixo || 'Título';
    return (
      <div style={{
        fontSize: sizes[level] ?? 16, fontWeight: level <= 2 ? 700 : 600,
        color: '#1a1a1a', fontFamily: "'Open Sans', sans-serif", lineHeight: 1.3,
        paddingBottom: level === 1 ? 10 : 0,
        borderBottom: level === 1 ? '1px solid #e5e7eb' : 'none',
      }}>{text}</div>
    );
  }
  if (type === 'paragraph') {
    return <p style={{ fontSize: 14, color: '#565656', lineHeight: 1.6, margin: 0, fontFamily: "'Open Sans', sans-serif" }}>{field.textoFixo || ''}</p>;
  }
  if (type === 'divider') {
    return <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '4px 0' }} />;
  }
  if (type === 'spacer') {
    return <div style={{ height: 24 }} />;
  }
  if (type === 'alert') {
    const cfgs: Record<string, { bg: string; border: string; color: string; icon: string }> = {
      info:    { bg: '#eff6ff', border: '#bfdbfe', color: '#1e40af', icon: 'fa-regular fa-circle-info' },
      aviso:   { bg: '#fffbeb', border: '#fde68a', color: '#92400e', icon: 'fa-regular fa-triangle-exclamation' },
      erro:    { bg: '#fef2f2', border: '#fecaca', color: '#991b1b', icon: 'fa-regular fa-circle-xmark' },
      sucesso: { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', icon: 'fa-regular fa-circle-check' },
    };
    const c = cfgs[field.alertaTipo ?? 'info'] ?? cfgs.info;
    return (
      <div style={{ display: 'flex', gap: 10, padding: '12px 16px', background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, color: c.color, fontSize: 13, fontFamily: "'Open Sans', sans-serif", lineHeight: 1.5 }}>
        <Ico icon={c.icon} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>{field.textoFixo || 'Alerta'}</span>
      </div>
    );
  }
  if (type === 'container') {
    const filhos1 = field.filhos ?? [];
    const filhos2 = field.filhos2 ?? [];
    const cols = propToGrid(field.proporcao);
    const renderCol = (colFields: FormFieldData[]) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {colFields.map(cf => {
          const isLayout = ['heading','paragraph','divider','spacer','alert','button','link','image'].includes(cf.type);
          return (
            <div key={cf.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {!isLayout && cf.titulo && (
                <label style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', fontFamily: "'Open Sans', sans-serif" }}>
                  {cf.titulo}{cf.obrigatorio && <span style={{ color: '#c0182d', marginLeft: 3 }}>*</span>}
                </label>
              )}
              <PreviewFieldContent field={cf} />
              {cf.textoAjuda && !isLayout && <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: "'Open Sans', sans-serif" }}>{cf.textoAjuda}</span>}
            </div>
          );
        })}
      </div>
    );
    return (
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16 }}>
        {renderCol(filhos1)}
        {renderCol(filhos2)}
      </div>
    );
  }
  if (type === 'textarea') {
    return <textarea disabled style={{ ...inputStyle, height: 100, padding: '10px 14px', resize: 'none' }} placeholder={field.placeholder || 'Texto longo...'} />;
  }
  if (type === 'select' || type === 'combobox') {
    return (
      <select disabled style={{ ...inputStyle, height: 44, appearance: 'none' }}>
        <option>{field.placeholder || 'Escolha uma opção...'}</option>
        {(field.opcoes ?? []).map((op, i) => <option key={i}>{op}</option>)}
      </select>
    );
  }
  if (type === 'radio' || type === 'checkbox') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(field.opcoes ?? ['Opção 1', 'Opção 2']).map((op, i) => (
          <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#333', fontFamily: "'Open Sans', sans-serif", cursor: 'default' }}>
            <input type={type === 'radio' ? 'radio' : 'checkbox'} disabled style={{ width: 16, height: 16, accentColor: '#0058db' }} />
            <span>{op}</span>
          </label>
        ))}
      </div>
    );
  }
  if (type === 'file' || type === 'files') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '28px 24px', border: '2px dashed #d1d5db', borderRadius: 10, background: '#fafafa', fontSize: 13, color: '#9ca3af', textAlign: 'center', fontFamily: "'Open Sans', sans-serif" }}>
        <Ico icon="fa-regular fa-cloud-arrow-up" style={{ fontSize: 28, color: '#d1d5db' }} />
        <span>Arraste arquivos ou clique para selecionar</span>
        {field.aceitarTipos && <span style={{ fontSize: 11 }}>Tipos aceitos: {field.aceitarTipos}</span>}
      </div>
    );
  }
  if (type === 'signature') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '24px', border: '2px dashed #fbbf24', borderRadius: 10, background: '#fffbeb', fontSize: 13, color: '#d97706', fontFamily: "'Open Sans', sans-serif" }}>
        <Ico icon="fa-regular fa-signature" style={{ fontSize: 22 }} />
        <span>Área de assinatura digital</span>
      </div>
    );
  }
  if (type === 'date')     return <input type="date"          disabled style={inputStyle} />;
  if (type === 'time')     return <input type="time"          disabled style={inputStyle} />;
  if (type === 'datetime') return <input type="datetime-local" disabled style={inputStyle} />;
  if (type === 'toggle') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 44, height: 24, borderRadius: 12, background: '#d1d5db', position: 'relative', flexShrink: 0 }}>
          <div style={{ position: 'absolute', top: 3, left: 3, width: 18, height: 18, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
        </div>
        <span style={{ fontSize: 14, color: '#9ca3af', fontFamily: "'Open Sans', sans-serif" }}>Não</span>
      </div>
    );
  }
  if (type === 'rating') {
    return (
      <div style={{ display: 'flex', gap: 6 }}>
        {[1,2,3,4,5].map(i => <Ico key={i} icon="fa-regular fa-star" style={{ color: '#e5e7eb', fontSize: 24 }} />)}
      </div>
    );
  }
  if (type === 'terms' || type === 'lgpd') {
    return (
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#565656', fontFamily: "'Open Sans', sans-serif", cursor: 'default', lineHeight: 1.5 }}>
        <input type="checkbox" disabled style={{ marginTop: 2, width: 16, height: 16, accentColor: '#0058db', flexShrink: 0 }} />
        <span>{field.textoFixo || (type === 'lgpd' ? 'Autorizo o uso dos meus dados conforme a LGPD' : 'Li e concordo com os termos de uso')}</span>
      </label>
    );
  }
  if (type === 'button') {
    const bg = field.estilobotao === 'primario' ? '#0058db' : field.estilobotao === 'perigo' ? '#c0182d' : 'white';
    const color = field.estilobotao === 'secundario' ? '#0058db' : 'white';
    const border = field.estilobotao === 'secundario' ? '1.5px solid #0058db' : 'none';
    return <button disabled style={{ padding: '10px 24px', borderRadius: 8, background: bg, color, border, fontSize: 14, fontWeight: 600, fontFamily: "'Open Sans', sans-serif", cursor: 'default' }}>{field.labelBotao || 'Botão'}</button>;
  }
  if (type === 'link') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
        <Ico icon="fa-regular fa-link" style={{ color: '#0058db' }} />
        <span style={{ color: '#0058db', textDecoration: 'underline', fontFamily: "'Open Sans', sans-serif" }}>{field.textoLink || 'Clique aqui'}</span>
      </div>
    );
  }
  if (type === 'image') {
    return field.srcImagem
      ? <img src={field.srcImagem} alt={field.altImagem || ''} style={{ maxWidth: '100%', borderRadius: 8 }} />
      : <div style={{ height: 100, background: '#f4f6f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 13, fontFamily: "'Open Sans', sans-serif", gap: 8 }}><Ico icon="fa-regular fa-image" />Imagem</div>;
  }
  if (type === 'currency') return <input type="text" disabled placeholder="R$ 0,00"  style={inputStyle} />;
  if (type === 'percent')  return <input type="text" disabled placeholder="0%"        style={inputStyle} />;
  if (type === 'number')   return <input type="number" disabled placeholder={field.placeholder || '0'} style={inputStyle} />;
  if (type === 'password') return <input type="password" disabled placeholder="••••••••" style={inputStyle} />;
  const maskPh: Record<string, string> = { cpf: '000.000.000-00', cnpj: '00.000.000/0000-00', cep: '00000-000', phone: '(00) 00000-0000' };
  return <input type="text" disabled placeholder={maskPh[type] ?? field.placeholder ?? 'Texto curto...'} style={inputStyle} />;
}

// ── Cabeçalho editável do formulário (CORREÇÃO 6) ──────────────
interface FormHeaderState { logoUrl: string | null; title: string; subtitle: string; }

function FormHeader({ header, onChange }: { header: FormHeaderState; onChange: (h: FormHeaderState) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="fb-form-header">
      <div className="fb-form-header-logo" onClick={() => ref.current?.click()}>
        {header.logoUrl
          ? <img src={header.logoUrl} alt="logo" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
          : <><Ico icon="fa-regular fa-image" style={{ fontSize: 22, color: '#c4ccd6' }} /><span>Adicionar logo</span></>}
        <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) onChange({ ...header, logoUrl: URL.createObjectURL(f) });
          }} />
      </div>
      <div className="fb-form-header-text">
        <input
          className="fb-form-header-title"
          value={header.title}
          onChange={e => onChange({ ...header, title: e.target.value })}
          placeholder="Título do formulário"
        />
        <input
          className="fb-form-header-subtitle"
          value={header.subtitle}
          onChange={e => onChange({ ...header, subtitle: e.target.value })}
          placeholder="Descrição opcional"
        />
      </div>
    </div>
  );
}

// ── Modo Pré-visualização ──────────────────────────────────────
const LAYOUT_TYPES = new Set(['heading', 'paragraph', 'divider', 'spacer', 'alert', 'button', 'link', 'image', 'container']);

function PreviewMode({ header, fields }: { header: FormHeaderState; fields: FormFieldData[]; onBack: () => void }) {
  return (
    <div className="fb-preview-wrapper">
      <div className="fb-preview-canvas">
        <div className="fb-preview-form">
          <div className="fb-preview-header">
            {header.logoUrl && (
              <img src={header.logoUrl} alt="logo" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
            )}
            <div className="fb-preview-title">{header.title || 'Título do formulário'}</div>
            {header.subtitle && <div className="fb-preview-subtitle">{header.subtitle}</div>}
          </div>

          <div className="fb-preview-fields">
            {fields.filter(f => !!f.type).map(field => {
              const isLayout = LAYOUT_TYPES.has(field.type);
              return (
                <div key={field.id} className="fb-preview-field">
                  {!isLayout && field.titulo && (
                    <label className="fb-preview-field-label">
                      {field.titulo}
                      {field.obrigatorio && <span style={{ color: '#c0182d', marginLeft: 3 }}>*</span>}
                    </label>
                  )}
                  <PreviewFieldContent field={field} />
                  {!isLayout && field.textoAjuda && <span className="fb-preview-field-help">{field.textoAjuda}</span>}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #e8edf3', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" disabled style={{ padding: '0 32px', height: 44, fontSize: 14, fontWeight: 700 }}>
              <Ico icon="fa-regular fa-paper-plane" />
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Painel de propriedades ─────────────────────────────────────
function FieldProperties({
  field, onChange, onDuplicate, onDelete,
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
      <div className="fbp-panel-header">
        <div className="fbp-panel-header-info">
          <div className="fbp-panel-icon" style={{ background: def?.bg, color: def?.color }}>
            <Ico icon={def?.icon ?? ''} />
          </div>
          <div>
            <div className="fbp-panel-type">{def?.label}</div>
            <div className="fbp-panel-name">{field.titulo}</div>
          </div>
        </div>
        <div className="fbp-panel-header-actions">
          <button className="fbp-icon-btn" title="Duplicar" onClick={onDuplicate}><Ico icon="fa-regular fa-copy" /></button>
          <button className="fbp-icon-btn red" title="Excluir" onClick={onDelete}><Ico icon="fa-regular fa-trash" /></button>
        </div>
      </div>

      <div className="fbp-tabs">
        {(['geral', 'avancado', 'condicoes'] as const).map(t => (
          <button key={t} className={`fbp-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'geral' ? 'Geral' : t === 'avancado' ? 'Avançado' : 'Condições'}
          </button>
        ))}
      </div>

      <div className="fbp-panel-body">
        {tab === 'geral' && (
          <>
            {(field.type === 'heading' || field.type === 'paragraph' || field.type === 'terms' || field.type === 'lgpd') && (
              <div className="fbp-field">
                <label className="fbp-label">Texto</label>
                <textarea className="fbp-textarea" rows={3} value={field.textoFixo} onChange={e => update({ textoFixo: e.target.value })} />
              </div>
            )}
            {field.type === 'heading' && (
              <div className="fbp-field">
                <label className="fbp-label">Nível</label>
                <div className="fbp-radio-row">
                  {[1,2,3,4].map(n => (
                    <label key={n} className="fbp-radio-chip">
                      <input type="radio" checked={field.nivelTitulo === n} onChange={() => update({ nivelTitulo: n as 1|2|3|4 })} />H{n}
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
                        <input type="radio" checked={field.alertaTipo === o.v} onChange={() => update({ alertaTipo: o.v as 'info'|'aviso'|'erro'|'sucesso' })} />{o.l}
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
                <div className="fbp-field"><label className="fbp-label">URL</label><input className="fbp-input" value={field.urlLink} onChange={e => update({ urlLink: e.target.value })} placeholder="https://..." /></div>
                <div className="fbp-field"><label className="fbp-label">Texto do link</label><input className="fbp-input" value={field.textoLink} onChange={e => update({ textoLink: e.target.value })} /></div>
              </>
            )}
            {field.type === 'image' && (
              <>
                <div className="fbp-field"><label className="fbp-label">URL da imagem</label><input className="fbp-input" value={field.srcImagem} onChange={e => update({ srcImagem: e.target.value })} placeholder="https://..." /></div>
                <div className="fbp-field"><label className="fbp-label">Texto alternativo</label><input className="fbp-input" value={field.altImagem} onChange={e => update({ altImagem: e.target.value })} /></div>
              </>
            )}
            {field.type === 'button' && (
              <>
                <div className="fbp-field"><label className="fbp-label">Rótulo do botão</label><input className="fbp-input" value={field.labelBotao} onChange={e => update({ labelBotao: e.target.value })} /></div>
                <div className="fbp-field">
                  <label className="fbp-label">Estilo</label>
                  <div className="fbp-radio-row">
                    {[{v:'primario',l:'Primário'},{v:'secundario',l:'Secundário'},{v:'perigo',l:'Perigo'}].map(o => (
                      <label key={o.v} className="fbp-radio-chip">
                        <input type="radio" checked={field.estilobotao === o.v} onChange={() => update({ estilobotao: o.v as 'primario'|'secundario'|'perigo' })} />{o.l}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="fbp-field">
                  <label className="fbp-label">Tipo</label>
                  <select className="fbp-select" value={field.tipoBotao} onChange={e => update({ tipoBotao: e.target.value as 'submit'|'reset'|'button' })}>
                    <option value="submit">Enviar (submit)</option>
                    <option value="reset">Limpar (reset)</option>
                    <option value="button">Ação personalizada</option>
                  </select>
                </div>
              </>
            )}
            {field.type === 'container' && (
              <div className="fbp-field">
                <label className="fbp-label">Proporção das colunas</label>
                <select className="fbp-select" value={field.proporcao} onChange={e => update({ proporcao: e.target.value as '1/2+1/2'|'1/3+2/3'|'1/4+3/4' })}>
                  <option value="1/2+1/2">1/2 + 1/2 (igual)</option>
                  <option value="1/3+2/3">1/3 + 2/3</option>
                  <option value="1/4+3/4">1/4 + 3/4</option>
                </select>
              </div>
            )}

            {!isLayout && field.type !== 'button' && field.type !== 'container' && (
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
                    <div className={`fbp-toggle ${field.obrigatorio ? 'on' : ''}`} onClick={() => update({ obrigatorio: !field.obrigatorio })}><div className="fbp-toggle-thumb" /></div>
                  </label>
                  <label className="fbp-toggle-label">
                    <span>Desabilitado</span>
                    <div className={`fbp-toggle ${field.desabilitado ? 'on' : ''}`} onClick={() => update({ desabilitado: !field.desabilitado })}><div className="fbp-toggle-thumb" /></div>
                  </label>
                  <label className="fbp-toggle-label">
                    <span>Somente leitura</span>
                    <div className={`fbp-toggle ${field.somenteLeitura ? 'on' : ''}`} onClick={() => update({ somenteLeitura: !field.somenteLeitura })}><div className="fbp-toggle-thumb" /></div>
                  </label>
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
              </>
            )}
          </>
        )}

        {tab === 'avancado' && (
          <>
            {hasOpcoes && (
              <div className="fbp-field">
                <label className="fbp-label">Opções disponíveis</label>
                <div className="fbp-options-list">
                  {(field.opcoes || []).map((op, i) => (
                    <div key={i} className="fbp-option-row">
                      <input className="fbp-input" value={op} placeholder={`Opção ${i + 1}`}
                        onChange={e => { const next = [...(field.opcoes || [])]; next[i] = e.target.value; update({ opcoes: next }); }} />
                      <button className="fbp-icon-btn red" onClick={() => update({ opcoes: (field.opcoes || []).filter((_, idx) => idx !== i) })}>
                        <Ico icon="fa-regular fa-xmark" />
                      </button>
                    </div>
                  ))}
                  <button className="fbp-add-option-btn" onClick={() => update({ opcoes: [...(field.opcoes || []), ''] })}>
                    <Ico icon="fa-regular fa-plus" /> Adicionar opção
                  </button>
                </div>
              </div>
            )}
            {['mask','cpf','cnpj','cep','phone'].includes(field.type) && (
              <div className="fbp-field">
                <label className="fbp-label">Máscara</label>
                <input className="fbp-input" value={field.mascara} onChange={e => update({ mascara: e.target.value })} placeholder="Ex: ###.###.###-##" />
                <div className="fbp-hint"># = dígito numérico, A = letra</div>
              </div>
            )}
            {(field.type === 'file' || field.type === 'files') && (
              <>
                <div className="fbp-field"><label className="fbp-label">Tipos aceitos</label><input className="fbp-input" value={field.aceitarTipos} onChange={e => update({ aceitarTipos: e.target.value })} placeholder=".pdf,.doc,.docx,.jpg" /></div>
                <div className="fbp-row-2">
                  <div className="fbp-field"><label className="fbp-label">Máx. de arquivos</label><input className="fbp-input" type="number" min={1} value={field.maxArquivos} onChange={e => update({ maxArquivos: parseInt(e.target.value) || 1 })} /></div>
                  <div className="fbp-field"><label className="fbp-label">Tamanho máx. (MB)</label><input className="fbp-input" type="number" min={1} value={field.maxTamanhoMb} onChange={e => update({ maxTamanhoMb: parseInt(e.target.value) || 1 })} /></div>
                </div>
              </>
            )}
            {!isLayout && (
              <div className="fbp-field">
                <label className="fbp-label">Validação personalizada</label>
                <input className="fbp-input" value={field.validacaoCustom} onChange={e => update({ validacaoCustom: e.target.value })} placeholder="Ex: valor > 0" />
                <div className="fbp-hint">Expressão avaliada no momento do envio</div>
              </div>
            )}
          </>
        )}

        {tab === 'condicoes' && (
          <div className="fbp-field">
            <label className="fbp-label">Exibir este campo quando</label>
            <textarea className="fbp-textarea" rows={3} value={field.condicaoExibir} onChange={e => update({ condicaoExibir: e.target.value })} placeholder="Ex: tipoPessoa == 'juridica'" />
            <div className="fbp-hint">Use o nome do campo e operadores: == != &gt; &lt; &gt;= &lt;=</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Template Picker ────────────────────────────────────────────
function TemplatePicker({ onSelect, onBlank }: { onSelect: (t: FormTemplate) => void; onBlank: () => void }) {
  return (
    <div className="fbp-template-overlay">
      <div className="fbp-template-card">
        <div className="fbp-template-header">
          <h2>Como deseja começar?</h2>
          <p>Escolha um modelo ou comece do zero</p>
        </div>
        <div className="fbp-template-grid">
          <button className="fbp-template-item fbp-template-blank" onClick={onBlank}>
            <div className="fbp-template-item-icon"><Ico icon="fa-regular fa-plus" /></div>
            <div className="fbp-template-item-info">
              <span className="fbp-template-item-name">Formulário em branco</span>
              <span className="fbp-template-item-desc">Comece do zero</span>
            </div>
          </button>
          {FORM_TEMPLATES.map(t => (
            <button key={t.id} className="fbp-template-item" onClick={() => onSelect(t)}>
              <div className="fbp-template-item-icon" style={{ background: '#dce6f5', color: '#0058db' }}>
                <Ico icon={t.icon} />
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

// ── Mapa de ícones por categoria da paleta ─────────────────────
const CAT_ICONS: Record<string, string> = {
  'Entrada de texto': 'fa-regular fa-font',
  'Numérico':         'fa-regular fa-hashtag',
  'Data e hora':      'fa-regular fa-calendar',
  'Documentos':       'fa-regular fa-id-card',
  'Seleção':          'fa-regular fa-list-check',
  'Arquivo':          'fa-regular fa-file-arrow-up',
  'Layout':           'fa-regular fa-table-columns',
  'Especial':         'fa-regular fa-sparkles',
};

// ── Componente principal ───────────────────────────────────────
interface FormBuilderPageProps {
  nomeTarefa?: string;
  onClose: () => void;
  onSave: (fields: FormFieldData[]) => void;
  initialFields?: FormFieldData[];
}

export default function FormBuilderPage({ nomeTarefa, onClose, onSave, initialFields }: FormBuilderPageProps) {
  const [fields, setFields]           = useState<FormFieldData[]>(initialFields ?? []);
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [showPicker, setShowPicker]   = useState(initialFields == null || initialFields.length === 0);
  const [isTemplate, setIsTemplate]   = useState(false);
  const [buscaPaleta, setBuscaPaleta] = useState('');
  const [dragOverIdx, setDragOverIdx]       = useState<number | null>(null);
  const [dragReorderIdx, setDragReorderIdx] = useState<number | null>(null);
  const [mode, setMode]               = useState<'edit' | 'preview'>('edit');
  const [formHeader, setFormHeader]   = useState<FormHeaderState>({ logoUrl: null, title: nomeTarefa || '', subtitle: '' });

  const DND_KEY     = 'fbp/field-type';
  const REORDER_KEY = 'fbp/reorder';
  const selectedField =
    fields.find(f => f.id === selectedId) ??
    fields.flatMap(f => [...(f.filhos ?? []), ...(f.filhos2 ?? [])]).find(f => f.id === selectedId) ??
    null;

  // ── Drag from palette ────────────────────────────────────────
  const onPaletteDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData(DND_KEY, type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const onCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const onCanvasDragOverIdx = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverIdx(idx);
  }, []);

  // ── Drop between fields (CORREÇÃO 1: stopPropagation presente) ─
  const onCanvasDrop = useCallback((e: React.DragEvent, insertAt: number) => {
    e.preventDefault();
    e.stopPropagation();

    const ri = e.dataTransfer.getData(REORDER_KEY);
    if (ri !== '') {
      const from = parseInt(ri);
      setFields(prev => {
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        const to = from < insertAt ? insertAt - 1 : insertAt;
        if (from === to) return prev;
        next.splice(to, 0, moved);
        return next;
      });
      setDragReorderIdx(null);
      setDragOverIdx(null);
      return;
    }

    const type = e.dataTransfer.getData(DND_KEY);
    if (!type) return;
    const nf = createField(type);
    setFields(prev => { const next = [...prev]; next.splice(insertAt, 0, nf); return next; });
    setSelectedId(nf.id);
    setDragOverIdx(null);
  }, []);

  const onZoneDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverIdx(-1);
  }, []);

  // CORREÇÃO 1: stopPropagation impede bubble ao canvas pai
  const onZoneDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const ri = e.dataTransfer.getData(REORDER_KEY);
    if (ri !== '') {
      const from = parseInt(ri);
      setFields(prev => {
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.push(moved);
        return next;
      });
      setDragReorderIdx(null);
      setDragOverIdx(null);
      return;
    }

    const type = e.dataTransfer.getData(DND_KEY);
    if (!type) return;
    const nf = createField(type);
    setFields(prev => [...prev, nf]);
    setSelectedId(nf.id);
    setDragOverIdx(null);
  }, []);

  // ── Container: drop into column ─────────────────────────────
  const dropIntoContainer = useCallback((e: React.DragEvent, containerId: string, col: 1 | 2) => {
    e.preventDefault();
    e.stopPropagation();
    const type = e.dataTransfer.getData(DND_KEY);
    if (!type) return;
    const nf = createField(type);
    setFields(prev => prev.map(f => {
      if (f.id !== containerId) return f;
      if (col === 1) return { ...f, filhos: [...(f.filhos || []), nf] };
      return { ...f, filhos2: [...(f.filhos2 || []), nf] };
    }));
  }, []);

  const deleteFromContainer = useCallback((containerId: string, fieldId: string, col: 1 | 2) => {
    setFields(prev => prev.map(f => {
      if (f.id !== containerId) return f;
      if (col === 1) return { ...f, filhos: (f.filhos || []).filter(c => c.id !== fieldId) };
      return { ...f, filhos2: (f.filhos2 || []).filter(c => c.id !== fieldId) };
    }));
  }, []);

  // ── Field CRUD ───────────────────────────────────────────────
  const updateField = (updated: FormFieldData) =>
    setFields(prev => prev.map(f => {
      if (f.id === updated.id) return updated;
      return {
        ...f,
        filhos:  (f.filhos  || []).map(c => c.id === updated.id ? updated : c),
        filhos2: (f.filhos2 || []).map(c => c.id === updated.id ? updated : c),
      };
    }));

  const deleteField = (id: string) => {
    setFields(prev =>
      prev
        .filter(f => f.id !== id)
        .map(f => ({
          ...f,
          filhos:  (f.filhos  || []).filter(c => c.id !== id),
          filhos2: (f.filhos2 || []).filter(c => c.id !== id),
        }))
    );
    if (selectedId === id) setSelectedId(null);
  };

  const duplicateField = (id: string) => {
    // Campo de nível raiz
    const topSrc = fields.find(f => f.id === id);
    if (topSrc) {
      const dup = createField(topSrc.type, { ...topSrc, id: '', titulo: topSrc.titulo + ' (cópia)' });
      const idx = fields.findIndex(f => f.id === id);
      setFields(prev => { const next = [...prev]; next.splice(idx + 1, 0, dup); return next; });
      setSelectedId(dup.id);
      return;
    }
    // Campo filho dentro de um container
    for (const f of fields) {
      const i1 = (f.filhos || []).findIndex(c => c.id === id);
      if (i1 !== -1) {
        const src = f.filhos![i1];
        const dup = createField(src.type, { ...src, id: '', titulo: src.titulo + ' (cópia)' });
        setFields(prev => prev.map(pf => {
          if (pf.id !== f.id) return pf;
          const next = [...(pf.filhos || [])];
          next.splice(i1 + 1, 0, dup);
          return { ...pf, filhos: next };
        }));
        setSelectedId(dup.id);
        return;
      }
      const i2 = (f.filhos2 || []).findIndex(c => c.id === id);
      if (i2 !== -1) {
        const src = f.filhos2![i2];
        const dup = createField(src.type, { ...src, id: '', titulo: src.titulo + ' (cópia)' });
        setFields(prev => prev.map(pf => {
          if (pf.id !== f.id) return pf;
          const next = [...(pf.filhos2 || [])];
          next.splice(i2 + 1, 0, dup);
          return { ...pf, filhos2: next };
        }));
        setSelectedId(dup.id);
        return;
      }
    }
  };

  const onFieldDragStart = (e: React.DragEvent, idx: number) => {
    e.dataTransfer.setData(REORDER_KEY, String(idx));
    e.dataTransfer.effectAllowed = 'move';
    setDragReorderIdx(idx);
  };

  const loadTemplate = (t: FormTemplate) => { setFields(t.fields); setSelectedId(null); setShowPicker(false); };
  const startBlank   = () => { setFields([]); setSelectedId(null); setShowPicker(false); };

  const filteredCatalog    = FIELD_CATALOG.filter(f => f.label.toLowerCase().includes(buscaPaleta.toLowerCase()) || f.categoria.toLowerCase().includes(buscaPaleta.toLowerCase()));
  const filteredCategories = FIELD_CATEGORIES.filter(cat => filteredCatalog.some(f => f.categoria === cat));

  return (
    <div className="fb-editor-container animate-fade-in">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="fb-editor-header">
        <div className="fb-editor-header-left">
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ marginRight: 4 }}>
            <Ico icon="fa-regular fa-chevron-left" />
            Sair
          </button>
          <div style={{ width: 1, height: 20, background: 'var(--border-light)', margin: '0 4px' }} />
          <Ico icon="fa-regular fa-file-pen" style={{ color: '#0058db', fontSize: 16 }} />
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1a1a1a', fontFamily: "'Open Sans', sans-serif" }}>
            {nomeTarefa ? `Formulário — ${nomeTarefa}` : 'Formulário'}
          </h2>
          <span className="badge badge-neutral" style={{ marginLeft: 4 }}>
            {fields.length} campo{fields.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* MELHORIA 3: Toggle Editar / Pré-visualização */}
        <div className="fb-mode-toggle">
          <button className={`fb-mode-btn ${mode === 'edit' ? 'active' : ''}`} onClick={() => setMode('edit')}>
            <Ico icon="fa-regular fa-pen-to-square" style={{ fontSize: 12 }} />
            Editar
          </button>
          <button className={`fb-mode-btn ${mode === 'preview' ? 'active' : ''}`} onClick={() => setMode('preview')}>
            <Ico icon="fa-regular fa-eye" style={{ fontSize: 12 }} />
            Pré-visualização
          </button>
        </div>

        <div className="fb-editor-header-right">
          <label className="fb-template-toggle">
            <div className={`fbp-toggle ${isTemplate ? 'on' : ''}`} onClick={() => setIsTemplate(v => !v)}>
              <div className="fbp-toggle-thumb" />
            </div>
            <span style={{ fontSize: 13, color: '#565656', whiteSpace: 'nowrap', fontFamily: "'Open Sans', sans-serif" }}>Salvar como modelo</span>
          </label>
          <button className="btn btn-secondary" onClick={() => setShowPicker(true)}>
            <Ico icon="fa-regular fa-layer-group" />
            Modelos
          </button>
          <button className="btn btn-primary" onClick={() => onSave(fields)}>
            <Ico icon="fa-regular fa-floppy-disk" />
            Salvar formulário
          </button>
        </div>
      </div>

      {/* MELHORIA 3: Modo Pré-visualização */}
      {mode === 'preview' ? (
        <PreviewMode header={formHeader} fields={fields} onBack={() => setMode('edit')} />
      ) : (
        /* ── Workspace ─────────────────────────────────────────── */
        <div className="fb-editor-workspace">
          {/* Paleta esquerda */}
          <aside className="fb-editor-palette">
            <div className="fb-palette-header">
              <span className="fb-palette-header-title">Tipos de campo</span>
              <span className="fb-palette-header-hint">Clique ou arraste para o canvas</span>
            </div>
            <div className="fb-palette-search">
              <Ico icon="fa-regular fa-magnifying-glass" style={{ color: '#9ca3af', fontSize: 13 }} />
              <input
                placeholder="Buscar campo..."
                value={buscaPaleta}
                onChange={e => setBuscaPaleta(e.target.value)}
              />
            </div>
            <div className="fb-palette-scroll">
              {filteredCategories.map(cat => {
                const catItems = filteredCatalog.filter(f => f.categoria === cat);
                const catIcon = CAT_ICONS[cat] ?? 'fa-regular fa-square';
                return (
                  <div key={cat} className="fb-palette-section">
                    <div className="fb-palette-section-title">
                      <Ico icon={catIcon} style={{ fontSize: 10, color: '#9ca3af' }} />
                      {cat}
                    </div>
                    <div className="fb-palette-items">
                      {catItems.map(f => (
                        <div
                          key={f.type}
                          className="fb-palette-item"
                          draggable
                          onDragStart={e => onPaletteDragStart(e, f.type)}
                          onDragEnd={() => setDragOverIdx(null)}
                          onClick={() => {
                            const nf = createField(f.type);
                            setFields(prev => [...prev, nf]);
                            setSelectedId(nf.id);
                          }}
                          title={`${f.descricao} — clique ou arraste`}
                        >
                          <div className="fb-palette-item-icon" style={{ background: f.bg, color: f.color }}>
                            <Ico icon={f.icon} />
                          </div>
                          <span className="fb-palette-item-label">{f.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Canvas central */}
          <main
            className="fb-editor-canvas"
            onDragOver={onCanvasDragOver}
            onDrop={onZoneDrop}
            onClick={e => { if (e.currentTarget === e.target) setSelectedId(null); }}
          >
            <div className="fb-canvas-inner">
              {/* CORREÇÃO 6: Cabeçalho editável */}
              <FormHeader header={formHeader} onChange={setFormHeader} />

              {fields.length === 0 ? (
                <div className="fb-canvas-empty" onDragOver={onZoneDragOver} onDrop={onZoneDrop}>
                  <div className="fb-canvas-empty-icon">
                    <Ico icon="fa-regular fa-plus" style={{ fontSize: 20, color: '#9ca3af' }} />
                  </div>
                  <p className="fb-canvas-empty-text">Arraste um campo da paleta<br />ou clique nele para começar</p>
                </div>
              ) : (
                <div className="fb-canvas-fields">
                  {fields.map((field, idx) => {
                    const def = fieldDef(field.type);
                    const isSelected = selectedId === field.id;
                    const isDropHere = dragOverIdx === idx;
                    const isContainerType = field.type === 'container';

                    return (
                      <div key={field.id}
                        onDragOver={e => { e.preventDefault(); onCanvasDragOverIdx(e, idx); }}
                        onDrop={e => onCanvasDrop(e, idx)}
                      >
                        {isDropHere && <div className="fb-drop-line" />}
                        <div
                          className={`fb-field-card${isSelected ? ' selected' : ''}${dragReorderIdx === idx ? ' dragging' : ''}`}
                          onClick={() => setSelectedId(isSelected ? null : field.id)}
                        >
                          {/* ── Linha principal: grip | ícone | nome | ações ── */}
                          <div className="fb-field-card-row">
                            <div
                              className="fb-grip"
                              draggable
                              onDragStart={e => { e.stopPropagation(); onFieldDragStart(e, idx); }}
                              onDragEnd={() => { setDragReorderIdx(null); setDragOverIdx(null); }}
                              onClick={e => e.stopPropagation()}
                              title="Arraste para reordenar"
                            >
                              <Ico icon="fa-solid fa-grip-vertical" style={{ fontSize: 12 }} />
                            </div>

                            <div className="fb-field-card-icon" style={{ background: def?.bg, color: def?.color }}>
                              <Ico icon={def?.icon ?? ''} style={{ fontSize: 13 }} />
                            </div>

                            {/* CORREÇÃO 3: removido fb-field-card-meta (tipo do campo) */}
                            <div className="fb-field-card-info">
                              <div className="fb-field-card-name">
                                {field.titulo || def?.label}
                                {field.obrigatorio && <span className="fb-required-dot">*</span>}
                              </div>
                            </div>

                            <div className="fb-field-card-actions" onClick={e => e.stopPropagation()}>
                              <button className="fb-action-btn" title="Duplicar" onClick={() => duplicateField(field.id)}>
                                <Ico icon="fa-regular fa-copy" />
                              </button>
                              <button className="fb-action-btn danger" title="Excluir" onClick={() => deleteField(field.id)}>
                                <Ico icon="fa-regular fa-trash" />
                              </button>
                            </div>
                          </div>

                          {/* CORREÇÃO 5 + MELHORIA 2: preview visual por tipo */}
                          {isContainerType ? (
                            /* MELHORIA 2: Container de colunas */
                            <div className="fb-container" onClick={e => e.stopPropagation()}>
                              <div className="fb-container-ratio">
                                <span className="fb-container-ratio-label">Proporção:</span>
                                <select
                                  className="fb-container-ratio-select"
                                  value={field.proporcao || '1/2+1/2'}
                                  onChange={e => updateField({ ...field, proporcao: e.target.value as '1/2+1/2'|'1/3+2/3'|'1/4+3/4' })}
                                >
                                  <option value="1/2+1/2">1/2 + 1/2</option>
                                  <option value="1/3+2/3">1/3 + 2/3</option>
                                  <option value="1/4+3/4">1/4 + 3/4</option>
                                </select>
                              </div>
                              <div className="fb-container-cols" style={{ gridTemplateColumns: propToGrid(field.proporcao) }}>
                                {([1, 2] as const).map(col => {
                                  const colFields = col === 1 ? (field.filhos || []) : (field.filhos2 || []);
                                  return (
                                    <div
                                      key={col}
                                      className="fb-container-col"
                                      onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                                      onDrop={e => dropIntoContainer(e, field.id, col)}
                                    >
                                      <div className="fb-container-col-label">Coluna {col}</div>
                                      {colFields.length === 0 ? (
                                        <div className="fb-container-col-empty">
                                          <Ico icon="fa-regular fa-plus" style={{ fontSize: 12 }} />
                                          Arraste um campo aqui
                                        </div>
                                      ) : (
                                        colFields.map(cf => {
                                          const cDef = fieldDef(cf.type);
                                          const isChildSelected = selectedId === cf.id;
                                          return (
                                            <div
                                              key={cf.id}
                                              className={`fb-container-nested-field${isChildSelected ? ' selected' : ''}`}
                                              onClick={e => { e.stopPropagation(); setSelectedId(isChildSelected ? null : cf.id); }}
                                            >
                                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                                                <div style={{ width: 22, height: 22, borderRadius: 5, background: cDef?.bg, color: cDef?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>
                                                  <Ico icon={cDef?.icon ?? ''} />
                                                </div>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cf.titulo}</span>
                                              </div>
                                              <button
                                                className="fb-action-btn danger"
                                                style={{ width: 22, height: 22, fontSize: 10, flexShrink: 0 }}
                                                onClick={e => { e.stopPropagation(); deleteFromContainer(field.id, cf.id, col); }}
                                              >
                                                <Ico icon="fa-regular fa-xmark" />
                                              </button>
                                            </div>
                                          );
                                        })
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            /* CORREÇÃO 5: Preview visual específico por tipo */
                            <div className="fb-field-preview-wrap">
                              <CanvasFieldPreview field={field} />
                            </div>
                          )}

                          {field.textoAjuda && (
                            <div className="fb-field-card-help">{field.textoAjuda}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Drop zone final */}
                  <div
                    className={`fb-drop-zone-final${dragOverIdx === -1 ? ' active' : ''}`}
                    onDragOver={onZoneDragOver}
                    onDrop={onZoneDrop}
                  >
                    <Ico icon="fa-regular fa-plus" style={{ fontSize: 14 }} />
                    <span>Arraste um campo aqui</span>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Painel de propriedades direito */}
          <aside className="fb-editor-properties">
            {selectedField ? (
              <FieldProperties
                field={selectedField}
                onChange={updateField}
                onDuplicate={() => duplicateField(selectedField.id)}
                onDelete={() => deleteField(selectedField.id)}
              />
            ) : (
              <div className="fb-properties-empty">
                <div className="fb-properties-empty-icon">
                  <Ico icon="fa-regular fa-hand-pointer" style={{ fontSize: 22, color: '#9ca3af' }} />
                </div>
                <p>Nenhum elemento selecionado</p>
                <span>Clique em um elemento para editar suas propriedades</span>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Template Picker — overlay */}
      {showPicker && mode === 'edit' && <TemplatePicker onSelect={loadTemplate} onBlank={startBlank} />}
    </div>
  );
}
