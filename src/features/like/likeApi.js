import api from "../../utils/axios.js";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken"); 
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    withCredentials: true, 
  };
};

// Toggle Tweet Like
export const toggleTweetLikeApi = (tweetId) => {
    return api.post(`/likes/toggle/tweet/${tweetId}`, {}, getAuthHeaders)
}

// Toggle Interview Like
export const toggleInterviewLikeApi = (interviewId) => {
    return api.post(`/likes/toggle/interview/${interviewId}`, {}, getAuthHeaders)
}