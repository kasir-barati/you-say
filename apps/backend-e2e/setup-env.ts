import axios, { AxiosError } from 'axios';

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.dir(error, { depth: null });
    return Promise.reject(error);
  },
);
