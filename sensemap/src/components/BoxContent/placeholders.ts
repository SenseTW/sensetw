import { BoxType } from '../../types';

interface Placeholders {
  title: string;
  tags: string;
  summary: string;
}

const notePlaceholders: Placeholders = {
  title: 'One concept or one argument.',
  tags: 'tag1, tag2, 用逗號隔開',
  summary: '簡短表示個人意見、註解與回應，無法歸類的各種留言。',
};

const infoPlaceholders: Placeholders = {
  ...notePlaceholders,
  summary: '補充中立的資訊來源，例如統計數據、相關研究。',
};

const problemPlaceholders: Placeholders = {
  ...notePlaceholders,
  summary: '簡短提問，針對這個議題、別人解法和意見的問題、疑慮、風險',
};

const solutionPlaceholders: Placeholders = {
  ...notePlaceholders,
  summary: '簡短回答，針對別人提出的問題和疑慮，有什麼解法？',
};

const definitionPlaceholders: Placeholders = {
  ...notePlaceholders,
  summary: '釐清專有名詞定義，例如定義什麼是 AI 人才、自由軟體、網路中立性，幫助大家討論有共同基礎。',
};

export const placeholders = {
  [BoxType.NOTE]: notePlaceholders,
  [BoxType.PROBLEM]: problemPlaceholders,
  [BoxType.SOLUTION]: solutionPlaceholders,
  [BoxType.DEFINITION]: definitionPlaceholders,
  [BoxType.INFO]: infoPlaceholders,
};