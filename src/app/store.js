import {configureStore} from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import tweetReducer from "../features/tweet/tweetSlice"
import commentReducer from "../features/comment/commentSlice"
import interviewReducer from "../features/interview/interviewSlice"
import developerReducer from "../features/developer/developerSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        tweets: tweetReducer,
        comments: commentReducer,
        interviews: interviewReducer,
        developers: developerReducer
    }
})

export default store