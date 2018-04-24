import * as React from 'react';
import { Rect } from 'react-konva';

class MapTag extends React.Component {
  render() {
    return (
      <Rect x={10} y={10} width={10} height={10} fill={'black'} />
    );
  }
}

export default MapTag;
