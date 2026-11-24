import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface TagProps {
  label: string;
  href?: string;
  className?: string;
}

export function Tag({ label, href, className }: TagProps) {
  const base = clsx('text-xs text-link hover:underline transition-colors', className);
  if (href) return <Link to={href} className={base}>{label}</Link>;
  return <span className={base}>{label}</span>;
}
