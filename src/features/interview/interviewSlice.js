import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
    createInterviewApi,
    getAllInterviewsApi,
    getInterviewByIdApi,
    updateInterviewApi,
    deleteInterviewApi
} from "./interviewApi.js"
import { toggleInterviewLikeApi } from "../like/likeApi.js"

export const createInterview = createAsyncThunk(
    "interviews/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await createInterviewApi(data);
            return response.data?.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create interview"
            )
        }
    }
)

export const getAllInterviews = createAsyncThunk(
    "interviews/getAll",
    async (params, { rejectWithValue }) => {
        try {
            const { data } = await getAllInterviewsApi(params)
            return data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch interviews"
            )
        }
    }
)

export const getInterviewById = createAsyncThunk(
    "interviews/getById",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await getInterviewByIdApi(id)
            return data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch interview"
            )
        }
    }
)

export const updateInterview = createAsyncThunk(
    "interviews/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await updateInterviewApi({ id, data })
            return response.data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Update failed"
            )
        }
    }
)

export const deleteInterview = createAsyncThunk(
    "interviews/delete",
    async (id, { rejectWithValue }) => {
        try {
            await deleteInterviewApi(id)
            return id
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Delete failed"
            )
        }
    }
)


export const toggleInterviewLike = createAsyncThunk(
  "interviews/toggleLike",
  async (interviewId, { rejectWithValue }) => {
    try {
      const { data } = await toggleInterviewLikeApi(interviewId);
      return { interviewId, isLiked: data.data.liked };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
    interviews: [],
    currentInterview: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0
    },
    loading: false,
    error: null
}

const interviewSlice = createSlice({
    name: "interviews",
    initialState,
    reducers: {
        optimisticToggleInterviewLike: (state, action) => {
            const { interviewId } = action.payload;

            const toggleLike = (obj) => {
                obj.likesCount = obj.likesCount ?? 0;
                if (obj.isLiked) {
                obj.isLiked = false;
                obj.likesCount = Math.max(0, obj.likesCount - 1);
                } else {
                obj.isLiked = true;
                obj.likesCount += 1;
                }
            };

            const listItem = state.interviews.find((i) => i._id === interviewId);
            if (listItem) {
                toggleLike(listItem);
            }

            if (
                state.currentInterview?._id === interviewId &&
                state.currentInterview !== listItem 
            ) {
                toggleLike(state.currentInterview);
            }
        },
    },

    extraReducers: (builder) => {
        builder

        // create interview 
        .addCase(createInterview.pending, (state) => {
            state.loading = true
        })
        .addCase(createInterview.fulfilled, (state, action) => {
            state.loading = false
            state.error = null
            // we do not add here in the list because of the complex pagination
        })
        .addCase(createInterview.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // get all interview
        .addCase(getAllInterviews.pending, (state) => {
            state.loading = true
        })
        .addCase(getAllInterviews.fulfilled, (state, action) => {
            state.loading = false
            state.interviews = action.payload.interviews
            state.pagination = {
                page: action.payload.page,
                limit: action.payload.limit,
                total: action.payload.total
            }
        })
        .addCase(getAllInterviews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // get interview by Id
        .addCase(getInterviewById.pending, (state) => {
            state.loading = true
            state.currentInterview = null
        })
        .addCase(getInterviewById.fulfilled, (state, action) => {
            state.loading = false
            state.currentInterview = action.payload
        })
        .addCase(getInterviewById.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        // update the Interview
        .addCase(updateInterview.fulfilled, (state, action) => {
            state.loading = false
            state.currentInterview = action.payload
            
            const index = state.interviews.findIndex((t) => t._id === action.payload._id)
            if (index !== -1){
                state.interviews[index] = action.payload
            }
        })

        // delete the interview
        .addCase(deleteInterview.fulfilled, (state, action) => {
            state.loading = false;
            state.interviews = state.interviews.filter(
                (interview) => interview._id !== action.payload
            );

            if (state.currentInterview?._id === action.payload) {
                state.currentInterview = null;
            }
        })

        // toggle like 
        .addCase(toggleInterviewLike.fulfilled, (state, action) => {
            const { interviewId, isLiked } = action.payload;

            // Helper to force sync server state
            const syncState = (obj) => {
            if (obj.isLiked !== isLiked) {
                obj.isLiked = isLiked;
                obj.likesCount += isLiked ? 1 : -1;
            }
            };

            const listItem = state.interviews.find((i) => i._id === interviewId);
            if (listItem) syncState(listItem);

            if (
            state.currentInterview?._id === interviewId &&
            state.currentInterview !== listItem
            ) {
            syncState(state.currentInterview);
            }
        })
        .addCase(toggleInterviewLike.rejected, (state, action) => {
            const interviewId = action.meta.arg;

            // Helper to rollback (Revert the toggle)
            const rollback = (obj) => {
            if (obj.isLiked) {
                obj.isLiked = false;
                obj.likesCount = Math.max(0, obj.likesCount - 1);
            } else {
                obj.isLiked = true;
                obj.likesCount += 1;
            }
            };

            const listItem = state.interviews.find((i) => i._id === interviewId);
            if (listItem) rollback(listItem);

            if (
            state.currentInterview?._id === interviewId &&
            state.currentInterview !== listItem
            ) {
            rollback(state.currentInterview);
            }
        });
    }
})

export const { clearInterviewError, clearCurrentInterview, optimisticToggleInterviewLike } = interviewSlice.actions
export default interviewSlice.reducer