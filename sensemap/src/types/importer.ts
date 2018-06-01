import { Dispatch } from '.';
import { ActionUnion, emptyAction } from './action';
// XXX: should use our hypothesis-api
import * as API from './hypothesis/api';
import { Annotation } from './hypothesis/annotation';
import { findIndex } from 'ramda';
import { Arr } from './utils';

const h = new API.Hypothesis('https://sense.tw/api');

enum SourceType {
  HYPOTHESIS = 'HYPOTHESIS',
}

interface AnnotationLog {
  sourceType: SourceType.HYPOTHESIS;
  url: string;
  annotations: Annotation[];
}

const annotationLog = (url: string): AnnotationLog => ({
  sourceType: SourceType.HYPOTHESIS,
  url,
  annotations: [],
});

/**
 * The sum of our logs. Maybe we will have more sources in the future.
 */
export type ImportLog
  = AnnotationLog;

const findByUrl = (url: string) => findIndex((a: ImportLog) => a.url === url);

const CHANGE_URL = 'IMPORTER_CHANGE_URL';
const changeUrl =
  (url: string) => ({
    type: CHANGE_URL as typeof CHANGE_URL,
    payload: { url },
  });

const ANNOTATION_REQUEST = 'IMPORTER_ANNOTATION_REQUEST';
const annotationRequest =
  (url: string) => ({
    type: ANNOTATION_REQUEST as typeof ANNOTATION_REQUEST,
    payload: { url },
  });

const ANNOTATION_SUCCESS = 'IMPORTER_ANNOTATION_SUCCESS';
const annotationSuccess =
  (url: string, annotations: Annotation[]) => ({
    type: ANNOTATION_SUCCESS as typeof ANNOTATION_SUCCESS,
    payload: { url, annotations },
  });

const ANNOTATION_FAILURE = 'IMPORTER_ANNOTATION_FAILURE';
const annotationFailure =
  (url: string, error: Error) => ({
    type: ANNOTATION_FAILURE as typeof ANNOTATION_FAILURE,
    payload: { url, error },
  });

const fetchAnnotations
  : (url: string) => (dispatch: Dispatch) => Promise<Annotation[]>
  = (url) => async (dispatch) => {
    dispatch(annotationRequest(url));

    try {
      const result = await h.search({ url });
      dispatch(annotationSuccess(url, result.rows));
      return result.rows;
    } catch (error) {
      dispatch(annotationFailure(url, error));
      throw error;
    }
  };

export const syncActions = {
  changeUrl,
  annotationRequest,
  annotationSuccess,
  annotationFailure,
};

export const actions = {
  ...syncActions,
  fetchAnnotations,
};

export type Action = ActionUnion<typeof syncActions>;

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
    case ANNOTATION_REQUEST: {
      const { url } = action.payload;
      const { logs } = state;
      const i = findByUrl(url)(logs);
      const ann = logs[i];

      return {
        ...state,
        logs: Arr.replaceOrAppend(logs, i, ann || annotationLog(url)),
      };
    }
    case ANNOTATION_SUCCESS: {
      const { url, annotations } = action.payload;
      const { logs } = state;
      const i = findByUrl(url)(logs);
      let ann = logs[i];

      if (ann === undefined) {
        // tslint:disable-next-line:no-console
        console.error(`Annotation request ${url} not found.`);
        return state;
      }

      ann = {
        ...ann,
        annotations
      };

      return {
        ...state,
        logs: Arr.replaceOrAppend(logs, i, ann),
      };
    }
    case ANNOTATION_FAILURE: {
      const { url, error } = action.payload;
      const { logs } = state;
      const i = findByUrl(url)(logs);

      // tslint:disable-next-line:no-console
      console.error(error);

      return {
        ...state,
        logs: Arr.remove(logs, i),
      };
    }
    default:
      return state;
  }
};
