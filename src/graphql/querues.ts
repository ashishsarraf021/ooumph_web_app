// queries.js

import { gql } from '@apollo/client';

export const VIBES_QUERY = gql`
  query VibeList {
    vibeList {
      id
      name
    }
  }
`;

export const GET_MY_STORY = gql`
  query GetMyStory {
    getMyStory {
      id
      title
      multipleimageSet {
        createdOn
        fileType
        id
        image
      }
    }
  }
`;

export const USER_PROFILE_QUERY = gql`
  query MyQuery {
    whoami {
      firstName
      username
      lastName
      profile {
        profilePic
      }
    }
  }
`;

export const RECOMMENDED_POSTS_QUERY = gql`
  query RecommendedPosts {
    recommendedposts {
      id
      timestamp
      postTitle
      postText
      postType
      postfilesSet {
        file
      }
      owner {
        firstName
        lastName
        profilePic
        username
      }
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($username: String!) {
    userProfile(username: $username) {
      connection {
        connectionStatus
        id
        acceptedConnectionsCount
        receiver {
          username
        }
      }
      user {
        username
        firstName
        lastName
        email
        profile {
          bio
          college
          born
          profilePic
        }
        postSet {
          postTitle
          postText
          postfilesSet {
            file
          }
        }
      }
    }
  }
`;

export const WHOAMI_QUERY = gql`
  query WhoAmI {
    whoami {
      username
    }
  }
`;
