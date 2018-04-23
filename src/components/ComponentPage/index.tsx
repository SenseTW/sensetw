import * as React from 'react';
import { Sidebar, Container, Divider, Button } from 'semantic-ui-react';
import * as SC from '../../types/sense-card';
import ObjectContent from '../ObjectContent';

interface Props {}

interface State {
  isCardVisible: boolean;
  currentCardId: SC.CardID;
  cards: { [key: string]: SC.CardData };
}

class ComponentPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isCardVisible: false,
      currentCardId: '0',
      cards: SC.sampleCardMap
    };
  }

  handleCardChange = (id: SC.CardID, card: SC.CardData) => {
    this.setState({
      cards: {
        ...this.state.cards,
        [id]: card
      }
    });
  }

  toggleCard = (currentCardId: SC.CardID) => {
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
          <ObjectContent
            data={cards[currentCardId]}
            onChange={(card) => this.handleCardChange(currentCardId, card)}
          />
        </Sidebar>
        <Sidebar.Pusher>
          <Container text>
            This page list some components.
            <Divider />
            <h2>Card</h2>
            <Button onClick={() => this.toggleCard(SC.sampleCardList[0].id)}>
              show the question card
            </Button>
            <Button onClick={() => this.toggleCard(SC.sampleCardList[1].id)}>
              show the answer card
            </Button>
            <Button onClick={() => this.toggleCard(SC.sampleCardList[2].id)}>
              show the note card
            </Button>
          </Container>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export default ComponentPage;