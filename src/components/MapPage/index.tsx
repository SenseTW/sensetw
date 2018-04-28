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
import * as OE from '../../types/object-editor';
import './index.css';

interface StateFromProps {
  objectType: SO.ObjectType;
  target: SC.CardData | SB.BoxData | null;
}

interface DispatchFromProps {
  actions: {
    selectObject: typeof OE.actions.selectObject,
    updateCard: typeof SO.actions.updateCard,
    updateBox: typeof SO.actions.updateBox
  };
}

type Props = StateFromProps & DispatchFromProps;

class MapPage extends React.Component<Props> {
  render() {
    const { actions, objectType, target } = this.props;

    return (
      <Sidebar.Pushable className="map-page">
        <Sidebar visible={!!target} animation="overlay" width="wide">{
          target &&
            <ObjectContent
              objectType={objectType}
              data={target}
              onChange={(data) => {
                switch (objectType) {
                  case SO.ObjectType.CARD:
                    actions.updateCard(data.id, data as SC.CardData);
                    break;
                  case SO.ObjectType.BOX:
                    actions.updateBox(data.id, data as SB.BoxData);
                    break;
                  default:
                }
              }}
              onCancel={() => actions.selectObject(null)}
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
  },
  (dispatch: T.Dispatch) => ({
    actions: {
      selectObject: (id: SO.ObjectID) => dispatch(OE.actions.selectObject(id)),
      updateCard: (id: SC.CardID, card: SC.CardData) => dispatch(SO.actions.updateCard(id, card)),
      updateBox: (id: SB.BoxID, box: SB.BoxData) => dispatch(SO.actions.updateBox(id, box))
    }
  })
)(MapPage);
