import { useEffect } from "react";

export default function AnimeLikes({ animeId }) {
  const anime = JSON.parse(localStorage.getItem("item")) || animeId;

  useEffect(() => {
    localStorage.setItem("item", JSON.stringify(animeId));
  }, [animeId]);

  return (
    <>
      {anime ? (
        <div>
          <h2>Te gusta este anime:</h2>
          <p>{anime}</p>
        </div>
      ) : (
        <p>No hay información sobre este anime.</p>
      )}
    </>
  );
}
