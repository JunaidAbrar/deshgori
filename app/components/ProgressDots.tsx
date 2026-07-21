'use client';

export default function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5" aria-label={`${current + 1} / ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={
            'h-2 rounded-full transition-all ' +
            (i === current
              ? 'w-6 bg-teal-500'
              : i < current
                ? 'w-2 bg-teal-300'
                : 'w-2 bg-cream-soft')
          }
        />
      ))}
    </div>
  );
}
