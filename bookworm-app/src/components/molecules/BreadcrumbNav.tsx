import { Link } from 'react-router-dom';
import { ChevronRight } from '@carbon/icons-react';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  crumbs: Crumb[];
}

export function BreadcrumbNav({ crumbs }: BreadcrumbNavProps) {
  return (
    <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1 text-sm py-3">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {crumb.href && !isLast ? (
              <Link to={crumb.href} className="text-link hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-muted' : 'text-link'}>{crumb.label}</span>
            )}
            {!isLast && <ChevronRight size={14} className="text-muted flex-shrink-0" />}
          </span>
        );
      })}
    </nav>
  );
}
