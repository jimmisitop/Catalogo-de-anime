import { gql } from "@apollo/client";

export const GET_ANIME_SCORE = gql`
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: SCORE_DESC) {
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
