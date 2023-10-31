import { gql } from "@apollo/client"

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($email: String!, $phone: String!) {
    updateUserProfile(email: $email, phoneNumber: $phone) {
      user {
        email
        username
      }
      profile {
        phoneNumber
        gmailId
      }
    }
  }
`

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($username: String!, $password: String!, $email: String!) {
    createUser(username: $username, password: $password, email: $email) {
      token
      refreshToken
      user {
        id
        username
        email
      }
      profile{
        isEmailVerified
      }
    }
  }
`


// mutations.js

export const CREATE_REACTION_MUTATION = gql`
  mutation MyMutation2($reaction: String!, $storyId: ID!, $vibe: Float!) {
    createStoryReaction(reaction: $reaction, storyId: $storyId, vibe: $vibe) {
      reaction {
        id
      }
    }
  }
`;


export const SEND_CONNECTION_REQUEST = gql`
  mutation SendConnectionRequest($connectionType: String!, $receiverUsername: String!) {
    sendConnectionRequest(connectionType: $connectionType, receiverUsername: $receiverUsername) {
      successMessage
    }
  }
`;

export const DELETE_CONNECTION_REQUEST = gql`
  mutation DeleteConnectionRequest($connectionId: Int!) {
    deleteConnection(id: $connectionId) {
      success
    }
  }
`;

export const ACCEPT_CONNECTION_REQUEST = gql`
  mutation AcceptConnectionRequest($connectionId: Int!) {
    updateConnection(id: $connectionId, updateTo: "Accepted") {
      connection {
        id
      }
    }
  }
`;





