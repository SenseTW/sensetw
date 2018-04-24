
import * as React from 'react';
// import { connect } from 'react-redux';
import { Stage, Layer } from 'react-konva';
import MapBox from '../MapBox';
import MapCard from '../MapCard';
// import * as SC from '../../types/sense-card';
import * as SM from '../../types/sense-map';
// import * as T from '../../types';

/*
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
*/

interface Props {
  width: number;
  height: number;
  objects: SM.MapObject[];
}

function renderCard(o: SM.MapObject) {
  return <MapCard mapObject={o} />;
}

function renderBox(o: SM.MapObject) {
  return <MapBox mapObject={o} />;
}

function Map(props: Props) {
  const objects = props.objects.map(
    o => {
      switch (o.objectType) {
        case SM.ObjectType.CARD: return renderCard(o);
        case SM.ObjectType.BOX: return renderBox(o);
        default: throw Error('This never happens.');
      }
    });
  return (
    <Stage width={props.width} height={props.height}>
      <Layer>
        {objects}
      </Layer>
    </Stage>
  );
}

export default Map;

/*
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
*/
