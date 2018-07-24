import * as React from 'react';
import { Stage, Layer } from 'react-konva';
import { Props } from '../Map';
import Box from './Box';
import Card from './Card';
import Edge from './Edge';
import { ObjectType, ObjectData, Edge as EdgeData } from '../../types';
import * as G from '../../graphics/point';
import * as O from '../../types/sense/object';
import * as B from '../../types/sense/box';
import * as C from '../../types/sense/card';
import * as V from '../../types/viewport';
import * as CS from '../../types/cached-storage';

export interface TransformerForProps {
  transform: G.Transform;
  inverseTransform: G.Transform;
}

class WholeMap extends React.Component<Props, TransformerForProps> {
  static getDerivedStateFromProps(props: Props) {
    return {
      transform: V.makeTransform(props),
      inverseTransform: V.makeInverseTransform(props),
    };
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      transform: V.makeTransform(props),
      inverseTransform: V.makeInverseTransform(props),
    };
  }

  renderObject(object: ObjectData) {
    const { senseObject } = this.props;
    const transformers = this.state;

    switch (object.objectType) {
      case ObjectType.BOX: {
        const { x, y } = object;
        // TODO: check for the existance
        const box = CS.getBox(senseObject, object.data);

        if (B.isEmpty(box)) {
          return null;
        }

        return (
          <Box
            {...transformers}
            {...box}
            key={box.id}
            x={x}
            y={y}
            width={Box.style.width}
            height={Box.style.height}
          />
        );
      }
      case ObjectType.CARD: {
        const { x, y } = object;
        // TODO: check for the existance
        const card = CS.getCard(senseObject, object.data);

        if (C.isEmpty(card)) {
          return null;
        }

        return (
          <Card
            {...transformers}
            {...card}
            key={card.id}
            x={x}
            y={y}
            width={Card.style.width}
            height={Card.style.height}
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

    return (
      <Stage
        width={width}
        height={height}
      >
        <Layer>
          {edges}
          {objects}
        </Layer>
      </Stage>
    );
  }
}

export default WholeMap;