import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
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
      <div className="breadcrumb">
        {
          box.id !== SB.emptyBoxData.id
            ? (
              <Link
                to={R.index}
                onClick={() => actions.setScopeToFullmap()}
              >
                Map
              </Link>
            )
            : <span>Map</span>
        }
        {
          box.id !== SB.emptyBoxData.id &&
            (
              <React.Fragment>
                <span>></span>
                <span>{box.title}</span>
              </React.Fragment>
            )
        }
      </div>
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