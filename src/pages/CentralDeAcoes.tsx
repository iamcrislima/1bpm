import "./CentralDeAcoes.css";

const COUNTERS = [
  { id: "nao-lidos", title: "Não lidos", counter: 44, iconClass: "fa-solid fa-eye-slash", iconColor: "blue" },
  { id: "assinaturas-solicitadas", title: "Assinaturas solicitadas", counter: 24, iconClass: "fa-solid fa-file-signature", iconColor: "green" },
  { id: "fila-assinaturas", title: "Fila de assinaturas", counter: 12, iconClass: "fa-solid fa-file-lines", iconColor: "orange" },
  { id: "prazos", title: "Prazos a vencer", counter: 40, iconClass: "fa-solid fa-calendar", iconColor: "red" },
];

const LISTS = [
  {
    id: "nao-lidos", subtitle: "Documentos não lidos", footerLabel: "Inbox", footerIcon: "fa-regular fa-inbox",
    items: [
      { title: "Memorando 114/2025", desc: "Novo contrato - Governo", date: "23 de agosto de 2025" },
      { title: "Memorando 114/2025", desc: "Novo contrato - Governo", date: "23 de agosto de 2025" },
      { title: "Memorando 018/2025", desc: "Atualizações setoriais", date: "11 de agosto de 2025" },
      { title: "Memorando 035/2025", desc: "Mudanças", date: "07 de agosto de 2025" },
      { title: "Memorando 092/2025", desc: "Novo regulamento interno", date: "05 de agosto de 2025" },
      { title: "Memorando 078/2025", desc: "Revisão orçamentária Q3", date: "01 de agosto de 2025" },
      { title: "Memorando 065/2025", desc: "Planejamento estratégico", date: "28 de julho de 2025" },
      { title: "Memorando 051/2025", desc: "Convocação reunião", date: "25 de julho de 2025" },
    ],
  },
  {
    id: "assinaturas-solicitadas", subtitle: "Assinaturas solicitadas", footerLabel: "Assinaturas Solicitadas", footerIcon: "fa-regular fa-file-signature",
    items: [
      { title: "Memorando 081/2025", desc: "Aguardando Inácio", date: "08 de agosto de 2025" },
      { title: "Memorando 027/2025", desc: "Aguardando Marcelle", date: "20 de agosto de 2025" },
      { title: "Memorando 008/2025", desc: "Aguardando Moacir", date: "18 de agosto de 2025" },
      { title: "Memorando 665/2025", desc: "Aguardando Moacir", date: "18 de agosto de 2025" },
      { title: "Memorando 042/2025", desc: "Aguardando Rafael", date: "15 de agosto de 2025" },
      { title: "Memorando 033/2025", desc: "Aguardando Sandra", date: "12 de agosto de 2025" },
      { title: "Memorando 019/2025", desc: "Aguardando Carlos", date: "08 de agosto de 2025" },
      { title: "Memorando 011/2025", desc: "Aguardando Juliana", date: "05 de agosto de 2025" },
    ],
  },
  {
    id: "fila-assinaturas", subtitle: "Fila de assinaturas", footerLabel: "Fila de Assinatura", footerIcon: "fa-regular fa-clipboard-list",
    items: [
      { title: "Memorando 094/2025", desc: "Cris Lima solicitou assinatura", date: "08 de agosto de 2025" },
      { title: "Memorando 381/2025", desc: "Samuel solicitou assinatura", date: "20 de agosto de 2025" },
      { title: "Memorando 008/2025", desc: "Matheus solicitou assinatura", date: "18 de agosto de 2025" },
      { title: "Memorando 025/2025", desc: "Rita solicitou assinatura", date: "18 de agosto de 2025" },
      { title: "Memorando 017/2025", desc: "Ana solicitou assinatura", date: "14 de agosto de 2025" },
      { title: "Memorando 009/2025", desc: "Pedro solicitou assinatura", date: "10 de agosto de 2025" },
      { title: "Memorando 003/2025", desc: "Luís solicitou assinatura", date: "06 de agosto de 2025" },
      { title: "Memorando 001/2025", desc: "Maria solicitou assinatura", date: "02 de agosto de 2025" },
    ],
  },
  {
    id: "prazos", subtitle: "Prazos a vencer", footerLabel: "Calendário", footerIcon: "fa-regular fa-calendar",
    items: [
      { title: "Memorando 21/2025", desc: "Vencimento: 25/08/2025", date: "Visualização: Todos" },
      { title: "Memorando 044/2025", desc: "Vencimento: 26/08/2025", date: "Visualização: Todos" },
      { title: "Memorando 576/2025", desc: "Vencimento: 26/08/2025", date: "Visualização: Todos de SADM" },
      { title: "Memorando 629/2025", desc: "Vencimento: 29/08/2025", date: "Visualização: Somente eu" },
      { title: "Memorando 715/2025", desc: "Vencimento: 30/08/2025", date: "Visualização: Todos" },
      { title: "Memorando 802/2025", desc: "Vencimento: 01/09/2025", date: "Visualização: Todos" },
      { title: "Memorando 831/2025", desc: "Vencimento: 03/09/2025", date: "Visualização: Somente eu" },
      { title: "Memorando 855/2025", desc: "Vencimento: 05/09/2025", date: "Visualização: Todos" },
    ],
  },
];

const CIRCULARES = [
  { title: "Circular 009/2025", subtitle: "teste", desc: "testetete _ Samuel Desenvolvedor III", date: "15 de agosto de 2025" },
  { title: "Circular 008/2025", subtitle: "Teste C", desc: "Teste circular _ Dev. Teste Dev ... ... ...", date: "14 de agosto de 2025" },
  { title: "Circular 012/2023", subtitle: "Verificação de Numeração", desc: "Verificação de Numeração _ Moacir Silva de Matos Junior Admin", date: "14 de julho de 2023" },
  { title: "Circular 010/2023", subtitle: "Verificação de Numeração", desc: "Verificação de Numeração", date: "14 de julho de 2023" },
  { title: "Circular 009/2023", subtitle: "Verificação de Numeração", desc: "Verificação de Numeração _ Moacir Silva de Matos Junior Admin", date: "14 de julho de 2023" },
  { title: "Circular 008/2023", subtitle: "Verificação de Numeração", desc: "Verificação de Numeração _ Moacir Silva de Matos Junior Admin", date: "14 de julho de 2023" },
  { title: "Circular 004/2023", subtitle: "", desc: "", date: "" },
];

export default function CentralDeAcoes() {
  return (
    <div className="cda">
      {/* ── Welcome + KPIs ─────────────────────────────── */}
      <div className="cda__welcome">
        <div className="cda__welcome-text">
          <h1>Bem-vindo de volta, Prefeito</h1>
          <p>Aqui está uma visão geral de suas tarefas e seus indicadores gerais.</p>
        </div>
        <div className="cda__kpis">
          <div className="cda__kpi-card">
            <span className="cda__kpi-title">Eficiência</span>
            <div className="cda__kpi-values">
              <div className="cda__kpi-col"><span className="cda__kpi-primary cda__kpi-primary--green">22,31%</span><span className="cda__kpi-label">Meu Setor</span></div>
              <div className="cda__kpi-divider" />
              <div className="cda__kpi-col"><span className="cda__kpi-secondary">14,11%</span><span className="cda__kpi-label">Geral</span></div>
            </div>
          </div>
          <div className="cda__kpi-card">
            <span className="cda__kpi-title">Engajamento</span>
            <div className="cda__kpi-values">
              <div className="cda__kpi-col"><span className="cda__kpi-primary cda__kpi-primary--green">22,31%</span><span className="cda__kpi-label">Meu Setor</span></div>
              <div className="cda__kpi-divider" />
              <div className="cda__kpi-col"><span className="cda__kpi-secondary">36,52%</span><span className="cda__kpi-label">Geral</span></div>
            </div>
          </div>
          <div className="cda__kpi-card">
            <span className="cda__kpi-title">Qualidade</span>
            <div className="cda__kpi-values">
              <div className="cda__kpi-col"><span className="cda__kpi-primary cda__kpi-primary--green">08</span><span className="cda__kpi-label">Meu Setor</span></div>
              <div className="cda__kpi-divider" />
              <div className="cda__kpi-col"><span className="cda__kpi-secondary">-</span><span className="cda__kpi-label">Geral</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid 5 colunas: 2 rows, Comunicados span 2 ── */}
      <div className="cda__grid">
        {/* Row 1: Counter Cards (col 1-4) */}
        {COUNTERS.map((c) => (
          <div key={c.id} className="cda__counter-card">
            <span className="cda__counter-title">
              {c.title} <i className="fa-regular fa-circle-info" style={{ fontSize: 11, color: "#bbb" }} />
            </span>
            <div className="cda__counter-body">
              <div className={`cda__counter-icon cda__counter-icon--${c.iconColor}`}>
                <i className={c.iconClass} />
              </div>
              <span className="cda__counter-number">{c.counter}</span>
            </div>
          </div>
        ))}

        {/* Comunicados: spans row 1 + row 2 (col 5) */}
        <div className="cda__comunicados">
          <div className="cda__comunicados-header">
            Comunicados
            <i className="fa-regular fa-circle-info" style={{ fontSize: 12, color: "#bbb" }} />
          </div>
          <div className="cda__comunicados-items">
            {CIRCULARES.map((c, i) => (
              <div key={i} className="cda__circular">
                <div className="cda__circular-title">{c.title}</div>
                {c.subtitle && <div className="cda__circular-subtitle">{c.subtitle}</div>}
                {c.desc && <div className="cda__circular-text">{c.desc}</div>}
                {c.date && <div className="cda__circular-date">{c.date}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Lists (col 1-4) */}
        {LISTS.map((col) => (
          <div key={col.id} className="cda__col">
            <div className="cda__col-subtitle">
              {col.subtitle}{" "}
              <i className="fa-regular fa-circle-info" style={{ fontSize: 11, color: "#bbb" }} />
            </div>
            <div className="cda__col-items">
              {col.items.map((item, i) => (
                <div key={i} className="cda__item">
                  <div className="cda__item-title">{item.title}</div>
                  <div className="cda__item-desc">{item.desc}</div>
                  <div className="cda__item-date">{item.date}</div>
                </div>
              ))}
            </div>
            <div className="cda__col-footer">
              <button className="cda__col-link">
                <i className={col.footerIcon} />
                {col.footerLabel} <span style={{ fontSize: 14 }}>»</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
