import clsx from 'clsx';

interface BadgeProps {
  count: number;
  className?: string;
}

export function Badge({ count, className }: BadgeProps) {
  if (count <= 0) return null;
  return (
    <span
      className={clsx(
        'absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1',
        'bg-[#fa4d56] text-white text-[10px] font-semibold rounded-full',
        'flex items-center justify-center leading-none',
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
