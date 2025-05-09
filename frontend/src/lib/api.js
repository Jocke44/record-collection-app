// src/lib/api.js
import axios from "axios";
import { toast } from "sonner";

// 🌎 Change this to your live backend URL
const BASE_URL = "https://record-backend-a5nk.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // ⏱️ optional timeout
});

const handleError = (error) => {
  if (error.response) {
    console.error("API Error:", error.response.data);
    toast.error(error.response.data.detail || "Something went wrong.");
  } else if (error.request) {
    console.error("API Error: No response received.", error.request);
    toast.error("No response from server.");
  } else {
    console.error("API Error:", error.message);
    toast.error("Error: " + error.message);
  }
  throw error;
};

export const registerUser = async (email, password) => {
  try {
    return await api.post("/register", { email, password });
  } catch (err) {
    handleError(err);
  }
};

export const loginUser = async (email, password) => {
  try {
    return await api.post("/login", { email, password });
  } catch (err) {
    handleError(err);
  }
};

export const requestPasswordReset = async (email) => {
  try {
    return await api.post("/request-password-reset", { email });
  } catch (err) {
    handleError(err);
  }
};

export const confirmPasswordReset = async (token, newPassword) => {
  try {
    return await api.post("/reset-password/confirm", {
      token,
      new_password: newPassword,
    });
  } catch (err) {
    handleError(err);
  }
};

export const searchDiscogs = async (query) => {
  try {
    const res = await api.get(`/discogs/search?q=${encodeURIComponent(query)}`);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const addRecord = async (recordData) => {
  try {
    return await api.post("/records", recordData);
  } catch (err) {
    handleError(err);
  }
};

export const getRecords = async () => {
  try {
    const res = await api.get("/records");
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const deleteRecordById = async (id) => {
  try {
    return await api.delete(`/records/${id}`);
  } catch (err) {
    handleError(err);
  }
};

export const updateRecord = async (id, updated) => {
  try {
    return await api.put(`/records/${id}`, updated);
  } catch (err) {
    handleError(err);
  }
};

export const searchDiscogsByBarcode = async (barcode) => {
  try {
    const res = await api.get(`/discogs/search?barcode=${encodeURIComponent(barcode)}`);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};




// ✅ Add more endpoints as needed (export const xyz...)

