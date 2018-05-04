import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Segment, Breadcrumb as SBreadcrumb } from 'semantic-ui-react';
import * as T from '../../types';
import * as SM from '../../types/sense-map';
import * as SB from '../../types/sense-box';
import * as R from '../../types/routes';

interface StateFromProps {
  box: SB.BoxData;
}

interface DispatchFromProps {
  actions: {
    setScopeToFullmap(): T.ActionChain;
  };
}

type Props = StateFromProps & DispatchFromProps;

class Breadcrumb extends React.PureComponent<Props> {

  render() {
    const { actions, box } = this.props;

    return (
      <Segment compact className="breadcrumb">
      <SBreadcrumb>
        {
          box.id !== SB.emptyBoxData.id
            ? (
              <SBreadcrumb.Section
                link
                as={Link}
                to={R.index}
                onClick={() => actions.setScopeToFullmap()}
              >
                Map
              </SBreadcrumb.Section>
            )
            : <SBreadcrumb.Section active>Map</SBreadcrumb.Section>
        }
        {
          box.id !== SB.emptyBoxData.id &&
            (
              <React.Fragment>
                <SBreadcrumb.Divider icon="right angle" />
                <SBreadcrumb.Section active>{box.title}</SBreadcrumb.Section>
              </React.Fragment>
            )
        }
      </SBreadcrumb>
      </Segment>
    );
  }
}

export default connect<StateFromProps, DispatchFromProps>(
  (state: T.State) => {
    const { senseObject } = state;
    const { scope } = state.senseMap;

    switch (scope.type) {
      case SM.MapScopeType.BOX:
        return { box: senseObject.boxes[scope.box || ''] || SB.emptyBoxData };
      case SM.MapScopeType.FULL_MAP:
      default:
        return { box: SB.emptyBoxData };
    }
  },
  (dispatch: T.Dispatch) => ({
    actions: {
      setScopeToFullmap: () => dispatch(SM.actions.setScopeToFullmap())
    }
  })
)(Breadcrumb);