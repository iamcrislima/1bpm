import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './BpmAiAssistant.css'

// ── System Prompt ─────────────────────────────────────────────
const SYSTEM_PROMPT = `Você é um assistente especialista em modelagem de processos BPM dentro da plataforma 1Doc da Softplan. Seu objetivo é ajudar o usuário a criar fluxos de processo completos através de uma conversa em português. Faça perguntas para entender: nome do processo, área responsável, etapas necessárias, quem é responsável por cada etapa, prazos, condições de decisão (gateways), formulários necessários e automações desejadas. Quando tiver informações suficientes para criar um fluxo completo, responda APENAS com um JSON válido no seguinte formato sem nenhum texto adicional antes ou depois: { "action": "generate_flow", "flow": { "name": "string", "area": "string", "description": "string", "nodes": [{ "id": "string", "type": "start ou end ou human_task ou system_task ou gateway_exclusive ou gateway_parallel ou message ou notification", "label": "string", "responsible": "string", "deadline": "string", "description": "string", "position": { "x": number, "y": number } }], "edges": [{ "id": "string", "source": "string", "target": "string", "label": "string" }], "automations": [{ "trigger": "string", "action": "string" }] } }. Enquanto estiver coletando informações, responda normalmente em português fazendo as perguntas necessárias. Seja objetivo e amigável.`

const INITIAL_MESSAGE = `Olá! Descreva o processo que você quer criar. Por exemplo: quero um processo de aprovação de compras onde o solicitante preenche um formulário, o gestor aprova ou rejeita, e se aprovado vai para o financeiro emitir a ordem de pagamento.`

// ── Tipos ─────────────────────────────────────────────────────

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

// ── Emoji por tipo de nó ──────────────────────────────────────
const NODE_EMOJI: Record<string, string> = {
  start:             '🟢',
  end:               '🔴',
  human_task:        '👤',
  system_task:       '⚙️',
  gateway_exclusive: '◇',
  gateway_parallel:  '✦',
  message:           '💬',
  notification:      '🔔',
  chatbot:           '🤖',
}

// ── Card de preview do fluxo ──────────────────────────────────
function FlowPreviewCard({
  flow,
  onOpenEditor,
  onRestart,
}: {
  flow: FlowData
  onOpenEditor: () => void
  onRestart: () => void
}) {
  const taskNodes = flow.nodes.filter(n => !['start', 'end'].includes(n.type))
  const previewNodes = taskNodes.slice(0, 5)
  const remaining = taskNodes.length - previewNodes.length

  return (
    <div className="bpm-ai-flow-card">
      {/* Header */}
      <div className="bpm-ai-flow-card-header">
        <i className="fa-regular fa-diagram-project" />
        <div className="bpm-ai-flow-card-meta">
          <div className="bpm-ai-flow-name">{flow.name}</div>
          <div className="bpm-ai-flow-area">{flow.area}</div>
        </div>
        <span className="badge badge-primary">{flow.nodes.length} etapas</span>
      </div>

      {/* Lista de etapas */}
      <div className="bpm-ai-flow-nodes">
        {previewNodes.map(node => (
          <div key={node.id} className="bpm-ai-flow-node">
            <span className="bpm-ai-flow-node-emoji">
              {NODE_EMOJI[node.type] ?? '📋'}
            </span>
            <div className="bpm-ai-flow-node-info">
              <div className="bpm-ai-flow-node-label">{node.label}</div>
              {node.responsible && (
                <div className="bpm-ai-flow-node-resp">👤 {node.responsible}</div>
              )}
            </div>
          </div>
        ))}
        {remaining > 0 && (
          <div className="bpm-ai-flow-node-more">
            +{remaining} etapa{remaining > 1 ? 's' : ''} adicional{remaining > 1 ? 'is' : ''}
          </div>
        )}
      </div>

      {/* Automações */}
      {flow.automations.length > 0 && (
        <div className="bpm-ai-flow-automations">
          <i className="fa-regular fa-bolt" />
          {flow.automations.length} automação{flow.automations.length > 1 ? 'ões' : ''} configurada{flow.automations.length > 1 ? 's' : ''}
        </div>
      )}

      {/* Ações */}
      <div className="bpm-ai-flow-actions">
        <button className="btn btn-primary" onClick={onOpenEditor}>
          <i className="fa-regular fa-diagram-project" />
          Abrir no editor
        </button>
        <button className="btn btn-secondary" onClick={onRestart}>
          <i className="fa-regular fa-arrow-rotate-left" />
          Recomeçar
        </button>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────
export default function BpmAiAssistant() {
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'assistant', content: INITIAL_MESSAGE },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll automático ao chegar nova mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Foco no input ao abrir o painel
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 320)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // ── Envio da mensagem ──
  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      // Histórico limpo para a API (sem flowData, apenas texto)
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.flowData ? `[Fluxo gerado: ${m.flowData.name}]` : m.content,
      }))

      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY ?? ''
      if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY não definida no .env')

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      })

      if (!res.ok) {
        const errBody = await res.text()
        throw new Error(`Erro ${res.status}: ${errBody}`)
      }

      const data = await res.json()
      const rawContent: string = data.content?.[0]?.text ?? ''

      // Tenta parsear JSON de geração de fluxo
      let flowData: FlowData | undefined
      let displayContent = rawContent

      try {
        const parsed = JSON.parse(rawContent.trim())
        if (parsed.action === 'generate_flow' && parsed.flow) {
          flowData = parsed.flow as FlowData
          displayContent = `Criei o fluxo **${flowData.name}** com ${flowData.nodes.length} etapas! Confira o preview abaixo e clique em "Abrir no editor" para ajustar os detalhes.`
        }
      } catch {
        // Não era JSON — resposta normal de conversa
      }

      setMessages(prev => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: 'assistant',
          content: displayContent,
          flowData,
        },
      ])
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `e_${Date.now()}`,
          role: 'assistant',
          content: `Ocorreu um erro ao conectar com o assistente.\n\n${err?.message ?? 'Verifique sua chave de API no arquivo .env (VITE_ANTHROPIC_API_KEY).'}`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleOpenInEditor = (flow: FlowData) => {
    setIsOpen(false)
    navigate('/processos/novo', { state: { flow } })
  }

  const handleRestart = () => {
    setMessages([{ id: 'init', role: 'assistant', content: INITIAL_MESSAGE }])
    setInput('')
  }

  // ── Render ──
  return (
    <>
      {/* Botão flutuante */}
      <button
        className={`bpm-ai-fab${isOpen ? ' bpm-ai-fab--hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        title="Criar fluxo com IA"
        aria-label="Abrir assistente de IA"
      >
        <i className="fa-regular fa-sparkles" />
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
            <i className="fa-regular fa-sparkles" />
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
            <i className="fa-regular fa-xmark" />
          </button>
        </div>

        {/* Mensagens */}
        <div className="bpm-ai-messages">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`bpm-ai-message bpm-ai-message--${msg.role}`}
            >
              <div className="bpm-ai-message-bubble">
                {msg.content}
              </div>

              {/* Preview do fluxo gerado */}
              {msg.flowData && (
                <FlowPreviewCard
                  flow={msg.flowData}
                  onOpenEditor={() => handleOpenInEditor(msg.flowData!)}
                  onRestart={handleRestart}
                />
              )}
            </div>
          ))}

          {/* Indicador de digitação */}
          {isLoading && (
            <div className="bpm-ai-message bpm-ai-message--assistant">
              <div className="bpm-ai-message-bubble bpm-ai-typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer com input */}
        <div className="bpm-ai-footer">
          <textarea
            ref={inputRef}
            className="bpm-ai-input"
            placeholder="Descreva seu processo... (Enter para enviar)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
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
            <i className="fa-regular fa-paper-plane" />
          </button>
        </div>
      </div>
    </>
  )
}
