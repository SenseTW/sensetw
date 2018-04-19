import * as React from 'react';
import { Sidebar, Container, Divider, Button } from 'semantic-ui-react';
import * as SM from '../../types/sense-map';
import CardContent from '../CardContent';

interface Props {}

interface State {
  isCardVisible: boolean;
  currentCardId: SM.CardID;
  cards: { [key: string]: SM.CardData };
}

class ComponentPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isCardVisible: false,
      currentCardId: '0',
      cards: SM.sampleCardMap
    };
  }

  handleCardChange = (id: SM.CardID, card: SM.CardData) => {
    this.setState({
      cards: {
        ...this.state.cards,
        [id]: card
      }
    });
  }

  toggleCard = (currentCardId: SM.CardID) => {
    const isCardVisible =
      currentCardId === this.state.currentCardId
        ? !this.state.isCardVisible
        : true;
    this.setState({ isCardVisible, currentCardId });
  }

  render() {
    const { isCardVisible, currentCardId, cards } = this.state;

    return (
      <Sidebar.Pushable className="sense--page">
        <Sidebar visible={isCardVisible} animation="overlay" width="wide">
          <CardContent
            data={cards[currentCardId]}
            onChange={(card) => this.handleCardChange(currentCardId, card)}
          />
        </Sidebar>
        <Sidebar.Pusher>
          <Container text>
            This page list some components.
            <Divider />
            <h2>Card</h2>
            <Button onClick={() => this.toggleCard(SM.sampleCardList[0].id)}>
              show the question card
            </Button>
            <Button onClick={() => this.toggleCard(SM.sampleCardList[1].id)}>
              show the answer card
            </Button>
            <Button onClick={() => this.toggleCard(SM.sampleCardList[2].id)}>
              show the box card
            </Button>
          </Container>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export default ComponentPage;