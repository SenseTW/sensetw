import * as React from 'react';
import { connect } from 'react-redux';
import { Sidebar } from 'semantic-ui-react';
import Map from '../../containers/Map';
import ObjectMenu from '../ObjectMenu';
import ObjectContent from '../ObjectContent';
import * as T from '../../types';
import * as SO from '../../types/sense-object';
import * as SC from '../../types/sense-card';
import * as SB from '../../types/sense-box';
import './index.css';

interface StateFromProps {
  objectType: SO.ObjectType;
  target: SC.CardData | SB.BoxData | null;
}

interface DispatchFromProps {
}

type Props = StateFromProps & DispatchFromProps;

interface State {
  isCardVisible: boolean;
  currentCardId: SC.CardID;
  cards: { [key: string]: SC.CardData };
}

class MapPage extends React.Component<Props, State> {
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
    const { objectType, target } = this.props;

    return (
      <Sidebar.Pushable className="map-page">
        <Sidebar visible={!!target} animation="overlay" width="wide">{
          target &&
            <ObjectContent
              objectType={objectType}
              data={target}
            />
        }
        </Sidebar>
        <Sidebar.Pusher>
          <Map
            id="cjgdo1yhj0si501559s0hgw2a"
            width={1960}
            height={1200}
          />
          <ObjectMenu />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export default connect(
  (state: T.State) => {
    if (!state.editor.id) {
      return { target: null };
    }

    const object = state.senseObject.objects[state.editor.id];
    const { objectType, data } = object;

    let target;
    switch (objectType) {
      case SO.ObjectType.BOX:
        target = state.senseObject.boxes[data];
        break;
      case SO.ObjectType.CARD:
        target = state.senseObject.cards[data];
        break;
      case SO.ObjectType.NONE:
      default:
        target = null;
    }

    return { objectType, target };
  }
)(MapPage);
