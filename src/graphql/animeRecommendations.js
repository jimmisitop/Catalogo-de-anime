import { gql } from "@apollo/client";

export const GET_ANIME_RECOMMENDATIONS = gql`
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      recommendations(sort: RATING_DESC, perPage: 6) {
        nodes {
          id
          rating
          mediaRecommendation {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            averageScore
            format
          }
        }
      }
    }
  }
`;
