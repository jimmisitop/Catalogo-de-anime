// Devuelve la temporada y el año actual según la fecha del sistema
export function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  let season = "WINTER";
  if (month >= 3 && month <= 5) season = "SPRING";
  else if (month >= 6 && month <= 8) season = "SUMMER";
  else if (month >= 9 && month <= 11) season = "FALL";

  return { season, year };
}

export const seasonLabels = {
  WINTER: "Invierno",
  SPRING: "Primavera",
  SUMMER: "Verano",
  FALL: "Otoño",
};
