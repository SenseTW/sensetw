
import * as React from 'react';
// import { connect } from 'react-redux';
import { Stage, Layer } from 'react-konva';
import MapBox from '../MapBox';
import MapCard from '../MapCard';
// import * as SC from '../../types/sense-card';
import * as SO from '../../types/sense-object';
// import * as T from '../../types';

/*
interface StateFromProps {
  cards: SO.ObjectData[];
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
  objects: SO.ObjectData[];
}

function renderObject(o: SO.ObjectData) {
  switch (o.objectType) {
    case SO.ObjectType.Card: {
      return <MapCard mapObject={o as SO.CardObjectData} />;
    }
    case SO.ObjectType.Box: {
      return <MapBox mapObject={o as SO.BoxObjectData} />;
    }
    default: {
      throw Error(`Unknown ObjectData ${typeof o}`);
    }
  }
}

function Map(props: Props) {
  const objects = props.objects.map(o => renderObject(o));
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
