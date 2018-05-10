
import * as React from 'react';
import { Stage, Layer } from 'react-konva';
import MapBox from '../MapBox';
import MapCard from '../MapCard';
import { Group } from 'react-konva';
import * as SL from '../../types/selection';
import * as T from '../../types';
import * as OE from '../../types/object-editor';
import * as SO from '../../types/sense-object';

export interface StateFromProps {
  selection: T.State['selection'];
  objects:   T.State['senseObject']['objects'];
  cards:     T.State['senseObject']['cards'];
  boxes:     T.State['senseObject']['boxes'];
}

export interface DispatchFromProps {
  actions: {
    toggleObjectSelection(id: T.ObjectID): T.ActionChain,
    moveObject(id: T.ObjectID, x: number, y: number): T.ActionChain,
    addCardToBox(card: T.ObjectID, box: T.BoxID): T.ActionChain,
    removeCardFromBox(card: T.ObjectID, box: T.BoxID): T.ActionChain,
    openBox(box: T.BoxID): T.ActionChain,
    selectObject(status: OE.Status): T.ActionChain,
  };
}

export interface OwnProps {
  width: number;
  height: number;
}

export type Props = StateFromProps & DispatchFromProps & OwnProps;

const renderObject = (o: T.ObjectData, props: Props) => {
  const toggleSelection = props.actions.toggleObjectSelection;
  const moveObject = props.actions.moveObject;
  const openBox = props.actions.openBox;
  const selectObject = props.actions.selectObject;

  switch (o.objectType) {
    case T.ObjectType.NONE: {
      return <Group />;
    }
    case T.ObjectType.CARD: {
      if (!props.cards[o.data]) {
        return <Group />;
      }
      return (
        <MapCard
          mapObject={o}
          card={props.cards[o.data]}
          selected={SL.contains(props.selection, o.id)}
          toggleSelection={toggleSelection}
          moveObject={moveObject}
          openCard={(id) => selectObject(OE.editCard(SO.getCard(props as SO.State, id)))}
        />);
    }
    case T.ObjectType.BOX: {
      if (!props.boxes[o.data]) {
        return <Group />;
      }
      return (
        <MapBox
          mapObject={o}
          box={props.boxes[o.data]}
          selected={SL.contains(props.selection, o.id)}
          toggleSelection={toggleSelection}
          moveObject={moveObject}
          openBox={openBox}
        />);
    }
    default: {
      throw Error(`Unknown ObjectData type ${o.objectType}`);
    }
  }
};

export function Map(props: Props) {
  const objects = Object.values(props.objects).map(o => renderObject(o, props));
  return (
    <Stage width={props.width} height={props.height}>
      <Layer>
        {objects}
      </Layer>
    </Stage>
  );
}

export default Map;
