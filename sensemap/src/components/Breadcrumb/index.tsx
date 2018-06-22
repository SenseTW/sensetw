import * as React from 'react';
import { History } from 'history';
import { Switch, Route, Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Breadcrumb as SBreadcrumb } from 'semantic-ui-react';
import * as T from '../../types';
import { actions, ActionProps, mapDispatch } from '../../types';
import { emptyBoxData } from '../../types/sense/box';
import { MapScope } from '../../types/sense-map';
import * as CS from '../../types/cached-storage';
import * as R from '../../types/routes';

interface StateFromProps {
  history: History;
  senseObject: CS.CachedStorage;
  scope: MapScope;
}

type RouterProps = RouteComponentProps<{ bid: string }>;

type Props = StateFromProps & ActionProps & RouterProps;

class MapSections extends React.PureComponent<Props> {
  componentWillMount() {
    const { actions: { senseMap } } = this.props;

    // sync the route to the scope
    senseMap.setScopeToFullmap();
  }

  componentDidUpdate() {
    const { history, scope } = this.props;

    // sync the scope to the route
    if (scope.type !== T.MapScopeType.FULL_MAP) {
      // XXX: can I get the router basename here?
      history.push(`${process.env.PUBLIC_URL}${R.index}${scope.box}`);
    }
  }

  render() {
    return (
      <React.Fragment>
        <SBreadcrumb.Section
          link
          as={Link}
          to={R.dashboard}
        >
          Dashboard
        </SBreadcrumb.Section>
        <SBreadcrumb.Divider icon="right angle" />
        <SBreadcrumb.Section active>Map</SBreadcrumb.Section>
      </React.Fragment>
    );
  }
}

class MapBoxSections extends React.PureComponent<Props & { bid: string }> {
  componentWillMount() {
    const { actions: { senseMap }, bid } = this.props;

    // sync the route to the scope
    senseMap.setScopeToBox(bid);
  }

  componentDidUpdate() {
    const { history, scope } = this.props;

    // sync the scope to the route
    if (scope.type === T.MapScopeType.FULL_MAP) {
      history.push(`${process.env.PUBLIC_URL}${R.index}`);
    }
  }

  render() {
    const { actions: { senseMap, selection }, senseObject, bid } = this.props;
    const box = CS.getBox(senseObject, bid);

    return (
      <React.Fragment>
        <SBreadcrumb.Section
          link
          as={Link}
          to={R.dashboard}
        >
          Dashboard
        </SBreadcrumb.Section>
        <SBreadcrumb.Divider icon="right angle" />
        <SBreadcrumb.Section
          link
          as={Link}
          to={R.index}
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
      <Segment compact className="breadcrumb">
        <SBreadcrumb>
        <Switch>
          <Route path={R.dashboard}>
            {() => <SBreadcrumb.Section active>Dashboard</SBreadcrumb.Section>}
          </Route>
          <Route path={R.importer}>
            {() => (
              <React.Fragment>
                <SBreadcrumb.Section
                  link
                  as={Link}
                  to={R.dashboard}
                >
                  Dashboard
                </SBreadcrumb.Section>
                <SBreadcrumb.Divider icon="right angle" />
                <SBreadcrumb.Section active>Import</SBreadcrumb.Section>
              </React.Fragment>
            )}
          </Route>
          <Route exact path={R.index}>
            {() => <MapSections {...this.props} />}
          </Route>
          <Route path={`${R.index}:bid`}>
            {({ match: { params: { bid }} }) => <MapBoxSections {...this.props} bid={bid} />}
          </Route>
        </Switch>
        </SBreadcrumb>
      </Segment>
    );
  }
}

export default withRouter(connect<StateFromProps, ActionProps, RouterProps>(
  (state: T.State, router) => {
    const { senseObject } = state;
    const { scope } = state.senseMap;
    const { history } = router;

    return { history, senseObject, scope };
  },
  mapDispatch({ actions })
)(Breadcrumb));
