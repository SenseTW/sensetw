import * as React from 'react';
import { Stage, Layer } from 'react-konva';
import { Props } from '../Map';
import Box from './Box';
import Card from './Card';
import Edge from './Edge';
import { ObjectType, ObjectData, Edge as EdgeData } from '../../types';
import * as G from '../../graphics/point';
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

  renderObjects(object: ObjectData) {
    const { senseObject } = this.props;
    const transformers = this.state;

    switch (object.objectType) {
      case ObjectType.BOX: {
        const box = CS.getBox(senseObject, object.data);
        return (<Box {...transformers} {...box} />);
      }
      case ObjectType.CARD: {
        const card = CS.getCard(senseObject, object.data);
        return (<Card {...transformers} {...card} />);
      }
      default:
        return null;
    }
  }

  renderEdges(edge: EdgeData) {
    const transformers = this.state;

    return (<Edge {...transformers} {...edge} />);
  }

  render() {
    const { width, height } = this.props;
    const storage = CS.toStorage(this.props.senseObject);
    const objects = Object.values(storage.objects).map(o => this.renderObjects(o));
    const edges = Object.values(storage.edges).map(e => this.renderEdges(e));

    return (
      <Stage
        width={width}
        height={height}
      >
        <Layer>
          {objects}
          {edges}
        </Layer>
      </Stage>
    );
  }
}

export default WholeMap;