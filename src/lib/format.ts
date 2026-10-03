export function formatPrice(cents: number) {
  const amount = cents / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function relativeDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  const days = Math.max(
    0,
    Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)),
  );
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return months <= 1 ? "1 month ago" : `${months} months ago`;
}

export function formatRating(rating: number) {
  return (Math.round(rating * 10) / 10).toFixed(1);
}
