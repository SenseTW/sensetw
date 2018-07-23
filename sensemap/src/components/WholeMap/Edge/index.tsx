import * as React from 'react';
import { TransformerForProps } from '../';
import { Edge as EdgeData } from '../../../types';

type Props = EdgeData & TransformerForProps;

class Edge extends React.PureComponent<Props> {
  render() {
    return (null);
  }
}

export default Edge;