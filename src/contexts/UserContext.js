import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API, API_AUTHENTICATED } from '../services/api';

export const UserContext = createContext();

export const UserStorage = ({ children }) => {
  const [data, setData] = useState(null);
  const [login, setLogin] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);

  const navigate = useNavigate();

  const userLogout = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setLoadingFacebook(false);
    setLogin(false);
    window.localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  async function getUser(token) {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    await API.get('me', config).then((response) => {
      setData(response.data);
      setLogin(true);
      response.data.is_advocate === 1
        ? navigate('dashboard')
        : navigate('dashboard-client');
    });
  }

  async function userFacebook(values) {
    setError(null);
    setLoadingFacebook(true);
    await API.post('facebook', values)
      .then((response) => {
        const token = response.data.access_token;
        window.localStorage.setItem('token', token);
        getUser(token);
      })
      .catch((err) => {
        setError(err.response.data.message);
        setLogin(false);
      });
    setLoadingFacebook(false);
  }

  async function userLogin(email, password) {
    setError(null);
    setLoading(true);
    await API_AUTHENTICATED.get('/sanctum/csrf-cookie').then(() => {
      API.post('login', { email, password })
        .then((response) => {
          const token = response.data.access_token;
          window.localStorage.setItem('token', token);
          getUser(token);
        })
        .catch((err) => {
          setError(err.response.data.message);
          setLogin(false);
        });
    });
    setLoading(false);
  }

  useEffect(() => {
    async function autoLogin() {
      const token = window.localStorage.getItem('token');
      if (token) {
        try {
          setError(null);
          setLoading(true);
          await getUser(token);
        } catch (err) {
          userLogout();
        } finally {
          setLoading(false);
        }
      } else {
        setLogin(false);
      }
    }
    autoLogin();
  }, [userLogout]);

  return (
    <UserContext.Provider
      value={{
        userLogin,
        userLogout,
        userFacebook,
        getUser,
        data,
        login,
        error,
        loading,
        loadingFacebook
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
