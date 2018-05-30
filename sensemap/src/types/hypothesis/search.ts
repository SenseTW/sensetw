export interface SearchOption {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'desc' | 'asc';
  uri?: string;
  url?: string;
  user?: string;
  group?: string;
  tag?: string;
  any?: string;
}

export interface SearchResult<T> {
  rows: T[];
  total: number;
}
