// tslint:disable-next-line:no-any
export type EmptyAction = { type: '', payload?: any };
export const emptyAction: EmptyAction = { type: '' };
// tslint:disable-next-line:no-any
type FunctionType = (...args: any[]) => any;
type ActionCreatorsMap = { [actionCreator: string]: FunctionType };
export type ActionUnion<A extends ActionCreatorsMap> = EmptyAction | ReturnType<A[keyof A]>;
