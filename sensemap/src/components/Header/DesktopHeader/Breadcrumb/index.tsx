import * as React from 'react';
import { Switch, Route, Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Breadcrumb as SBreadcrumb } from 'semantic-ui-react';
import * as T from '../../../../types';
import { actions, ActionProps, mapDispatch } from '../../../../types';
import * as B from '../../../../types/sense/box';
import * as M from '../../../../types/sense/map';
import { MapScope } from '../../../../types/sense-map';
import * as CS from '../../../../types/cached-storage';
import * as R from '../../../../types/routes';

// tslint:disable-next-line:no-any
type MyRouteProps = RouteComponentProps<any>;

interface StateFromProps {
  senseObject: CS.CachedStorage;
  scope: MapScope;
}

type Props = StateFromProps & ActionProps;

class MapSections extends React.PureComponent<Props & { map: T.MapData }> {
  render() {
    const { map } = this.props;

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
        <SBreadcrumb.Section active>{map.name || map.id}</SBreadcrumb.Section>
      </React.Fragment>
    );
  }
}

class MapBoxSections extends React.PureComponent<Props & { map: T.MapData, box: T.BoxData }> {
  render() {
    const { actions: { senseMap, selection }, map, box } = this.props;

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
          to={R.toMapPath({ mid: map.id })}
          onClick={() => {
            selection.clearSelection();
            senseMap.setScopeToFullmap();
          }}
        >
          {map.name || map.id}
        </SBreadcrumb.Section>
        <SBreadcrumb.Divider icon="right angle" />
        <SBreadcrumb.Section active>
          {box.title || box.id}
        </SBreadcrumb.Section>
      </React.Fragment>
    );
  }
}

class Breadcrumb extends React.PureComponent<Props> {
  render() {
    const { senseObject } = this.props;
    const getMap = (mid: T.MapID): T.MapData => {
      let map = CS.getMap(senseObject, mid);
      map = M.isEmpty(map) ? M.mapData({ id: mid }) : map;
      return map;
    };
    const getBox = (bid: T.BoxID): T.BoxData => {
      let box = CS.getBox(senseObject, bid);
      box = B.isEmpty(box) ? B.boxData({ id: bid }) : box;
      return box;
    };

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
            {({ match: { params: { mid }} }) =>
                <MapSections {...this.props} map={getMap(mid)} />}
          </Route>
          <Route path={R.submap}>
            {({ match: { params: { mid, bid }} }) =>
                <MapBoxSections {...this.props} map={getMap(mid)} box={getBox(bid)} />}
          </Route>
        </Switch>
      </SBreadcrumb>
    );
  }
}

export default withRouter(connect<StateFromProps, ActionProps, MyRouteProps>(
  (state: T.State) => {
    const { senseObject } = state;
    const { scope } = state.senseMap;

    return { senseObject, scope };
  },
  mapDispatch({ actions })
)(Breadcrumb));
