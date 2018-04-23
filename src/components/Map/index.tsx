
import * as React from 'react';
import { connect } from 'react-redux';
import { Stage, Layer } from 'react-konva';
import MapBox from '../MapBox';
import MapCard from '../MapCard';
import * as SC from '../../types/sense-card';
import * as SM from '../../types/sense-map';
import * as T from '../../types';

interface StateFromProps {
  cards: SM.MapObject[];
}

interface DispatchFromProps {
  actions: {
    createCard: (data: SC.CardData, position: SM.PositionInMap) => T.Action,
// tslint:disable-next-line:no-any
    loadCards: (mapId: SM.MapID) => any
  };
}

type Props = StateFromProps & DispatchFromProps;

class Map extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleDblClick = this.handleDblClick.bind(this);
  }

  componentDidMount() {
    this.props.actions.loadCards('cjfrxpxuzdw1k01790lvp0edn');
  }

  // tslint:disable-next-line:no-any
  handleDblClick(e: any) {
    this.props.actions.createCard(
      SC.sampleCardList[0],
      [e.evt.layerX, e.evt.layerY]
    );
  }

  render() {
    const cards = this.props.cards.map(card => (
      <MapCard x={card.position[0]} y={card.position[1]} key={card.id} />
    ));
    return (
      <Stage width={960} height={600} onDblClick={this.handleDblClick}>
        <Layer>
          <MapBox x={130} y={30} />
          {cards}
        </Layer>
      </Stage>
    );
  }
}

export default connect<StateFromProps, DispatchFromProps>(
  (state: T.State) => ({
    cards: state.senseMap.cards
  }),
  (dispatch: T.Dispatch) => ({
    actions: {
      createCard: (data: SC.CardData, position: SM.PositionInMap) =>
        dispatch(T.actions.senseMap.createCard(data, position)),
      loadCards: (mapId: SM.MapID) =>
        dispatch(T.actions.senseMap.loadCards(mapId))
    }
  })
)(Map);
