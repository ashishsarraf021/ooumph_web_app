'use client'

import s from "./profile.module.css"
import React, { useEffect, useState } from "react"
import { useRouter } from 'next/navigation';
import Link from "next/link"
import SideNav from "../components/sideNav/sideNav" //import side nav
import Nav from "../components/nav/nav"
import { IoIosPeople } from "react-icons/io"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { GiBlackBook } from "react-icons/gi"
import { MdOutlineTopic, MdOutlineHolidayVillage } from "react-icons/md"
import useAuthStore from '../../stores/userAuth';

const bgImage = "/assets/ooumph_logo.webp"
const defaultUser="/assets/defaultuser.png"

const ProfilePage = () => {
  const {authToken} = useAuthStore()
  const router = useRouter()

  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getWhoAmI = async () => {
      try {
        const response = await fetch("http://64.227.188.78/auth/graphql/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            query: `
              query WhoAmI {
                whoami {
                  email
                  username
                  profile {
                    appleId
                    bio
                    college
                    born
                    profilePic
                    intelligenceScore
                    appealScore
                    socialScore
                    humanScore
                    vibersCount
                  }
                }
              }
            `,
          }),
        })
        const data = await response.json()
        setUserProfile(data.data.whoami)
        setLoading(false)
      } catch (error) {
        console.error("Error:", error)
      }
    }

    getWhoAmI()
  }, [authToken])

  const handleUpdateProfileClick = () => {
    navigate("/updateprofile")
  }

  return (
    <div>
      {/* <Nav /> */}
      <div className="grid grid-cols-4 wrapper mt-28">
        {/* Left Column */}
        <div className="col-span-1 sticky top-28 p-4  left-0 h-screen overflow-y-auto">
          <SideNav />
        </div>

        {/* profile page */}
        <div className="col-span-3 w-full">
          <div>
            <div>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className=" mx-auto bg-gray-50 shadow-lg rounded-xl overflow-hidden mt-8">
                  {/* Cover Image */}
                  <img
                    className="w-full h-64 object-cover"
                    src={bgImage}
                    alt="background Image"
                  />
                  {userProfile.profile && (
                    // profile image
                    <div className="flex justify-left -mt-20 ml-10">
                      <img
                        className="w-48 h-48 object-cover rounded-full p-2 bg-white shadow-2xl"
                        src={ userProfile.profile.profilePic?`http://64.227.188.78/media/${userProfile.profile.profilePic}`: `${defaultUser}` }
                        alt="Profile Pic"
                      />
                    </div>
                  )}
                  {/* profile info */}
                  <div className="wrapper m-4 mx-6">
                    <p className="text-5xl font-bold text-gray-800">
                      {userProfile.username}
                    </p>
                    <p className="text-gray-500 text-3xl">
                      {userProfile.email}
                    </p>
                    <p className="text-xl mt-4">{userProfile.profile.bio}</p>
                    <p className="text-xl mt-4">
                      {userProfile.profile.college}
                    </p>
                    <p className="text-xl mt-4">{userProfile.profile.born}</p>

                    <div className="flex flex-row gap-4 my-4">
                      <button
                        className="w-80 rounded-lg bg-blue-500 hover:bg-blue-700"
                        onClick={handleUpdateProfileClick}
                      >
                        Update Profile
                      </button>
                      {/* Place the Link component here */}

                      <Link
                        className="block font-bold text-center w-80 py-2 px-4 pt-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-2xl transition duration-300 ease-in-out "
                        href="/resetpassword"
                      >
                        Change Password
                      </Link>
                      <Link
                        className="block font-bold text-center pt-3 w-80 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-2xl transition duration-300 ease-in-out "
                        href="/uploadStory"
                      >
                        Upload Story
                      </Link>
                    </div>
                    {/* followers */}
                    <div className="my-11 ">
                      <div className="flex flex-row mb-2 justify-center w-96 gap-10  text-gray-500">
                        <p className="text-xl italic cursor-pointer">
                          Vibers: 5.2k
                        </p>
                        <p className="text-xl italic cursor-pointer">
                          Posts: 25
                        </p>
                      </div>
                      <div className="flex flex-col items-center rounded-full shadow-inner justify-center gap-4 bg-gray-100 w-96 h-36">
                        <div className="flex flex-row justify-between space-x-9 shadow-inner bg-white rounded-full p-1">
                          <p className="flex  items-center  justify-center font-bold text-gray-600 bg-white h-16 w-20 rounded-full shadow-xl cursor-pointer">
                            15
                          </p>
                          <p className="flex  items-center  justify-center font-bold text-gray-600 bg-white h-16 w-20 rounded-full shadow-xl cursor-pointer">
                            2.3k
                          </p>
                          <p className="flex  items-center  justify-center font-bold text-gray-600 bg-white h-16 w-20 rounded-full shadow-xl cursor-pointer">
                            2.3k
                          </p>
                        </div>
                        <div className="flex flex-row justify-between space-x-7">
                          <p className="text-2xl  text-gray-600 cursor-pointer">
                            Inner
                          </p>
                          <p className="text-2xl  text-gray-600 cursor-pointer">
                            Outer
                          </p>
                          <p className="text-2xl  text-gray-600 cursor-pointer">
                            Universe
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row overflow-scroll gap-7 h-40 mt-11">
                      <div class="flex flex-col items-center justify-center border-2 border-white  bg-gray-100 overflow-hidden w-52 h-32 rounded-3xl shadow-xl cursor-pointer">
                        <IoIosPeople className="text-5xl text-gray-600" />
                        <p className="text-xl mt-1 font-medium text-gray-400">
                          People
                        </p>
                      </div>
                      <div class="flex flex-col items-center justify-center border-2 border-white  bg-gray-100 w-52 h-32 rounded-3xl shadow-xl cursor-pointer">
                        <MdOutlineTopic className="text-5xl text-gray-600" />
                        <p className="text-xl mt-1 font-medium text-gray-400">
                          Content
                        </p>
                      </div>
                      <div class="flex flex-col items-center justify-center border-2 border-white  bg-gray-100 w-52 h-32 rounded-3xl shadow-xl cursor-pointer">
                        <MdOutlineHolidayVillage className="text-5xl text-gray-600" />
                        <p className="text-xl mt-1 font-medium text-gray-400">
                          Community
                        </p>
                      </div>
                      <div class="flex flex-col items-center justify-center border-2 border-white  bg-gray-100 w-52 h-32 rounded-3xl shadow-xl cursor-pointer">
                        <AiOutlineShoppingCart className="text-5xl text-gray-600" />
                        <p className="text-xl mt-1 font-medium text-gray-400">
                          Shop
                        </p>
                      </div>
                      <div class="flex flex-col items-center justify-center border-2 border-white  bg-gray-100 w-52 h-32 rounded-3xl shadow-xl cursor-pointer">
                        <GiBlackBook className="text-5xl text-gray-600" />
                        <p className="text-xl mt-1 font-medium text-gray-400">
                          Diary
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
