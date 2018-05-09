import { applyMiddleware, createStore } from 'redux';
import { reducer } from '../types';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

export const store = createStore(
  reducer,
  applyMiddleware(
    thunkMiddleware,
    logger
  )
);
