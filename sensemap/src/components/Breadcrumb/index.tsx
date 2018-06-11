import * as React from 'react';
import { History } from 'history';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
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
  bid: string;
}

type RouterProps = RouteComponentProps<{ bid: string }>;

type Props = StateFromProps & ActionProps & RouterProps;

class Breadcrumb extends React.PureComponent<Props> {
  componentWillMount() {
    const { actions: { senseMap }, bid } = this.props;

    // sync the route to the scope
    if (bid) {
      senseMap.setScopeToBox(bid);
    } else {
      senseMap.setScopeToFullmap();
    }
  }

  componentDidUpdate() {
    const { history, scope, bid } = this.props;

    // sync the scope to the route
    if (scope.type === T.MapScopeType.FULL_MAP) {
      if (bid) {
        history.push(R.index);
      }
    } else {
      if (scope.box !== bid) {
        history.push(`${R.index}${scope.box}`);
      }
    }
  }

  render() {
    const { actions: { senseMap, selection }, senseObject, scope, bid } = this.props;
    const box = CS.getBox(senseObject, bid);

    return (
      <Segment compact className="breadcrumb">
        <SBreadcrumb>
          {
            scope.type === T.MapScopeType.BOX &&
              (
                <React.Fragment>
                  <SBreadcrumb.Section active>{
                    box === emptyBoxData
                      ? bid
                      : box.title
                  }</SBreadcrumb.Section>
                  <SBreadcrumb.Divider icon="left angle" />
                </React.Fragment>
              )
          }
          {
            scope.type === T.MapScopeType.BOX
              ? (
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
              )
              : <SBreadcrumb.Section active>Map</SBreadcrumb.Section>
          }
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
    const { bid } = router.match.params;

    return { history, senseObject, scope, bid };
  },
  mapDispatch({ actions })
)(Breadcrumb));
