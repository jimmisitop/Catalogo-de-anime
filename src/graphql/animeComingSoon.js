import { gql } from "@apollo/client";

export const GET_ANIME_COMING_SOON = gql`
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
        perPage
        total
      }
      media(
        type: ANIME
        sort: [START_DATE, POPULARITY_DESC]
        status: NOT_YET_RELEASED
      ) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
      }
    }
  }
`;
