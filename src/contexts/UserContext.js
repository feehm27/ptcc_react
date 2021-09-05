import React, { createContext, useEffect, useState } from 'react';
import { API_URL } from '../services/api';

export const UserContext = createContext();

export const UserStorage = ({ children }) => {
  const [login, setLogin] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function userLogin(email, password) {
    try {
      setError(null);
      setLoading(true);

      await API_URL.get('/sanctum/csrf-cookie').then(() => {
        API_URL.post('/api/login', { email, password })
          .then((response) => {
            const token = response.data.access_token;
            window.localStorage.setItem('token', token);
            setLogin(true);
          })
          .catch((err) => {
            setError(err.response.message);
            setLogin(false);
          });
      });
    } catch (err) {
      setLogin(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {});

  return (
    <UserContext.Provider value={{ userLogin, login, error, loading }}>
      {children}
    </UserContext.Provider>
  );
};
