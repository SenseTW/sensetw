import * as React from 'react';
import { Route, Redirect, RouteComponentProps } from 'react-router-dom';
import * as R from '../../types/routes';

export type Props<P> = {
    component: React.ComponentClass<P>,
    exact?: boolean,
    path: string,
    authenticated: boolean,
};

export default function PrivateRoute<P>({ component, exact = false, path, authenticated }: Props<P>) {
    return (
        <Route
            exact={exact}
            path={path}
            // tslint:disable-next-line:no-any
            render={(props: P & RouteComponentProps<any>)  => (
                authenticated ? (
                    React.createElement(component, props)
                ) : (
                    <Redirect 
                        to={{
                            pathname: R.login,
                            state: { from: props.location }
                        }}
                    />
                )
            )}
        />
    );
}