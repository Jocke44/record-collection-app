export const updateRecord = async (id, data) => {
  try {
    const res = await api.put(`/records/${id}`, data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};







// ✅ Add more endpoints as needed (export const xyz...)

