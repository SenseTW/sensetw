import * as React from 'react';
import { Container, Divider } from 'semantic-ui-react';
import * as SM from '../../types/sense-map';
import SenseCard from '../SenseCard';

interface Props {}

interface State {
  cards: SM.CardData[];
}

class ComponentPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      cards: [{
        type: SM.CardType.User,
        title: '這是一張卡',
        description: '這是卡片的內容'
      }]
    };
  }

  handleCardChange = (card: SM.CardData) => {
    this.setState({ cards: [card] });
  }

  render() {
    const { cards } = this.state;

    return (
      <Container text>
        This page list components.
        <Divider />
        <h2>Card</h2>
        <SenseCard
          data={cards[0]}
          onChange={this.handleCardChange}
        />
      </Container>
    );
  }
}

export default ComponentPage;