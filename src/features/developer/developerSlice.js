import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  createDeveloperApi,
  getAllDevelopersApi,
  getDeveloperByIdApi,
  updateDeveloperApi,
  deleteDeveloperApi
} from "./developerApi.js"

export const createDeveloper = createAsyncThunk(
  "developers/create",
  async(data, { rejectWithValue })=>{
    try {
      const response = await createDeveloperApi(data);
      return response.data?.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create developer"
      )
    }
  }
)

export const getAllDevelopers = createAsyncThunk(
  "developers/getAll",
  async(_,{ rejectWithValue })=>{
    try {
      const { data } = await getAllDevelopersApi();
      return data?.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch developers"
      )
    }
  }
)

export const getDeveloperById = createAsyncThunk(
  "developers/getById",
  async(id, { rejectWithValue })=>{
    try {
      const { data } = await getDeveloperByIdApi(id);
      return data?.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch developer"
      )
    }
  }
)

export const updateDeveloper = createAsyncThunk(
  "developers/update",
  async({ id, data }, { rejectWithValue })=>{
    try {
      const response = await updateDeveloperApi( id, data );
      return response.data?.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update developer"
      )
    }
  }
)

export const deleteDeveloper = createAsyncThunk(
  "developers/delete",
  async( id, { rejectWithValue })=>{
    try {
      await deleteDeveloperApi(id);
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete developer"
      )
    }
  }
)

const initialState = {
  developers: [],
  currentDeveloper: null,
  loading: false,
  error: null,
}

const developersSlice = createSlice({
  name: "developers",
  initialState,

  reducers: {
    clearDeveloperError: (state)=>{
      state.error = null
    },
    clearCurrentDeveloper: (state)=>{
      state.currentDeveloper = null
    },
  },

  extraReducers: (builder) => {
    builder

    // Create
    .addCase(createDeveloper.pending, (state)=>{
      state.loading = true
      state.error = null
    })
    .addCase(createDeveloper.fulfilled, (state, action)=>{
      state.loading = false
      state.error = null

      // Add new developer to top of list
      state.developers.unshift(action.payload)
    })

    .addCase(createDeveloper.rejected, (state, action) =>{
      state.loading = false
      state.error = action.payload
    })
    
    // Get All
    .addCase(getAllDevelopers.pending, (state) => {
      state.loading = true
      state.error = null
    })
    .addCase(getAllDevelopers.fulfilled, (state, action) => {
      state.loading = false
      state.error = null
      state.developers = action.payload
    })
    .addCase(getAllDevelopers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // GET BY ID
    .addCase(getDeveloperById.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.currentDeveloper = null;
    })
    .addCase(getDeveloperById.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.currentDeveloper = action.payload;
    })
    .addCase(getDeveloperById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // UPDATE
    .addCase(updateDeveloper.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateDeveloper.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;

      // Update currentDeveloper if it matches
      if (state.currentDeveloper?._id === action.payload._id) {
        state.currentDeveloper = action.payload;
      }

      // Update in developers list
      const index = state.developers.findIndex(
        (dev) => dev._id === action.payload._id
      );
      if (index !== -1) {
        state.developers[index] = action.payload;
      }
    })
    .addCase(updateDeveloper.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // DELETE
    .addCase(deleteDeveloper.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteDeveloper.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;

      // Remove from list
      state.developers = state.developers.filter(
        (dev) => dev._id !== action.payload
      );

      // Clear currentDeveloper if deleted one was open
      if (state.currentDeveloper?._id === action.payload) {
        state.currentDeveloper = null;
      }
    })
    .addCase(deleteDeveloper.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

  },
})

export const { clearDeveloperError, clearCurrentDeveloper } =
  developersSlice.actions;

export default developersSlice.reducer;







