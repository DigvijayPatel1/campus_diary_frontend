import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { 
    createTweetApi,
    getAllTweetsApi,
    getUserTweetsApi,
    updateTweetApi,
    deleteTweetApi
} from "./tweetApi.js"
import { toggleTweetLikeApi } from "../like/likeApi.js"

// ------ Aysnc Thunks -------

export const createTweet = createAsyncThunk(
    "tweets/create",
    async (content, { rejectWithValue }) => {
        try {
            const { data } = await createTweetApi(content)
            return data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create tweet"
            )
        }
    }
)

export const getAllTweets = createAsyncThunk(
    "tweets/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await getAllTweetsApi()
            return data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch tweets"
            )
        }
    }
)

export const getUserTweets = createAsyncThunk(
    "tweets/getUserTweets",
    async (userId, { rejectWithValue }) => {
        try {
            const { data } = await getUserTweetsApi(userId)
            return data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch tweets"
            )
        }
    }
)

export const updateTweets = createAsyncThunk(
    "tweets/updateTweets",
    async ({ tweetId, content }, { rejectWithValue }) => {
        try {
            const { data } = await updateTweetApi({tweetId, content})
            return data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update tweet"
            )
        }
    }
)

export const deleteTweet = createAsyncThunk(
    "tweets/delete",
    async (tweetId, { rejectWithValue }) => {
        try {
            await deleteTweetApi(tweetId)
            return tweetId
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete tweet")
        }
    }
);

// toggle tweet like
export const toggleTweetLike = createAsyncThunk(
  "tweets/toggleLike",
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await toggleTweetLikeApi(tweetId)
      return { tweetId, isLiked: response.data.data.liked };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to like tweet");
    }
  }
);

const initialState = {
    tweets: [],
    loading: false,
    error: null
}

const tweetSlice = createSlice({
    name: "tweets",
    initialState,
    reducers: {
        clearTweetError: (state) => {
            state.error = null;
        },
        optimisticToggleLike: (state, action) => {
            const { tweetId } = action.payload;
            const tweet = state.tweets.find((t) => t._id === tweetId);
            
            if (tweet) {
                // Toggle the boolean instantly
                tweet.isLiked = !tweet.isLiked;
                // Adjust the count instantly
                tweet.likesCount += tweet.isLiked ? 1 : -1;
            }
        },
    },

    extraReducers: (builder) => {
        builder

        // create tweet
        .addCase(createTweet.pending, (state) => {
            state.loading = true
        })
        .addCase(createTweet.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.tweets.unshift(action.payload)
        })
        .addCase(createTweet.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        // get all tweets
        .addCase(getAllTweets.pending, (state) => {
            state.loading = true
        })
        .addCase(getAllTweets.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            state.tweets = action.payload
        })
        .addCase(getAllTweets.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        // get user tweets
        .addCase(getUserTweets.pending, (state) => {
            state.loading = true
        })
        .addCase(getUserTweets.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null
            state.tweets = action.payload // replace the tweets with the users tweet
        })
        .addCase(getUserTweets.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload
        })

        // update the tweet
        .addCase(updateTweets.fulfilled, (state, action) => {
            state.loading = false
            const index = state.tweets.findIndex((t) => t._id === action.payload._id)

            if (index != -1){
                state.tweets[index] = action.payload
            }
        })

        // delete the tweet
        .addCase(deleteTweet.fulfilled, (state, action) => {
            state.loading = false
            state.tweets = state.tweets.filter((tweet) => tweet._id !== action.payload)
        })

        // toggle the tweet 
        .addCase(toggleTweetLike.fulfilled, (state, action) => {
            const { tweetId, isLiked } = action.payload;
            const tweet = state.tweets.find((t) => t._id === tweetId);

            if (tweet) {
                tweet.isLiked = isLiked;
            }
        })
        .addCase(toggleTweetLike.rejected, (state, action) => {
            const tweetId = action.meta.arg;
            const tweet = state.tweets.find((t) => t._id === tweetId);
            
            if (tweet) {
            tweet.isLiked = !tweet.isLiked;
            tweet.likesCount += tweet.isLiked ? 1 : -1;
            }
            console.error("Like failed:", action.payload);
        });

    }
})

export const { clearTweetError, optimisticToggleLike } = tweetSlice.actions
export default tweetSlice.reducer;