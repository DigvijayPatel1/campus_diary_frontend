import api from "../../utils/axios.js"

// Tweet Api
export const getTweetCommentsApi = (tweetId) => {
    return api.get(`/comments/tweet/${tweetId}`)
}

export const addTweetCommentApi = (tweetId, content) => {
    return api.post(`/comments/tweet/${tweetId}`, { content })
}

export const updateTweetCommentApi = (tweetId, commentId, content) => {
    return api.patch(`/comments/tweet/${tweetId}/comment/${commentId}`, { content })
}

export const deleteTweetCommentApi = (tweetId, commentId) => {
    return api.delete(`/comments/tweet/${tweetId}/comment/${commentId}`)
}

export const replyToTweetApi = (tweetId, commentId, content) => {
    return api.post(`/comments/tweets/${tweetId}/comments/${commentId}/reply`, { content })
}

// interview Api
export const getInterviewCommentsApi = (interviewId) => {
    return api.get(`/comments/interview/${interviewId}`)
}

export const addInterviewCommentApi = (interviewId, content) => {
    return api.post(`/comments/interview/${interviewId}`, { content })
}

export const updateInterviewCommentApi = (interviewId, commentId, content) => {
    return api.patch(`/comments/interview/${interviewId}/comment/${commentId}`, { content })
}

export const deleteInterviewCommentApi = (interviewId, commentId) => {
    return api.delete(`/comments/interview/${interviewId}/comment/${commentId}`)
}

export const replyToInterviewApi = (interviewId, commentId, content) => {
    return api.post(`/comments/interviews/${interviewId}/comments/${commentId}/reply`, { content })
}

// generic
export const getCommentRepliesApi = (commentId) => {
    return api.get(`/comments/${commentId}/replies`)
}