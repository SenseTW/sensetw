
import * as React from 'react';
import { Stage, Layer } from 'react-konva';
import Box from '../CanvasBox';
import Card from '../CanvasCard';

class Map extends React.Component {
  render() {
    return (
      <Stage width={960} height={600}>
        <Layer>
          <Box x={130} y={30} />
          <Card x={0} y={0} />
        </Layer>
      </Stage>
    );
  }
}

export default Map;
