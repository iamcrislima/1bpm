// ── Ico — wrapper para FontAwesome Pro ──────────────────────────
// FontAwesome muta <i> para <svg> via MutationObserver.
// React 19 quebra ao tentar remover elementos que não existem mais no DOM.
// dangerouslySetInnerHTML isola a mutação do reconciliador do React.

interface IcoProps {
  icon: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

export function Ico({ icon, style, className, onClick }: IcoProps) {
  return (
    <span
      dangerouslySetInnerHTML={{ __html: `<i class="${icon}"></i>` }}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        flexShrink: 0,
        ...style,
      }}
      onClick={onClick}
    />
  );
}
