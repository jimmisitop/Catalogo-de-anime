export default function SkeletonCard() {
  return (
    <div className="min-w-48 flex flex-col justify-start snap-start animate-pulse">
      <div className="aspect-[2/3] rounded-lg bg-gray-300"></div>
      <div className="h-4 mt-2 bg-gray-300 rounded w-3/4 mx-auto"></div>
    </div>
  );
}
