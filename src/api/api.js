import axios from "axios";
import {
  triggerBackendDown,
  clearBackendDown,
} from "./networkState";


// Base URL
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Create Axios Instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token); // DEBUG

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});


api.interceptors.response.use(
  (response) => {
    console.log("✅ API success:", response.config.url);
    clearBackendDown();
    return response;
  },
  (error) => {
    console.log("❌ API error:", {
      url: error.config?.url,
      code: error.code,
      message: error.message,
    });

    // ✅ ONLY trigger when server is unreachable (not timeout)
    if (!error.response && error.code !== "ECONNABORTED") {
      triggerBackendDown();
    }

    return Promise.reject(error);
  }
);

// -------------------
// AUTH ENDPOINTS
// -------------------
export const AUTH_API = {
  GOOGLE_LOGIN: `http://api.scramblo.xyz/oauth2/authorization/google`,
};

// -------------------
// USER ENDPOINTS
// -------------------
export const getUserDetails = () => api.get("/users");

export const updateProfile = (data) => {
  return api.put("/users/update", data);
};

export const setInterests = (interests) => {
  return api.post("/users/interests", interests);
};

export const getDefaultImages = () => api.get("/users/default-images");

export const getUserById = (id) => {
  return api.get(`/users/${id}`);
};

export const deleteProfileImage = () =>
  api.delete("/users/profile-image");

export const deleteCoverImage = () =>
  api.delete("/users/cover-image");

// -------------------
// ARTICLE ENDPOINTS
// -------------------


export const createArticle = (data) => {
  return api.post("/articles", data);
};

export const getArticlesByUser = (userId, page = 0, size = 10) => {
  return api.get(`/articles/user/${userId}?page=${page}&size=${size}`);
};

export const getPresignedUrl = (fileName, contentType, folder) => {
  return api.post("/upload/presigned-url", {
    fileName,
    contentType,
    folder,
  });
};



export const getTrendingArticles = (page = 0, size = 10) => {
  return api.get(`/articles/trending?page=${page}&size=${size}`);
};

export const getRecentArticles = (page = 0, size = 10) => {
  return api.get(`/articles/recent?page=${page}&size=${size}`);
};

export const getArticleById = (id) => {
  return api.get(`/articles/${id}`);
};

export const toggleLike = (articleId) => {
  return api.post(`/likes/${articleId}`);
};
export const toggleBookmark = (articleId) => {
  return api.post(`/bookmarks/${articleId}`);
};

export const deleteArticle = (articleId) => {
  return api.delete(`/articles/${articleId}`);
};

export const getFollowingFeed = (page = 0, size = 10) => {
  return api.get(`/articles/feed/following?page=${page}&size=${size}`);
};

export const getHybridFeed = (page = 0, size = 10) => {
  return api.get(`/articles/feed?page=${page}&size=${size}`);
};

export const searchArticles = (query, page = 0, size = 10) => {
  return api.get(`/articles/search?query=${query}&page=${page}&size=${size}`);
};

// Comment Section

export const getComments = (articleId) => {
  return api.get(`/comment/${articleId}`);
};

export const createComment = (data) => {
  return api.post(`/comment`, data);
};

// follow - following 

export const toggleFollow = (userId) => {
  return api.post(`/follow/${userId}`);
};

export const isFollowingUser = (userId) => {
  return api.get(`/follow/is-following/${userId}`);
};


// -------------------
// NOTIFICATION ENDPOINTS
// -------------------

// 🔔 Get all notifications
export const getNotifications = () => {
  return api.get("/notifications");
};

// 🔔 Mark notification as read
export const markNotificationAsRead = (id) => {
  return api.put(`/notifications/${id}/read`);
};

// 🔔 Get unread count
export const getUnreadCount = () => {
  return api.get("/notifications/unread-count");
};

// 🔔 Get notification preferences
export const getNotificationPreferences = () => {
  return api.get("/notifications/preferences");
};

// 🔔 Update notification preferences
export const updateNotificationPreferences = (data) => {
  return api.put("/notifications/preferences", data);
};

export const getPreferences = () => api.get("/notifications/preferences");

export const updatePreferences = (data) =>
  api.put("/notifications/preferences", data);

export default api;


