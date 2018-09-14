import { CardType } from '../../types';

interface Placeholders {
  summary: string;
  tags: string;
  sourceTitle: string;
  sourceLink: string;
  description: string;
  saidBy: string;
  stakeholders: string;
}

const notePlaceholders: Placeholders = {
  summary: '簡短表示個人意見、註解與回應，無法歸類的各種留言。',
  tags: 'tag1, tag2, 用逗號隔開',
  sourceTitle: '資料來源名稱，e.g. 【AI全面啟動Ⅱ：台灣企業行不行？關鍵在老闆｜天下雜誌】',
  sourceLink: 'https://o.sense.tw/abcd',
  description: '有更多想說的可以放在這裡。',
  saidBy: '誰提出的意見？ e.g. XX 大學校長 XXX',
  stakeholders: '誰會被影響？e.g. 經濟部, 半導體廠商, 大學（用逗號隔開）',
};

const infoPlaceholders: Placeholders = {
  ...notePlaceholders,
  summary: '補充中立的資訊來源，例如統計數據、相關研究。',
  tags: 'tag1, tag2, tag3',
  sourceTitle: '資料來源，e.g. 主計總處',
  description: '建議引用外部資料作為補充資訊來源。資料原文摘錄重點可以使用畫面右上角 Annotation 功能。也開放大家共編讓資訊更完備。',
  stakeholders: '誰會被影響？（用逗號隔開）e.g. 經濟部, 半導體廠商, 大學',
};

const problemPlaceholders: Placeholders = {
  ...notePlaceholders,
  summary: '簡短提問，針對這個議題、別人解法和意見的問題、疑慮、風險',
  description: '針對你提的問題有什麼補充資訊和支持證據？資料原文摘錄重點可以使用畫面右上角 Annotation 功能。',
};

const solutionPlaceholders: Placeholders = {
  ...notePlaceholders,
  summary: '簡短回答，針對別人提出的問題和疑慮，有什麼解法？',
  sourceTitle: '資料來源名稱，e.g. 數位國家行動方案',
  description: '這裏可以更詳細解釋解決方案的細節補充資訊和支持證據。資料原文摘錄重點可以使用畫面右上角 Annotation 功能。',
};

const definitionPlaceholders: Placeholders = {
  ...notePlaceholders,
  summary: '釐清專有名詞定義，例如定義什麼是 AI 人才、自由軟體、網路中立性，幫助大家討論有共同基礎。',
  sourceTitle: '資料來源名稱，e.g. 維基百科',
  description: '建議引用外部資料作為名詞定義來源。資料原文摘錄重點可以使用畫面右上角 Annotation 功能。也開放大家共編讓定義更完備。',
};

export const placeholders = {
  // legacy card types
  [CardType.NORMAL]: notePlaceholders,
  [CardType.QUESTION]: notePlaceholders,
  [CardType.ANSWER]: notePlaceholders,
  // card types
  [CardType.NOTE]: notePlaceholders,
  [CardType.PROBLEM]: problemPlaceholders,
  [CardType.SOLUTION]: solutionPlaceholders,
  [CardType.DEFINITION]: definitionPlaceholders,
  [CardType.INFO]: infoPlaceholders,
};