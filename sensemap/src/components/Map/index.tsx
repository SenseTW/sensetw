
import * as React from 'react';
import { Stage, Layer } from 'react-konva';
import Box from './Box';
import Card from './Card';
import Edge from './Edge';
import { Group } from 'react-konva';
import * as SL from '../../types/selection';
import * as T from '../../types';
import * as I from '../../types/input';
import * as OE from '../../types/object-editor';
import * as O from '../../types/sense/object';
import * as F from '../../types/sense/focus';
import { Event as KonvaEvent } from '../../types/konva';

export interface StateFromProps {
  selection: T.State['selection'];
  objects:   T.State['senseObject']['objects'];
  cards:     T.State['senseObject']['cards'];
  boxes:     T.State['senseObject']['boxes'];
  edges:     T.State['senseObject']['edges'];
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
    stageMouseUp(): T.ActionChain,
    stageMouseDown(): T.ActionChain,
    stageMouseMove({ dx, dy }: { dx: number, dy: number }): T.ActionChain,
    focusObject(focus: F.Focus): T.ActionChain,
    changeStatus(status: OE.StatusType): T.ActionChain,
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
    y: y - top,
  });
}

function makeInverseTransform(props: ViewportProps): GeometryTransform {
  const { top, left } = props;
  return ({ x, y }) => ({
    x: x + left,
    y: y + top,
  });
}

function renderEdge(e: T.Edge, props: Props) {
  const from = props.objects[e.from];
  const to = props.objects[e.to];
  return <Edge key={e.id} from={from} to={to} />;
}

function renderObject(o: T.ObjectData, props: Props) {
  const addObjectToSelection = props.actions.addObjectToSelection;
  const toggleSelection = props.actions.toggleObjectSelection;
  const clearSelection = props.actions.clearSelection;
  const moveObject = props.actions.moveObject;
  const openBox = props.actions.openBox;
  const focusObject = props.actions.focusObject;
  const changeStatus = props.actions.changeStatus;
  const isMultiSelectable = I.isMultiSelectable(props.input);
  const isSelected = SL.contains(props.selection, o.id);
  const transform = makeTransform(props);
  const inverseTransform = makeInverseTransform(props);

  const handleSelection = (e: KonvaEvent.Mouse, data: T.ObjectData) => {
    // stop event propagation by setting the e.cancelBubble
    // notice that it's useless to set e.evt.cancelBubble directly
    // check: https://github.com/lavrton/react-konva/issues/139
    e.cancelBubble = true;

    if (isMultiSelectable) {
      focusObject(F.focusNothing());
      toggleSelection(data.id);
    } else {
      clearSelection();
      if (!isSelected || props.selection.length > 1) {
        focusObject(O.toFocus(data));
        addObjectToSelection(data.id);
      } else {
        focusObject(F.focusNothing());
      }
    }
  };

  switch (o.objectType) {
    case T.ObjectType.NONE: {
      return <Group key={o.id} />;
    }
    case T.ObjectType.CARD: {
      if (!props.cards[o.data]) {
        return <Group key={o.id} />;
      }
      return (
        <Card
          key={o.id}
          mapObject={o}
          transform={transform}
          inverseTransform={inverseTransform}
          card={props.cards[o.data]}
          selected={isSelected}
          toggleSelection={handleSelection}
          moveObject={moveObject}
          openCard={(id) => changeStatus(OE.StatusType.SHOW)}
        />);
    }
    case T.ObjectType.BOX: {
      if (!props.boxes[o.data]) {
        return <Group key={o.id} />;
      }
      return (
        <Box
          key={o.id}
          mapObject={o}
          transform={transform}
          inverseTransform={inverseTransform}
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

// tslint:disable-next-line:no-any
function handleMouseDown(e: any, props: Props) {
  if (e.target && e.target.nodeType === 'Stage') {
    props.actions.stageMouseDown();
  }
}

// tslint:disable-next-line:no-any
function handleMouseUp(e: any, props: Props) {
  props.actions.stageMouseUp();
}

export function Map(props: Props) {
  const clearSelection = props.actions.clearSelection;
  const objects = Object.values(props.objects).map(o => renderObject(o, props));
  const edges = Object.values(props.edges).map(g => renderEdge(g, props));
  let stage: Stage | null = null;

  return (
    <Stage
      ref={(node) => stage = node as (Stage | null)}
      width={props.width}
      height={props.height}
      onClick={() => clearSelection()}
      // tslint:disable-next-line:no-console
      onMouseDown={(e: Event) => handleMouseDown(e, props)}
      onMouseUp={(e: Event) => handleMouseUp(e, props)}
      onMouseMove={(e: Event) => handleMouseMove(e, props)}
    >
      <Layer>
        {edges}
        {objects}
      </Layer>
    </Stage>
  );
}

export default Map;
