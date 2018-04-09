const INCREASE = 'INCREASE';
type IncreaseAction = { type: typeof INCREASE };
const increase = (): IncreaseAction => ({ type: INCREASE });

const DECREASE = 'DECREASE';
type DecreaseAction = { type: typeof DECREASE };
const decrease = (): DecreaseAction => ({ type: DECREASE });

export type Action = IncreaseAction | DecreaseAction;

export type State = {
  counter: number
};
export const initial: State = {
  counter: 0
};

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