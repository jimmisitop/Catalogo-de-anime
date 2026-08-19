export default function SkeletonCard() {
  return (
    <div className="min-w-[200px] md:min-w-[220px] flex-shrink-0 snap-start">
      {/* Image skeleton */}
      <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 animate-shimmer" />
      {/* Title skeleton */}
      <div className="h-4 rounded-md w-3/4 animate-shimmer mb-2" />
      {/* Subtitle skeleton */}
      <div className="h-3 rounded-md w-1/2 animate-shimmer" />
    </div>
  );
}
