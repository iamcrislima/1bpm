# 1Doc BPM — Documento de Contexto do Projeto

> Atualizado em: 2026-04-26  
> Propósito: resumo técnico acumulado para continuidade entre sessões (uso pelo Arthas)

---

## 1. Visão Geral

**1Doc BPM** é um editor visual de fluxos de processo (estilo Camunda/Pipefy) com:
- Editor de fluxo BPM baseado em ReactFlow
- Editor de formulários dinâmicos (Form Builder) estilo Pipefy
- Assistente de IA integrado (Claude) para geração de fluxos
- Página de formulários com 10 modelos pré-definidos

Stack: React 19 + TypeScript + Vite + React Router DOM + ReactFlow + FontAwesome Pro

---

## 2. Estrutura de Layout

```
App.tsx
  ├── <Softbar>          (56px fixo à esquerda — NUNCA some, em NENHUMA tela)
  └── .app-main          (margin-left: 56px, display flex, flex-direction column)
        ├── <Header>     (56px)
        ├── <Subheader>  (breadcrumb)
        ├── <BpmTabBar>  (abas)
        └── .bpm-main-content   (flex:1, overflow:hidden — aqui ficam as rotas)
              ├── BpmEditor     (height:100%, fills parent)
              ├── FormBuilderPage (height:100%, fills parent — early return do FormulariosPage)
              └── FormulariosPage (lista de formulários)
```

**Regra crítica**: nenhum componente de página pode usar `position: fixed; inset: 0` — isso cobre a Softbar. Usar sempre `height: 100%; display: flex; flex-direction: column; overflow: hidden` igual ao BpmEditor.

---

## 3. Arquivos Principais

| Arquivo | Propósito |
|---------|-----------|
| `src/App.tsx` | Layout raiz, roteamento via react-router |
| `src/components/Softbar.tsx` | Sidebar esquerda fixa, 56px colapsada |
| `src/components/bpm/editor/BpmEditor.tsx` | Editor visual de fluxos (ReactFlow) |
| `src/components/bpm/formBuilder/FormBuilderPage.tsx` | Editor de formulários full-page |
| `src/components/bpm/formBuilder/formBuilderPage.css` | CSS do editor de formulários |
| `src/components/bpm/formBuilder/fieldTypes.ts` | Catálogo de campos + 10 templates |
| `src/pages/FormulariosPage.tsx` | Grid de formulários com cards coloridos |
| `src/pages/FormulariosPage.css` | CSS da página de formulários |

---

## 4. FontAwesome — Padrão Obrigatório

React 19 conflita com FA SVG injection via `<i>`. Usar SEMPRE o helper `Ico`:

```tsx
function Ico({ icon, style }: { icon: string; style?: React.CSSProperties }) {
  return (
    <span
      dangerouslySetInnerHTML={{ __html: `<i class="${icon}"></i>` }}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, flexShrink: 0, ...style }}
    />
  );
}
```

**Nunca usar `<i className="...">` diretamente** em componentes que podem ser re-renderizados condicionalmente.

---

## 5. FormBuilderPage — Estado e Lógica

```tsx
// Estados
const [fields, setFields]               // FormFieldData[] — lista de campos do formulário
const [selectedId, setSelectedId]       // string | null — campo selecionado no painel
const [showPicker, setShowPicker]       // boolean — exibe o TemplatePicker overlay
const [isTemplate, setIsTemplate]       // boolean — toggle "salvar como modelo"
const [buscaPaleta, setBuscaPaleta]     // string — filtro da paleta
const [dragOverIdx, setDragOverIdx]     // number | null — índice de hover do drop (paleta → canvas)
const [dragReorderIdx, setDragReorderIdx] // number | null — índice sendo reordenado

// Constantes DND
const DND_KEY     = 'fbp/field-type'   // arrasto da paleta para o canvas
const REORDER_KEY = 'fbp/reorder'      // arrasto de reordenação dentro do canvas
```

### Fluxo de Drag & Drop

**Da paleta → canvas:**
1. `onPaletteDragStart` seta `DND_KEY` no dataTransfer
2. `onCanvasDrop(e, insertAt)` ou `onZoneDrop(e)` detecta `DND_KEY` e cria novo campo

**Reordenação no canvas:**
1. `.fb-grip` (handle real no DOM) tem `draggable` e `onDragStart` que seta `REORDER_KEY + índice`
2. `onCanvasDrop(e, insertAt)` detecta `REORDER_KEY` e reordena
3. `e.stopPropagation()` em `onCanvasDrop` **evita o bug do item duplicado** (event bubbling para o canvas pai)

### Bug corrigido: item duplicado
- **Causa**: `onDrop` em `.fb-field-card` subia (bubble) para `.fb-editor-canvas` que também tinha `onDrop={onZoneDrop}`, adicionando o campo duas vezes.
- **Fix**: `e.stopPropagation()` no início de `onCanvasDrop`.

---

## 6. FormBuilderPage — Visual dos Cards (Pipefy Style)

Cada campo no canvas tem layout compacto em linha:

```
[⠿ grip] [🔵 ícone-tipo] [Nome do campo / tipo]     [📋][🗑]
                          [__ barra de input cinza __]
```

Classes CSS:
- `.fb-field-card` — container, hover=`#fafbfd`, selected=`box-shadow inset azul`
- `.fb-field-card-row` — flex row com gap:10px
- `.fb-grip` — handle draggable, aparece no hover, `cursor: grab`
- `.fb-field-card-icon` — 32x32, rounded, bg/color por tipo
- `.fb-field-card-info` — flex:1, nome (700 13px) + tipo (gray 11px)
- `.fb-field-card-actions` — botões copy+trash, opacidade 0 → 1 no hover
- `.fb-field-input-bar` — barra cinza com placeholder italic, `margin-left: 62px`
- `.fb-field-text-preview` — para heading/paragraph
- `.fb-field-divider-preview` — linha horizontal cinza
- `.fb-field-button-preview` — mini-botão azul preview

---

## 7. fieldTypes.ts — 10 Templates Disponíveis

| # | Nome | Cor | Categoria | Campos |
|---|------|-----|-----------|--------|
| 1 | Solicitação de Compras | `#0058db` | Compras | 16 |
| 2 | Chamado de TI | `#6366f1` | Tecnologia | 11 |
| 3 | Admissão de Funcionário | `#0f6b3e` | RH | 20 |
| 4 | Relatório de Despesas | `#d97706` | Financeiro | 14 |
| 5 | Solicitação de Férias | `#0891b2` | RH | 13 |
| 6 | Avaliação de Fornecedor | `#9333ea` | Compras | 14 |
| 7 | Ouvidoria / Manifestação | `#c0182d` | Atendimento | 10 |
| 8 | Abertura de Processo | `#0058db` | Jurídico | 17 |
| 9 | Licença de Funcionamento | `#0f6b3e` | Licenciamento | 22 |
| 10 | Parecer Técnico | `#7c3aed` | Técnico | 16 |

Interface `FormTemplate` tem: `id, nome, descricao, categoria, icon, color, bg, fields`.

---

## 8. FormulariosPage

- Grid de cards coloridos com `form-card-top` (band colorida por categoria)
- Filtro por categoria (pills) + busca por nome/descrição
- Chips de preview dos primeiros 4 campos (excluindo layout types)
- Stats bar: total formulários | em uso | campos configurados | categorias
- **Early return** quando `editando !== null` → monta `<FormBuilderPage>` no lugar da grid (ocupa `.bpm-main-content` inteiro)
- Card "Criar novo" com borda dashed + hover azul

---

## 9. BpmEditor — Pontos Importantes

- Baseado em ReactFlow
- Simulação de tokens: `iniciarSimulacao`, `pararSimulacao`, `simAbortRef = useRef(false)`
- Import correto: `import { useState, useCallback, useRef, Component } from 'react'` (sem `React.` na frente)
- Assistente IA: painel FAB flutuante, chama API Anthropic com modelo `claude-sonnet-4-20250514`
- Elemento "Aguardar resposta" no canvas: type `wait-response` → mapeado para `MsgNode`
- Recebe fluxo gerado pela IA via `location.state.flow` (react-router)

---

## 10. Configurações Importantes

### tsconfig.app.json
```json
{
  "compilerOptions": {
    "noUnusedLocals": false,
    "noUnusedParameters": false
  }
}
```
**Sempre desativar** — com `true` qualquer variável não usada quebra o build no Vercel.

### .npmrc (commitado no repo)
```
@fortawesome:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=B298DC1B-8319-4D67-B499-0396EAD12862
```

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

---

## 11. Pendências e Próximos Passos

- [ ] Persistência real dos formulários (localStorage ou API)
- [ ] Copiar formulário direto para uma tarefa do BPM Editor
- [ ] Preview full do formulário (modo visualização, não edição)
- [ ] Validação de campos no Form Builder antes de salvar
- [ ] Integração da IA no Form Builder (gerar campos por prompt)

---

## 12. Padrões Visuais do Projeto

- **Azul primário**: `#0058db`
- **Fundo cinza**: `#f4f6f9`
- **Borda padrão**: `#e8edf3`
- **Texto primário**: `#1a1a1a`
- **Texto secundário**: `#565656`
- **Texto terciário**: `#9ca3af`
- **Fonte**: Open Sans, sans-serif
- **Border-radius padrão**: 8–14px nos cards
- **Hover card**: `box-shadow: 0 8px 28px rgba(24,39,75,0.12)` + `translateY(-3px)`
