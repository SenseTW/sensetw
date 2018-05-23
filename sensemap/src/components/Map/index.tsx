
import * as React from 'react';
import { Stage, Layer } from 'react-konva';
import MapBox from '../MapBox';
import MapCard from '../MapCard';
import { Group } from 'react-konva';
import * as SL from '../../types/selection';
import * as T from '../../types';
import * as OE from '../../types/object-editor';
import * as SO from '../../types/sense-object';
import * as I from '../../types/input';
import { Event as KonvaEvent } from '../../types/konva';

export interface StateFromProps {
  selection: T.State['selection'];
  objects:   T.State['senseObject']['objects'];
  cards:     T.State['senseObject']['cards'];
  boxes:     T.State['senseObject']['boxes'];
  input:     T.State['input'];
  stage:     T.State['stage'];
}

export interface DispatchFromProps {
  actions: {
    addObjectToSelection(id: T.ObjectID): T.ActionChain,
    toggleObjectSelection(id: T.ObjectID): T.ActionChain,
    clearSelection(): T.ActionChain,
    moveObject(id: T.ObjectID, x: number, y: number): T.ActionChain,
    addCardToBox(card: T.ObjectID, box: T.BoxID): T.ActionChain,
    removeCardFromBox(card: T.ObjectID, box: T.BoxID): T.ActionChain,
    openBox(box: T.BoxID): T.ActionChain,
    selectObject(status: OE.Status): T.ActionChain,
    stageMouseUp(): T.ActionChain,
    stageMouseDown(): T.ActionChain,
    stageMouseMove({ dx, dy }: { dx: number, dy: number }): T.ActionChain,
  };
}

interface GeometryProps {
  x: number;
  y: number;
}

interface GeometryTransform {
  (g: GeometryProps): GeometryProps;
}

interface ViewportProps {
  width:  number;
  height: number;
  top:    number;
  left:   number;
}

export interface OwnProps extends ViewportProps {}

export type Props = StateFromProps & DispatchFromProps & OwnProps;

function makeTransform(props: ViewportProps): GeometryTransform {
  const { top, left } = props;
  return ({ x, y }) => ({
    x: x - left,
    y: y - top
  });
}

function renderObject(o: T.ObjectData, props: Props) {
  const addObjectToSelection = props.actions.addObjectToSelection;
  const toggleSelection = props.actions.toggleObjectSelection;
  const clearSelection = props.actions.clearSelection;
  const moveObject = props.actions.moveObject;
  const openBox = props.actions.openBox;
  const selectObject = props.actions.selectObject;
  const isMultiSelectable = I.isMultiSelectable(props.input);
  const isSelected = SL.contains(props.selection, o.id);
  const transform = makeTransform(props);

  const handleSelection = (e: KonvaEvent.Mouse, id: T.ObjectID) => {
    // stop event propagation by setting the e.cancelBubble
    // notice that it's useless to set e.evt.cancelBubble directly
    // check: https://github.com/lavrton/react-konva/issues/139
    e.cancelBubble = true;

    if (isMultiSelectable) {
      toggleSelection(id);
    } else {
      clearSelection();
      if (!isSelected || props.selection.length > 1) {
        addObjectToSelection(id);
      }
    }
  };

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
          transform={transform}
          card={props.cards[o.data]}
          selected={isSelected}
          toggleSelection={handleSelection}
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
          transform={transform}
          box={props.boxes[o.data]}
          selected={isSelected}
          toggleSelection={handleSelection}
          moveObject={moveObject}
          openBox={(id) => {
            clearSelection();
            openBox(id);
          }}
        />);
    }
    default: {
      throw Error(`Unknown ObjectData type ${o.objectType}`);
    }
  }
}

// tslint:disable-next-line:no-any
function handleMouseMove(e: any, props: Props) {
  if (props.stage.mouseDown) {
    const dx = e.evt.movementX;
    const dy = e.evt.movementY;
    props.actions.stageMouseMove({ dx, dy });
  }
  return;
}

export function Map(props: Props) {
  const clearSelection = props.actions.clearSelection;
  const objects = Object.values(props.objects).map(o => renderObject(o, props));
  let stage: Stage | null = null;

  return (
    <Stage
      ref={(node) => stage = node as (Stage | null)}
      width={props.width}
      height={props.height}
      onClick={() => clearSelection()}
      onMouseDown={props.actions.stageMouseDown}
      onMouseUp={props.actions.stageMouseUp}
      onMouseMove={(e: Event) => handleMouseMove(e, props)}
    >
      <Layer>
        {objects}
      </Layer>
    </Stage>
  );
}

export default Map;
