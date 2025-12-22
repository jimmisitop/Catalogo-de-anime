import SkeletonCard from "../../components/SkeletonCard";

//El skeleton de carga del array de los animes
export const loadingArray = Array(5)
  .fill(0)
  .map((_, index) => <SkeletonCard key={index} />);
