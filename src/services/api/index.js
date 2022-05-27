// First we need to import axios.js
import axios from 'axios';
import authParams from './authParams';
import dynamic from 'next/dynamic';
import storage from '../utils/authToken';

const config = {
  // .. where we make our configurations
  baseURL: 'https://restaurant.delino.com',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'cache-control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  },
  timeout: 10000,
};

export const api = axios.create(config);
export const authApi = axios.create(config);

export const setAuth = ({ accessToken, refreshToken }, initMode = false) => {
  authApi.defaults.headers.Authorization = `${accessToken}`;
  if (!initMode) {
    storage.setToken(accessToken, refreshToken);
  }
};

let queueRequests = [];
let isRefreshing = false;
authApi.interceptors.response.use(
  function (response) {
    return response;
  },
  function async(error) {
    const originalRequest = error.config;

    if (isNetworkError(error)) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(authApi(originalRequest));
        }, 2500);
      });
    }

    if (error.response?.status === 401) {
      if (!isRefreshing) {
        refreshTokenRequest();
      }
      return new Promise((resolve) => {
        queueRequests.push((token) => {
          originalRequest.headers.Authorization = token;
          resolve(axios(originalRequest));
        });
      });
    }
    return Promise.reject(error);
  }
);

const refreshTokenRequest = async () => {
  isRefreshing = true;
  try {
    const { accessToken, refreshToken } = await storage.getToken();
    const response = await api.post(`user/refreshToken`, {
      ...authParams,
      refreshToken,
      accessToken,
    });

    if (response) {
      const {
        data: {
          data: { accessToken, refreshToken },
        },
      } = response;
      isRefreshing = false;
      setAuth({ accessToken, refreshToken });
      refreshQueueRequests(accessToken);
      queueRequests = [];
    } else {
      storage.removeToken();
      isRefreshing = false;
      queueRequests = [];
    }
  } catch (e) {
    console.error(e);
    storage.removeToken();
    isRefreshing = false;
    queueRequests = [];
    // we should use dispatch here
  }
};

function refreshQueueRequests(token) {
  if (queueRequests.length === 0) return false;
  queueRequests.map((cb) => cb(token));
  return true;
}

export const isNetworkError = (err) => {
  console.log(err);
  //debugger;
  let result = false;
  if (err.isAxiosError) {
    // err.response
    if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
      result = true;
    } else {
      result = false;
    }
  }

  return result;
};
