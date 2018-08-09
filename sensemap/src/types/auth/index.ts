export type User = {
    id: string;
    username: string,
    email: string
};

const fakeToken = '43h4h34oh32o4h32o';
const fakeUser: User = {
    id: 'X2B31321',
    username: 'faker',
    email: 'faker@fake.com'
};

export interface Success {
    token: string;
    user: User;
}

export type Result = Success;

function fakeSignup(username: string, email: string, password: string): Promise<Result> {
    return new Promise(resolve => {
        resolve({token: fakeToken, user: fakeUser});
    });
}

function fakeLogin(username: string, password: string): Promise<Result> {
    return new Promise(resolve => {
        resolve({token: fakeToken, user: fakeUser});
    });
}

function fakeLogout() {
    return new Promise(resolve => setTimeout(resolve, 1000));
}

export default {
    signup: fakeSignup,
    login: fakeLogin,
    logout: fakeLogout
};