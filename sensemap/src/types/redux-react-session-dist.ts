declare module 'redux-react-session' {
    import { Store } from 'redux';
    export interface Action {
        type: string;
    }
    // tslint:disable:no-any
    export type Session = any;
    // tslint:disable:no-any
    export type User = any;
    export interface State {
        authenticated: boolean;
        checked: boolean;
        invalid: boolean;
        user: User;
    }
    export interface Options {
        driver: string;
        validateSession: (session: Session) => boolean;
        refreshOnCheckAuth: boolean;
        expires: number;
        redirectPath: string;
    }
    export function sessionReducer(state: State, action: Action): State;
    // tslint:disable-next-line:class-name
    export class sessionService {
        static setOptions(store: Store, options: Options): never;
        // tslint:disable-next-line:no-any
        static initSessionService(store: Store, options?: Options): Promise<any>;
        static initServerSession(store: Store, options?: Options & {sever: boolean}): object;
        // tslint:disable-next-line:no-any
        static saveFromClient(cookies: object): Promise<any>;
        static invalidateSession(): never;
        static attemptLoadUser(): never;
        static refreshFromLocalStorage(): never;
        static checkAuth(nextState: State, replace: (state: State) => State, next: Function): never;
        // tslint:disable-next-line:no-any
        static saveSession(session: Session): Promise<any>;
        static loadSession(): Promise<Session>;
        static deleteSession(): never;
        // tslint:disable-next-line:no-any
        static saveUser(user: User): Promise<any>;
        static loadUser(): Promise<User>;
        static deleteUser(): never;
        constructor(store: Store, options?: Options);
    }
}