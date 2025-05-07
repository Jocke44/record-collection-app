// src/lib/api.js

import axios from "axios";

// ✅ Base URL (change to your live backend URL)
const BASE_URL = "https://record-backend.onrender.com";

// REGISTER
export const registerUser = (email, password) => {
  return axios.post(`${BASE_URL}/register`, { email, password });
};

// LOGIN
export const loginUser = (email, password) => {
  return axios.post(`${BASE_URL}/login`, { email, password });
};

// REQUEST PASSWORD RESET
export const requestPasswordReset = (email) => {
  return axios.post(`${BASE_URL}/request-password-reset`, null, {
    params: { email },
  });
};

// CONFIRM PASSWORD RESET
export const confirmPasswordReset = (token, newPassword) => {
  return axios.post(`${BASE_URL}/reset-password/confirm`, {
    token,
    new_password: newPassword,
  });
};

// FETCH RECORDS
export const fetchRecords = () => {
  return axios.get(`${BASE_URL}/records`);
};

// ADD RECORD
export const addRecord = (record) => {
  return axios.post(`${BASE_URL}/records`, record);
};

// DELETE RECORD
export const deleteRecord = (id) => {
  return axios.delete(`${BASE_URL}/records/${id}`);
};

// UPDATE RECORD
export const updateRecord = (id, updatedData) => {
  return axios.put(`${BASE_URL}/records/${id}`, updatedData);
};

// BARCODE LOOKUP
export const lookupBarcode = (barcode) => {
  return axios.get(`${BASE_URL}/discogs/search`, {
    params: { barcode },
  });
};
