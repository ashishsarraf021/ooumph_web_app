'use client'
import React, { useEffect, useState } from "react";
import useAuthStore from '../../../stores/userAuth';
import { useQuery } from "@apollo/client";
import s from "./story.module.css";
import "react-responsive-carousel/lib/styles/carousel.min.css" // Import carousel styles
import UploadStory from "../uploadStory/uploadStory";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useMutation, gql } from "@apollo/client";

const storyClient = new ApolloClient({
  uri: process.env.REACT_APP_AUTH_GRAPHQL_URL,
  cache: new InMemoryCache(),
});

const vibesClient = new ApolloClient({
  uri: process.env.REACT_APP_VIBES_GRAPHQL_URL,
  cache: new InMemoryCache(),
});

const CREATE_REACTION_MUTATION = gql`
  mutation MyMutation2($reaction: String!, $storyId: ID!, $vibe: Float!) {
    createStoryReaction(reaction: $reaction, storyId: $storyId, vibe: $vibe) {
      reaction {
        id
      }
    }
  }
`;


const VIBES_QUERY = gql`
  query VibeList {
    vibeList {
      id
      name
    }
  }
`;

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
`;

// Query for user profile and name
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
`;

// Retrieve the authentication token from local storage


export default function Story() {
  const {authToken} =useAuthStore()
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(0); // Initialize progress to 0
  const [timer, setTimer] = useState(null); // Timer reference
  const [selectedVibe, setSelectedVibe] = useState(""); // Added selectedVibe state
  const [sliderPosition, setSliderPosition] = useState(0); // State for slider position
  const [selectedEmoji, setSelectedEmoji] = useState("😊"); // Default to the initial emoji
  const [vibeData, setVibeData] = useState(null);
  const [createReaction] = useMutation(CREATE_REACTION_MUTATION);
 

  const vibeEmojiMapping = {
    Affable: "😊",
    Haha: "😂",
    "Very BAd": "😠", // Note: Use quotes for keys with spaces
    Angry: "😡",
    Like: "👍",
    Dirty: "🤢",
    Wow: "😲",
    super: "🌟",
    Sad: "😢",
    Love: "❤️",
  };

  const handleSliderClick = async (event) => {
    const boundingRect = event.target.getBoundingClientRect();
    const clickedX = event.clientX - boundingRect.left;
    const sliderWidth = boundingRect.width;
    const newPosition = (clickedX / sliderWidth) * 100;
    setSliderPosition(newPosition);
    const sliderValue = Math.round(newPosition);

    console.log(`Selected Vibe: ${selectedVibe}, Slider Value: ${sliderValue}`);
    try {
      const storyId = myStory.length > 0 ? myStory[0].id : "";

      const { data } = await createReaction({
        variables: {
          reaction: selectedEmoji,
          storyId: storyId,
          vibe: sliderValue,
        },
        context: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });


      console.log("Reaction created:", data);
    } catch (error) {
      console.error("Error creating reaction:", error.message);
    }
  };



  const handleFetchVibes = async () => {
    try {
      const { data } = await vibesClient.query({
        query: VIBES_QUERY,
        context: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      });

      console.log("Fetched Vibes:", data);

      setVibeData(data);
    } catch (error) {
      console.error("Error fetching vibes:", error.message);
    }
  };


  const handleEmojiClick = (vibe) => {
    if (vibe) {
      setSelectedVibe(vibe.name);
      setSelectedEmoji(vibe.name);
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setModalOpen(true);

    const timeoutId = setTimeout(() => {
      closeModal();
    }, 10000);

    setTimer(
      setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 100) {
            return prevProgress + 1;
          }
          return prevProgress;
        });
      }, 100)
    );

    return () => {
      clearInterval(timer);
      clearTimeout(timeoutId);
    };
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
    clearInterval(timer); // Clear the timer when closing manually
    setProgress(0); // Reset progress
  };

  useEffect(() => {
    handleFetchVibes();
    return () => {
      clearInterval(timer);
    };
  }, [timer]);

  // Fetch data using the GET_MY_STORY
  const { loading, error, data: storyData } = useQuery(GET_MY_STORY, {
    context: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  });

  // Fetch data using the USER_PROFILE_QUERY
  const { loading: userLoading, error: userError, data: userData } = useQuery(
    USER_PROFILE_QUERY,
    {
      context: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    }
  );



  // Handle loading state and error state
  if (loading) return <p>Loading...</p>;
  // Handle error state
  if (error) return <p>Error: {error.message}</p>;
  const myStory = storyData.getMyStory; // story data
  console.log(userData);



  return (
    <div className="wrapper flex flex-row overflow-scroll">
      {myStory.map((story) => (
        <div className="flex flex-row mx-3 overflow-scroll" key={story.id}>
          <div>
            <div>
              <div className="relative">
                {/* Story images */}
                <div>
                  {story.multipleimageSet.map((image) => (
                    <div
                      className="w-32 h-32 overflow-hidden my-2 cursor-pointer relative"
                      key={image.id}
                      onClick={() => openModal(image)}
                    >
                      <img
                        src={`http://64.227.188.78/media/${image.image}`}
                        alt={`Image ${image.id}`}
                        className={`${s.storyImg} h-full w-full rounded-full p-1.5`}
                      />
                    </div>
                  ))}
                  <h2 className="text-2xl text-gray-600 mx-auto text-center my-2">
                    {story.title}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Conditionally render user's name */}
      {!userLoading && !userError && userData.whoami && (
        <div>
          <h2 className="text-xl text-gray-600 mx-auto text-center my-2">
            User Name: {userData.whoami.username}
          </h2>
        </div>
      )}



      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 left-1/3 w-1/4">
          <div className="modal-bg fixed inset-0 bg-black opacity-50"></div>
          <div className="modal-content z-50 relative">
            <div className="progress-bar">
              <div
                className={`progress h-1 bg-slate-200 ${s.progress}`}
                style={{ height: `${progress}%` }}
              ></div>
            </div>
            <div>
              <img
                src={`http://64.227.188.78/media/${selectedImage.image}`}
                alt={`Image ${selectedImage.id}`}
                className="w-full h-auto rounded-xl shadow-xl border-2 border-gray-200"
              />

              {myStory.map((story) => (
                <div key={story.id} title={story.title}>
                  <h2
                    className="text-2xl text-gray-600 mx-auto text-center my-2 absolute top-4 left-0 right-0 bg-black bg-opacity-5 p-2"
                    style={{ zIndex: 1 }}
                  >
                    {story.title}
                  </h2>
                </div>
              ))}

              {/* <button onClick={() => handleFetchVibes()}>fetch vibes</button> */}

              <div className={`${s['flex-container']} mt-4`}>
                {vibeData && vibeData.vibeList.slice(0, 10).map((vibe) => (
                  <span
                    key={vibe.id}
                    className={`${s['emoji-button']} ${selectedVibe === vibe.name ? s.selected : ''}`}
                    onClick={() => handleEmojiClick(vibe)}
                  >
                    {vibeEmojiMapping[vibe.name]}
                  </span>
                ))}
              </div>


              <div className="flex mt-4 relative">
                <div className="w-10/12 flex items-center justify-center my-7 mb-9 gap-10 mx-auto">
                <p className={`text-2xl font-semibold text-gray-600 tracking-widest ${selectedVibe ? 'text-pink-300' : ''}`}>
                    
                      {selectedVibe || "Affable"}
          
                  </p>
                  <div className="w-9/12">
                    <div
                      className="slider relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 h-1 cursor-pointer rounded-full"
                      onClick={handleSliderClick}
                    >
                      <div
                        className="slider-thumb absolute text-5xl rounded-full top-0 transform -translate-y-1/2 -translate-x-1/2 transition flex flex-row"
                        style={{ left: `${sliderPosition}%` }}
                        onClick={handleSliderClick}
                      >
                        {selectedVibe && (
                          <span>
                            {vibeEmojiMapping[selectedVibe] || "😊"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="h-16 w-16 absolute top-4 -right-24 bg-slate-100 text-red-500 cursor-pointer"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
