
import * as React from 'react';
import { Stage, Layer } from 'react-konva';
import MapBox from '../MapBox';
import MapCard from '../MapCard';
import * as SO from '../../types/sense-object';
import * as SC from '../../types/sense-card';
import * as SB from '../../types/sense-box';
import * as SL from '../../types/selection';
import { connect } from 'react-redux';
import * as T from '../../types';

interface StateFromProps {
  selection: SO.ObjectID[];
}

interface DispatchFromProps {
  actions: {
    toggleObjectSelection(id: SO.ObjectID): T.Action
  };
}

interface PropsFromParent {
  width: number;
  height: number;
  objects: { [key: string]: SO.ObjectData };
  cards: { [key: string]: SC.CardData };
  boxes: { [key: string]: SB.BoxData };
}

type Props = StateFromProps & DispatchFromProps & PropsFromParent;

function renderObject(o: SO.ObjectData, props: Props) {
  const toggleSelection = props.actions.toggleObjectSelection;
  switch (o.objectType) {
    case SO.ObjectType.Card: {
      return (
        <MapCard
          mapObject={o}
          card={props.cards[o.data]}
          selected={SL.contains(props.selection, o.id)}
          toggleSelection={toggleSelection}
        />);
    }
    case SO.ObjectType.Box: {
      return (
        <MapBox
          mapObject={o}
          box={props.boxes[o.data]}
          selected={SL.contains(props.selection, o.id)}
          toggleSelection={toggleSelection}
        />);
    }
    default: {
      throw Error(`Unknown ObjectData ${typeof o}`);
    }
  }
}

function Map(props: Props) {
  const objects = Object.values(props.objects)
    .filter(o => !o.belongsTo)
    .map(o => renderObject(o, props));
  return (
    <Stage width={props.width} height={props.height}>
      <Layer>
        {objects}
      </Layer>
    </Stage>
  );
}

export default connect<StateFromProps, DispatchFromProps, PropsFromParent>(
  (state: T.State) => ({
    selection: state.selection
  }),
  (dispatch: T.Dispatch) => ({
    actions: {
      toggleObjectSelection: (id: SO.ObjectID) =>
        dispatch(T.actions.selection.toggleObjectSelection(id)),
    }
  })
)(Map);
