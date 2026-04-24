import React, { useState } from 'react';
import './FormBuilderModal.css';

export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  helpText?: string;
  options?: string[];
}

const FIELD_TYPES = [
  { type: 'texto-curto', label: 'Texto curto', icon: '📝' },
  { type: 'texto-longo', label: 'Texto longo', icon: '📄' },
  { type: 'numero', label: 'Número', icon: '🔢' },
  { type: 'data', label: 'Data', icon: '📅' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { type: 'select', label: 'Seleção Múltipla', icon: '🔽' },
  { type: 'anexo', label: 'Anexo / Arquivo', icon: '📎' },
  { type: 'responsavel', label: 'Responsável', icon: '👤' },
];

export default function FormBuilderModal({ 
  isOpen, 
  onClose, 
  initialFields, 
  onSave, 
  taskName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  initialFields: FormField[];
  onSave: (fields: FormField[]) => void;
  taskName: string;
}) {
  const [fields, setFields] = useState<FormField[]>(initialFields || []);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDragStart = (e: React.DragEvent, fieldType: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(fieldType));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      try {
        const fieldType = JSON.parse(data);
        const newField: FormField = {
          id: `field_${Date.now()}`,
          type: fieldType.type,
          label: fieldType.label,
          required: false
        };
        setFields(prev => [...prev, newField]);
        setSelectedFieldId(newField.id); // Auto select added field
      } catch (err) {
        console.error('Invalid drop payload', err);
      }
    }
  };

  const handleRemoveField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const updateSelectedField = (updates: Partial<FormField>) => {
    setFields(prev => prev.map(f => f.id === selectedFieldId ? { ...f, ...updates } : f));
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  return (
    <div className="form-builder-overlay animate-fade-in">
      <div className="form-builder-modal animate-slide-in">
        {/* Header */}
        <header className="form-builder-header">
          <div>
            <h2>Construtor de Formulário</h2>
            <p>Etapa: <strong>{taskName}</strong></p>
          </div>
          <div className="header-actions">
            <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={() => onSave(fields)}>💾 Salvar Formulário</button>
          </div>
        </header>

        <div className="form-builder-body">
          {/* Left Sidebar - Component Palette */}
          <aside className="form-builder-palette">
            <div className="palette-title">Tipos de Campo</div>
            <p className="palette-desc">Clique ou arraste os campos para construir o seu formulário</p>
            
            <div className="palette-list">
              {FIELD_TYPES.map(ft => (
                <div 
                  key={ft.type} 
                  className="palette-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, ft)}
                  onClick={() => {
                    // Also support click to add
                    const newField = { id: `field_${Date.now()}`, type: ft.type, label: ft.label, required: false };
                    setFields(prev => [...prev, newField]);
                    setSelectedFieldId(newField.id);
                  }}
                >
                  <span className="palette-icon">{ft.icon}</span>
                  <span className="palette-label">{ft.label}</span>
                  <span className="palette-drag-handle">✨</span>
                </div>
              ))}
            </div>
          </aside>

          {/* Center Canvas */}
          <main className="form-builder-canvas">
            <div 
              className={`canvas-paper ${fields.length === 0 ? 'empty' : ''}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <h3 className="canvas-title">{taskName}</h3>
              
              {fields.length === 0 ? (
                <div className="canvas-empty-state">
                  <div className="empty-icon">🖱️</div>
                  <h4>Formulário vazio</h4>
                  <p>Arraste campos da barra lateral e solte-os aqui.</p>
                </div>
              ) : (
                <div className="canvas-fields">
                  {fields.map((f) => (
                    <div 
                      key={f.id} 
                      className={`canvas-field-item ${selectedFieldId === f.id ? 'selected' : ''}`}
                      onClick={() => setSelectedFieldId(f.id)}
                    >
                      <div className="field-item-header">
                        <label>
                          {f.required && <span style={{color: 'var(--danger)', marginRight: 4}}>*</span>}
                          {f.label}
                        </label>
                        <div className="field-item-actions">
                           <button className="btn-icon" onClick={(e) => { e.stopPropagation(); setSelectedFieldId(f.id); }}>✏️</button>
                           <button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleRemoveField(f.id); }}>🗑️</button>
                        </div>
                      </div>
                      
                      {f.helpText && <div className="field-help-text">{f.helpText}</div>}

                      {/* Mock Render based on type */}
                      <div className="field-mock-input">
                        {f.type === 'texto-longo' ? <textarea disabled placeholder="Texto longo..." /> :
                         f.type === 'checkbox' ? <div style={{display:'flex', gap: 8}}><input type="checkbox" disabled /> <span>Opção</span></div> :
                         f.type === 'select' ? <select disabled><option>Selecione uma opção</option></select> :
                         f.type === 'anexo' ? <div className="mock-file-drop">Arraste arquivos ou clique aqui</div> :
                         <input type="text" disabled placeholder="Digite aqui..." />
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar - Properties */}
          <aside className="form-builder-properties">
             {selectedField ? (
               <div className="prop-panel">
                  <h3>Propriedades do Campo</h3>
                  
                  <div className="prop-group">
                    <label>Título / Pergunta</label>
                    <input 
                      type="text" 
                      className="input" 
                      value={selectedField.label}
                      onChange={e => updateSelectedField({ label: e.target.value })}
                    />
                  </div>

                  <div className="prop-group">
                    <label>Texto de Ajuda / Subtítulo</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Ex: Insira o nome completo"
                      value={selectedField.helpText || ''}
                      onChange={e => updateSelectedField({ helpText: e.target.value })}
                    />
                  </div>

                  <div className="prop-group-inline">
                    <label>Tornar Obrigatório</label>
                    <label className="toggle-switch-container">
                       <input 
                         type="checkbox" 
                         checked={selectedField.required}
                         onChange={e => updateSelectedField({ required: e.target.checked })}
                         style={{display:'none'}}
                       />
                       <div className={`toggle-switch ${selectedField.required ? 'active' : ''}`} />
                    </label>
                  </div>

                  {(selectedField.type === 'select' || selectedField.type === 'checkbox') && (
                    <div className="prop-group" style={{marginTop: 16}}>
                       <label>Opções (uma por linha)</label>
                       <textarea className="input" rows={4} defaultValue="Opção 1\nOpção 2"></textarea>
                    </div>
                  )}

                  <div className="prop-type-badge">
                     Tipo: <strong>{FIELD_TYPES.find(t => t.type === selectedField.type)?.label}</strong>
                  </div>
               </div>
             ) : (
               <div className="prop-panel-empty">
                 <div style={{fontSize: 32, marginBottom: 12}}>⚙️</div>
                 <h4>Nenhum campo selecionado</h4>
                 <p>Clique em um campo no formulário para editar suas propriedades.</p>
               </div>
             )}
          </aside>
        </div>
      </div>
    </div>
  );
}
