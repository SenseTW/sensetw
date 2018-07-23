import { sessionService } from 'redux-react-session';
import { ActionUnion, emptyAction } from './action';
import { Dispatch } from './redux';
import authClient from './auth';
import * as R from './routes';

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

// tslint:disable:no-any
const loginRequest = (username: string, password: string, history: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const data = await authClient.login(username, password);
      const { token, user } = data;
      await sessionService.saveSession({token: token});
      await sessionService.saveUser(user);
      dispatch(loginSuccess());
      history.push(R.index);
    } catch (err) {
      dispatch(loginFailure(err));
    }
  };
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
const signupRequest = (username: string, email: string, password: string, history: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const {token, user} = await authClient.signup(username, email, password);
      await sessionService.saveSession({token: token});
      await sessionService.saveUser(user);
      dispatch(signupSuccess());
      history.push(R.index);
    } catch (err) {
      dispatch(signupFailure(err));
    }
  };
};

// tslint:disable:no-any
const logoutRequest = (history: any) => {
  authClient.logout();
  sessionService.deleteSession();
  sessionService.deleteUser();
  history.push(R.index);
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
  logoutRequest
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