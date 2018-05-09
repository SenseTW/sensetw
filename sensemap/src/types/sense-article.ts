export interface Article {
  title: string;
  url: URL;
  quote: string;
}

export const emptyArticle: Article = {
  title: '',
  url: new URL('http://example.com'),
  quote: ''
};