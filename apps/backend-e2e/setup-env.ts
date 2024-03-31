import axios, { AxiosError } from 'axios';

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const request = {
      method: error.request?.method,
      path: error.request?.path,
    };
    const response = {
      statusCode: error.response?.status,
      requestConfig: {
        url: error.response?.config?.url,
        method: error.response?.config?.method,
        data: error.response?.config?.data,
      },
      data: error.response?.data,
    };
    const errorData = {
      code: error.code,
      config: {
        url: error?.config?.url,
        method: error?.config?.method,
        data: error?.config?.data,
      },
    };

    console.dir(errorData, { depth: null });
    console.dir({ request }, { depth: null });
    console.dir({ response }, { depth: null });

    return Promise.reject(error);
  },
);
