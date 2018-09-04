
import * as React from 'react';
import { Stage, Layer } from 'react-konva';
import Box from './Box';
import Card from './Card';
import Edge from './Edge';
import { Group } from 'react-konva';
import * as SL from '../../types/selection';
import { Edge as EdgeData, ObjectType, ObjectData, State, ActionProps } from '../../types';
import { ObjectMap } from '../../types/sense/has-id';
import * as I from '../../types/input';
import * as OE from '../../types/object-editor';
import * as O from '../../types/sense/object';
import * as F from '../../types/sense/focus';
import * as CS from '../../types/cached-storage';
import * as V from '../../types/viewport';
import * as S from '../../types/stage';
import * as G from '../../graphics/point';
import { NodeType, Event as KonvaEvent } from '../../types/konva';

export interface StateFromProps {
  selection:   State['selection'];
  senseObject: CS.CachedStorage;
  inScope:     CS.CachedStorage;
  input:       State['input'];
  stage:       State['stage'];
}

type ViewportState = State['viewport'];

export interface OwnProps extends ViewportState {}

export type Props = StateFromProps & ActionProps & OwnProps;

interface MapState {
  prevDragPoint: G.Point;
  prevTouchPoint: G.Point;
  dropTarget: ObjectMap<ObjectData>;
  transform: G.Transform;
  inverseTransform: G.Transform;
}

export class Map extends React.Component<Props, MapState> {
  static getDerivedStateFromProps(props: Props) {
    return {
      transform: V.makeTransform(props),
      inverseTransform: V.makeInverseTransform(props),
    };
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      prevDragPoint: { x: 0, y: 0 },
      prevTouchPoint: { x: 0, y: 0 },
      dropTarget: {},
      transform: V.makeTransform(this.props),
      inverseTransform: V.makeInverseTransform(this.props),
    };
  }

  handleMouseMove = (e: KonvaEvent.Mouse) => {
    if (this.props.stage.mouseDown) {
      const dx = e.evt.movementX;
      const dy = e.evt.movementY;
      this.props.actions.stage.mouseMove({ dx, dy });
    }
    return;
  }

  handleMouseDown = (e: KonvaEvent.Mouse) => {
    if (e.target && e.target.nodeType === NodeType.STAGE) {
      this.props.actions.stage.stageMouseDown();
    }
  }

  handleMouseUp = (e: KonvaEvent.Mouse) => {
    this.props.actions.stage.stageMouseUp();
  }

  handleTouchStart = (e: KonvaEvent.Touch) => {
    if (e.evt.touches.length === 1) {
      if (e.target && e.target.nodeType === NodeType.STAGE) {
        const touch = e.evt.touches[0];
        this.props.actions.stage.stageMouseDown();
        this.setState({ prevTouchPoint: { x: touch.clientX, y: touch.clientY }});
      }
    }
  }

  handleTouchMove = (e: KonvaEvent.Touch) => {
    if (e.evt.touches.length === 1) {
      const touch = e.evt.touches[0];
      if (this.props.stage.mouseDown) {
        const { prevTouchPoint } = this.state;
        const dx = touch.clientX - prevTouchPoint.x;
        const dy = touch.clientY - prevTouchPoint.y;
        this.props.actions.stage.mouseMove({ dx, dy });
        this.setState({ prevTouchPoint: { x: touch.clientX, y: touch.clientY }});
      }
    }
  }

  handleTouchEnd = (e: KonvaEvent.Touch) => {
    if (e.evt.touches.length === 1) {
      if (e.target && e.target.nodeType === NodeType.STAGE) {
        this.props.actions.stage.stageMouseDown();
      }
    }
  }

  handleClick = (e: KonvaEvent.Mouse) => {
    const isMoved = S.isMoved(this.props.stage);
    if (!isMoved && e.target && e.target.nodeType === NodeType.STAGE) {
      this.props.actions.selection.clearSelection();
    }
  }

  handleObjectSetDropTarget = (e: KonvaEvent.Mouse, data: ObjectData) => {
    this.setState({ dropTarget: { [data.id]: data } });
  }

  handleObjectUnsetDropTarget = (e: KonvaEvent.Mouse, data: ObjectData) => {
    this.setState({ dropTarget: {} });
  }

  _handleObjectDragStart(x: number, y: number) {
    const prevDragPoint = this.state.inverseTransform({ x, y });
    this.setState({ prevDragPoint });
  }

  _handleObjectDragMove(x: number, y: number) {
    const prevDragPoint = this.state.inverseTransform({ x, y });
    const dx = prevDragPoint.x - this.state.prevDragPoint.x;
    const dy = prevDragPoint.y - this.state.prevDragPoint.y;
    const objects = this.props.selection.objects.map(id => {
      const o = CS.getObject(this.props.senseObject, id);
      return { ...o, x: o.x + dx, y: o.y + dy };
    }).reduce((a, o) => { a[o.id] = o; return a; }, {});
    this.props.actions.cachedStorage.updateObjects(objects);
    this.setState({ prevDragPoint });
  }

  _handleObjectDragEnd(x: number, y: number) {
    const prevDragPoint = this.state.inverseTransform({ x, y });
    const dx = prevDragPoint.x - this.state.prevDragPoint.x;
    const dy = prevDragPoint.y - this.state.prevDragPoint.y;
    this.props.selection.objects.forEach(id => {
      const o = CS.getObject(this.props.senseObject, id);
      this.props.actions.senseObject.moveObject(id, o.x + dx, o.y + dy);
    });
    this.setState({ prevDragPoint: { x: 0, y: 0 } });
  }

  handleObjectDragStart = (e: KonvaEvent.Mouse) => {
    this._handleObjectDragStart(e.evt.layerX, e.evt.layerY);
  }

  handleObjectDragMove = (e: KonvaEvent.Mouse) => {
    this._handleObjectDragMove(e.evt.layerX, e.evt.layerY);
  }

  handleObjectDragEnd = (e: KonvaEvent.Mouse) => {
    this._handleObjectDragEnd(e.evt.layerX, e.evt.layerY);
  }

  handleObjectTouchStart = (e: KonvaEvent.Touch) => {
    if (e.evt.touches.length === 1) {
      const touch = e.evt.touches[0];
      this._handleObjectDragStart(touch.clientX, touch.clientY);
    }
  }

  handleObjectTouchMove = (e: KonvaEvent.Touch) => {
    if (e.evt.touches.length === 1) {
      const touch = e.evt.touches[0];
      this._handleObjectDragMove(touch.clientX, touch.clientY);
    }
  }

  handleObjectTouchEnd = (e: KonvaEvent.Touch) => {
    if (e.evt.touches.length === 1) {
      const touch = e.evt.touches[0];
      this._handleObjectDragEnd(touch.clientX, touch.clientY);
    }
  }

  handleObjectSelect = (e: KonvaEvent.Mouse, o: ObjectData) => {
    const acts = this.props.actions;
    const isMultiSelectable = I.isMultiSelectable(this.props.input);

    if (isMultiSelectable) {
      acts.editor.focusObject(F.focusNothing());
      acts.selection.addObjectToSelection(o.id);
    } else {
      acts.selection.clearSelection();
      acts.editor.focusObject(O.toFocus(o));
      acts.selection.addObjectToSelection(o.id);
    }
  }

  handleObjectDeselect = (e: KonvaEvent.Mouse, o: ObjectData) => {
    const acts = this.props.actions;
    const selection = this.props.selection;

    acts.selection.removeObjectFromSelection(o.id);
    if (SL.count(selection) === 1) {
      acts.editor.focusObject(O.toFocus(CS.getObject(this.props.senseObject, SL.get(selection, 0))));
    } else {
      acts.editor.focusObject(F.focusNothing());
    }
  }

  render() {
    const storage = CS.toStorage(this.props.inScope);
    const objects = Object.values(storage.objects).map(o => this.renderObject(o));
    const edges =   Object.values(storage.edges).map(e => this.renderEdge(e));

    return (
      <Stage
        width={this.props.width}
        height={this.props.height}
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
      >
        <Layer>
          {edges}
          {objects}
        </Layer>
      </Stage>
    );
  }

  renderObject(o: ObjectData) {
    const acts = this.props.actions;
    const isSelected = SL.contains(this.props.selection, o.id);

    switch (o.objectType) {
      case ObjectType.NONE: {
        return <Group key={o.id} />;
      }
      case ObjectType.CARD: {
        if (!CS.doesCardExist(this.props.inScope, o.data)) {
          return <Group key={o.id} />;
        }
        return (
          <Card
            key={o.id}
            transform={this.state.transform}
            inverseTransform={this.state.inverseTransform}
            object={o}
            data={CS.getCard(this.props.senseObject, o.data)}
            isDirty={CS.isCardDirty(this.props.inScope, o.data)}
            selected={isSelected}
            onSelect={this.handleObjectSelect}
            onDeselect={this.handleObjectDeselect}
            onDragStart={this.handleObjectDragStart}
            onDragMove={this.handleObjectDragMove}
            onDragEnd={this.handleObjectDragEnd}
            onTouchStart={this.handleObjectTouchStart}
            onTouchMove={this.handleObjectTouchMove}
            onTouchEnd={this.handleObjectTouchEnd}
            onOpen={() => acts.editor.changeStatus(OE.StatusType.SHOW)}
          />);
      }
      case ObjectType.BOX: {
        if (!CS.doesBoxExist(this.props.inScope, o.data)) {
          return <Group key={o.id} />;
        }
        return (
          <Box
            key={o.id}
            transform={this.state.transform}
            inverseTransform={this.state.inverseTransform}
            object={o}
            data={CS.getBox(this.props.senseObject, o.data)}
            isDirty={CS.isBoxDirty(this.props.inScope, o.data)}
            cards={CS.getCardsInBox(this.props.senseObject, o.data)}
            selected={isSelected}
            onSelect={this.handleObjectSelect}
            onDeselect={this.handleObjectDeselect}
            onDragStart={this.handleObjectDragStart}
            onDragMove={this.handleObjectDragMove}
            onDragEnd={this.handleObjectDragEnd}
            onTouchStart={this.handleObjectTouchStart}
            onTouchMove={this.handleObjectTouchMove}
            onTouchEnd={this.handleObjectTouchEnd}
            onSetDropTarget={this.handleObjectSetDropTarget}
            onUnsetDropTarget={this.handleObjectUnsetDropTarget}
            onOpen={() => acts.editor.changeStatus(OE.StatusType.SHOW)}
          />);
      }
      default: {
        throw Error(`Unknown ObjectData type ${o.objectType}`);
      }
    }
  }

  renderEdge(e: EdgeData) {
    const edgeProps = {
      from: CS.getObject(this.props.inScope, e.from),
      to: CS.getObject(this.props.inScope, e.to),
      transform: this.state.transform,
      inverseTransform: this.state.inverseTransform,
    };
    return <Edge key={e.id} {...edgeProps} />;
  }
}

export default Map;
