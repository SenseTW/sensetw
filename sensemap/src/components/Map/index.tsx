
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
  selection:   T.State['selection'];
  senseObject: T.State['senseObject'];
  input:       T.State['input'];
  stage:       T.State['stage'];
}

export interface DispatchFromProps {
  actions: {
    removeObjectFromSelection: typeof T.actions.selection.removeObjectFromSelection,
    addObjectToSelection:      typeof T.actions.selection.addObjectToSelection,
    toggleObjectSelection:     typeof T.actions.selection.toggleObjectSelection,
    clearSelection:            typeof T.actions.selection.clearSelection,

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

interface State {
  objects: T.State['senseObject']['objects'];
  edges:   T.State['senseObject']['edges'];
  objectDragStart: {
    x: number,
    y: number,
  };
}

const makeTransform: V.StateToTransform =
  ({ top, left }) => ({ x, y }) => ({ x: x - left, y: y - top });

const makeInverseTransform: V.StateToTransform =
  ({ top, left }) => ({ x, y }) => ({ x: x + left, y: y + top });

export class Map extends React.Component<Props, State> {

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      objects: props.senseObject.objects,
      edges:   props.senseObject.edges,
    };
  }

  constructor(props: Props) {
    super(props);

    this.handleClick           = this.handleClick.bind(this);
    this.handleMouseDown       = this.handleMouseDown.bind(this);
    this.handleMouseMove       = this.handleMouseMove.bind(this);
    this.handleMouseUp         = this.handleMouseUp.bind(this);
    this.handleObjectDragStart = this.handleObjectDragStart.bind(this);
    this.handleObjectDragMove  = this.handleObjectDragMove.bind(this);
    this.handleObjectDragEnd   = this.handleObjectDragEnd.bind(this);

    this.state = {
      objects: this.props.senseObject.objects,
      edges:   this.props.senseObject.edges,
      objectDragStart: { x: 0, y: 0 },
    };
  }

  handleMouseMove(e: KonvaEvent.Mouse) {
    if (this.props.stage.mouseDown) {
      const dx = e.evt.movementX;
      const dy = e.evt.movementY;
      this.props.actions.stageMouseMove({ dx, dy });
    }
    return;
  }

  // tslint:disable-next-line:no-any
  handleMouseDown(e: any) {
    if (e.target && e.target.nodeType === 'Stage') {
      this.props.actions.stageMouseDown();
    }
  }

  handleMouseUp(e: KonvaEvent.Mouse) {
    this.props.actions.stageMouseUp();
  }

  // tslint:disable-next-line:no-any
  handleClick(e: any) {
    if (e.target && e.target.nodeType === 'Stage') {
      this.props.actions.clearSelection();
    }
  }

  handleObjectDragStart(e: KonvaEvent.Mouse) {
    const x = e.evt.layerX;
    const y = e.evt.layerY;
    this.setState({ objectDragStart: { x, y } });
  }

  handleObjectDragMove(e: KonvaEvent.Mouse) {
    const dx = e.evt.layerX - this.state.objectDragStart.x;
    const dy = e.evt.layerY - this.state.objectDragStart.y;
    const objects = this.props.selection.map(id => {
      const o = SO.getObject(this.props.senseObject, id);
      return { ...o, x: o.x + dx, y: o.y + dy };
    }).reduce((a, o) => { a[o.id] = o; return a; }, {});
    this.setState({ objects: { ...this.state.objects, ...objects } });
  }

  handleObjectDragEnd(e: KonvaEvent.Mouse) {
    const dx = e.evt.layerX - this.state.objectDragStart.x;
    const dy = e.evt.layerY - this.state.objectDragStart.y;
    this.props.selection.forEach(id => {
      const o = SO.getObject(this.props.senseObject, id);
      this.props.actions.moveObject(id, o.x + dx, o.y + dy);
    });
    this.setState({ objectDragStart: { x: 0, y: 0 } });
  }

  render() {
    const objects = Object.values(this.state.objects).map(o => this.renderObject(o));
    const edges =   Object.values(this.state.edges).map(e => this.renderEdge(e));
    let stage: Stage | null = null;

    return (
      <Stage
        ref={(node) => stage = node as (Stage | null)}
        width={this.props.width}
        height={this.props.height}
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
      >
        <Layer>
          {edges}
          {objects}
        </Layer>
      </Stage>
    );
  }

  renderObject(o: T.ObjectData) {
    const {
      addObjectToSelection, removeObjectFromSelection, clearSelection, openBox, focusObject, changeStatus
    } = this.props.actions;

    const isMultiSelectable = I.isMultiSelectable(this.props.input);
    const isSelected = SL.contains(this.props.selection, o.id);
    const transform = makeTransform(this.props);
    const inverseTransform = makeInverseTransform(this.props);

    const handleObjectSelect = (data: T.ObjectData) => {
      if (isMultiSelectable) {
        focusObject(F.focusNothing());
        addObjectToSelection(data.id);
      } else {
        clearSelection();
        focusObject(O.toFocus(data));
        addObjectToSelection(data.id);
      }
    };

    const handleObjectDeselect = (data: T.ObjectData) => {
      removeObjectFromSelection(data.id);
      if (this.props.selection.length === 1) {
        focusObject(O.toFocus(SO.getObject(this.props.senseObject, this.props.selection[0])));
      } else {
        focusObject(F.focusNothing());
      }
    };

    switch (o.objectType) {
      case T.ObjectType.NONE: {
        return <Group key={o.id} />;
      }
      case T.ObjectType.CARD: {
        if (!this.props.senseObject.cards[o.data]) {
          return <Group key={o.id} />;
        }
        return (
          <Card
            key={o.id}
            mapObject={o}
            transform={transform}
            inverseTransform={inverseTransform}
            card={this.props.senseObject.cards[o.data]}
            selected={isSelected}
            handleSelect={handleObjectSelect}
            handleDeselect={handleObjectDeselect}
            handleDragStart={this.handleObjectDragStart}
            handleDragMove={this.handleObjectDragMove}
            handleDragEnd={this.handleObjectDragEnd}
            openCard={(id) => changeStatus(OE.StatusType.SHOW)}
          />);
      }
      case T.ObjectType.BOX: {
        if (!this.props.senseObject.boxes[o.data]) {
          return <Group key={o.id} />;
        }
        return (
          <Box
            key={o.id}
            mapObject={o}
            transform={transform}
            inverseTransform={inverseTransform}
            box={this.props.senseObject.boxes[o.data]}
            selected={isSelected}
            handleSelect={handleObjectSelect}
            handleDeselect={handleObjectDeselect}
            handleDragStart={this.handleObjectDragStart}
            handleDragMove={this.handleObjectDragMove}
            handleDragEnd={this.handleObjectDragEnd}
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

  renderEdge(e: T.Edge) {
    const edgeProps = {
      from: SO.getObject(this.props.senseObject, e.from),
      to: SO.getObject(this.props.senseObject, e.to),
      transform: makeTransform(this.props),
      inverseTransform: makeInverseTransform(this.props),
    };
    return <Edge key={e.id} {...edgeProps} />;
  }
}

export default Map;
