import * as React from 'react';
import { connect } from 'react-redux';
import {
  State,
  actions,
  ActionProps,
  EdgeID,
  Edge,
  mapDispatch
} from '../../../types';
import { History, ChangeType, HistoryType } from '../../../types/sense/history';
import { List } from 'semantic-ui-react';
import HistoryItem from './HistoryItem';
import * as CS from '../../../types/cached-storage';

interface OwnProps {
  edge: EdgeID;
}

interface StateFromProps {
  edge: Edge;
  histories: History[];
}

type Props = StateFromProps & ActionProps;

class EdgeHistory extends React.PureComponent<Props> {
  componentDidMount() {
    const { actions: acts } = this.props;
    acts.senseObject.loadHistories({ historyType: HistoryType.OBJECT }, true);
  }

  componentDidUpdate(prevProps: Props) {
    const { actions: acts, edge } = this.props;
    if (prevProps.edge.id !== edge.id) {
      acts.senseObject.loadHistories({ historyType: HistoryType.OBJECT }, true);
    }
  }

  render() {
    const { histories } = this.props;

    return (
      <List className="edge-history__histories">
        {histories.map(h => <HistoryItem key={h.id} data={h} />)}
      </List>
    );
  }
}

export default connect<State, ActionProps, OwnProps, Props>(
  (state: State) => state,
  mapDispatch({ actions }),
  (state, actionProps, props) => {
    const { senseObject } = state;
    const { edge: eid } = props;
    const edge = CS.getEdge(senseObject, eid);
    // TODO: use a function
    let histories =
      Object.values(senseObject[CS.TargetType.PERMANENT].histories)
        .filter(h => {
          for (const c of h.changes) {
            if (
              (
                c.changeType === ChangeType.CREATE_EDGE ||
                c.changeType === ChangeType.DELETE_EDGE
              ) &&
              c.from === edge.from && c.to === edge.to
            ) {
              return true;
            }
          }
          return false;
        });

    return { actions: actionProps.actions, edge, histories };
  }
)(EdgeHistory);