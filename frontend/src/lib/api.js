// src/lib/api.js
import axios from "axios";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
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

export const searchDiscogsByBarcode = async (barcode) => {
  try {
    const res = await api.get(`/discogs/search?barcode=${encodeURIComponent(barcode)}`);
    return res.data;
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

export const addRecord = async (recordData) => {
  try {
    const cleanRecord = {
      ...recordData,
      artist: recordData.artist?.trim(),
      title: recordData.title?.trim(),
      genre: recordData.genre?.trim(),
      label: recordData.label?.trim(),
      format: recordData.format?.trim(),
    };
    return await api.post("/records", cleanRecord);
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

export const updateRecord = async (id, data) => {
  try {
    const res = await api.put(`/records/${id}`, data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const getDiscogsRelease = async (id) => {
  try {
    const res = await fetch(`https://api.discogs.com/releases/${id}?token=${import.meta.env.VITE_DISCOGS_TOKEN}`);
    return await res.json();
  } catch (err) {
    console.error("Discogs API Error:", err);
    toast.error("Failed to fetch release info.");
    return null;
  }
};
