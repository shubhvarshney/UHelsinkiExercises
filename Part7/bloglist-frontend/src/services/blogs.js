import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, blog, config);
  return response.data;
};

const update = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };
  const url = `${baseUrl}/${blog.id}`;
  const response = await axios.put(url, blog, config);
  return response.data;
};

const deleteItem = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const url = `${baseUrl}/${id}`;
  const response = await axios.delete(url, config);
  return response.data;
};

const addComment = async (id, comment) => {
  const url = `${baseUrl}/${id}/comments`;
  const response = await axios.post(url, { comment: comment });
  return response.data;
};

export default { setToken, getAll, create, update, deleteItem, addComment };
