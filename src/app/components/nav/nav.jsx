'use client'

import React,{useEffect} from "react"
import useAuthStore from '@/stores/userAuth';
import { useQuery, gql } from "@apollo/client"
import s from "./nav.module.css"
import Link from "next/link"
import {useRouter} from 'next/navigation';
import UserProfileStore from "@/stores/userProfile";

const  logo = "/assets/ooumph.png"
const defaultUser="/assets/defaultuser.png"

const USER_PROFILE_QUERY = gql`
  query MyQuery {
    whoami {
      firstName
      username
      lastName
      isActive
      email
      profile {
        profilePic
        isEmailVerified
        isPhoneVerified
      }
    }
  }
`

export default function Nav() {
  const { authToken } = useAuthStore();
  const router =useRouter()
  const {setEmail} = UserProfileStore()
  // Fetch data using the USER_PROFILE_QUERY
  const { loading, error, data } = useQuery(USER_PROFILE_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  })

  // Handle loading state
  if (loading) return <p> </p>

  // Handle error state
  if (error) return <p> </p>

  const user = data.whoami // Access the user data from the query result

 if(data){
  if(!data.whoami.profile.isEmailVerified){
    router.push("/otp")
    setEmail(data.whoami.email || null)
  }
 }


  return (
    <div
      className={`${s.nav}  fixed top-0 left-0 w-full bg-black border-b border-gray-300 shadow z-10 `}
    >
      <div className="wrapper flex items-center justify-between">
        {/* ooumph logo */}
        <Link href="/home" className=" h-28 flex items-center gap-6">
          <img
            className="p-1 border border-white rounded-full shadow-xl h-5/6 my-auto"
            src={logo}
            alt="ooumph_logo"
          />
          <p className={s.ooumph}>OOUMPH</p>
        </Link>
        {/* user  */}
        <Link  href="/profile" className="flex items-center gap-2 ">
          <img
            className="border rounded-full h-16 w-16 border-gray-300 "
            src={ user.profile.profilePic? `http://64.227.188.78/media/${user.profile.profilePic}` : `${defaultUser}`}
            alt="Profile"
          />
          {user.firstName ? (
            <p className="text-gray-700 text-2xl">
              {user.firstName} {user.lastName}
            </p>
          ) : (
            <p className="text-gray-700 text-2xl"> {user.username}</p>
          )}
        </Link>
      </div>
    </div>
  )
}
