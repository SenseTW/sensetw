import * as React from 'react';
import { connect } from 'react-redux';
import { State, MapData } from '../../../types';
import { History } from '../../../types/sense/history';
import { List } from 'semantic-ui-react';
import HistoryItem from './HistoryItem';
import * as CS from '../../../types/cached-storage';

interface Props {
  map: MapData;
  histories: History[];
}

class MapHistory extends React.PureComponent<Props> {
  render() {
    const { histories } = this.props;

    return (
      <List className="map-history__histories">
        {histories.map(h => <HistoryItem key={h.id} data={h} />)}
      </List>
    );
  }
}

export default connect<Props>(
  (state: State) => {
    const { senseObject } = state;
    const { map: mid } = state.senseMap;
    const map = CS.getMap(senseObject, mid);
    // TODO: use a function
    const histories = Object.values(senseObject[CS.TargetType.PERMANENT].histories);

    return { map, histories };
  }
)(MapHistory);