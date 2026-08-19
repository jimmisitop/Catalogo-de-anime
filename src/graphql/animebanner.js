import { gql } from "@apollo/client";

export const GET_ANIME_NOVEDADES = gql`
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: UPDATED_AT_DESC) {
        id
        bannerImage
        title {
          romaji
          english
          native
        }
        description
        meanScore
        episodes
        coverImage {
          large
        }
      }
    }
  }
`;
