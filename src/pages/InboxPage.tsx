import { useState } from 'react'
import './InboxPage.css'

interface Item {
  id: string
  numero: string
  data: string
  de: string
  para: string[]
  assunto: string
  descricao: string
  tempoCorrido: string
  visualizacao: string
  marcadores?: string[]
  urgente?: boolean
}

const items: Item[] = [
  { id:'1', numero:'Protocolo 065/2020', data:'20/10/2020 às 14h14', de:'Moacir - Imeacir S.A.', para:['SAOM'], assunto:'Teste com Template', descricao:'teste teste teste teste teste...', tempoCorrido:'5 anos 6 meses 2 dias', visualizacao:'Visto por mim', marcadores:['Jurídico'] },
  { id:'2', numero:'Proc. Administrativo 001/2020', data:'11/11/2020 às 10h51', de:'Moacir SAOM', para:['SAOM','SSEI'], assunto:'Solicitação de Pagamento', descricao:'teste', tempoCorrido:'5 anos 5 meses 11 dias', visualizacao:'Visto por mim', marcadores:['Jurídico'] },
  { id:'3', numero:'Proc. Administrativo 002/2020', data:'11/11/2020 às 12h12', de:'Moacir SAOM', para:['SAOM','SAOM'], assunto:'Solicitação de Pagamento', descricao:'testes', tempoCorrido:'5 anos 5 meses 11 dias', visualizacao:'Visto pelo setor', urgente: true },
  { id:'4', numero:'Proc. Administrativo 003/2020', data:'11/11/2020 às 12h13', de:'Moacir SAOM', para:['SAOM'], assunto:'Solicitação de Pagamento', descricao:'teste', tempoCorrido:'5 anos 5 meses 11 dias', visualizacao:'Visto pelo setor' },
  { id:'5', numero:'Proc. Administrativo 004/2020', data:'11/11/2020 às 12h19', de:'Moacir SAOM', para:['SAOM'], assunto:'Solicitação de Pagamento', descricao:'testes', tempoCorrido:'5 anos 5 meses 11 dias', visualizacao:'Visto por mim' },
  { id:'6', numero:'Proc. Administrativo 005/2020', data:'11/11/2020 às 12h21', de:'Moacir SAOM', para:['SAOM'], assunto:'Solicitação de Pagamento', descricao:'teste', tempoCorrido:'5 anos 5 meses 11 dias', visualizacao:'Visto pelo setor', marcadores:['Dias de Demonstração #7', 'Jurídico'] },
]

export default function InboxPage() {
  const [tab, setTab] = useState<'aberto' | 'saida' | 'favoritos' | 'arquivados'>('aberto')
  const [selected, setSelected] = useState<string[]>([])

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }
  const toggleAll = () => {
    setSelected(prev => prev.length === items.length ? [] : items.map(i => i.id))
  }

  return (
    <div className="inbox-page animate-fade-in">
      {/* Sub-header */}
      <div className="inbox-subheader">
        <div className="inbox-path">Inbox / Em aberto</div>
        <div className="inbox-subheader-right">
          <label className="visual-toggle">
            <span>Desativar novo visual</span>
            <div className="toggle-switch active" />
          </label>
          <div className="inbox-org">
            <span>SAOM - Secretaria de Administração</span>
            <button className="btn btn-secondary btn-sm">Trocar de setor ▾</button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="inbox-filters-row">
        <div className="inbox-search-group">
          <select className="input select inbox-filter-select">
            <option>Selecione</option>
          </select>
          <input className="input inbox-filter-input" placeholder="Número" />
          <input type="number" className="input inbox-filter-year" defaultValue={2024} />
          <input type="date" className="input inbox-filter-date" />
          <button className="btn btn-primary">Buscar</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="inbox-tabs-row">
        <div className="inbox-tabs">
          {(['aberto','saida','favoritos','arquivados'] as const).map(t => (
            <button key={t} className={`inbox-tab ${tab === t ? 'active':''}`} onClick={() => setTab(t)}>
              {t === 'aberto' ? 'Em aberto' : t === 'saida' ? 'Caixa de Saída' : t === 'favoritos' ? 'Favoritos' : 'Arquivados'}
            </button>
          ))}
        </div>
        <div className="inbox-actions">
          <button className="btn btn-secondary btn-sm">Marcadores ▾</button>
          <button className="btn btn-secondary btn-sm">Documento ▾</button>
          <span className="inbox-count">1-20 de 264 ›› »</span>
        </div>
      </div>

      {/* Table */}
      <div className="inbox-table-wrapper">
        <table className="inbox-table table">
          <thead>
            <tr>
              <th style={{width:32}}>
                <input type="checkbox" checked={selected.length === items.length} onChange={toggleAll} />
              </th>
              <th style={{width:32}}></th>
              <th style={{width:32}}></th>
              <th style={{width:32}}></th>
              <th>Requerição ↓</th>
              <th>De</th>
              <th style={{width:80}}>Para</th>
              <th>Assunto</th>
              <th>Movimentação ↑</th>
              <th>Visualização</th>
              <th style={{width:32}}></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className={`inbox-row ${item.urgente ? 'urgente':''} ${selected.includes(item.id) ? 'selected':''}`}>
                <td>
                  <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)} />
                </td>
                <td><span className="inbox-star">☆</span></td>
                <td><span className="inbox-icon">📋</span></td>
                <td></td>
                <td>
                  <div className="inbox-numero">{item.numero}</div>
                  <div className="inbox-data">{item.data}</div>
                  {item.marcadores?.map(m => (
                    <span key={m} className="badge badge-primary inbox-marcador">{m}</span>
                  ))}
                </td>
                <td>
                  <div className="inbox-de">{item.de}</div>
                  <div className="inbox-de-email">{item.de.toLowerCase().replace(/ /g,'.')}@1doc.com.br</div>
                </td>
                <td>
                  <div className="inbox-para-list">
                    {item.para.map((p, i) => (
                      <span key={i} className={`badge badge-neutral inbox-para-badge`}>{p}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className={`inbox-assunto ${item.urgente ? 'urgente-text':''}`}>{item.assunto}</div>
                  <div className="inbox-desc">{item.descricao}</div>
                </td>
                <td className="inbox-tempo">{item.tempoCorrido}</td>
                <td>
                  <div className="inbox-vis">
                    {item.visualizacao.includes('mim') ? '✓' : '✓'} {item.visualizacao}
                  </div>
                </td>
                <td>
                  <div className="inbox-processo-link">
                    <a href="/processos" className="btn btn-ghost btn-sm">Ver processo</a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
