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
/**
 * The username updating action constructor.
 *
 * @param {string} username The username.
 * @returns A username updating action.
 */
const updateUsername =
  (username: string) => ({
    type: UPDATE_USERNAME as typeof UPDATE_USERNAME,
    payload: { username}
  });

const UPDATE_EMAIL = 'UPDATE_EMAIL';
/**
 * The email updating action constructor.
 *
 * @param {string} email The email.
 * @returns A email updating action.
 */
const updateEmail =
  (email: string) => ({
    type: UPDATE_EMAIL as typeof UPDATE_EMAIL,
    payload: { email }
});

const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
/**
 * The password updating action constructor.
 *
 * @param {string} password The password.
 * @returns A password updating action.
 */
const updatePassword =
  (password: string) => ({
    type: UPDATE_PASSWORD as typeof UPDATE_PASSWORD,
    payload: { password }
  });

const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
/**
 * The successful login action constructor.
 *
 * @returns A successful login action.
 */
const loginSuccess = () => {
  return {
    type: LOGIN_SUCCESS as typeof LOGIN_SUCCESS,
    payload: {}
  };
};

const LOGIN_FAILURE = 'LOGIN_FAILURE';
/**
 * The failed login action constructor.
 *
 * @param {string} errorMsg The error message.
 * @returns A failed login action.
 */
const loginFailure = (errorMsg: string) => {
  return {
    type: LOGIN_FAILURE as typeof LOGIN_FAILURE,
    payload: { errorMsg }
  };
};

/**
 * The login action.
 * It's an async action which is composed by many plain actions.
 *
 * @returns A login result promise.
 */
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
/**
 * The successful signup action constructor.
 *
 * @returns A successful signup action.
 */
const signupSuccess = () => {
  return {
    type: SIGNUP_SUCCESS as typeof SIGNUP_SUCCESS,
    payload: {}
  };
};

const SIGNUP_FAILURE = 'SIGNUP_FAILURE';
/**
 * The failed signup action constructor.
 *
 * @param {string} errorMsg The error message.
 * @returns A failed signup action.
 */
const signupFailure = (errorMsg: string) => {
  return {
    type: SIGNUP_FAILURE as typeof SIGNUP_FAILURE,
    payload: {errorMsg}
  };
};

/**
 * The signup action.
 *
 * @param {string} username The username.
 * @param {string} email The email.
 * @param {string} password The password.
 * @returns A signup result promise.
 */
const signupRequest = (username: string, email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(signupSuccess());
    } catch (err) {
      dispatch(signupFailure(err));
    }
  };
};

/**
 * The logout action.
 */
const logoutRequest = () => async (dispatch: Dispatch) => {
  sessionService.deleteSession();
  sessionService.deleteUser();
};

/**
 * Plain(sync) actions.
 */
export const syncActions = {
    updateUsername,
    updateEmail,
    updatePassword,
    loginSuccess,
    loginFailure,
    signupSuccess,
    signupFailure,
};

/**
 * Async actions.
 */
export const actions = {
  ...syncActions,
  signupRequest,
  loginRequest,
  logoutRequest,
};

export type Action = ActionUnion<typeof syncActions>;

/**
 * The account action reducer.
 *
 * @param {State} [state=initial] The current account state.
 * @param {Action} [action=emptyAction] The action.
 * @returns The new account state.
 */
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
