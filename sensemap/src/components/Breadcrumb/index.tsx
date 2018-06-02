import * as React from 'react';
import { History } from 'history';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Breadcrumb as SBreadcrumb } from 'semantic-ui-react';
import * as T from '../../types';
import { actions, ActionProps, mapDispatch } from '../../types';
import * as R from '../../types/routes';

interface StateFromProps {
  history: History;
  scope: typeof T.initial.senseMap.scope;
  boxes: typeof T.initial.senseObject.boxes;
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
    const { actions: { senseMap, selection }, scope, boxes, bid } = this.props;
    let box = { title: bid };
    if (scope.type === T.MapScopeType.BOX) {
      box = boxes[scope.box] || box;
    }

    return (
      <Segment compact className="breadcrumb">
        <SBreadcrumb>
          {
            scope.type === T.MapScopeType.BOX &&
              (
                <React.Fragment>
                  <SBreadcrumb.Section active>{box.title}</SBreadcrumb.Section>
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
    const { boxes } = state.senseObject;
    const { scope } = state.senseMap;
    const { history } = router;
    const { bid } = router.match.params;

    return { history, scope, boxes, bid };
  },
  mapDispatch({ actions })
)(Breadcrumb));
