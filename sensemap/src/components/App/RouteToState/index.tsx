import * as React from 'react';
import { connect } from 'react-redux';
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import { actions, ActionProps, mapDispatch } from '../../../types';
import * as R from '../../../types/routes';

// tslint:disable-next-line:no-any
type MyRouteProps = RouteComponentProps<any>;

interface OwnProps {}

type Props = OwnProps & ActionProps;

/**
 * A terrible way to sync the location to the custom state.
 *
 * React Router v4 update the location in the `Router` state and passes the
 * location to each `Route` via it's router context.
 */
class RouteToState extends React.PureComponent<Props> {
  render() {
    const { actions: acts } = this.props;

    return (
      <Switch>
        <Route exact path={R.map}>
          {({ match: { params: { mid }} }) => {
            setImmediate(() => {
              acts.senseMap.setMap(mid);
              acts.senseMap.setScopeToFullmap();
            });
            return null;
          }}
        </Route>
        <Route path={R.submap}>
          {({ match: { params: { mid, bid }} }) => {
            setImmediate(() => {
              acts.senseMap.setMap(mid);
              acts.senseMap.setScopeToBox(bid);
            });
            return null;
          }}
        </Route>
        <Route>
          {() => {
            setImmediate(() => {
              acts.senseMap.setMap('');
            });
            return null;
          }}
        </Route>
      </Switch>
    );
  }
}

export default withRouter(connect<OwnProps, ActionProps, MyRouteProps>(
  state => ({}),
  mapDispatch({actions}),
)(RouteToState));