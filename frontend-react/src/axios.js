import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // sinu backend API aadress
});

export default api;

