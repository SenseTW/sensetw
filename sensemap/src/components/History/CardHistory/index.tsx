import * as React from 'react';
import { connect } from 'react-redux';
import { State, actions, ActionProps, CardData, CardID, mapDispatch } from '../../../types';
import { History } from '../../../types/sense/history';
import { List } from 'semantic-ui-react';
import HistoryItem from './HistoryItem';
import * as CS from '../../../types/cached-storage';

interface OwnProps {
  card: CardID;
}

interface StateFromProps {
  card: CardData;
  histories: History[];
}

type Props = StateFromProps & ActionProps;

class CardHistory extends React.PureComponent<Props> {
  componentDidMount() {
    const { actions: acts, card } = this.props;
    acts.senseObject.loadHistories({ card: { id: card.id } }, true);
  }

  componentDidUpdate(prevProps: Props) {
    const { actions: acts, card } = this.props;
    if (prevProps.card.id !== card.id) {
      acts.senseObject.loadHistories({ card: { id: card.id }}, true);
    }
  }

  render() {
    const { histories } = this.props;

    return (
      <List className="card-history__histories">
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
    const { card: cid } = props;
    const card = CS.getCard(senseObject, cid);
    // TODO: use a function
    const histories = Object.values(senseObject[CS.TargetType.PERMANENT].histories);

    return { actions: actionProps.actions , card, histories };
  }
)(CardHistory);