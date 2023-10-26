// @ts-nocheck
'use client'
import React from "react"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import RecommendedUsers from "../components/recommendedUsers/recommendedUsers"
import RecommendedPosts from "../components/recommendedPost/recommendedPost"
import Nav from "../components/nav/nav"
import SideNav from "../components/sideNav/sideNav"
import UploadStory from "../components/uploadStory/uploadStory"
import Story from "../components/story/story"
import SplashScreen from "../components/splashScreen/splashScreen"
const defaultImage = "/assets/defaultuser.png"
// import { getLogger } from "../../logging/log_util";
// Create an Apollo Client for fetching recommended users
const userClient = new ApolloClient({
  uri: "http://64.227.188.78/connection/graphql/", // URL of the GraphQL server for recommended users
  cache: new InMemoryCache(), // Create an in-memory cache for storing fetched data
})

// Create another Apollo Client for fetching recommended posts
const userPost = new ApolloClient({
  uri: "http://64.227.188.78/posts/graphql/",
  cache: new InMemoryCache(),
})
// Create another Apollo Client for fetching story
const userStory = new ApolloClient({
  uri: "http://64.227.188.78/story/graphql/",
  cache: new InMemoryCache(),
})

export default function HomePage() {
  // const logger = getLogger("home")
  // logger.debug("Home Page");

  return (
    <>
      {/* <Nav /> */}
      <div className="grid grid-cols-4 wrapper mt-28">
        {/* Left Column */}
        <div className="col-span-1 sticky top-28 p-4  left-0 h-screen overflow-y-auto">
          <SideNav />
        </div>

        <div className="col-span-2 p-4 mx-auto overflow-y-auto w-4/5">
          <div className="flex flex-col">
            <div className="flex flex-row justify-center">
              <UploadStory />
              {/* user story */}
              <ApolloProvider client={userStory}>
                <Story />
              </ApolloProvider>
            </div>
            {/* Provide the Apollo Client for recommended posts */}
            <ApolloProvider client={userPost}>
              <RecommendedPosts />
            </ApolloProvider>
          </div>
        </div>

        {/* Provide the Apollo Client for recommended users */}
        <div className="col-span-1 p-4 fixed top-28 right-7  overflow-y-auto mx-auto ">
          <ApolloProvider client={userClient}>
            <RecommendedUsers />
          </ApolloProvider>
        </div>

      </div>
    </>
  )
}
