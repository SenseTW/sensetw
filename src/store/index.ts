import { createStore } from 'redux';
import { reducer } from '../types';

export const store = createStore(reducer);