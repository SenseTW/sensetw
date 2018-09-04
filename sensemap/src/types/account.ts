import { sessionService } from 'redux-react-session';
import { ActionUnion, emptyAction } from './action';
import { profileRequest, tokenRequest, AuthorizationCode } from './auth';
import { Dispatch } from './redux';
import { sanitizeURL } from './utils';

const apiRoot = sanitizeURL(process.env.REACT_APP_SENSEMAP_API_ROOT) || 'https://api.sense.tw';
const loginURL = `${apiRoot}/login`;

export type State = {
    username: string,
    email: string,
    password: string,
    errorMsg: String
};

export const initial: State = {
    username: '',
    email: '',
    password: '',
    errorMsg: ''
};

const UPDATE_USERNAME = 'UPDATE_USERNAME';
const updateUsername =
  (username: string) => ({
    type: UPDATE_USERNAME as typeof UPDATE_USERNAME,
    payload: { username}
  });

const UPDATE_EMAIL = 'UPDATE_EMAIL';
const updateEmail =
  (email: string) => ({
    type: UPDATE_EMAIL as typeof UPDATE_EMAIL,
    payload: { email }
});

const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
const updatePassword =
  (password: string) => ({
    type: UPDATE_PASSWORD as typeof UPDATE_PASSWORD,
    payload: { password }
  });

const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const loginSuccess = () => {
  return {
    type: LOGIN_SUCCESS as typeof LOGIN_SUCCESS,
    payload: {}
  };
};

const LOGIN_FAILURE = 'LOGIN_FAILURE';
const loginFailure = (errorMsg: string) => {
  return {
    type: LOGIN_FAILURE as typeof LOGIN_FAILURE,
    payload: { errorMsg }
  };
};

const loginRequest = () => (dispatch: Dispatch) => {
  return new Promise(resolve => {
    // tslint:disable:no-any
    const receiveCode = (e: any) => {
      if (e && e.data) {
        window.removeEventListener('message', receiveCode);
        resolve(e.data);
      }
    };
    const login = window.open('about:blank', 'Login to Sensemap');
    if (login) {
      login.location.href = loginURL;
      window.addEventListener('message', receiveCode);
    }
  })
    .then(async (code: AuthorizationCode) => {
      const token = await tokenRequest(code);
      const profile = await profileRequest(token.access_token);
      await sessionService.saveSession({ token });
      await sessionService.saveUser({ ...profile, ...token });
      return dispatch(loginSuccess());
    })
    .catch((err) => dispatch(loginFailure(err)));
};

const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
const signupSuccess = () => {
  return {
    type: SIGNUP_SUCCESS as typeof SIGNUP_SUCCESS,
    payload: {}
  };
};

const SIGNUP_FAILURE = 'SIGNUP_FAILURE';
const signupFailure = (errorMsg: string) => {
  return {
    type: SIGNUP_FAILURE as typeof SIGNUP_FAILURE,
    payload: {errorMsg}
  };
};

// tslint:disable:no-any
const signupRequest = (username: string, email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(signupSuccess());
    } catch (err) {
      dispatch(signupFailure(err));
    }
  };
};

// tslint:disable:no-any
const logoutRequest = () => async (dispatch: Dispatch) => {
  sessionService.deleteSession();
  sessionService.deleteUser();
};

export const syncActions = {
    updateUsername,
    updateEmail,
    updatePassword,
    loginSuccess,
    loginFailure,
    signupSuccess,
    signupFailure,
};

export const actions = {
  ...syncActions,
  signupRequest,
  loginRequest,
  logoutRequest,
};

export type Action = ActionUnion<typeof syncActions>;

export const reducer = (state: State = initial, action: Action = emptyAction) => {
  switch (action.type) {
    case UPDATE_USERNAME: {
      const { username } = action.payload;
      return {
        ...state, username
      };
    }
    case UPDATE_EMAIL: {
      const { email } = action.payload;
      return {
        ...state, email
      };
    }
    case UPDATE_PASSWORD: {
      const { password } = action.payload;
      return {
        ...state, password
      };
    }
    case SIGNUP_SUCCESS: {
      return initial;
    }
    case SIGNUP_FAILURE: {
      return {
        ...state, errorMsg: action.payload.errorMsg
      };
    }
    case LOGIN_SUCCESS: {
      return initial;
    }
    case LOGIN_FAILURE: {
      return {
        ...state, errorMsg: action.payload.errorMsg
      };
    }
    default: return state;
  }
};
