import api from "../../utils/axios.js";

// Create
export const createInterviewApi = (data) => {
    return api.post("/interviews", data);
};

// get all (With Filters & Pagination)
export const getAllInterviewsApi = (params) => {
    // params = { page: 1, limit: 10, company: "Google", domain: "Tech" ... }
    return api.get("/interviews", { params });
};

// get single by id
export const getInterviewByIdApi = (id) => {
    return api.get(`/interviews/${id}`);
};

// Update
export const updateInterviewApi = ({ id, data }) => {
    return api.patch(`/interviews/${id}`, data);
};

// Delete
export const deleteInterviewApi = (id) => {
    return api.delete(`/interviews/${id}`);
};