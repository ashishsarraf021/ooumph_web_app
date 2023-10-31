// Import necessary dependencies
import useAuthStore from '../../../stores/userAuth';
import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import s from "./recommendedPost.module.css";
import { FaEye, FaCommentAlt, FaShare, FaPlus, FaRegUser } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { BiDotsVerticalRounded } from "react-icons/bi";
import TimeStamp from "../timeStamp/timeStamp";

// Import the mutation and query
import { CREATE_REACTION_MUTATION } from "@/graphql/mutations";
import { RECOMMENDED_POSTS_QUERY } from "@/graphql/querues";

// Default user image
const defaultUser = "/assets/defaultuser.png";

function RecommendedPosts() {
  // Fetch data using the RECOMMENDED_POSTS_QUERY
  const { authToken } = useAuthStore();
  const { loading, error, data } = useQuery(RECOMMENDED_POSTS_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  });

  const [sliderPosition, setSliderPosition] = useState(0);

  // Use the CREATE_REACTION_MUTATION
  const [createReaction] = useMutation(CREATE_REACTION_MUTATION);

  const handleSliderClick = async (event) => {
    const boundingRect = event.target.getBoundingClientRect();
    const clickedX = event.clientX - boundingRect.left;
    const sliderWidth = boundingRect.width;
    const newPosition = (clickedX / sliderWidth) * 100;
    setSliderPosition(newPosition);

    // Use the mutation here
    try {
      const storyId = post.id; // Use the appropriate story ID
      const reaction = "😊"; // Use the appropriate reaction

      const { data } = await createReaction({
        variables: {
          reaction,
          storyId,
          vibe: newPosition,
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

  // Handle loading state
  if (loading) return <p>Loading...</p>;

  // Handle error state
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen m-2 mt-4">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-8">
          {data.recommendedposts.map((post) => (
            <div
              key={post.id}
              className={`border border-gray-200 bg-gray-200 p-3 pt-4 pb-10 shadow-xl rounded-3xl space-y-4 ${s.card}`}
            >
              {/* Owner's information */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col gap-1">
                    <p className="mx-auto text-gray-600 text-xl font-bold">
                      3.2
                    </p>
                    <div className="flex flex-row items-center text-4xl text-gray-400">
                      <img
                        src={
                          post.owner.profilePic
                            ? `http://64.227.188.78/media/${post.owner.profilePic}`
                            : `${defaultUser}`
                        }
                        alt={`Profile Pic of ${post.owner.username}`}
                        className="w-16 h-16 rounded-full p-1 bg-white shadow-xl border "
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div>
                    {post.owner.firstName ? (
                      <p className="font-semibold text-2xl my-1">
                        {post.owner.firstName}
                        {post.owner.lastName}
                      </p>
                    ) : (
                      <p className="font-semibold text-2xl my-1">Name</p>
                    )}
                    <TimeStamp timestamp={post.timestamp} />
                  </div>
                </div>
                <div className="flex flex-row">
                  <FiPlus className="h-11 w-11 text-xl font-thin border border-white bg-white shadow-xl rounded-full text-gray-800 mr-7 my-auto cursor-pointer" />
                  <BiDotsVerticalRounded className="text-4xl text-gray-800 mr-4 cursor-pointer" />
                </div>
              </div>
              <hr />
              <h3 className="text-2xl mt-2 mb-2 font-semibold ">
                {post.postTitle}
              </h3>
              <p className="text-gray-700 mb-4 text-2xl">{post.postText}</p>
              <p className="text-gray-500 text-xl"> {post.postType}</p>
              {post.postfilesSet.length > 0 && (
                <div className="mt-4">
                  <div className={s.imgScroller}>
                    <Carousel
                      showThumbs={false}
                      showIndicators={true}
                      showArrows={false}
                      infiniteLoop={true}
                    >
                      {post.postfilesSet.map((files, index) => (
                        <div key={index} className={s.imgContainer}>
                          <img
                            src={`http://64.227.188.78/media/${files.file}`}
                            alt={`Image ${index + 1}`}
                            className={s.postImg}
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </Carousel>
                  </div>
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
                  <p className="text-gray-600 font-semibold text-xl ml-4">
                    246 Vibe
                  </p>
                  <div className="w-10/12 flex items-center justify-center my-7 mb-9 gap-10 mx-auto">
                    <p className="text-2xl font-semibold text-gray-600 tracking-widest">
                      Great
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
                          😊
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 items-center justify-items-center mx-4 ">
                    <div>
                      <FaPlus className="h-7 w-7 text-gray-700 cursor-pointer" />
                    </div>
                    <div className="flex flex-row gap-3 items-center justify-items-center py-2 px-3 pr-5 bg-gray-200 shadow-xl rounded-full cursor-pointer border border-gray-100">
                      <FaRegUser className="h-10 w-10 p-1 border-2 border-gray-300 rounded-full shadow-xl" />
                      <p className="text-2xl text-gray-600 font-medium">
                        Beautiful
                      </p>
                    </div>
                    <div className="flex flex-row gap-3 items-center justify-items-center py-2 px-3 pr-5 bg-gray-200 shadow-xl rounded-full cursor-pointer border border-gray-100">
                      <FaRegUser className="h-10 w-10 p-1 border-2 border-gray-300 rounded-full shadow-xl" />
                      <p className="text-2xl text-gray-600 font-medium">Wow</p>
                    </div>
                    <div className="flex flex-row gap-3 items-center justify-items-center py-2 px-3 pr-5 bg-gray-200 shadow-xl rounded-full cursor-pointer border border-gray-100">
                      <FaRegUser className="h-10 w-10 p-1 border-2 border-gray-300 rounded-full shadow-xl" />
                      <p className="text-2xl text-gray-600 font-medium">
                        Lovely
                      </p>
                    </div>
                    <div className="flex flex-row gap-3 items-center justify-items-center py-2 px-3 pr-5 bg-gray-200 shadow-xl rounded-full cursor-pointer border border-gray-100">
                      <FaRegUser className="h-10 w-10 p-1 border-2 border-gray-300 rounded-full shadow-xl" />
                      <p className="text-2xl text-gray-600 font-medium">
                        Great
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecommendedPosts;
