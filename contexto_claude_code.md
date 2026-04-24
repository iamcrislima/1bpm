# Contexto Estratégico e Técnico: 1Doc BPM Prototype
**LEIA ESTE ARQUIVO COMPLETO ANTES DE QUALQUER COISA.**

---

## 1. Visão de Negócio: O "Porquê" deste Projeto

Este projeto é um movimento estratégico dentro da **Softplan**. O objetivo é **fundir as capacidades da 1Doc com o SolarBPM**, construindo uma solução unificada e superior. A meta de longo prazo é **dissolver o SolarBPM como produto apartado**, trazendo todos os fluxos de processos (BPM) nativamente para dentro da 1Doc.

Para convencer os stakeholders, estamos construindo um "Killer Prototype" — um protótipo de altíssima fidelidade que prova que a 1Doc consegue orquestrar fluxos complexos (enterprise) com UX muito superior.

---

## 2. Benchmark de Inspiração

- **Pipefy**: Referência de organização ágil, formulários modulares e construtor de automações estilo "Sempre que... → Faça isso..."
- **Make.com / Miro**: Referência de fluidez no canvas visual, drag & drop suave, sombras sutis, conexões visuais agradáveis.
- **SolarBPM**: Referência funcional (conceito de Áreas/Pastas para agrupar processos), mas UX reimaginada 10x melhor.

---

## 3. Arquitetura de Navegação (Sidebar)

A sidebar tem uma seção expansível chamada **"Proc. Inteligentes"** (Processos Inteligentes), que é o guarda-chuva de tudo BPM:

```
Sidebar
├── Inbox
├── Atividades
├── Documentos
├── Assinaturas
├── Comunicação
├── 🚀 Proc. Inteligentes  ← expansível (toggle)
│   ├── 🔀 Fluxos          → /processos
│   └── 📝 Formulários     → /formularios
├── Integrações
├── Relatórios
└── Configurações
```

**Arquivos:**
- `src/components/layout/Sidebar.tsx` — componente principal com grupo expansível
- `src/components/layout/Sidebar.css` — estilos com `.nav-group`, `.nav-sub-items`, `.nav-chevron`

---

## 4. Páginas e Rotas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/processos` | `ProcessosPage.tsx` | Dashboard de processos com visão de Áreas/Cards/Lista |
| `/processos/novo?template=X` | `BpmEditor` | Editor visual de fluxo (React Flow) |
| `/processos/:id` | `ProcessoDetailPage.tsx` | Detalhe de um processo em execução |
| `/formularios` | `FormulariosPage.tsx` | **NOVO** — Biblioteca de formulários dinâmicos |

---

## 5. Editor BPM — Estrutura e BUG CONHECIDO

### Layout do Editor
O editor em `/processos/novo` tem 3 painéis em `flex-row`:

```
[BpmSidebar 240px] | [BpmCanvas flex:1] | [BpmProperties 320px]
```

**Arquivo principal:** `src/components/bpm/editor/BpmEditor.tsx`

### ⚠️ BUG CRÍTICO A CORRIGIR PRIMEIRO

O painel `BpmProperties` (direita, 320px) está invadindo o canvas ou desaparecendo, causando o canvas encolher ou sumir. O problema acontece porque:

1. O `BpmCanvas` retorna um `<div className="reactflow-wrapper">` com `flex: 1`. Esse div precisa ter `minWidth: 0` para não transbordar o flex container.
2. O `BpmProperties` deve ter exatamente `flex: 0 0 320px` no CSS (sem inline styles conflitantes).
3. O `.bpm-editor-workspace` precisa de `display: flex; flex-direction: row; overflow: hidden;`

**Arquivos a verificar/corrigir:**
- `src/components/bpm/editor/BpmCanvas.tsx` — div wrapper com `style={{ flex: 1, height: '100%', minWidth: 0, position: 'relative' }}`
- `src/components/bpm/editor/BpmEditor.css` — `.bpm-editor-workspace` e `.bpm-editor-properties`
- `src/components/bpm/editor/BpmProperties.tsx` — NÃO usar inline `style={{ width }}`, deixar o CSS cuidar

---

## 6. Funcionalidades Implementadas (dentro do Editor)

### Construtor de Formulários Drag & Drop
- **Modal:** `src/components/bpm/formBuilder/FormBuilderModal.tsx`
- **Acesso:** Aba "Formulário" no painel de propriedades de uma Tarefa Humana, OU na nova página `/formularios`
- **DnD:** API nativa HTML5 (sem react-dnd, sem dnd-kit)
- **Persistência:** `node.data.formFields: FormField[]`

### Construtor de Automações (estilo Pipefy)
- **Modal:** `src/components/bpm/formBuilder/AutomationBuilderModal.tsx`
- **Acesso:** Aba "Integrações" no painel de propriedades
- **UI:** Painel duplo — "Sempre que... (Trigger)" + "Faça isso... (Action)"
- **Persistência:** `node.data.automations: AutomationRule[]`

### Página de Formulários (`/formularios`)
- **Componente:** `src/pages/FormulariosPage.tsx` + `FormulariosPage.css`
- Lista formulários existentes em grid de cards
- Botão "Novo Formulário" → cria e já abre o `FormBuilderModal`
- Card de rascunho "+" visual

---

## 7. Mock Data dos Templates

Arquivo: `src/data/flowMocks.ts`

Templates disponíveis via `?template=`:
- `compras` → Aprovação de Compras (com gateway de decisão por valor)
- `admissao` → Admissão de Funcionários (com gateway paralelo)
- `atendimento` → Atendimento ao Cidadão
- `contratos` → Gestão de Contratos

---

## 8. Stack e Regras Inegociáveis

- **Framework:** React 19 + Vite + TypeScript
- **Canvas:** `@xyflow/react` (React Flow v12)
- **Estilização:** CSS puro com Custom Properties (`--ds-*` / `--primary-*` etc.) do FPT Design System. **ZERO Tailwind, ZERO MUI, ZERO AntDesign.**
- **Estado:** Dentro dos objetos do React Flow (`node.data`). Não usar Redux, Zustand, etc.
- **DnD:** API nativa HTML5 sempre. Nunca importar react-dnd ou dnd-kit.
- **Visual:** Premium/esports — sombras glow, bordas arredondadas, badges modernas, transições suaves.

---

## 9. Próxima prioridade

1. **Corrigir o layout bug do editor** (descrito na seção 5)
2. Evoluir a página de Formulários com mais tipos de campos
3. Adicionar mais opções de automação (webhooks, condicionais)
