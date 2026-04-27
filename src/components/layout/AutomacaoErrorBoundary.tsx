import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props  { children: ReactNode }
interface State  { hasError: boolean; error: Error | null }

export default class AutomacaoErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[AutomacaoErrorBoundary] Erro capturado:', error, info.componentStack);
  }

  private handleReload = () => window.location.reload();

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 40,
        background: 'var(--bg-surface, #f4f6f9)',
      }}>
        <div style={{
          background: '#fff',
          border: '1px solid #e8edf3',
          borderRadius: 12,
          padding: '40px 48px',
          maxWidth: 480,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          fontFamily: "'Open Sans', sans-serif",
        }}>
          {/* Ícone */}
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 24,
            color: '#dc2626',
          }}>
            <span dangerouslySetInnerHTML={{ __html: '<i class="fa-regular fa-triangle-exclamation"></i>' }} />
          </div>

          {/* Título */}
          <h2 style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#1a1a1a',
            margin: '0 0 10px',
            fontFamily: "'Open Sans', sans-serif",
          }}>
            Algo deu errado
          </h2>

          {/* Descrição */}
          <p style={{
            fontSize: 13,
            color: '#565656',
            margin: '0 0 8px',
            lineHeight: 1.6,
            fontFamily: "'Open Sans', sans-serif",
          }}>
            Ocorreu um erro inesperado na tela de automações.
          </p>

          {this.state.error?.message && (
            <p style={{
              fontSize: 12,
              color: '#9ca3af',
              background: '#f4f6f9',
              border: '1px solid #e8edf3',
              borderRadius: 6,
              padding: '8px 12px',
              margin: '0 0 24px',
              fontFamily: 'monospace',
              wordBreak: 'break-word',
              textAlign: 'left',
            }}>
              {this.state.error.message}
            </p>
          )}

          {/* Botão */}
          <button
            onClick={this.handleReload}
            style={{
              background: '#0058db',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 28px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Open Sans', sans-serif",
              transition: 'background 0.15s',
              marginTop: this.state.error?.message ? 0 : 24,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0046b5'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0058db'; }}
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }
}
