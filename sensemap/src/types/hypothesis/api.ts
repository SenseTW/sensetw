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

  search(option: SearchOption): Promise<SearchResult<Annotation>> {
    return axios.get(`${this.apiUrl}/search`, { ...this.defaultConfig, params: option }).then(r => r.data);
  }

}
