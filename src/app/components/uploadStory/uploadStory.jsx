'use client'

import React, { useState } from "react"
import axios from "axios"

import {
  useMutation,
  useQuery,
  gql,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import styles from "./uploadStory.module.css"
import { FaPlus } from "react-icons/fa"
import Story from "../story/story"
import useAuthStore from '../../../stores/userAuth';

const defaultUser="/assets/defaultuser.png"

// Define GraphQL mutations and queries
const CREATE_STORY_MUTATION = gql`
  mutation CreateStory($title: String!, $content: String!, $privacy: String!) {
    createStory(title: $title, content: $content, privacy: $privacy) {
      story {
        id
        title
        content
        privacy
      }
    }
  }
`

const UPLOAD_IMAGES_MUTATION = gql`
  mutation UploadImages($file: Upload!, $storyId: ID!) {
    uploadImages(file: $file, storyId: $storyId) {
      success
    }
  }
`

const GET_MY_STORY = gql`
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
`
const USER_PROFILE_QUERY = gql`
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
`

const UploadStory = () => {
  // Retrieve authentication token from local storage
  const {authToken} = useAuthStore()
  // State variables for form inputs and selected image
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [privacy, setPrivacy] = useState("Universal")
  const [selectedImage, setSelectedImage] = useState(null)
  const [createdStoryId, setCreatedStoryId] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Apollo Client instances for different GraphQL operations
  const client = new ApolloClient({
    uri: "http://64.227.188.78/story/graphql/",
    cache: new InMemoryCache(),
  })

  const imageClient = new ApolloClient({
    uri: "http://64.227.188.78/story/graphqlmedia/",
    cache: new InMemoryCache(),
  })
  // Apollo Client instance for fetching user's story
  const getMyStoryClient = new ApolloClient({
    uri: "http://64.227.188.78/story/graphql/",
    cache: new InMemoryCache(),
  })

  // Use mutations for creating a story and uploading images
  const [createStory] = useMutation(CREATE_STORY_MUTATION, {
    client,
  })

  const [uploadImages] = useMutation(UPLOAD_IMAGES_MUTATION, {
    client: imageClient,
  })

  // Fetch user's story using the defined query
  const {
    data: myStoryData,
    loading,
    error,
    refetch,
  } = useQuery(GET_MY_STORY, {
    client: getMyStoryClient,
    skip: true,
    context: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  })
  // Fetch data using the USER_PROFILE_QUERY
  const { data: userData } = useQuery(USER_PROFILE_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  })
  const user = userData?.whoami // Access the user data from the query result
  const profilePic = user?.profile?.profilePic

  // Function to handle story creation
  const handleCreateStory = async (e) => {
    e.preventDefault()
    try {
      // Create story mutation with authorization header
      const { data } = await createStory({
        variables: { title, content, privacy },
        context: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      })

      // Set up image upload link with authorization
      const imageUploadLink = setContext((_, { headers }) => {
        return {
          headers: {
            ...headers,
            Authorization: authToken ? `Bearer ${authToken}` : "",
          },
        }
      })

      // If story creation is successful, update the createdStoryId
      if (data.createStory.story) {
        console.log("Story created successfully:", data.createStory.story)
        setCreatedStoryId(data.createStory.story.id)
      } else {
        console.error("Failed to create story")
      }
    } catch (error) {
      console.error("Error creating story:", error)
    }
  }

  // Function to refetch the user's story
  const handleGetStory = async () => {
    try {
      await refetch()
    } catch (fetchError) {
      console.error("Error fetching story:", fetchError)
    }
  }

  // Function to handle image upload
  const handleFileChange = (event) => {
    setImageFile(event.target.files[0])
  }

  const uploadStoryImage = async () => {
    try {
      console.log("Uploading image:", imageFile)

      const formData = new FormData()
      formData.append(
        "operations",
        JSON.stringify({
          query: `
          mutation MyMutation($file: Upload!, $storyId: ID!) {
            uploadImages(file: $file, storyId: $storyId) {
              success
            }
          }
        `,
          variables: { file: null, storyId: createdStoryId },
        })
      )
      formData.append("map", '{"0": ["variables.file"]}')
      formData.append("0", imageFile)

      console.log("FormData:", formData)

      const options = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      }

      const endpoint = "http://64.227.188.78/story/graphqlmedia/"
      const response = await axios.post(endpoint, formData, options)

      if (response.status === 200) {
        console.log("Upload success", response)
      } else {
        console.log("Upload failed:", response)
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    }
  }
  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }
  return (
    <>
      <div
        className="relative w-32 h-32 my-2 cursor-pointer"
        onClick={openModal}
      >
        <img
          className={`${styles.storyImg} h-full w-full rounded-full p-1.5`}
          src={profilePic?`http://64.227.188.78/media/${profilePic}` :`${defaultUser}`}
          alt="Profile"
        />
        <FaPlus className="absolute bottom-2 right-0 text-2xl h-9 w-9 border-4 border-gray-300 bg-gray-300 rounded-full" />
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <button
              className="h-16 w-16 rounded-full absolute top-24 right-1/3 m-2 bg-slate-100 text-red-500 hover:text-red-600"
              onClick={closeModal}
            >
              X
            </button>
            <div className="flex flex-col align-middle justify-center pb-4">
              <h2 className="font-medium text-4xl mx-auto mb-11 mt-5">
                Upload Story
              </h2>
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Input fields for story details */}
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
                {/* Dropdown for privacy selection */}
                <select
                  className={styles.select}
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                >
                  <option value="Universal">Universal</option>
                  <option value="private">Private</option>
                </select>
                {/* Input field for image selection */}
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  className={styles.input}
                  onChange={handleFileChange}
                />
                {/* Buttons for various actions */}
                <button
                  className="text-gray-50 bg-blue-500 hover:bg-blue-700 px-4 py-2 mt-11 my-1 rounded-md mx-auto"
                  onClick={handleCreateStory}
                  type="button"
                >
                  Create Story
                </button>
                <button
                  className="text-gray-50 bg-blue-500 hover:bg-blue-700 px-4 py-2 my-1 rounded-md mx-auto"
                  onClick={uploadStoryImage}
                  type="button"
                  // disabled={!selectedImage || !createdStoryId}
                >
                  Upload Image
                </button>
                <button
                  className="text-gray-50 bg-blue-500 hover:bg-blue-700 px-4 py-2 my-1 rounded-md mx-auto"
                  onClick={handleGetStory}
                  type="button"
                >
                  Get Story
                </button>
              </form>
              {/* Display selected image preview */}
              {selectedImage && (
                <div className={styles.imagePreview}>
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Uploaded"
                  />
                </div>
              )}
              {/* <div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={uploadStoryImage}>Upload Image</button>
        </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UploadStory
