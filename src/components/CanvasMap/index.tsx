
import * as React from 'react';
import { connect } from 'react-redux';
import { Stage, Layer } from 'react-konva';
import CanvasBox from '../CanvasBox';
import CanvasCard from '../CanvasCard';
import * as SM from '../../types/sense-map';
import * as T from '../../types';

interface StateFromProps {
  cards: SM.CanvasObject[];
}

interface DispatchFromProps {
  actions: {
    createCard: (data: SM.CardData, position: SM.PositionInMap) => T.Action
  };
}

type Props = StateFromProps & DispatchFromProps;

class Map extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleDblClick = this.handleDblClick.bind(this);
  }

  // tslint:disable-next-line:no-any
  handleDblClick(e: any) {
    this.props.actions.createCard(
      {
        type: SM.CardType.Empty,
        title: 'Yo',
        description: 'Yooo'
      },
      [e.evt.layerX, e.evt.layerY]
    );
  }

  render() {
    const cards = this.props.cards.map(card => (
      <CanvasCard x={card.position[0]} y={card.position[1]} key={card.id} />
    ));
    return (
      <Stage width={960} height={600} onDblClick={this.handleDblClick}>
        <Layer>
          <CanvasBox x={130} y={30} />
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
      createCard: (data: SM.CardData, position: SM.PositionInMap) =>
        dispatch(T.actions.senseMap.createCard(data, position))
    }
  })
)(Map);
