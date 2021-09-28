import axios from 'axios';

export const API_AUTHENTICATED = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  auth: '',
  withCredentials: true
});

export const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  auth: '',
  withCredentials: true
});

export function TOKEN_POST(body) {
  API_AUTHENTICATED.get('/sanctum/csrf-cookie').then(() => {
    API_AUTHENTICATED.post('/api/login', body).then((response) => {
      return response;
    });
  });
}
