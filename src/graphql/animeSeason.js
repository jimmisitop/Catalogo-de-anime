import { gql } from "@apollo/client";

export const GET_ANIME_SEASON = gql`
  query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
    Page(page: $page, perPage: $perPage) {
      media(
        type: ANIME
        season: $season
        seasonYear: $seasonYear
        sort: POPULARITY_DESC
      ) {
        id
        coverImage {
          large
        }
        title {
          romaji
          english
          native
        }
        averageScore
        format
      }
    }
  }
`;
