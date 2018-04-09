const INCREASE = 'INCREASE';
const increase = () => ({ type: INCREASE as typeof INCREASE });
type IncreaseAction = ReturnType<typeof increase>;

const DECREASE = 'DECREASE';
const decrease = () => ({ type: DECREASE as typeof DECREASE });
type DecreaseAction = ReturnType<typeof decrease>;

export type State = {
  counter: number
};
export const initial: State = {
  counter: 0
};

type Action
  = IncreaseAction
  | DecreaseAction;

export const actions = { increase, decrease };

export const reducer = (state: State = initial, action: Action) => {
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