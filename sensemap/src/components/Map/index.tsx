
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
import * as SO from '../../types/sense-object';
import * as V from '../../types/viewport';
import { Event as KonvaEvent } from '../../types/konva';

export interface StateFromProps {
  selection: T.State['selection'];
  senseObject: T.State['senseObject'];
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

type ViewportState = T.State['viewport'];

export interface OwnProps extends ViewportState {}

export type Props = StateFromProps & DispatchFromProps & OwnProps;

const makeTransform: V.StateToTransform =
  ({ top, left }) => ({ x, y }) => ({ x: x - left, y: y - top });

const makeInverseTransform: V.StateToTransform =
  ({ top, left }) => ({ x, y }) => ({ x: x + left, y: y + top });

function renderEdge(e: T.Edge, props: Props) {
  const edgeProps = {
    from: SO.getObject(props.senseObject, e.from),
    to: SO.getObject(props.senseObject, e.to),
    transform: makeTransform(props),
    inverseTransform: makeInverseTransform(props),
  };
  return <Edge key={e.id} {...edgeProps} />;
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
      if (!props.senseObject.cards[o.data]) {
        return <Group key={o.id} />;
      }
      return (
        <Card
          key={o.id}
          mapObject={o}
          transform={transform}
          inverseTransform={inverseTransform}
          card={props.senseObject.cards[o.data]}
          selected={isSelected}
          toggleSelection={handleSelection}
          moveObject={moveObject}
          openCard={(id) => changeStatus(OE.StatusType.SHOW)}
        />);
    }
    case T.ObjectType.BOX: {
      if (!props.senseObject.boxes[o.data]) {
        return <Group key={o.id} />;
      }
      return (
        <Box
          key={o.id}
          mapObject={o}
          transform={transform}
          inverseTransform={inverseTransform}
          box={props.senseObject.boxes[o.data]}
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
  const { clearSelection } = props.actions;
  const objects = Object.values(props.senseObject.objects).map(o => renderObject(o, props));
  const edges = Object.values(props.senseObject.edges).map(g => renderEdge(g, props));
  let stage: Stage | null = null;

  return (
    <Stage
      ref={(node) => stage = node as (Stage | null)}
      width={props.width}
      height={props.height}
      onClick={() => clearSelection()}
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
