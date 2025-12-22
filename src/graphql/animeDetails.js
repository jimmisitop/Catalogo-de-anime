import { gql } from "@apollo/client";

export const GET_ANIME_DETAIL = gql`
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
      }
      description
      episodes
      averageScore
      bannerImage
      type
      isLicensed
      genres
      tags {
        name
        category
      }
      studios {
        nodes {
          name
        }
      }
      isAdult
      coverImage {
        large
      }
      status
      characters {
        nodes {
          image {
            large
          }
        }
      }
      trailer {
        thumbnail
        site
        id
      }
      reviews {
        nodes {
          id
          summary
          rating
        }
      }
    }
  }
`;
