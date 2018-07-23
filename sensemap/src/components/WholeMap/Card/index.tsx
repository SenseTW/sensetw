import * as React from 'react';
import { TransformerForProps } from '../';
import { CardData } from '../../../types';

type Props = CardData & TransformerForProps;

class Card extends React.PureComponent<Props> {
  render() {
    return (null);
  }
}

export default Card;