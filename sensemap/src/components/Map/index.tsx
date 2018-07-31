
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
import * as G from '../../graphics/point';
import * as B from '../../types/sense/box';
import * as C from '../../types/sense/card';
import { Event as KonvaEvent } from '../../types/konva';

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
  prevDragPoint: {
    x: number,
    y: number,
  };
  dropTarget: ObjectMap<ObjectData>;
}

const makeTransform: V.StateToTransform =
  ({ top, left }) => ({ x, y }) => ({ x: x - left, y: y - top });

const makeInverseTransform: V.StateToTransform =
  ({ top, left }) => ({ x, y }) => ({ x: x + left, y: y + top });

function getCenter(o: ObjectData): G.Point {
  switch (o.objectType) {
    case ObjectType.CARD: {
      return { x: o.x + C.DEFAULT_WIDTH / 2, y: o.y + C.DEFAULT_HEIGHT / 2 };
    }
    case ObjectType.BOX: {
      return { x: o.x + B.DEFAULT_WIDTH / 2, y: o.y + B.DEFAULT_HEIGHT / 2 };
    }
    default: {
      return { x: o.x, y: o.y };
    }
  }
}

export class Map extends React.Component<Props, MapState> {
  constructor(props: Props) {
    super(props);

    this.handleClick           = this.handleClick.bind(this);
    this.handleMouseDown       = this.handleMouseDown.bind(this);
    this.handleMouseMove       = this.handleMouseMove.bind(this);
    this.handleMouseUp         = this.handleMouseUp.bind(this);
    this.handleObjectDragStart = this.handleObjectDragStart.bind(this);
    this.handleObjectDragMove  = this.handleObjectDragMove.bind(this);
    this.handleObjectDragEnd   = this.handleObjectDragEnd.bind(this);
    this.handleObjectSetDropTarget   = this.handleObjectSetDropTarget.bind(this);
    this.handleObjectUnsetDropTarget = this.handleObjectUnsetDropTarget.bind(this);

    this.state = {
      prevDragPoint: { x: 0, y: 0 },
      dropTarget: {},
    };
  }

  handleMouseMove(e: KonvaEvent.Mouse) {
    if (this.props.stage.mouseDown) {
      const dx = e.evt.movementX;
      const dy = e.evt.movementY;
      this.props.actions.stage.stageMouseMove({ dx, dy });
    }
    return;
  }

  // tslint:disable-next-line:no-any
  handleMouseDown(e: any) {
    if (e.target && e.target.nodeType === 'Stage') {
      this.props.actions.stage.stageMouseDown();
    }
  }

  handleMouseUp(e: KonvaEvent.Mouse) {
    this.props.actions.stage.stageMouseUp();
  }

  // tslint:disable-next-line:no-any
  handleClick(e: any) {
    if (e.target && e.target.nodeType === 'Stage') {
      this.props.actions.selection.clearSelection();
    }
  }

  handleObjectSetDropTarget(data: ObjectData) {
    this.setState({ dropTarget: { [data.id]: data } });
  }

  handleObjectUnsetDropTarget(data: ObjectData) {
    this.setState({ dropTarget: {} });
  }

  handleObjectDragStart(e: KonvaEvent.Mouse) {
    const x = e.evt.layerX;
    const y = e.evt.layerY;
    this.setState({ prevDragPoint: { x, y } });
  }

  handleObjectDragMove(e: KonvaEvent.Mouse) {
    const x = e.evt.layerX;
    const y = e.evt.layerY;
    const dx = x - this.state.prevDragPoint.x;
    const dy = y - this.state.prevDragPoint.y;
    const objects = this.props.selection.map(id => {
      const o = CS.getObject(this.props.senseObject, id);
      return { ...o, x: o.x + dx, y: o.y + dy };
    }).reduce((a, o) => { a[o.id] = o; return a; }, {});
    this.props.actions.cachedStorage.updateObjects(objects);
    this.setState({ prevDragPoint: { x, y } });
  }

  handleObjectDragEnd(e: KonvaEvent.Mouse) {
    const dx = e.evt.layerX - this.state.prevDragPoint.x;
    const dy = e.evt.layerY - this.state.prevDragPoint.y;
    this.props.selection.forEach(id => {
      const o = CS.getObject(this.props.senseObject, id);
      this.props.actions.senseObject.moveObject(id, o.x + dx, o.y + dy);
    });
    this.setState({ prevDragPoint: { x: 0, y: 0 } });
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

    const isMultiSelectable = I.isMultiSelectable(this.props.input);
    const isSelected = SL.contains(this.props.selection, o.id);
    const transform = makeTransform(this.props);
    const inverseTransform = makeInverseTransform(this.props);

    const handleObjectSelect = (data: ObjectData) => {
      if (isMultiSelectable) {
        acts.editor.focusObject(F.focusNothing());
        acts.selection.addObjectToSelection(data.id);
      } else {
        acts.selection.clearSelection();
        acts.editor.focusObject(O.toFocus(data));
        acts.selection.addObjectToSelection(data.id);
      }
    };

    const handleObjectDeselect = (data: ObjectData) => {
      acts.selection.removeObjectFromSelection(data.id);
      if (this.props.selection.length === 1) {
        acts.editor.focusObject(O.toFocus(CS.getObject(this.props.senseObject, this.props.selection[0])));
      } else {
        acts.editor.focusObject(F.focusNothing());
      }
    };

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
            isDirty={CS.isCardDirty(this.props.inScope, o.data)}
            mapObject={o}
            transform={transform}
            inverseTransform={inverseTransform}
            card={CS.getCard(this.props.senseObject, o.data)}
            selected={isSelected}
            handleSelect={handleObjectSelect}
            handleDeselect={handleObjectDeselect}
            handleDragStart={this.handleObjectDragStart}
            handleDragMove={this.handleObjectDragMove}
            handleDragEnd={this.handleObjectDragEnd}
            openCard={() => acts.editor.changeStatus(OE.StatusType.SHOW)}
          />);
      }
      case ObjectType.BOX: {
        if (!CS.doesBoxExist(this.props.inScope, o.data)) {
          return <Group key={o.id} />;
        }
        return (
          <Box
            key={o.id}
            isDirty={CS.isBoxDirty(this.props.inScope, o.data)}
            mapObject={o}
            transform={transform}
            inverseTransform={inverseTransform}
            box={CS.getBox(this.props.senseObject, o.data)}
            cards={CS.getCardsInBox(this.props.senseObject, o.data)}
            selected={isSelected}
            handleSelect={handleObjectSelect}
            handleDeselect={handleObjectDeselect}
            handleDragStart={this.handleObjectDragStart}
            handleDragMove={this.handleObjectDragMove}
            handleDragEnd={this.handleObjectDragEnd}
            handleSetDropTarget={this.handleObjectSetDropTarget}
            handleUnsetDropTarget={this.handleObjectUnsetDropTarget}
            openBox={() => acts.editor.changeStatus(OE.StatusType.SHOW)}
          />);
      }
      default: {
        throw Error(`Unknown ObjectData type ${o.objectType}`);
      }
    }
  }

  renderEdge(e: EdgeData) {
    const edgeProps = {
      from: getCenter(CS.getObject(this.props.inScope, e.from)),
      to: getCenter(CS.getObject(this.props.inScope, e.to)),
      transform: makeTransform(this.props),
      inverseTransform: makeInverseTransform(this.props),
    };
    return <Edge key={e.id} {...edgeProps} />;
  }
}

export default Map;
