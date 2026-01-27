import api from "../../utils/axios.js";

// Toggle Tweet Like
export const toggleTweetLikeApi = (tweetId) => {
    return api.post(`/likes/toggle/tweet/${tweetId}`)
}

// Toggle Interview Like
export const toggleInterviewLikeApi = (interviewId) => {
    return api.post(`/likes/toggle/interview/${interviewId}`)
}