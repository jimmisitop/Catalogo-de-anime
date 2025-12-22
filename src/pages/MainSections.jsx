import SearchBar from "../components/SearchBar";
import AnimePopularity from "../components/AnimePopularity";
import AnimeTrends from "../components/AnimeTrends";
import BannerNovedades from "../components/BannerNovedades";
import AnimeScore from "../components/AnimeScore";

export default function MainSections() {
  return (
    <>
      <BannerNovedades />
      <AnimePopularity />
      <AnimeTrends />
      <AnimeScore />
    </>
  );
}
