// @ts-nocheck
'use client'
import React from "react";
import useAuthStore from '../stores/userAuth';
import { useRouter } from 'next/navigation';
import SplashScreen from "./components/splashScreen/splashScreen";

export default function Home() {
  const {authToken} =useAuthStore()
  const router = useRouter();
  
  React.useEffect(()=>{

    if(!authToken){
      router.push("/register")
    }
    else{
      router.push("/home")
    }

  },[])


  return (
    <SplashScreen/>
  )


}
