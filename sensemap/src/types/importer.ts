import { ActionUnion, emptyAction } from './action';
// XXX: should use our hypothesis-api
import { Annotation } from './hypothesis/annotation';

enum SourceType {
  HYPOTHESIS = 'HYPOTHESIS',
}

interface AnnotationLog {
  sourceType: SourceType.HYPOTHESIS;
  url: string;
  annotations: Annotation[];
}

/**
 * The sum of our logs. Maybe we will have more sources in the future.
 */
type ImportLog
  = AnnotationLog;

const CHANGE_URL = 'IMPORTER_CHANGE_URL';
const changeUrl =
  (url: string) => ({
    type: CHANGE_URL as typeof CHANGE_URL,
    payload: { url },
  });

export const actions = {
  changeUrl,
};

export type Action = ActionUnion<typeof actions>;

export interface State {
  url: string;
  logs: ImportLog[];
}

export const initial = {
  url: '',
  logs: [],
};

export const reducer = (state: State = initial, action: Action = emptyAction): State => {
  switch (action.type) {
    case CHANGE_URL: {
      const { url } = action.payload;
      return { ...state, url };
    }
    default:
      return state;
  }
};
