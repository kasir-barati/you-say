import axios, { AxiosError } from 'axios';

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.dir(error.request, { depth: null });
    console.dir(error.response, { depth: null });
    return Promise.reject(error);
  },
);
