import * as React from 'react';
import { connect } from 'react-redux';
import {
  State,
  actions,
  ActionProps,
  MapID,
  BoxID,
  BoxData,
  mapDispatch
} from '../../../types';
import { History, ChangeType, HistoryType } from '../../../types/sense/history';
import { List } from 'semantic-ui-react';
import HistoryItem from './HistoryItem';
import * as CS from '../../../types/cached-storage';

interface OwnProps {
  mapId: MapID;
  box: BoxID;
}

interface StateFromProps {
  mapId: MapID;
  box: BoxData;
  histories: History[];
}

type Props = StateFromProps & ActionProps;

class BoxHistory extends React.PureComponent<Props> {
  componentDidMount() {
    const { actions: acts, mapId } = this.props;
    acts.senseObject.loadHistories({ historyType: HistoryType.OBJECT, map: { id: mapId } }, true);
  }

  componentDidUpdate(prevProps: Props) {
    const { actions: acts, mapId, box } = this.props;
    if (prevProps.box.id !== box.id) {
      acts.senseObject.loadHistories({ historyType: HistoryType.OBJECT, map: { id: mapId } }, true);
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
    const { mapId, box: bid } = props;
    const box = CS.getBox(senseObject, bid);
    // TODO: use a function
    let histories =
      Object.values(senseObject[CS.TargetType.PERMANENT].histories)
        .filter(h => {
          for (const c of h.changes) {
            if (
              (
                c.changeType === ChangeType.ADD_OBJECT_TO_BOX ||
                c.changeType === ChangeType.REMOVE_OBJECT_FROM_BOX
              ) &&
              c.box === box.id
            ) {
              return true;
            }
          }
          return false;
        });

    return { actions: actionProps.actions, mapId, box, histories };
  }
)(BoxHistory);