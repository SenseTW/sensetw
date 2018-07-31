import axios, { AxiosRequestConfig } from 'axios';
import { SearchOption, SearchResult } from './search';
import { Annotation } from './annotation';

export class Hypothesis {
  private apiUrl: string;
  private defaultConfig: AxiosRequestConfig;

  constructor(apiUrl: string, token: string | undefined = process.env.HYPOTHESIS_TOKEN) {
    this.apiUrl = apiUrl.replace(/\/+$/, '');
    this.defaultConfig = {
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined,
      },
    };
  }

  signup(username: string, email: string, password: string) {
    return axios
      .post(`${this.apiUrl}/api/signup`, { username, password})
      .then(response => {
        return new Promise(resolve => {
          return resolve(response.data);
        });
      });
  }

  login(username: string, password: string) {
    return axios
      .post(`${this.apiUrl}/api/login`, { username, password})
      .then(response => {
        return new Promise(resolve => {
          return resolve(response.data);
        });
      });
  }

  logout() {
    return axios.get(`${this.apiUrl}/logout`);
  }

  search(option: SearchOption): Promise<SearchResult<Annotation>> {
    return axios.get(`${this.apiUrl}/search`, { ...this.defaultConfig, params: option }).then(r => r.data);
  }

}
