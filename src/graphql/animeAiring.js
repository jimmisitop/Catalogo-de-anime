import { gql } from "@apollo/client";

export const GET_ANIME_AIRING = gql`
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
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
