import api from "../../utils/axios.js";

// Create Developer
export const createDeveloperApi = (formData) => {
    return api.post("/developers", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}

// Get All Developers
export const getAllDevelopersApi = () => {
    return api.get("/developers")
}

// Get Single Developer
export const getDeveloperByIdApi = (id) => {
    return api.get(`/developers/${id}`)
}

// Update Developer
export const updateDeveloperApi = (id, formData) => {
    return api.patch(`/developers/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}

// Delete Developer
export const deleteDeveloperApi = (id) => {
    return api.delete(`/developers/${id}`)
}