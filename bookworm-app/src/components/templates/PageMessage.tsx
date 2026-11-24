import { Spinner } from '../atoms';

/** Centered loading / error / empty state used by every data-driven page. */
export function PageMessage({ loading = false, children }: { loading?: boolean; children?: React.ReactNode }) {
  return (
    <div className="py-20 flex flex-col items-center gap-4 text-center text-muted" role={loading ? 'status' : undefined}>
      {loading && <Spinner size={28} />}
      {children}
    </div>
  );
}
