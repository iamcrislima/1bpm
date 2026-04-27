import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './BpmAiAssistant.css'

// ── Icon helper (evita conflito React/FontAwesome SVG) ────────
function Ico({ icon, style }: { icon: string; style?: React.CSSProperties }) {
  return (
    <span
      dangerouslySetInnerHTML={{ __html: `<i class="${icon}"></i>` }}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, flexShrink: 0, ...style }}
    />
  )
}

// ── Tipos ─────────────────────────────────────────────────────
type TemplateKey = 'compras' | 'ambiental' | 'admissao' | 'ouvidoria' | 'alvara'
type Stage = 0 | 1 | 2 | 3 | 4

interface FlowNode {
  id: string
  type: string
  label: string
  responsible: string
  deadline: string
  description: string
  position: { x: number; y: number }
}

interface FlowEdge {
  id: string
  source: string
  target: string
  label: string
}

interface FlowData {
  name: string
  area: string
  description: string
  nodes: FlowNode[]
  edges: FlowEdge[]
  automations: { trigger: string; action: string }[]
}

interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
  flowData?: FlowData
}

// ── Templates de fluxo pré-prontos ────────────────────────────
const FLOW_TEMPLATES: Record<TemplateKey, FlowData> = {
  compras: {
    name: 'Compras e Suprimentos',
    area: 'Administrativo',
    description: 'Fluxo de solicitação, aprovação e aquisição de materiais e serviços',
    nodes: [
      { id: 'c1', type: 'start',             label: 'Início',                     responsible: '',               deadline: '0',  description: '', position: { x: 400, y: 50   } },
      { id: 'c2', type: 'human_task',        label: 'Solicitação de compra',      responsible: 'Solicitante',    deadline: '1',  description: '', position: { x: 400, y: 170  } },
      { id: 'c3', type: 'gateway_exclusive', label: 'Valor acima de R$10mil?',    responsible: '',               deadline: '0',  description: '', position: { x: 400, y: 290  } },
      { id: 'c4', type: 'human_task',        label: 'Aprovação do Secretário',    responsible: 'Secretário',     deadline: '3',  description: '', position: { x: 620, y: 410  } },
      { id: 'c5', type: 'human_task',        label: 'Cotação de fornecedores',    responsible: 'Setor de Compras', deadline: '10', description: '', position: { x: 400, y: 530  } },
      { id: 'c6', type: 'human_task',        label: 'Aprovação da cotação',       responsible: 'Gestor',         deadline: '2',  description: '', position: { x: 400, y: 650  } },
      { id: 'c7', type: 'system_task',       label: 'Emissão de ordem de compra', responsible: 'Sistema',       deadline: '1',  description: '', position: { x: 400, y: 770  } },
      { id: 'c8', type: 'message',           label: 'Notificação ao solicitante', responsible: '',               deadline: '0',  description: '', position: { x: 400, y: 890  } },
      { id: 'c9', type: 'end',               label: 'Fim',                        responsible: '',               deadline: '0',  description: '', position: { x: 400, y: 1010 } },
    ],
    edges: [
      { id: 'ce1', source: 'c1', target: 'c2', label: '' },
      { id: 'ce2', source: 'c2', target: 'c3', label: '' },
      { id: 'ce3', source: 'c3', target: 'c4', label: 'Sim' },
      { id: 'ce4', source: 'c3', target: 'c5', label: 'Não' },
      { id: 'ce5', source: 'c4', target: 'c5', label: '' },
      { id: 'ce6', source: 'c5', target: 'c6', label: '' },
      { id: 'ce7', source: 'c6', target: 'c7', label: '' },
      { id: 'ce8', source: 'c7', target: 'c8', label: '' },
      { id: 'ce9', source: 'c8', target: 'c9', label: '' },
    ],
    automations: [
      { trigger: 'SLA vencendo',        action: 'Notificar o gestor da área' },
      { trigger: 'Aprovação concedida', action: 'Avançar etapa automaticamente' },
    ],
  },

  ambiental: {
    name: 'Licenciamento Ambiental',
    area: 'Meio Ambiente',
    description: 'Análise e emissão de licenças para atividades que utilizem recursos naturais',
    nodes: [
      { id: 'a1', type: 'start',             label: 'Início',                      responsible: '',                    deadline: '0',  description: '', position: { x: 400, y: 50  } },
      { id: 'a2', type: 'system_task',       label: 'Protocolo da solicitação',    responsible: 'Sistema',             deadline: '1',  description: '', position: { x: 400, y: 170 } },
      { id: 'a3', type: 'human_task',        label: 'Análise documental',          responsible: 'Setor de Licenciamento', deadline: '5', description: '', position: { x: 400, y: 290 } },
      { id: 'a4', type: 'human_task',        label: 'Vistoria técnica',            responsible: 'Equipe de Campo',     deadline: '15', description: '', position: { x: 400, y: 410 } },
      { id: 'a5', type: 'gateway_exclusive', label: 'Documentação aprovada?',      responsible: '',                    deadline: '0',  description: '', position: { x: 400, y: 530 } },
      { id: 'a6', type: 'system_task',       label: 'Emissão da licença',          responsible: 'Sistema',             deadline: '2',  description: '', position: { x: 600, y: 650 } },
      { id: 'a7', type: 'message',           label: 'Notificação de aprovação',    responsible: '',                    deadline: '0',  description: '', position: { x: 600, y: 770 } },
      { id: 'a8', type: 'message',           label: 'Notificação de indeferimento',responsible: '',                    deadline: '0',  description: '', position: { x: 200, y: 650 } },
      { id: 'a9', type: 'end',               label: 'Fim',                         responsible: '',                    deadline: '0',  description: '', position: { x: 400, y: 890 } },
    ],
    edges: [
      { id: 'ae1', source: 'a1', target: 'a2', label: '' },
      { id: 'ae2', source: 'a2', target: 'a3', label: '' },
      { id: 'ae3', source: 'a3', target: 'a4', label: '' },
      { id: 'ae4', source: 'a4', target: 'a5', label: '' },
      { id: 'ae5', source: 'a5', target: 'a6', label: 'Sim' },
      { id: 'ae6', source: 'a5', target: 'a8', label: 'Não' },
      { id: 'ae7', source: 'a6', target: 'a7', label: '' },
      { id: 'ae8', source: 'a7', target: 'a9', label: '' },
      { id: 'ae9', source: 'a8', target: 'a9', label: '' },
    ],
    automations: [
      { trigger: 'Vistoria agendada', action: 'Notificar o cidadão por e-mail' },
      { trigger: 'Prazo vencido',     action: 'Escalar para o secretário' },
    ],
  },

  admissao: {
    name: 'Admissão de Servidores',
    area: 'Recursos Humanos',
    description: 'Integração e formalização de novos servidores públicos',
    nodes: [
      { id: 'd1', type: 'start',            label: 'Início',                              responsible: '',      deadline: '0', description: '', position: { x: 400, y: 50  } },
      { id: 'd2', type: 'human_task',       label: 'Convocação e entrega de documentos',  responsible: 'RH',    deadline: '5', description: '', position: { x: 400, y: 170 } },
      { id: 'd3', type: 'human_task',       label: 'Análise documental',                  responsible: 'Jurídico', deadline: '7', description: '', position: { x: 400, y: 290 } },
      { id: 'd4', type: 'gateway_parallel', label: 'Processos em paralelo',               responsible: '',      deadline: '0', description: '', position: { x: 400, y: 410 } },
      { id: 'd5', type: 'human_task',       label: 'Exame médico admissional',            responsible: 'Saúde', deadline: '3', description: '', position: { x: 200, y: 530 } },
      { id: 'd6', type: 'system_task',      label: 'Cadastro em sistemas',                responsible: 'Sistema', deadline: '1', description: '', position: { x: 600, y: 530 } },
      { id: 'd7', type: 'human_task',       label: 'Posse e assinatura',                  responsible: 'Chefia', deadline: '1', description: '', position: { x: 400, y: 650 } },
      { id: 'd8', type: 'system_task',      label: 'Liberação de acessos',                responsible: 'Sistema', deadline: '1', description: '', position: { x: 400, y: 770 } },
      { id: 'd9', type: 'end',              label: 'Fim',                                 responsible: '',      deadline: '0', description: '', position: { x: 400, y: 890 } },
    ],
    edges: [
      { id: 'de1', source: 'd1', target: 'd2', label: '' },
      { id: 'de2', source: 'd2', target: 'd3', label: '' },
      { id: 'de3', source: 'd3', target: 'd4', label: '' },
      { id: 'de4', source: 'd4', target: 'd5', label: '' },
      { id: 'de5', source: 'd4', target: 'd6', label: '' },
      { id: 'de6', source: 'd5', target: 'd7', label: '' },
      { id: 'de7', source: 'd6', target: 'd7', label: '' },
      { id: 'de8', source: 'd7', target: 'd8', label: '' },
      { id: 'de9', source: 'd8', target: 'd9', label: '' },
    ],
    automations: [
      { trigger: 'Documentos recebidos', action: 'Notificar RH por e-mail' },
      { trigger: 'Posse agendada',       action: 'Notificar servidor por e-mail' },
    ],
  },

  ouvidoria: {
    name: 'Ouvidoria',
    area: 'Atendimento ao Cidadão',
    description: 'Registro e tratamento de manifestações dos cidadãos',
    nodes: [
      { id: 'o1', type: 'start',       label: 'Início',                    responsible: '',                  deadline: '0',  description: '', position: { x: 400, y: 50  } },
      { id: 'o2', type: 'system_task', label: 'Registro da manifestação',  responsible: 'Sistema',           deadline: '0',  description: '', position: { x: 400, y: 170 } },
      { id: 'o3', type: 'human_task',  label: 'Triagem e classificação',   responsible: 'Ouvidoria',         deadline: '2',  description: '', position: { x: 400, y: 290 } },
      { id: 'o4', type: 'system_task', label: 'Encaminhamento ao setor',   responsible: 'Sistema',           deadline: '0',  description: '', position: { x: 400, y: 410 } },
      { id: 'o5', type: 'human_task',  label: 'Análise e resposta',        responsible: 'Setor responsável', deadline: '10', description: '', position: { x: 400, y: 530 } },
      { id: 'o6', type: 'human_task',  label: 'Validação da resposta',     responsible: 'Ouvidoria',         deadline: '2',  description: '', position: { x: 400, y: 650 } },
      { id: 'o7', type: 'message',     label: 'Resposta ao cidadão',       responsible: '',                  deadline: '0',  description: '', position: { x: 400, y: 770 } },
      { id: 'o8', type: 'end',         label: 'Fim',                       responsible: '',                  deadline: '0',  description: '', position: { x: 400, y: 890 } },
    ],
    edges: [
      { id: 'oe1', source: 'o1', target: 'o2', label: '' },
      { id: 'oe2', source: 'o2', target: 'o3', label: '' },
      { id: 'oe3', source: 'o3', target: 'o4', label: '' },
      { id: 'oe4', source: 'o4', target: 'o5', label: '' },
      { id: 'oe5', source: 'o5', target: 'o6', label: '' },
      { id: 'oe6', source: 'o6', target: 'o7', label: '' },
      { id: 'oe7', source: 'o7', target: 'o8', label: '' },
    ],
    automations: [
      { trigger: 'Manifestação recebida', action: 'Gerar protocolo e notificar cidadão' },
      { trigger: 'Prazo vencido',         action: 'Escalar para o ouvidor' },
    ],
  },

  alvara: {
    name: 'Alvará de Funcionamento',
    area: 'Atendimento ao Cidadão',
    description: 'Concessão de alvará para abertura de estabelecimentos comerciais',
    nodes: [
      { id: 'v1', type: 'start',             label: 'Início',                              responsible: '',          deadline: '0', description: '', position: { x: 400, y: 50  } },
      { id: 'v2', type: 'system_task',       label: 'Solicitação e protocolo',             responsible: 'Sistema',   deadline: '1', description: '', position: { x: 400, y: 170 } },
      { id: 'v3', type: 'human_task',        label: 'Análise de documentos',               responsible: 'Fiscalização', deadline: '5', description: '', position: { x: 400, y: 290 } },
      { id: 'v4', type: 'human_task',        label: 'Vistoria no local',                   responsible: 'Fiscal',    deadline: '7', description: '', position: { x: 400, y: 410 } },
      { id: 'v5', type: 'gateway_exclusive', label: 'Aprovado?',                           responsible: '',          deadline: '0', description: '', position: { x: 400, y: 530 } },
      { id: 'v6', type: 'system_task',       label: 'Emissão do alvará',                   responsible: 'Sistema',   deadline: '1', description: '', position: { x: 600, y: 650 } },
      { id: 'v7', type: 'message',           label: 'Notificação de aprovação',            responsible: '',          deadline: '0', description: '', position: { x: 600, y: 770 } },
      { id: 'v8', type: 'message',           label: 'Notificação de indeferimento',        responsible: '',          deadline: '0', description: '', position: { x: 200, y: 650 } },
      { id: 'v9', type: 'end',               label: 'Fim',                                 responsible: '',          deadline: '0', description: '', position: { x: 400, y: 890 } },
    ],
    edges: [
      { id: 've1', source: 'v1', target: 'v2', label: '' },
      { id: 've2', source: 'v2', target: 'v3', label: '' },
      { id: 've3', source: 'v3', target: 'v4', label: '' },
      { id: 've4', source: 'v4', target: 'v5', label: '' },
      { id: 've5', source: 'v5', target: 'v6', label: 'Sim' },
      { id: 've6', source: 'v5', target: 'v8', label: 'Não' },
      { id: 've7', source: 'v6', target: 'v7', label: '' },
      { id: 've8', source: 'v7', target: 'v9', label: '' },
      { id: 've9', source: 'v8', target: 'v9', label: '' },
    ],
    automations: [
      { trigger: 'Vistoria agendada', action: 'Notificar requerente por e-mail' },
      { trigger: 'Alvará emitido',    action: 'Notificar requerente por e-mail e SMS' },
    ],
  },
}

// ── Mensagem de boas-vindas ────────────────────────────────────
const WELCOME_MSG =
  "Olá! Sou o assistente de criação de fluxos da 1Doc. Descreva o processo que você quer criar e eu ajudo a estruturá-lo. Por exemplo: 'quero criar um processo de aprovação de compras' ou 'preciso de um fluxo de licenciamento ambiental'."

// ── Detecção de template por palavras-chave ───────────────────
function detectTemplate(text: string): { key: TemplateKey; response: string } {
  const t = text.toLowerCase()
  if (/compra|suprimento|aquisi/i.test(t))
    return { key: 'compras',   response: 'Entendi! Vou criar um fluxo de Compras e Suprimentos. Qual secretaria ou área será responsável pelo processo?' }
  if (/licen|ambiental|meio ambiente/i.test(t))
    return { key: 'ambiental', response: 'Perfeito! Um fluxo de Licenciamento Ambiental. Qual secretaria será responsável pela análise técnica?' }
  if (/admiss|servidor|concurso/i.test(t))
    return { key: 'admissao',  response: 'Ótimo! Vou estruturar o fluxo de Admissão de Servidores. Qual é o órgão ou secretaria responsável pelo RH?' }
  if (/ouvidoria|reclama|manifesta|cidad/i.test(t))
    return { key: 'ouvidoria', response: 'Entendido! Um fluxo de Ouvidoria para atendimento ao cidadão. Qual é o prazo máximo para resposta ao cidadão em dias?' }
  if (/alvar|funcionamento|comercial/i.test(t))
    return { key: 'alvara',    response: 'Perfeito! Vou criar o fluxo de Alvará de Funcionamento. Qual secretaria faz a análise das solicitações?' }
  return {
    key: 'compras',
    response: 'Interessante! Para estruturar melhor o processo, me conta: quais são as principais etapas que ele precisa ter? Por exemplo: solicitação, análise, aprovação, conclusão.',
  }
}

// ── Ícones por tipo de nó ─────────────────────────────────────
const NODE_META: Record<string, { icon: string; color: string; label: string }> = {
  start:             { icon: 'fa-regular fa-circle-play',             color: '#22c55e', label: 'Início' },
  end:               { icon: 'fa-regular fa-circle-stop',             color: '#ef4444', label: 'Fim' },
  human_task:        { icon: 'fa-regular fa-user',                    color: '#0058db', label: 'Humana' },
  system_task:       { icon: 'fa-regular fa-gear',                    color: '#6366f1', label: 'Sistema' },
  gateway_exclusive: { icon: 'fa-regular fa-code-branch',             color: '#9333ea', label: 'Decisão' },
  gateway_parallel:  { icon: 'fa-regular fa-arrows-split-up-and-left',color: '#0ea5e9', label: 'Paralelo' },
  message:           { icon: 'fa-regular fa-message',                 color: '#2563eb', label: 'Mensagem' },
  notification:      { icon: 'fa-regular fa-bell',                    color: '#d97706', label: 'Notificação' },
}

// ── Card de preview do fluxo gerado ──────────────────────────
function FlowPreviewCard({
  flow,
  onOpenEditor,
  onCreateAnother,
}: {
  flow: FlowData
  onOpenEditor: () => void
  onCreateAnother: () => void
}) {
  const taskNodes = flow.nodes.filter(n => !['start', 'end'].includes(n.type))
  const totalEtapas = flow.nodes.length

  return (
    <div className="bpm-ai-flow-card bpm-ai-flow-card--success">
      {/* Cabeçalho de sucesso */}
      <div className="bpm-ai-flow-success-header">
        <div className="bpm-ai-flow-success-icon">
          <Ico icon="fa-solid fa-circle-check" style={{ fontSize: 22, color: '#16a34a' }} />
        </div>
        <div>
          <div className="bpm-ai-flow-success-title">Fluxo criado com sucesso!</div>
          <div className="bpm-ai-flow-success-sub">Pronto para abrir no editor</div>
        </div>
      </div>

      {/* Meta do processo */}
      <div className="bpm-ai-flow-card-header">
        <Ico icon="fa-regular fa-diagram-project" style={{ fontSize: 18, color: 'var(--primary-pure)', marginTop: 2 }} />
        <div className="bpm-ai-flow-card-meta">
          <div className="bpm-ai-flow-name">{flow.name}</div>
          <div className="bpm-ai-flow-area">{flow.area} · {flow.description}</div>
        </div>
        <span className="badge badge-primary">{totalEtapas} etapas</span>
      </div>

      {/* Lista de etapas */}
      <div className="bpm-ai-flow-nodes">
        {taskNodes.map(node => {
          const meta = NODE_META[node.type] ?? NODE_META['human_task']
          return (
            <div key={node.id} className="bpm-ai-flow-node">
              <span
                className="bpm-ai-flow-node-icon"
                style={{ background: meta.color + '18', color: meta.color }}
              >
                <Ico icon={meta.icon} style={{ fontSize: 11 }} />
              </span>
              <div className="bpm-ai-flow-node-info">
                <div className="bpm-ai-flow-node-label">{node.label}</div>
                {node.responsible && (
                  <div className="bpm-ai-flow-node-resp">{node.responsible}</div>
                )}
              </div>
              {node.deadline && node.deadline !== '0' && (
                <span className="bpm-ai-flow-node-prazo">{node.deadline}d</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Automações */}
      {flow.automations.length > 0 && (
        <div className="bpm-ai-flow-automations">
          <Ico icon="fa-regular fa-bolt" style={{ fontSize: 11 }} />
          <div className="bpm-ai-flow-auto-list">
            {flow.automations.map((a, i) => (
              <span key={i} className="bpm-ai-flow-auto-item">
                <strong>{a.trigger}</strong> → {a.action}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="bpm-ai-flow-actions">
        <button className="btn btn-primary btn-sm" onClick={onOpenEditor}>
          <Ico icon="fa-regular fa-diagram-project" style={{ fontSize: 13 }} />
          Abrir no editor
        </button>
        <button className="btn btn-secondary btn-sm" onClick={onCreateAnother}>
          <Ico icon="fa-regular fa-arrow-rotate-left" style={{ fontSize: 13 }} />
          Criar outro
        </button>
      </div>
    </div>
  )
}

// ── Indicador de digitação ────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="bpm-ai-message bpm-ai-message--assistant">
      <div className="bpm-ai-message-bubble bpm-ai-typing">
        <span /><span /><span />
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────
export default function BpmAiAssistant() {
  const navigate = useNavigate()

  const [isOpen,    setIsOpen]    = useState(false)
  const [messages,  setMessages]  = useState<ChatMessage[]>([
    { id: 'init', role: 'assistant', content: WELCOME_MSG },
  ])
  const [input,     setInput]     = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [stage,     setStage]     = useState<Stage>(0)
  const [template,  setTemplate]  = useState<TemplateKey>('compras')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLInputElement>(null)

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Foco no input ao abrir
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 320)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // ── Adiciona mensagem do assistente ──
  const addAssistantMsg = (content: string, flowData?: FlowData) => {
    setMessages(prev => [...prev, {
      id: `a_${Date.now()}`,
      role: 'assistant',
      content,
      flowData,
    }])
  }

  // ── Máquina de estados ────────────────────────────────────────
  const handleSend = () => {
    const text = input.trim()
    if (!text || isLoading) return

    // Adiciona mensagem do usuário
    setMessages(prev => [...prev, { id: `u_${Date.now()}`, role: 'user', content: text }])
    setInput('')

    if (stage === 0) {
      // Estágio 0 → detectar template e responder imediatamente
      const detected = detectTemplate(text)
      setTemplate(detected.key)
      addAssistantMsg(detected.response)
      setStage(1)

    } else if (stage === 1) {
      // Estágio 1 → aguardar 1200ms, perguntar sobre aprovação
      setIsLoading(true)
      setTimeout(() => {
        addAssistantMsg('Anotado! Esse processo vai precisar de aprovação de algum gestor ou secretário antes de seguir em frente, ou ele pode avançar automaticamente entre as etapas?')
        setIsLoading(false)
        setStage(2)
      }, 1200)

    } else if (stage === 2) {
      // Estágio 2 → aguardar 1000ms, perguntar sobre notificações
      setIsLoading(true)
      setTimeout(() => {
        addAssistantMsg('Entendido! Mais uma coisa: o cidadão ou solicitante precisa ser notificado automaticamente quando o processo for concluído ou quando mudar de etapa?')
        setIsLoading(false)
        setStage(3)
      }, 1000)

    } else if (stage === 3) {
      // Estágio 3 → gerar fluxo em dois momentos
      setIsLoading(true)
      setTimeout(() => {
        addAssistantMsg('Perfeito, já tenho tudo que preciso! Deixa eu montar o fluxo para você...')
        setTimeout(() => {
          const flow = FLOW_TEMPLATES[template]
          addAssistantMsg(
            `Criei o fluxo **${flow.name}** com ${flow.nodes.length} etapas e ${flow.automations.length} automações configuradas. Clique em "Abrir no editor" para revisar e salvar.`,
            flow,
          )
          setIsLoading(false)
          setStage(4)
        }, 2000)
      }, 1500)
    }
    // stage 4 = conversa encerrada, input desabilitado implicitamente pelo stage check
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  const handleOpenInEditor = (flow: FlowData) => {
    setIsOpen(false)
    navigate('/processos/novo', { state: { aiGeneratedFlow: flow } })
  }

  const handleCreateAnother = () => {
    setMessages([{ id: 'init', role: 'assistant', content: WELCOME_MSG }])
    setInput('')
    setStage(0)
    setTemplate('compras')
    setIsLoading(false)
  }

  const isDone = stage === 4

  // ── Render ──────────────────────────────────────────────────
  return (
    <>
      {/* Botão flutuante */}
      <button
        className={`bpm-ai-fab${isOpen ? ' bpm-ai-fab--hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        title="Criar fluxo com IA"
        aria-label="Abrir assistente de IA"
      >
        <Ico icon="fa-regular fa-sparkles" style={{ fontSize: 16 }} />
        Criar com IA
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="bpm-ai-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Painel lateral */}
      <div
        className={`bpm-ai-panel${isOpen ? ' bpm-ai-panel--open' : ''}`}
        role="complementary"
        aria-label="Assistente de criação de fluxos"
      >
        {/* Cabeçalho */}
        <div className="bpm-ai-panel-header">
          <div className="bpm-ai-panel-header-icon">
            <Ico icon="fa-regular fa-sparkles" style={{ fontSize: 19, color: '#fff' }} />
          </div>
          <div className="bpm-ai-panel-header-text">
            <h3 className="bpm-ai-panel-title">Assistente de Fluxos</h3>
            <p className="bpm-ai-panel-subtitle">Descreva o processo e eu crio para você</p>
          </div>
          <button
            className="bpm-ai-panel-close"
            onClick={() => setIsOpen(false)}
            aria-label="Fechar assistente"
          >
            <Ico icon="fa-regular fa-xmark" style={{ fontSize: 15, color: '#fff' }} />
          </button>
        </div>

        {/* Mensagens */}
        <div className="bpm-ai-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`bpm-ai-message bpm-ai-message--${msg.role}`}>
              <div className="bpm-ai-message-bubble">
                {msg.content}
              </div>
              {msg.flowData && (
                <FlowPreviewCard
                  flow={msg.flowData}
                  onOpenEditor={() => handleOpenInEditor(msg.flowData!)}
                  onCreateAnother={handleCreateAnother}
                />
              )}
            </div>
          ))}

          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="bpm-ai-footer">
          {isDone ? (
            <button className="bpm-ai-restart-btn" onClick={handleCreateAnother}>
              <Ico icon="fa-regular fa-arrow-rotate-left" style={{ fontSize: 13, marginRight: 6 }} />
              Criar outro fluxo
            </button>
          ) : (
            <>
              <input
                ref={inputRef}
                className="bpm-ai-input"
                placeholder="Digite sua resposta..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                aria-label="Mensagem para o assistente"
              />
              <button
                className="bpm-ai-send"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                title="Enviar mensagem"
                aria-label="Enviar"
              >
                <Ico icon="fa-regular fa-paper-plane" style={{ fontSize: 14, color: '#fff' }} />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
