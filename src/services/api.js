import axios from 'axios';

export const API_AUTHENTICATED = axios.create({
  baseURL: 'https://advoguez-php.herokuapp.com',
  auth: '',
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFTOKEN',
  xsrfCookieName: 'csrftoken'
});

export const API = axios.create({
  baseURL: 'https://advoguez-php.herokuapp.com/api',
  auth: '',
  withCredentials: true,
  xsrfHeaderName: 'X-CSRFTOKEN',
  xsrfCookieName: 'csrftoken'
});

export function TOKEN_POST(body) {
  API_AUTHENTICATED.get('/sanctum/csrf-cookie').then(() => {
    API_AUTHENTICATED.post('/api/login', body).then((response) => {
      return response;
    });
  });
}
