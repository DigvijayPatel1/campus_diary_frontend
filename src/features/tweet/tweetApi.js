import api from "../../utils/axios.js"

// Create
export const createTweetApi = (content) => {
    return api.post("/tweets", { content })
}

// Get All Tweets
export const getAllTweetsApi = () => {
    return api.get("/tweets")
}

// Get User Tweets
export const getUserTweetsApi = (userId) => {
    return api.get(`/tweets/user/${userId}`)
}

// Update
export const updateTweetApi = ({ tweetId, content }) => {
    return api.patch(`/tweets/${tweetId}`, { content })
}

// Delete
export const deleteTweetApi = (tweetId) => {
    return api.delete(`/tweets/${tweetId}`)
}