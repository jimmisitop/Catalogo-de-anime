import { gql } from "@apollo/client";

export const GET_ANIME_TRENDS = gql`
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: TRENDING_DESC) {
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
