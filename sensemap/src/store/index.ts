import { applyMiddleware, createStore } from 'redux';
import { reducer } from '../types';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { sessionService } from 'redux-react-session';

export const store = createStore(
  reducer,
  process.env.NODE_ENV !== 'production'
    ? applyMiddleware(
      thunkMiddleware,
      logger
    )
    : applyMiddleware(
      thunkMiddleware
    )
);

sessionService.initSessionService(store);