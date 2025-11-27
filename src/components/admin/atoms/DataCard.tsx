/**
 * Data Card Atom
 * Generic card container
 */

interface DataCardProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function DataCard({ children, title, actions, className = '' }: DataCardProps) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

