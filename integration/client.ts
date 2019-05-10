import axios from 'axios';
import cookieJarSupport from 'axios-cookiejar-support';

export const axiosInstance = axios.create({ baseURL: 'http://localhost:3005' });

cookieJarSupport(axiosInstance);
