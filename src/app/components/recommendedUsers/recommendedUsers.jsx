import React from "react"
import useAuthStore from '../../../stores/userAuth';
import { useQuery, gql } from "@apollo/client"
import { HiOutlineUser } from "react-icons/hi"
import s from "./recommendedUsers.module.css"
import Link from "next/link"

const defaultUser="/assets/defaultuser.png"


// GraphQL query to fetch recommended users
const RECOMMENDED_USERS_QUERY = gql`
  query recommendedUsers {
    recommendedUsers {
      firstName
      lastName
      profilePic
      username
    }
  }
`



// Retrieve the authentication token from local storage


function RecommendedUsers() {
  const {authToken} =useAuthStore()
  // Fetch data using the RECOMMENDED_USERS_QUERY
  const { loading, error, data } = useQuery(RECOMMENDED_USERS_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  })

  // Handle loading state
  if (loading) return <p>Loading...</p>

  // Handle error state
  if (error) return <p>Error: {error.message}</p>

  // Render the recommended users
  return (
    <div
      className={`${s.usersContainner}  p-4 border border-gray-100 m-4 rounded-xl shadow-md   `}
    >
      <h2 className="text-4xl font-normal  mb-6">Recommended Users</h2>
      <div className="h-[90vh] overflow-auto "> 
      <ul>
        {data.recommendedUsers.map((user) => (
           <Link
           href={`/user/${user.username}`} // Define the user profile page URL
           key={user.username}
           className="flex items-center space-x-4 my-4 shadow rounded-lg bg-white p-4"
         >
            {/* Display user profile picture */}
            
              <img
                src={user.profilePic?`http://64.227.188.78/media/${user.profilePic}` : `${defaultUser}`}
                alt={user.username}
                className="w-20 h-20 rounded-full border mx-2 border-gray-200"
                loading="lazy"
              />

            <div>
              {/* Display user's full name */}
              <p className="font-semibold my-1">
                {user.firstName} {user.lastName}
              </p>
              {/* Display user's username */}
              <p className="text-gray-500 text-xl my-1">@{user.username}</p>
            </div>
          </Link>
        ))}
      </ul>
      </div>
    </div>
  )
}

export default RecommendedUsers
