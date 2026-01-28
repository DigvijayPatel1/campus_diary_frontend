import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/axios.js"
import {
    getTweetCommentsApi,
    getInterviewCommentsApi,
    addTweetCommentApi,
    addInterviewCommentApi,
    updateInterviewCommentApi,
    updateTweetCommentApi,
    deleteInterviewCommentApi,
    deleteTweetCommentApi,
    replyToTweetApi,
    replyToInterviewApi
} from "./commentApi.js"

// get Comments
export const getComments = createAsyncThunk(
    "comments/get",
    async ({ id, type}, { rejectWithValue }) => {
        try {
            const response = type === "tweet"
                ? await getTweetCommentsApi(id)
                : await getInterviewCommentsApi(id)
            const data = response.data.data
            // Handle both formats: array (tweets) and object with comments property (interviews)
            return Array.isArray(data) ? data : (data.comments || [])
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to load comments"
            )
        }
    }
)

// add Comments 
export const addComment = createAsyncThunk(
    "comments/add",
    async ({ id, content, type, parentCommentId }, { rejectWithValue }) => {
        try {
            let response;
            if (type === "tweet") {
                response = parentCommentId 
                    ? await replyToTweetApi(id, parentCommentId, content)
                    : await addTweetCommentApi(id, content);
            } else {
                response = parentCommentId 
                    ? await replyToInterviewApi(id, parentCommentId, content)
                    : await addInterviewCommentApi(id, content);
            }
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add comment"
            )
        }
    }
)

// update Comments
export const updateComment = createAsyncThunk(
    "comments/update",
    async ({ id, commentId, content, type }, { rejectWithValue }) => {
        try {
            const response = type === "tweet"
                ? await updateTweetCommentApi(id, commentId, content)
                : await updateInterviewCommentApi(id, commentId, content);
            return response.data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update comment"
            )
        }
    }
)

// delete Comment
export const deleteComment = createAsyncThunk(
    "comments/delete",
    async ({ id, commentId, type }, { rejectWithValue }) => {
        try {
            if (type === "tweet") {
                await deleteTweetCommentApi(id, commentId)
            } else {
                await deleteInterviewCommentApi(id, commentId)
            }
            return commentId
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete comment"
            )
        }
    }
)

// reply to tweet comment
export const replyToTweet = createAsyncThunk(
    "comments/replyToTweet",
    async ({ tweetId, commentId, content }, { rejectWithValue }) => {
        try {
            const response = await replyToTweetApi(tweetId, commentId, content)
            return response.data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add reply"
            )
        }
    }
)

// reply to interview comment
export const replyToInterview = createAsyncThunk(
    "comments/replyToInterview",
    async ({ interviewId, commentId, content }, { rejectWithValue }) => {
        try {
            const response = await replyToInterviewApi(interviewId, commentId, content)
            return response.data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add reply"
            )
        }
    }
)

const initialState = {
    comments: [], 
    loading: false,
    error: null
}

const commentSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        clearCommentError: (state) => {
            state.error = null;
        },
        clearComments: (state) => {
            state.comments = [];
        }
    },

    extraReducers: (builder) => {
        builder

        // get comments
        .addCase(getComments.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getComments.fulfilled, (state, action) => {
            state.loading = false;
            state.comments = action.payload;
        })
        .addCase(getComments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // add new comments
        .addCase(addComment.fulfilled, (state, action) => {
            // add new comment to top of the list
            if (!Array.isArray(state.comments)) {
                state.comments = [];
            }
            state.comments.unshift(action.payload);
        })

        // update the comment
        .addCase(updateComment.fulfilled, (state, action) => {
            if (!Array.isArray(state.comments)) {
                state.comments = [];
            }
            const index = state.comments.findIndex(c => c._id === action.payload._id);
            if (index !== -1) {
                state.comments[index] = action.payload;
            }
        })

        // delete comments
        .addCase(deleteComment.fulfilled, (state, action) => {
            if (!Array.isArray(state.comments)) {
                state.comments = [];
            }
            // Filter out the deleted comment and its nested replies if it's a main comment
            const deletedId = action.payload;
            const deletedComment = state.comments.find(c => c._id === deletedId);
            state.comments = state.comments.filter(c => {
                // Remove the comment itself
                if (c._id === deletedId) return false;
                // If the deleted comment is a main comment, also remove its replies
                if (deletedComment && !deletedComment.parentComment && c.parentComment === deletedId) return false;
                return true;
            });
        })
        .addCase(deleteComment.rejected, (state, action) => {
            state.error = action.payload;
        })

        // reply to tweet
        .addCase(replyToTweet.fulfilled, (state, action) => {
            // Add reply to the comments list
            if (!Array.isArray(state.comments)) {
                state.comments = [];
            }
            state.comments.unshift(action.payload);
        })
        .addCase(replyToTweet.rejected, (state, action) => {
            state.error = action.payload;
        })

        // reply to interview
        .addCase(replyToInterview.fulfilled, (state, action) => {
            // Add reply to the comments list
            if (!Array.isArray(state.comments)) {
                state.comments = [];
            }
            state.comments.unshift(action.payload);
        })
        .addCase(replyToInterview.rejected, (state, action) => {
            state.error = action.payload;
        });
    }
})

export const { clearCommentError, clearComments } = commentSlice.actions
export default commentSlice.reducer