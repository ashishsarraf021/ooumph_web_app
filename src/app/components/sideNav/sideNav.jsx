'use client'


import React,{useEffect} from "react"
import {useRouter,usePathname} from 'next/navigation'; 
import useAuthStore from "@/stores/userAuth";
import { MdOutlineHome, MdOutlineSearch } from "react-icons/md"
import { FaRegUserCircle, FaPlus, FaRegCommentDots ,FaLock } from "react-icons/fa"
import { HiOutlineHeart } from "react-icons/hi"
import Link from "next/link"
import s from "./sideNav.module.css"

const navLinks = [
  { path: "/home", icon: <MdOutlineHome />, label: "Home" },
  { path: "/search", icon: <MdOutlineSearch />, label: "Search" },
  {
    path: "/plus",
    icon: (
      <FaPlus className={`${s.icon} rounded-full p-1 bg-white shadow-md`} />
    ),
    label: "Plus",
  },
  {
    path: "/messages",
    icon: <FaRegCommentDots className="p-1" />,
    label: "Messages",
  },
  {
    path: "/notifications",
    icon: <HiOutlineHeart className="gray" />,
    label: "Notifications",
  },
  {
    path: "/profile",
    icon: <FaRegUserCircle className="gray" />,
    label: "My Profile",
  },

]

export default function SideNav() {
  // const location = useLocation()
  const pathname = usePathname();
  const { removeTokens } = useAuthStore();

  useEffect( ()=>{
    console.log(pathname)
  },[])
  

  return (
    <div className="text-gray-900 flex flex-col gap-3 my-11">
      {navLinks.map(({ path, icon, label }) => (
        <Link
          key={path}
          href={path}

          className={`flex m-4 my-2 ${
            pathname === path ? "opacity-100 font-bold" : "opacity-60"
          }`}

        >
          {icon && <div className="my-auto text-4xl mx-3">{icon} </div>}
          <h4 className="text-2xl ml-7 ">{label}</h4>
        </Link>
      
      ))}

      <Link href="/" className="flex m-4 my-2 opacity-60 font-bold" onClick={()=>removeTokens()} >

        <div className="my-auto text-3xl mx-3">
          {<FaLock/>}
        </div>
          <h4 className="text-2xl ml-7 ">{"Log Out"}</h4>
      </Link>

    </div>
  )
}
