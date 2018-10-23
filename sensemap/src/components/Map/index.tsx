import * as React from 'react';
import { History } from 'history';
import { Stage, Layer } from 'react-konva';
import Box from './Box';
import Card from './Card';
import Edge from './Edge';
import AltBox from '../WholeMap/Box';
import AltCard from '../WholeMap/Card';
import CardList from '../WholeMap/CardList';
import EdgeDescription from './EdgeDescription';
import { Group } from 'react-konva';
import * as SL from '../../types/selection';
import { Edge as EdgeData, ObjectType, ObjectData, CardData, State, ActionProps } from '../../types';
import { ObjectMap } from '../../types/sense/has-id';
import * as I from '../../types/input';
import * as OE from '../../types/object-editor';
import * as CS from '../../types/cached-storage';
import * as V from '../../types/viewport';
import * as S from '../../types/stage';
import * as G from '../../graphics/point';
import { NodeType, Event as KonvaEvent } from '../../types/konva';
import * as qs from 'qs';

export interface StateFromProps {
  selection:   State['selection'];
  senseObject: CS.CachedStorage;
  inScope:     CS.CachedStorage;
  input:       State['input'];
  stage:       State['stage'];
  level:       number;
  history:     History;
  promisedObjects: Promise<ObjectMap<ObjectData>>;
  isAuthenticated: boolean;
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
  hoverObject?: ObjectData;
  hoverEdge?: EdgeData;
  hoverPoint?: G.Point;
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
      hoverObject: undefined,
    };
  }

  // center to the queried object
  async componentDidMount() {
    const { actions: acts, promisedObjects, senseObject } = this.props;
    const query = location.search.substr(1);
    type Query = { object: string };
    const { object: oid } = qs.parse(query) as Query;
    const object = CS.getObject(senseObject, oid);

    if (oid) {
      await promisedObjects;
      acts.viewport.panToObject(oid);
      switch (object.objectType) {
        case ObjectType.BOX:
          acts.selection.selectMapBox(object.id, object.data);
          break;
        case ObjectType.CARD:
          acts.selection.selectMapCard(object.id, object.data);
          break;
        default:
      }
    }
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
      this.props.history.replace('?');
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
    const ids = SL.selectedObjects(this.props.selection);
    const objects = ids.map(id => {
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
    const ids = SL.selectedObjects(this.props.selection);
    ids.forEach(id => {
      const o = CS.getObject(this.props.senseObject, id);
      this.props.actions.senseObject.moveObject(id, o.x + dx, o.y + dy);
    });
    this.setState({ prevDragPoint: { x: 0, y: 0 } });
  }

  handleObjectDragStart = (e: KonvaEvent.Mouse) => {
    this._handleObjectDragStart(e.evt.layerX, e.evt.layerY);
  }

  handleObjectDragMove = (e: KonvaEvent.Mouse, hoverObject: ObjectData) => {
    this._handleObjectDragMove(e.evt.layerX, e.evt.layerY);
    this.setState({ hoverObject });
  }

  handleObjectDragEnd = (e: KonvaEvent.Mouse, hoverObject: ObjectData) => {
    this._handleObjectDragEnd(e.evt.layerX, e.evt.layerY);
    this.setState({ hoverObject });
  }

  handleMouseOver = (e: KonvaEvent.Mouse, hoverObject: ObjectData) => {
    this.setState({ hoverObject });
  }

  handleMouseOut = () => {
    this.setState({ hoverObject: undefined });
  }

  handleEdgeMouseOver = (e: KonvaEvent.Mouse, hoverEdge: EdgeData) => {
    const hoverPoint = { x: e.evt.layerX, y: e.evt.layerY };
    this.setState({ hoverEdge, hoverPoint });
  }

  handleEdgeMouseMove = (e: KonvaEvent.Mouse) => {
    const hoverPoint = { x: e.evt.layerX, y: e.evt.layerY };
    this.setState({ hoverPoint });
  }

  handleEdgeMouseOut = () => {
    this.setState({ hoverEdge: undefined, hoverPoint: undefined });
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
    const history = this.props.history;
    const acts = this.props.actions;
    const isMultiSelectable = I.isMultiSelectable(this.props.input);

    if (isMultiSelectable) {
      switch (o.objectType) {
        case ObjectType.BOX:
          acts.selection.selectMapBox(o.id, o.data);
          break;
        case ObjectType.CARD:
          acts.selection.selectMapCard(o.id, o.data);
          break;
        default:
      }
      history.replace('?');
    } else {
      acts.selection.clearSelection();
      switch (o.objectType) {
        case ObjectType.BOX:
          acts.selection.selectMapBox(o.id, o.data);
          break;
        case ObjectType.CARD:
          acts.selection.selectMapCard(o.id, o.data);
          break;
        default:
      }
      history.replace(`?object=${o.id}`);
    }
  }

  handleObjectDeselect = (e: KonvaEvent.Mouse, o: ObjectData) => {
    const history = this.props.history;
    const acts = this.props.actions;

    switch (o.objectType) {
      case ObjectType.BOX:
        acts.selection.unselectMapBox(o.id, o.data);
        break;
      case ObjectType.CARD:
        acts.selection.unselectMapCard(o.id, o.data);
        break;
      default:
    }
    history.replace('?');
  }

  handleEdgeSelect = (e: KonvaEvent.Mouse, edge: EdgeData) => {
    const acts = this.props.actions;
    const isMultiSelectable = I.isMultiSelectable(this.props.input);

    if (isMultiSelectable) {
      acts.selection.selectMapEdge(edge.id);
    } else {
      acts.selection.clearSelection();
      acts.selection.selectMapEdge(edge.id);
    }
  }

  handleEdgeDeselect = (e: KonvaEvent.Mouse, edge: EdgeData) => {
    const acts = this.props.actions;

    acts.selection.unselectMapEdge(edge.id);
  }

  isAltLayout(): boolean {
    return this.props.level < 0.65;
  }

  render() {
    // const { senseObject } = this.props;
    const useAltLayout = this.isAltLayout();
    const { transform, inverseTransform, hoverObject, hoverEdge, hoverPoint } = this.state;
    const storage = CS.toStorage(this.props.inScope);
    const objects = Object.values(storage.objects).map(o => this.renderObject(o));
    const edges =   Object.values(storage.edges).map(e => this.renderEdge(e));

    let offsetX = 0;
    let offsetY = 0;
    let title: string = '';
    let cards: CardData[] = [];
    if (hoverObject) {
      switch (hoverObject.objectType) {
        case ObjectType.BOX:
          offsetX = AltBox.style.width / 2;
          offsetY = -AltBox.style.height / 2;
          const box = CS.getBox(this.props.senseObject, hoverObject.data);
          title = box.title || box.summary;
          // cards of the box
          cards = Object
            .values(CS.getCardsInBox(this.props.senseObject, hoverObject.data))
            .filter(c => c.id !== '0');
          break;
        case ObjectType.CARD:
          offsetX = AltCard.style.width / 2;
          offsetY = -AltCard.style.height / 2;
          const card = CS.getCard(this.props.senseObject, hoverObject.data);
          title = card.title || card.summary;
          // the card itself
          cards = [];
          break;
        default:
      }
    }
    // filter out the empty card
    cards = cards.filter(c => c.id !== '0');

    const cardList =
      useAltLayout &&
      (title.length !== 0 || cards.length !== 0) &&
      hoverObject !== undefined && (
        <CardList
          transform={transform}
          inverseTransform={inverseTransform}
          mapObject={hoverObject}
          x={hoverObject.x + offsetX}
          y={hoverObject.y + offsetY}
          title={title}
          cards={cards}
        />
      );

    let edgeDescription;
    // let obj;
    if (
      hoverEdge !== undefined &&
      hoverPoint !== undefined &&
      (hoverEdge.title || hoverEdge.summary)
    ) {
      // obj = CS.getObject(senseObject, hoverEdge.from);
      // const { x: fromX, y: fromY } = obj;
      // obj = CS.getObject(senseObject, hoverEdge.to);
      // const { x: toX, y: toY } = obj;
      const { x, y } = inverseTransform(hoverPoint);
      edgeDescription = (
        <EdgeDescription
          transform={transform}
          inverseTransform={inverseTransform}
          x={x}
          y={y}
          edge={hoverEdge}
        />
      );
    }

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
          {cardList}
          {edgeDescription}
        </Layer>
      </Stage>
    );
  }

  renderObject(o: ObjectData) {
    const acts = this.props.actions;
    const isAuthenticated = this.props.isAuthenticated;
    const isSelected = SL.isMapObjectSelected(this.props.selection, o.id);
    const useAltLayout = this.isAltLayout();
    const draggingProps = isAuthenticated
      ? {
        draggable: true,
        onDragStart: this.handleObjectDragStart,
        onDragMove: this.handleObjectDragMove,
        onDragEnd: this.handleObjectDragEnd,
        onTouchStart: this.handleObjectTouchStart,
        onTouchMove: this.handleObjectTouchMove,
        onTouchEnd: this.handleObjectTouchEnd,
      }
      : {
        draggable: false,
      };

    switch (o.objectType) {
      case ObjectType.NONE: {
        return <Group key={o.id} />;
      }
      case ObjectType.CARD: {
        if (!CS.doesCardExist(this.props.inScope, o.data)) {
          return <Group key={o.id} />;
        }

        const props = {
          key: o.id,
          transform: this.state.transform,
          inverseTransform: this.state.inverseTransform,
          data: CS.getCard(this.props.senseObject, o.data),
          isDirty: CS.isCardDirty(this.props.senseObject, o.data),
          selected: isSelected,
          ...draggingProps,
          onSelect: this.handleObjectSelect,
          onDeselect: this.handleObjectDeselect,
          onMouseOver: this.handleMouseOver,
          onMouseOut: this.handleMouseOut,
          onOpen: () => acts.editor.changeStatus(OE.StatusType.SHOW),
        };

        if (useAltLayout) {
          return (
            <AltCard
              {...props}
              object={{ ...o, width: AltCard.style.width, height: AltCard.style.height }}
            />
          );
        } else {
          return <Card {...props} object={o} />;
        }
      }
      case ObjectType.BOX: {
        if (!CS.doesBoxExist(this.props.inScope, o.data)) {
          return <Group key={o.id} />;
        }

        const props = {
          key: o.id,
          transform: this.state.transform,
          inverseTransform: this.state.inverseTransform,
          data: CS.getBox(this.props.senseObject, o.data),
          isDirty: CS.isBoxDirty(this.props.senseObject, o.data),
          selected: isSelected,
          onSelect: this.handleObjectSelect,
          onDeselect: this.handleObjectDeselect,
          ...draggingProps,
          onMouseOver: this.handleMouseOver,
          onMouseOut: this.handleMouseOut,
          onOpen: () => acts.editor.changeStatus(OE.StatusType.SHOW),
        };

        if (useAltLayout) {
          return (
            <AltBox
              {...props}
              object={{ ...o, width: AltBox.style.width, height: AltBox.style.height }}
            />
          );
        } else {
          return (
            <Box
              {...props}
              object={o}
              cards={CS.getCardsInBox(this.props.senseObject, o.data)}
              onSetDropTarget={this.handleObjectSetDropTarget}
              onUnsetDropTarget={this.handleObjectUnsetDropTarget}
            />
          );
        }
      }
      default: {
        throw Error(`Unknown ObjectData type ${o.objectType}`);
      }
    }
  }

  renderEdge(edge: EdgeData) {
    const { selection } = this.props;
    const { hoverEdge } = this.state;

    return (
      <Edge
        key={edge.id}
        transform={this.state.transform}
        inverseTransform={this.state.inverseTransform}
        from={CS.getObject(this.props.inScope, edge.from)}
        to={CS.getObject(this.props.inScope, edge.to)}
        data={edge}
        selected={SL.isMapEdgeSelected(selection, edge.id)}
        hovered={hoverEdge && hoverEdge.id === edge.id}
        onSelect={this.handleEdgeSelect}
        onDeselect={this.handleEdgeDeselect}
        onMouseOver={this.handleEdgeMouseOver}
        onMouseMove={this.handleEdgeMouseMove}
        onMouseOut={this.handleEdgeMouseOut}
      />
    );
  }
}

export default Map;
