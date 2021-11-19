import axios from 'axios';
import { store } from '../app/store';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  // remember to make this async as the store action will
  // need to be awaited
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest.url.includes('/dj-rest-auth/token/refresh/')
    ) {
      localStorage.removeItem('user');
      store.dispatch({ type: 'auth/clearUser' });
      return Promise.reject(error);
    } else if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // await execution of the store async action before
      // return
      await instance.post('/dj-rest-auth/token/refresh/');
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default instance;
