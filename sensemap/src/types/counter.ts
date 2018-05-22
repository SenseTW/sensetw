import { ActionUnion } from './action';

const INCREASE = 'INCREASE';
const increase = () => ({ type: INCREASE as typeof INCREASE });

const DECREASE = 'DECREASE';
const decrease = () => ({ type: DECREASE as typeof DECREASE });

export type State = {
  counter: number
};
export const initial: State = {
  counter: 0
};

export const actions = { increase, decrease };

export const reducer = (state: State = initial, action: ActionUnion<typeof actions>) => {
  switch (action.type) {
    case INCREASE: {
      return { counter: state.counter + 1 };
    }
    case DECREASE: {
      return { counter: state.counter - 1 };
    }
    default: {
      return state;
    }
  }
};