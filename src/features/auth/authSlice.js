import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
    registerUserApi,
    loginUserApi,
    logoutUserApi,
    currentUserApi,
    changePasswordApi,
    refreshTokenApi,
    updateAccountApi,
    updateAvatarApi,
    updateSocialLinksApi,
    savePostApi,
    getUserProfileApi,
    removeSocialLinksApi,
    getSavedPostsApi,
    getMyPostsApi,
    verifyEmailApi,
    forgotPasswordApi,
    resetPasswordApi,
} from "./authApi.js"

// ------ Aysnc Thunks -------
// ------ Auth Basic -------

// register
export const register = createAsyncThunk(
    "auth/register",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await registerUserApi(payload)
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Registration failed")
        }
    }
)

// login 
export const login = createAsyncThunk(
    "auth/login",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await loginUserApi(payload)
            return data.data
        } catch (error) {
        return rejectWithValue(
            error?.response?.data?.message ||
            (typeof error?.response?.data === "string" ? error.response.data : null) ||
            "Login failed"
        );
        }

    }
)

// logout
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const {data} = await logoutUserApi()
            return true
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Logout failed"
            )
        }
    }
)

// get current user
export const getCurrentUser = createAsyncThunk(
    "auth/currentUser",
    async(_, { rejectWithValue }) => {
        try {
            const {data} = await currentUserApi()
            return data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Not authenticated"
            )
        }
    }
)

// change password 
export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async(payload, { rejectWithValue }) => {
        try {
            const { data } = await changePasswordApi(payload)
            return true
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Change password failed"
            )
        }
    }
)

// Refresh Token
export const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async(payload, { rejectWithValue }) => {
        try {
            const { data } = await refreshTokenApi()
            return data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Invalid Token"
            )
        }
    }
)

// user update self
// ----- updateAccount -------
export const updateAccount = createAsyncThunk(
    "users/updateAccount",
    async (payload, { rejectWithValue }) => {
        try {
            const {data} = await updateAccountApi(payload)
            return data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Account update failed"
            )
        }
    }
)

// ----- updateAvatar -------
export const updateAvatar = createAsyncThunk(
    "users/updateAvatar",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await updateAvatarApi(payload)
            return data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Avatar update failed"
            )
        }
    }
)

// ------ update socail link ------
export const updateSocialLinks = createAsyncThunk(
    "users/updateLink",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await updateSocialLinksApi(payload)
            return data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Link update failed"
            )
        }
    }
)

export const removeSocialLinks = createAsyncThunk(
    "auth/removeSocialLinks",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await removeSocialLinksApi();
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Link removal failed")
        }
    }
)

export const savePost = createAsyncThunk(
    "auth/savePost", 
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await savePostApi(payload);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Save failed");
        }
    }
)

export const getUserProfile = createAsyncThunk(
    "auth/getUserProfile", 
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await getUserProfileApi(payload);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Profile fetch failed");
        }
    }
)

export const getSavedPosts = createAsyncThunk(
  "auth/getSavedPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getSavedPostsApi();
      return res.data.data; // saved posts array (full objects)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch saved posts"
      );
    }
  }
);

export const getMyPosts = createAsyncThunk(
  "auth/getMyPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyPostsApi();
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch my posts"
      );
    }
  }
);

// verify email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const res = await verifyEmailApi(token)
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Email verification failed"
      );
    }
  }
);

// request forgot link
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordApi(email)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await resetPasswordApi(token, password)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Reset failed");
    }
  }
);

const initialState = {
    user: null,          
    userProfile: null,  
    isAuthenticated: false,
    savedPostsData: [],
    myPostsData: [],
    loading: false,
    error: null,
    message: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        clearError: (state) => {
            state.error = null
            state.message = null
        }
    },

    extraReducers: (builder) => {
        builder

        // ------ register -------
        .addCase(register.pending, (state) => {
            state.loading = true
            state.message = null
        })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
            state.message = action.payload.message
            state.isAuthenticated = false
            state.error = null
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        // ------ login --------
        .addCase(login.pending, (state) => {
            state.loading = true
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
            state.isAuthenticated = true
            state.error = null
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })
        
        // ------ logout -------
        .addCase(logout.fulfilled, (state, action) => {
            state.loading = false
            state.user = null
            state.isAuthenticated = false
            state.error = null
        })

        // ------ get current user --------
        .addCase(getCurrentUser.pending, (state) => {
            state.loading = true
        })
        .addCase(getCurrentUser.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload
            state.error = null
        })
        .addCase(getCurrentUser.rejected, (state, action) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
        })
        
        // ------ change password -------
        .addCase(changePassword.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(changePassword.fulfilled, (state) => {
            state.loading = false
            state.error = null
        })
        .addCase(changePassword.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
        })

        // ------ refreshToken -------
        .addCase(refreshToken.fulfilled, (state) => {
            state.isAuthenticated = true;
        })
        .addCase(refreshToken.rejected, (state) => {
            state.isAuthenticated = false;
            state.user = null;
        })

        // save post
        .addCase(savePost.fulfilled, (state, action) => {
            if (state.user) {
                state.user.savedPosts = action.payload; 
            }
        })
        
        // get user profile
        .addCase(getUserProfile.pending, (state) => {
            state.loading = true;
            state.userProfile = null; 
        })
        .addCase(getUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.userProfile = action.payload; 
        })
        .addCase(getUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        //get saved posts
        .addCase(getSavedPosts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getSavedPosts.fulfilled, (state, action) => {
            state.loading = false;
            state.savedPostsData = action.payload;
        })
        .addCase(getSavedPosts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // get my-posts
        .addCase(getMyPosts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getMyPosts.fulfilled, (state, action) => {
            state.loading = false;
            state.myPostsData = action.payload;
        })
        .addCase(getMyPosts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // verification email
        .addCase(verifyEmail.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        })
        .addCase(verifyEmail.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.message = action.payload.message || "Verification successful";
        })
        .addCase(verifyEmail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Forgot Password Cases
        .addCase(forgotPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        })
        .addCase(forgotPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
        })
        .addCase(forgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Reset Password Cases
        .addCase(resetPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        })
        .addCase(resetPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
        })
        .addCase(resetPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // --- Updates (Account, Avatar, Links) ---
        // We can group these since they all just update 'state.user'
        .addMatcher(
            (action) => [
                updateAccount.pending.type, 
                updateAvatar.pending.type, 
                updateSocialLinks.pending.type
            ].includes(action.type),

            (state) => {
                state.loading = true;
                state.error = null;
            }
        )

        .addMatcher(
            (action) => [
                updateAccount.fulfilled.type, 
                updateAvatar.fulfilled.type, 
                updateSocialLinks.fulfilled.type, 
                removeSocialLinks.fulfilled.type
            ].includes(action.type),

            (state, action) => {
                state.loading = false;
                state.user = action.payload; 
                state.error = null;
            }
        )

        .addMatcher(
            (action) => [
                updateAccount.rejected.type, 
                updateAvatar.rejected.type, 
                updateSocialLinks.rejected.type
            ].includes(action.type),

            (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
        )

        
    }
})

export const {clearError} = authSlice.actions
export default authSlice.reducer