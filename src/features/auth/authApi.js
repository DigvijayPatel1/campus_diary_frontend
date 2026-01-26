import api from "../../utils/axios.js"

// Register
export const registerUserApi = (payload) => {
    return api.post("/users/register", payload);
}

// Login
export const loginUserApi = (payload) => {
    return api.post("/users/login", payload)
}

// logout
export const logoutUserApi = () => {
    return api.post("/users/logout")
}

// Get current user
export const currentUserApi = () => {
    return api.get("/users/current-user")
}

// Refresh Token
export const refreshTokenApi = () => {
    return api.post("/users/refresh-tokens")
}

// change password
export const changePasswordApi = (payload) => {
    return api.post("/users/change-password", payload)
}

// update account
export const updateAccountApi = (payload) => {
    return api.patch("/users/update-details", payload)
}
  
// update avatar
export const updateAvatarApi = (avatarId) => {
    return api.patch("/users/update-avatar", { avatarId })
}
  
// update Social Link
export const updateSocialLinksApi = (payload) => {
    return api.patch("/users/update-social-links", payload)
}
  
// remove social links
export const removeSocialLinksApi = () => {
    return api.delete("/users/remove-social-links")
}

// save post
export const savePostApi = (postId) => {
  return api.post(`/users/save-post/${postId}`)
}

// get user profile
export const getUserProfileApi = (userId) => {
  return api.get(`/users/profile/${userId}`)
}

// get saved posts
export const getSavedPostsApi = () => {
  return api.get("/users/saved-posts");
}

// get my posts
export const getMyPostsApi = () => {
  return api.get("/users/my-posts");
};

// verify email
export const verifyEmailApi = (token) => {
    return api.get(`/users/verify/${token}`)
}

// forgot password
export const forgotPasswordApi = (email) => {
    return api.post("/users/forgot-password", { email });
}

// reset password
export const resetPasswordApi = (token, password) => {
    return api.post(`/users/reset-password/${token}`, { password })
}