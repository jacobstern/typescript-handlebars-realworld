import axios from 'axios';
import cookieJarSupport from 'axios-cookiejar-support';
import cheerio from 'cheerio';
import tough from 'tough-cookie';

const axiosInstance = axios.create({ baseURL: 'http://localhost:3005' });

cookieJarSupport(axiosInstance);

export async function getCheerio(
  url: string,
  cookieJar?: tough.CookieJar
): Promise<CheerioStatic> {
  return await axiosInstance
    .get(url, {
      headers: {
        Accept: 'text/html; charset=utf-8',
      },
      jar: cookieJar,
      withCredentials: true,
    })
    .then(res => cheerio.load(res.data));
}

export interface PostCheerioFormOptions {
  baseUrl?: string;
}

export async function postCheerioForm(
  form: Cheerio,
  cookieJar?: tough.CookieJar,
  options: PostCheerioFormOptions = {}
): Promise<CheerioStatic> {
  if (!form.is('form')) {
    throw new Error('postCheerioForm(): Expected form element');
  }
  const action = form.attr('action');
  let url = action;
  if (!action) {
    if (options.baseUrl === undefined) {
      throw new Error('postCheerioForm(): Found empty action and no baseUrl');
    }
    url = options.baseUrl;
  }
  return await axiosInstance
    .post(url, form.serialize(), {
      jar: cookieJar,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then(res => cheerio.load(res.data));
}
