import * as React from 'react';
import { History } from 'history';
import { Switch, Route, Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb as SBreadcrumb } from 'semantic-ui-react';
import * as T from '../../../types';
import { actions, ActionProps, mapDispatch } from '../../../types';
import { emptyBoxData } from '../../../types/sense/box';
import { MapScope } from '../../../types/sense-map';
import * as CS from '../../../types/cached-storage';
import * as R from '../../../types/routes';

// tslint:disable-next-line:no-any
type MyRouteProps = RouteComponentProps<any>;

interface StateFromProps {
  senseObject: CS.CachedStorage;
  scope: MapScope;
  history: History;
}

type Props = StateFromProps & ActionProps;

class MapSections extends React.PureComponent<Props & { mid: T.MapID }> {
  componentWillMount() {
    const { actions: { senseMap }, mid } = this.props;

    // sync the route to the scope
    senseMap.setMap(mid);
    senseMap.setScopeToFullmap();
  }

  componentDidUpdate() {
    const { history, scope, mid } = this.props;

    // sync the scope to the route
    if (scope.type !== T.MapScopeType.FULL_MAP) {
      // XXX: can I get the router basename here?
      history.push(`${process.env.PUBLIC_URL}${R.toSubmapPath({ mid, bid: scope.box })}`);
    }
  }

  render() {
    return (
      <React.Fragment>
        <SBreadcrumb.Section
          link
          as={Link}
          to={R.mapList}
        >
          Dashboard
        </SBreadcrumb.Section>
        <SBreadcrumb.Divider icon="right angle" />
        <SBreadcrumb.Section active>Map</SBreadcrumb.Section>
      </React.Fragment>
    );
  }
}

class MapBoxSections extends React.PureComponent<Props & { mid: T.MapID, bid: T.BoxID }> {
  componentWillMount() {
    const { actions: { senseMap }, mid, bid } = this.props;

    // sync the route to the scope
    senseMap.setMap(mid);
    senseMap.setScopeToBox(bid);
  }

  componentDidUpdate() {
    const { history, scope, mid } = this.props;

    // sync the scope to the route
    if (scope.type === T.MapScopeType.FULL_MAP) {
      history.push(`${process.env.PUBLIC_URL}${R.toMapPath({ mid })}`);
    }
  }

  render() {
    const { actions: { senseMap, selection }, senseObject, mid, bid } = this.props;
    const box = CS.getBox(senseObject, bid);

    return (
      <React.Fragment>
        <SBreadcrumb.Section
          link
          as={Link}
          to={R.mapList}
        >
          Dashboard
        </SBreadcrumb.Section>
        <SBreadcrumb.Divider icon="right angle" />
        <SBreadcrumb.Section
          link
          as={Link}
          to={R.toMapPath({ mid })}
          onClick={() => {
            selection.clearSelection();
            senseMap.setScopeToFullmap();
          }}
        >
          Map
        </SBreadcrumb.Section>
        <SBreadcrumb.Divider icon="right angle" />
        <SBreadcrumb.Section active>{
          box === emptyBoxData
            ? bid
            : box.title
        }</SBreadcrumb.Section>
      </React.Fragment>
    );
  }
}

class Breadcrumb extends React.PureComponent<Props> {
  render() {
    return (
      <SBreadcrumb>
        <Switch>
          <Route exact path={R.mapList}>
            {() => <SBreadcrumb.Section active>Dashboard</SBreadcrumb.Section>}
          </Route>
          <Route exact path={R.settings}>
            {() => <SBreadcrumb.Section active>Settings</SBreadcrumb.Section>}
          </Route>
          <Route exact path={R.importer}>
            {() => (
              <React.Fragment>
                <SBreadcrumb.Section
                  link
                  as={Link}
                  to={R.mapList}
                >
                  Dashboard
                </SBreadcrumb.Section>
                <SBreadcrumb.Divider icon="right angle" />
                <SBreadcrumb.Section active>Import</SBreadcrumb.Section>
              </React.Fragment>
            )}
          </Route>
          <Route exact path={R.map}>
            {({ match: { params: { mid }} }) => <MapSections {...this.props} mid={mid} />}
          </Route>
          <Route path={R.submap}>
            {({ match: { params: { mid, bid }} }) => <MapBoxSections {...this.props} mid={mid} bid={bid} />}
          </Route>
        </Switch>
      </SBreadcrumb>
    );
  }
}

export default withRouter(connect<StateFromProps, ActionProps, MyRouteProps>(
  (state: T.State, router: MyRouteProps) => {
    const { senseObject } = state;
    const { scope } = state.senseMap;
    const { history } = router;

    // pass router to trigger rerender when the url changed
    return { senseObject, scope, history };
  },
  mapDispatch({ actions })
)(Breadcrumb));
