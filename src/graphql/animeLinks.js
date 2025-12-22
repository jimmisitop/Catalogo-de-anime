import { gql } from "@apollo/client";

export const GET_ANIME_LINKS = gql`
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      streamingEpisodes {
        thumbnail
        title
        url
        site
      }
    }
  }
`;
