import { applyMiddleware, createStore } from 'redux';
import { reducer } from '../types';
import logger from 'redux-logger';

export const store = createStore(
  reducer,
  applyMiddleware(logger)
);
