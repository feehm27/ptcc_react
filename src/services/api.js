import axios from 'axios';

export const API_URL = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  auth: '',
  withCredentials: true
});

export function TOKEN_POST(body) {
  API_URL.get('/sanctum/csrf-cookie').then(() => {
    API_URL.post('/api/login', body).then((response) => {
      return response;
    });
  });
}
