import * as React from 'react';
import { Stage, Layer } from 'react-konva';
import { Props } from '../Map';
import { TransformerForProps } from '../Layout';
import Box from './Box';
import CardList from './CardList';
import Card from './Card';
import Edge from './Edge';
import { ObjectType, ObjectData, CardData, Edge as EdgeData } from '../../types';
import * as G from '../../graphics/point';
import * as O from '../../types/sense/object';
import * as B from '../../types/sense/box';
import * as C from '../../types/sense/card';
import * as F from '../../types/sense/focus';
import * as I from '../../types/input';
import * as V from '../../types/viewport';
import * as CS from '../../types/cached-storage';
import * as SL from '../../types/selection';
import * as S from '../../types/stage';
import { NodeType, Event as KonvaEvent } from '../../types/konva';

interface MapState {
  prevDragPoint: G.Point;
  hoverObject?: ObjectData;
}

type State = MapState & TransformerForProps;

class WholeMap extends React.Component<Props, State> {
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
      hoverObject: undefined,
      transform: V.makeTransform(props),
      inverseTransform: V.makeInverseTransform(props),
    };
  }

  handleMouseMove = (e: KonvaEvent.Mouse) => {
    if (this.props.stage.mouseDown) {
      this.props.actions.stage.mouseMove({
        dx: e.evt.movementX,
        dy: e.evt.movementY,
      });
    }
  }

  handleMouseDown = (e: KonvaEvent.Mouse) => {
    this.props.actions.stage.stageMouseDown();
  }

  handleMouseUp = (e: KonvaEvent.Mouse) => {
    this.props.actions.stage.stageMouseUp();
  }

  handleClick = (e: KonvaEvent.Mouse) => {
    const isMoved = S.isMoved(this.props.stage);
    if (!isMoved && e.target && e.target.nodeType === NodeType.STAGE) {
      this.props.actions.selection.clearSelection();
    }
  }

  handleSelect = (e: KonvaEvent.Mouse, object: ObjectData) => {
    const { actions: acts, input } = this.props;
    const isMultiSelectable = I.isMultiSelectable(input);

    if (isMultiSelectable) {
      acts.editor.focusObject(F.focusNothing());
      acts.selection.addObjectToSelection(object.id);
    } else {
      acts.selection.clearSelection();
      acts.editor.focusObject(O.toFocus(object));
      acts.selection.addObjectToSelection(object.id);
    }
  }

  handleDeselect(e: KonvaEvent.Mouse, object: ObjectData) {
    const { actions: acts, inScope, selection } = this.props;

    acts.selection.removeObjectFromSelection(object.id);
    if (SL.count(selection) === 1) {
      const target = SL.get(selection, 0);
      acts.editor.focusObject(O.toFocus(CS.getObject(inScope, target)));
    } else {
      acts.editor.focusObject(F.focusNothing());
    }
  }

  // XXX: duplicated
  handleObjectDragStart = (e: KonvaEvent.Mouse) => {
    const prevDragPoint =
      this.state.inverseTransform({ x: e.evt.layerX, y: e.evt.layerY });
    this.setState({ prevDragPoint });
  }

  // XXX: duplicated
  handleObjectDragMove(e: KonvaEvent.Mouse) {
    const prevDragPoint =
      this.state.inverseTransform({ x: e.evt.layerX, y: e.evt.layerY });
    const dx = prevDragPoint.x - this.state.prevDragPoint.x;
    const dy = prevDragPoint.y - this.state.prevDragPoint.y;
    const objects = this.props.selection.objects.map(id => {
      const o = CS.getObject(this.props.senseObject, id);
      return { ...o, x: o.x + dx, y: o.y + dy };
    }).reduce((a, o) => { a[o.id] = o; return a; }, {});
    this.props.actions.cachedStorage.updateObjects(objects);
    this.setState({ prevDragPoint });
  }

  // XXX: duplicated
  handleObjectDragEnd(e: KonvaEvent.Mouse) {
    const prevDragPoint =
      this.state.inverseTransform({ x: e.evt.layerX, y: e.evt.layerY });
    const dx = prevDragPoint.x - this.state.prevDragPoint.x;
    const dy = prevDragPoint.y - this.state.prevDragPoint.y;
    this.props.selection.objects.forEach(id => {
      const o = CS.getObject(this.props.senseObject, id);
      this.props.actions.senseObject.moveObject(id, o.x + dx, o.y + dy);
    });
    this.setState({ prevDragPoint: { x: 0, y: 0 } });
  }

  handleMouseOver = (e: KonvaEvent.Mouse, hoverObject: ObjectData) => {
    this.setState({ hoverObject });
  }

  handleMouseOut = () => {
    this.setState({ hoverObject: undefined });
  }

  renderObject(object: ObjectData) {
    const { senseObject, selection } = this.props;
    const transformers = this.state;
    const isSelected = SL.contains(selection, object.id);

    switch (object.objectType) {
      case ObjectType.BOX: {
        const { x, y } = object;
        const box = CS.getBox(senseObject, object.data);

        if (B.isEmpty(box)) {
          return null;
        }

        return (
          <Box
            {...transformers}
            {...box}
            key={object.id}
            mapObject={object}
            selected={isSelected}
            x={x}
            y={y}
            width={Box.style.width}
            height={Box.style.height}
            onSelect={this.handleSelect}
            onDeselect={this.handleDeselect}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
          />
        );
      }
      case ObjectType.CARD: {
        const { x, y } = object;
        const card = CS.getCard(senseObject, object.data);

        if (C.isEmpty(card)) {
          return null;
        }

        return (
          <Card
            {...transformers}
            {...card}
            key={object.id}
            mapObject={object}
            selected={isSelected}
            x={x}
            y={y}
            width={Card.style.width}
            height={Card.style.height}
            onSelect={this.handleSelect}
            onDeselect={this.handleDeselect}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
          />
        );
      }
      default:
        return null;
    }
  }

  renderEdge(edge: EdgeData) {
    const transformers = this.state;
    let o = CS.getObject(this.props.inScope, edge.from);
    const from = O.getCenter({
      ...o,
      width: o.objectType === ObjectType.BOX
        ? Box.style.width
        : Card.style.width,
      height: o.objectType === ObjectType.BOX
        ? Box.style.height
        : Card.style.height,
    });
    o = CS.getObject(this.props.inScope, edge.to);
    const to = O.getCenter({
      ...o,
      width: o.objectType === ObjectType.BOX
        ? Box.style.width
        : Card.style.width,
      height: o.objectType === ObjectType.BOX
        ? Box.style.height
        : Card.style.height,
    });
    const edgeProps = { from, to };

    return (
      <Edge
        {...transformers}
        {...edgeProps}
        key={edge.id}
      />
    );
  }

  render() {
    const { width, height } = this.props;
    const storage = CS.toStorage(this.props.inScope);
    const objects = Object.values(storage.objects).map(o => this.renderObject(o));
    const edges = Object.values(storage.edges).map(e => this.renderEdge(e));

    const { transform, inverseTransform, hoverObject } = this.state;

    let offsetX = 0;
    let title: string = '';
    let cards: CardData[] = [];
    if (hoverObject) {
      switch (hoverObject.objectType) {
        case ObjectType.BOX:
          offsetX = Box.style.width;
          const box = CS.getBox(this.props.senseObject, hoverObject.data);
          title = box.title || box.summary;
          // cards of the box
          cards = Object
            .values(CS.getCardsInBox(this.props.senseObject, hoverObject.data))
            .filter(c => c.id !== '0');
          break;
        case ObjectType.CARD:
          offsetX = Card.style.width;
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
      (title.length !== 0 || cards.length !== 0) &&
      hoverObject !== undefined && (
        <CardList
          transform={transform}
          inverseTransform={inverseTransform}
          mapObject={hoverObject}
          x={hoverObject.x + offsetX}
          y={hoverObject.y}
          title={title}
          cards={cards}
        />
      );

    return (
      <Stage
        width={width}
        height={height}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        onClick={this.handleClick}
      >
        <Layer>
          {edges}
          {objects}
          {cardList}
        </Layer>
      </Stage>
    );
  }
}

export default WholeMap;