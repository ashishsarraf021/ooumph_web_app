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
