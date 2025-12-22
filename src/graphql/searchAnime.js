import { gql } from "@apollo/client";

export const SEARCH_ANIME = gql`
  query ($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        description(asHtml: false)
        averageScore
        coverImage {
          large
        }
      }
    }
  }
`;
