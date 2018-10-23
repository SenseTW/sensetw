import { EdgeType } from '../../types';

interface Placeholders {
  title: string;
  tags: string;
  summary: string;
}

const defaultPlaceholders: Placeholders = {
  title: 'One concept or one argument.',
  tags: 'tag1, tag2, 用逗號隔開',
  summary: '簡短提問，針對這個議題、別人解法和意見的問題、疑慮、風險',
};

export const placeholders = {
  [EdgeType.NONE]: defaultPlaceholders,
  [EdgeType.DIRECTED]: defaultPlaceholders,
  [EdgeType.REVERSED]: defaultPlaceholders,
  [EdgeType.BIDIRECTED]: defaultPlaceholders,
};