import BannerNovedades from "../components/BannerNovedades";
import AnimeTrends from "../components/AnimeTrends";
import AnimeSeason from "../components/AnimeSeason";
import AnimeAiring from "../components/AnimeAiring";
import AnimePopularity from "../components/AnimePopularity";
import AnimeScore from "../components/AnimeScore";

export default function MainSections() {
  return (
    <>
      <BannerNovedades />
      <AnimeTrends />
      <AnimeSeason />
      <AnimeAiring />
      <AnimePopularity />
      <AnimeScore />
      <div className="pb-12" />
    </>
  );
}
