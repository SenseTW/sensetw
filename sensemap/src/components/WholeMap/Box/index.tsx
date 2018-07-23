import * as React from 'react';
import { TransformerForProps } from '../';
import { BoxData } from '../../../types';

type Props = BoxData & TransformerForProps;

class Box extends React.PureComponent<Props> {
  render() {
    return (null);
  }
}

export default Box;