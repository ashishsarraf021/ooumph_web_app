// @ts-nocheck
"use client"

require('dotenv').config();
import React, { useState, useMemo, useEffect } from "react";
import useAuthStore from '../../../stores/userAuth';
// import { useParams } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  useQuery,
  HttpLink,
  useMutation,
} from "@apollo/client";
import gql from "graphql-tag";
import SideNav from "../sideNav/sideNav";
import Nav from "../nav/nav";
import { IoIosPeople } from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { GiBlackBook } from "react-icons/gi";
import { MdOutlineTopic, MdOutlineHolidayVillage } from "react-icons/md";
import Link from "next/link";
import {
  FaEye,
  FaCommentAlt,
  FaShare,
  FaPlus,
  FaRegUser,
} from "react-icons/fa";
import { FiPlus } from "react-icons/fi";

const defaultUser = "/assets/defaultuser.png"
const bgImage = "/assets/ooumph_logo.webp";

// Define the GraphQL query for user profile
const GET_USER_PROFILE = gql`
  query GetUserProfile($username: String!) {
    userProfile(username: $username) {
      connection {
        connectionStatus
        id
        acceptedConnectionsCount
        receiver {
          username
        }
      }
      user {
        username
        firstName
        lastName
        email
        profile {
          bio
          college
          born
          profilePic
        }
        postSet {
          postTitle
          postText
          postfilesSet {
            file
          }
        }
      }
    }
  }
`;

// Define the GraphQL mutation for sending a connection request
const SEND_CONNECTION_REQUEST = gql`
  mutation SendConnectionRequest(
    $connectionType: String!
    $receiverUsername: String!
  ) {
    sendConnectionRequest(
      connectionType: $connectionType
      receiverUsername: $receiverUsername
    ) {
      successMessage
    }
  }
`;

// Define the GraphQL mutation for deleting a connection
const DELETE_CONNECTION_REQUEST = gql`
  mutation DeleteConnectionRequest($connectionId: Int!) {
    deleteConnection(id: $connectionId) {
      success
    }
  }
`;

// Define the GraphQL mutation for accepting a connection
const ACCEPT_CONNECTION_REQUEST = gql`
  mutation AcceptConnectionRequest($connectionId: Int!) {
    updateConnection(id: $connectionId, updateTo: "Accepted") {
      connection {
        id
      }
    }
  }
`;

// Define the GraphQL query to know Who Am I i.e username of user login
const WHOAMI_QUERY = gql`
  query WhoAmI {
    whoami {
      username
    }
  }
`;

// Define the GraphQL query to get list of available vibes
const VIBES_QUERY = gql`
  query VibeList {
    vibeList {
      id
      name
    }
  }
`;

const UserProfile = (props) => {
  const username = props.slug.replace("%", '')
  console.log(username)
  const [hasFetched, setHasFetched] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isConnectionSent, setConnectionSent] = useState(false);
  const [isConnectionDeleted, setConnectionDeleted] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const { authToken } = useAuthStore()
  const [selectedReactionEmoji, setSelectedReactionEmoji] = useState("😊"); // Default to the initial emoji // Default to the initial emoji
  const [selectedVibe, setSelectedVibe] = useState(""); // Added selectedVibe state
  const [selectedReaction, setSelectedReaction] = useState(null);

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

  // Changing different URI
  const defaultClient = useMemo(() => {
    return new ApolloClient({
      link: new HttpLink({ uri: "http://default-uri/graphql/" }),
      cache: new InMemoryCache(),
    });
  }, []);

  const profileClient = useMemo(() => {
    return new ApolloClient({
      link: new HttpLink({ uri: process.env.NEXT_PUBLIC_PROFILE_GRAPHQL_URL}),
      cache: new InMemoryCache(),
    });
  }, []);

  const connectionClient = useMemo(() => {
    return new ApolloClient({
      link: new HttpLink({ uri: "http://64.227.188.78/connection/graphql/" }),
      cache: new InMemoryCache(),
    });
  }, []);

  const vibesClient = useMemo(() => {
    return new ApolloClient({
      uri: process.env.REACT_APP_VIBES_GRAPHQL_URL,
      cache: new InMemoryCache(),
    });
  }, []);

  const authClient = useMemo(() => {
    return new ApolloClient({
      link: new HttpLink({ uri: "http://64.227.188.78/auth/graphql/" }),
      cache: new InMemoryCache(),
    });
  }, []);

  // Describing what to send with the query for example auth token for different query
  const {
    loading: whoAmILoading,
    error: whoAmIError,
    data: whoAmIData,
  } = useQuery(WHOAMI_QUERY, {
    client: authClient,
    context: {
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    },
  });

  useEffect(() => {
    if (whoAmIData && whoAmIData.whoami) {
      setCurrentUser(whoAmIData.whoami.username);
      console.log("Current User:", whoAmIData.whoami.username);
    }
  }, [whoAmIData]);

  const { loading, error, data, refetch } = useQuery(GET_USER_PROFILE, {
    client: profileClient,
    variables: { username },
    skip: !hasFetched,
    context: {
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    },
  });

  const {
    loading: vibesLoading,
    error: vibesError,
    data: vibesData,
  } = useQuery(VIBES_QUERY, {
    client: vibesClient,
    context: {
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    },
  });

  // Define state to keep track of slider positions for each image
  const [sliderPositions, setSliderPositions] = useState([]);

  useEffect(() => {
    if (!loading && data) {
      // Initialize sliderPositions when data is available
      const initialSliderPositions =
        data?.userProfile?.user?.postSet?.map((post) =>
          post.postfilesSet.map(() => 0)
        ) || [];
      setSliderPositions(initialSliderPositions);
    }
    handleFetchData()
  }, [data]);



  const [sendConnectionRequest] = useMutation(SEND_CONNECTION_REQUEST, {
    client: connectionClient,
    context: {
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    },
  });

  const [deleteConnectionRequest] = useMutation(DELETE_CONNECTION_REQUEST, {
    client: connectionClient,
    context: {
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    },
  });

  const [acceptConnectionRequest] = useMutation(ACCEPT_CONNECTION_REQUEST, {
    client: connectionClient,
    context: {
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    },
  });

  // Defining handler function for different functionality when call
  const handleFetchData = async () => {
    try {
      await refetch();
      setHasFetched(true);
      setLoadingData(true);

    } catch (err) {
      setHasFetched(true);
      setLoadingData(true);
      console.error("Error fetching:", err);
    }
    setLoadingData(false);
  };

  const handleSendConnection = async () => {
    try {
      await sendConnectionRequest({
        variables: {
          connectionType: "Friends",
          receiverUsername: username,
        },
      });
      setConnectionSent(true);
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };

  const handleDeleteConnection = async () => {
    if (
      data &&
      data.userProfile &&
      data.userProfile.connection &&
      data.userProfile.connection.id
    ) {
      try {
        await deleteConnectionRequest({
          variables: {
            connectionId: parseInt(data.userProfile.connection.id, 10),
          },
        });
        setConnectionDeleted(true);
      } catch (error) {
        console.error("Error deleting connection:", error);
      }
    }
  };

  const handleAcceptConnection = async () => {
    if (
      data &&
      data.userProfile &&
      data.userProfile.connection &&
      data.userProfile.connection.id
    ) {
      try {
        const response = await acceptConnectionRequest({
          variables: {
            connectionId: parseInt(data.userProfile.connection.id, 10),
          },
        });
        console.log(response);
        // Handle the response and update the UI or perform any other necessary actions
      } catch (error) {
        console.error("Error accepting connection:", error);
      }
    }
  };

  const handleRejectConnection = async () => {
    // Check if the user profile includes a connection ID
    if (
      data &&
      data.userProfile &&
      data.userProfile.connection &&
      data.userProfile.connection.id
    ) {
      try {
        await deleteConnectionRequest({
          variables: {
            connectionId: parseInt(data.userProfile.connection.id, 10),
          },
        });
        setConnectionDeleted(true); // Set the connection deletion request as sent
      } catch (error) {
        console.error("Error rejecting connection:", error);
      }
    }
  };

  // Function to handle slider click for a specific image
  const handleSliderClick = (event, postIndex, fileIndex) => {
    const boundingRect = event.target.getBoundingClientRect();
    const clickedX = event.clientX - boundingRect.left;
    const sliderWidth = boundingRect.width;
    const newPosition = clickedX / sliderWidth; // Calculate the new position as a percentage (0 to 1)

    // Calculate the score based on the newPosition and a scale from 0 to 5
    const newScore = Math.round(newPosition * 5);

    // Create a copy of the sliderPositions array
    const newSliderPositions = [...sliderPositions];
    // Update the position for the clicked image
    newSliderPositions[postIndex][fileIndex] = newPosition;
    // Update the state with the new positions
    setSliderPositions(newSliderPositions);
    const newSelectedReactions = [...selectedReactions];
    newSelectedReactions[postIndex] = selectedReaction;
    setSelectedReactions(newSelectedReactions);
    // Set the selected reaction emoji when clicking the slider
    setSelectedReactionEmoji(vibeEmojiMapping[selectedReaction] || "😊");
    // Update the selectedVibe or perform any other necessary actions based on the newScore
    setSelectedVibe(newScore);
  };

  if (loadingData) {
    return (
      <>

      </>
    );
  }

  if (loading) {
    return (
      <>
      </>
    );
  }

  if (error) {
    return (
      <div>
        {/* <Nav /> */}

        <div class="flex justify-center items-center h-screen flex-col space-y-8 ">

          <div class="bg-gray-300 p-4 rounded-lg">
            <p class="text-center"> USER NOT FOUND </p>
            <p className="text-sm"> {error.message} </p>

          </div>

          <Link href="/home"> 
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            onclick="window.history.back()"
          >
            Go Back
          </button>
          </Link>

        </div>



      </div>
    );
  }

  const userProfile = data?.userProfile;


  return (
    <div>
      <Nav />
      <div className="grid grid-cols-4 wrapper mt-28">
        <div className="col-span-1 sticky top-28 p-4 left-0 h-screen overflow-y-auto">
          <SideNav />
        </div>
        <div className="col-span-3 w-full">
          <div>
            <div>
              {/* button to fetch user existing data like post, vibes etc; */}

              {/* <button onClick={handleFetchData}>Fetch Data</button> */}
              {userProfile ? (
                <div className="mx-auto bg-gray-50 shadow-lg rounded-xl overflow-hidden mt-8">
                  {/* section for background image */}
                  <img
                    className="w-full ml-4 h-64 object-cover"
                    src={bgImage}
                    alt="background Image"
                  />

                  <div className="mx-auto ml-14 mr-14 bg-gray-50 shadow-lg rounded-xl overflow-hidden mt-8">
                    {/* displaying profile pic of user log in */}
                    <img
                      className="w-48 h-48 object-cover rounded-full p-2 bg-white shadow-2xl"
                      src={userProfile.user.profile.profilePic ? `http://64.227.188.78/media/${userProfile.user.profile.profilePic}` : `${defaultUser}`}
                      alt="Profile Pic"
                    />
                    <div>
                      <h2>Username: {userProfile.user.username}</h2>
                      {/* Handling connection functionality */}
                      {userProfile.connection ? (
                        userProfile.connection.connectionStatus ===
                          "RECEIVED" ? (
                          <div>
                            {userProfile.connection.receiver.username ===
                              currentUser ? (
                              <div>
                                <br />
                                <button
                                  onClick={handleAcceptConnection}
                                  style={{
                                    backgroundColor: "green",
                                    color: "white",
                                  }}
                                >
                                  Accept
                                </button>
                                <br />
                                <button
                                  onClick={handleRejectConnection}
                                  style={{
                                    backgroundColor: "red",
                                    color: "white",
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={handleDeleteConnection}
                                disabled={isConnectionDeleted}
                              >
                                {isConnectionDeleted
                                  ? "Send Connection"
                                  : "Delete Connection"}
                              </button>
                            )}
                          </div>
                        ) : (
                          <p>
                            Connection Status:{" "}
                            {userProfile.connection.connectionStatus}
                          </p>
                        )
                      ) : (
                        <button
                          onClick={handleSendConnection}
                          disabled={isConnectionSent}
                        >
                          {isConnectionSent
                            ? "Delete Connection"
                            : "Send Connection"}
                        </button>
                      )}
                    </div>
                    {/* connection functionality end */}

                    {/*post,and other things ----start*/}
                    <div className="my-11 ">
                      <div className="flex flex-row mb-2 justify-center w-96 gap-10 text-gray-500">
                        <p className="text-xl italic cursor-pointer">
                          Vibers: 5.2k
                        </p>
                        <p className="text-xl italic cursor-pointer">
                          Posts: 25
                        </p>
                      </div>
                      <div className="flex flex-col items-center rounded-full shadow-inner justify-center gap-4 bg-gray-100 w-96 h-36">
                        <div className="flex flex-row justify-between space-x-9 shadow-inner bg-white rounded-full p-1">
                          <p className="flex items-center justify-center font-bold text-gray-600 bg-white h-16 w-20 rounded-full shadow-xl cursor-pointer">
                            15
                          </p>
                          <p
                            className="flex items
                            -center justify-center font-bold text-gray-600 bg-white h-16 w-20 rounded-full shadow-xl cursor-pointer"
                          >
                            2.3k
                          </p>
                          <p className="flex items-center justify-center font-bold text-gray-600 bg-white h-16 w-20 rounded-full shadow-xl cursor-pointer">
                            2.3k
                          </p>
                        </div>
                        <div className="flex flex-row justify-between space-x-7">
                          <p className="text-2xl text-gray-600 cursor-pointer">
                            Inner
                          </p>
                          <p className="text-2xl text-gray-600 cursor-pointer">
                            Outer
                          </p>
                          <p className="text-2xl text-gray-600 cursor-pointer">
                            Universe
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row overflow-scroll gap-7 h-40 mt-11">
                      <div className="flex flex-col items-center justify-center border-2 border-white bg-gray-100 overflow-hidden w-52 h-32 rounded-3xl shadow-xl cursor-pointer">
                        <IoIosPeople className="text-5xl text-gray-600" />
                        <p className="text-xl mt-1 font-medium text-gray-400">
                          People
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center border-2 border-white bg-gray-100 w-52 h-32 rounded-3xl shadow-xl cursor-pointer">
                        <MdOutlineTopic className="text-5xl text-gray-600" />
                        <p className="text-xl mt-1 font-medium text-gray-400">
                          Content
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center border-2 border-white bg-gray-100 w-52 h-32 rounded-3xl shadow-xl cursor-pointer">
                        <MdOutlineHolidayVillage className="text-5xl text-gray-600" />
                        <p className="text-xl mt-1 font-medium text-gray-400">
                          Community
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center border-2 border-white bg-gray-100 w-52 h-32 rounded-3xl shadow-xl cursor-pointer">
                        <AiOutlineShoppingCart className="text-5xl text-gray-600" />
                        <p className="text-xl mt-1 font-medium text-gray-400">
                          Shop
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center border-2 border-white bg-gray-100 w-52 h-32 rounded-3xl shadow-xl cursor-pointer">
                        <GiBlackBook className="text-5xl text-gray-600" />
                        <p className="text-xl mt-1 font-medium text-gray-400">
                          Diary
                        </p>
                      </div>
                    </div>
                    {/*post,and other things ----end*/}

                    {/* Display user's posts */}
                    <div className="mt-18">
                      <h3 className="text-center text-5xl font-bold mb-4">
                        User's Posts
                      </h3>
                      {userProfile.user.postSet.map((post, index) => (
                        <div
                          key={index}
                          className="border-2 rounded-md p-4 my-4"
                        >
                          <h4 className="text-center text-lg font-semibold mb-2">
                            {post.postTitle}
                          </h4>
                          <p>{post.postText}</p>

                          {/* Loop through images in the current post */}
                          {post.postfilesSet.map((file, fileIndex) => (
                            <div key={fileIndex} className="text-center">
                              <img
                                src={`http://64.227.188.78/media/${file.file}`}
                                alt={`Post Image ${fileIndex}`}
                                className="mx-auto max-w-2/3 border-2 rounded-md"
                              />

                              {/* Engagement section */}
                              <div className="m-4 mt-5 flex flex-row justify-between">
                                <div className="flex flex-row gap-7">
                                  <div className="bg-gray-200 text-gray-700 text-2xl font-semibold h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-xl cursor-pointer border border-gray-100">
                                    3.2
                                  </div>
                                  <div className="bg-gray-200 h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-xl cursor-pointer border border-gray-100">
                                    <FaEye className="h-7 w-7 text-gray-600" />
                                    <p className="text-sm text-gray-500">125</p>
                                  </div>
                                  <div className="bg-gray-200 h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-xl cursor-pointer border border-gray-100">
                                    <FaCommentAlt className="h-7 w-7 text-gray-600" />
                                    <p className="text-sm text-gray-500">125</p>
                                  </div>
                                </div>
                                <div className="bg-gray-200 h-16 w-16 rounded-full flex flex-col items-center justify-center shadow-xl cursor-pointer border border-gray-100">
                                  <FaShare className="h-7 w-7 text-gray-600" />
                                  <p className="text-sm text-gray-500">26</p>
                                </div>
                              </div>
                              {/* vibe count */}
                              <p className="text-gray-600 font-semibold text-xl ml-4">
                                246 Vibe
                              </p>
                              {/* Engagement section end*/}
                              {/* Slider */}
                              {/* Slider */}
                              <div className="w-10/12 flex items-center justify-center my-7 mb-9 gap-10 mx-auto">
                                <div className="w-9/12 relative">
                                  <div
                                    className="slider bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 h-1 cursor-pointer rounded-full"
                                    onClick={(event) =>
                                      handleSliderClick(event, index, fileIndex)
                                    }
                                  >
                                    <div
                                      className="slider-thumb absolute text-5xl rounded-full top-0 transform -translate-y-1/2 -translate-x-1/2 transition flex flex-row"
                                      style={{
                                        left: `${(sliderPositions[index]?.[
                                          fileIndex
                                        ] || 0) * 100
                                          }%`, // Calculate the current value based on percentage (0 to 5)
                                      }}
                                    >
                                      {selectedReactionEmoji || "😊"}
                                    </div>
                                  </div>
                                  <div className="w-full mt-3 text-center">
                                    <p className="text-2xl font-semibold text-gray-600 tracking-widest">
                                      {parseFloat(
                                        (sliderPositions[index]?.[fileIndex] ||
                                          0) * 5
                                      ).toFixed(1)}{" "}
                                      {/* Display the current score with one decimal place */}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Slider end */}
                              {/* Reactions */}

                              <div className="flex flex-row gap-4 items-center justify-items-center mx-4">
                                <div>
                                  <FaPlus className="h-7 w-7 text-gray-700 cursor-pointer" />
                                </div>
                                {vibesData?.vibeList?.map((vibe) => (
                                  <div
                                    key={vibe.id}
                                    className={`flex flex-row gap-3 items-center justify-center  py-2 px-4 bg-gray-200 shadow-xl rounded-full cursor-pointer border-2 border-gray-300 ${selectedReaction === vibe.name
                                      ? "selected-reaction"
                                      : ""
                                      }`}
                                    style={{ fontSize: "1.2rem" }} // Increase the font size here
                                    onClick={() => {
                                      setSelectedReaction(vibe.name);
                                      setSelectedReactionEmoji(
                                        vibeEmojiMapping[vibe.name]
                                      );
                                    }}
                                  >
                                    <p className="text-xl text-gray-600 font-medium">
                                      {vibe.name} {vibeEmojiMapping[vibe.name]}
                                    </p>
                                  </div>
                                ))}
                              </div>

                              {/* Add more reaction icons here */}
                              <br />
                              <br />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
