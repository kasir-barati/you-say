import axios, { AxiosError } from 'axios';
import { jsonParser } from './src/utils/json-parser.util';

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const parsedMessage = jsonParser(
      error?.response?.data?.['message'],
    );
    console.dir(error.config, { depth: null });
    delete error?.response?.data?.['message'];

    if (typeof parsedMessage === 'object') {
      console.log(parsedMessage);
    }
    console.dir(error.response.data, { depth: null });
    return Promise.reject(error);
  },
);
