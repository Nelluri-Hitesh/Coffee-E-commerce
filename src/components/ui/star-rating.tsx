export function StarRating({
  rating,
  size = 14,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <span
      className={`inline-flex items-center gap-[2px] ${className}`}
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
      role="img"
    >
      {stars.map((star) => {
        const fill = Math.max(0, Math.min(1, rating - star + 1));
        return (
          <svg
            key={star}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="shrink-0"
          >
            <defs>
              <linearGradient id={`star-${star}-${Math.round(fill * 100)}`}>
                <stop offset={`${fill * 100}%`} stopColor="currentColor" />
                <stop offset={`${fill * 100}%`} stopColor="currentColor" stopOpacity="0.22" />
              </linearGradient>
            </defs>
            <path
              d="M10 1.6l2.47 5.2 5.53.77-4.06 3.9 1 5.53L10 14.3l-4.94 2.7 1-5.53L2 7.57l5.53-.77z"
              fill={`url(#star-${star}-${Math.round(fill * 100)})`}
            />
          </svg>
        );
      })}
    </span>
  );
}
