import clsx from 'clsx';
import type { ReactNode } from 'react';

type Kind = 'error' | 'success' | 'info' | 'warning';

const STYLES: Record<Kind, string> = {
  error: 'border-[#fa4d56]',
  success: 'border-[#42be65]',
  info: 'border-[#4589ff]',
  warning: 'border-[#f1c21b]',
};

/** Carbon inline notification: square, layer-01 fill, 3px status bar on the left. */
export function Notice({ kind = 'info', children, className }: { kind?: Kind; children: ReactNode; className?: string }) {
  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      className={clsx('bg-surface-raised border-l-[3px] px-4 py-3 text-sm text-[#f4f4f4]', STYLES[kind], className)}
    >
      {children}
    </div>
  );
}
