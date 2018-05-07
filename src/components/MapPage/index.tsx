import * as React from 'react';
import { connect } from 'react-redux';
import { Sidebar } from 'semantic-ui-react';
import Map from '../../containers/Map';
import ObjectMenu from '../ObjectMenu';
import ObjectContent from '../ObjectContent';
import Breadcrumb from '../Breadcrumb';
import * as T from '../../types';
import * as SM from '../../types/sense-map';
import * as SO from '../../types/sense-object';
import * as SC from '../../types/sense-card';
import * as SB from '../../types/sense-box';
import * as OE from '../../types/object-editor';
import './index.css';
const background = require('./background-map.png');

interface StateFromProps {
  map: SM.MapID;
  objectType: SO.ObjectType;
  target: SC.CardData | SB.BoxData | null;
}

interface DispatchFromProps {
  actions: {
    selectObject(id: SO.ObjectID | null): T.ActionChain,
    updateRemoteBox(box: SB.BoxData): T.ActionChain
    updateRemoteCard(card: SC.CardData): T.ActionChain
  };
}

type Props = StateFromProps & DispatchFromProps;

class MapPage extends React.Component<Props> {
  render() {
    const { actions, objectType, target, map } = this.props;

    return (
      <Sidebar.Pushable className="map-page" style={{ backgroundImage: `url(${background})` }}>
        <Sidebar visible={!!target} animation="overlay" width="wide">{
          target &&
            <ObjectContent
              objectType={objectType}
              data={target}
              onChange={(data) => {
                switch (objectType) {
                  case SO.ObjectType.CARD:
                    actions.updateRemoteCard(data as SC.CardData);
                    break;
                  case SO.ObjectType.BOX:
                    actions.updateRemoteBox(data as SB.BoxData);
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
            id={map}
            width={1960}
            height={1200}
          />
          <ObjectMenu />
          <Breadcrumb />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export default connect<StateFromProps, DispatchFromProps>(
  (state: T.State) => {
    const map = state.senseMap.map;

    if (!state.editor.id) {
      return { objectType: SO.ObjectType.NONE, target: null, map };
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

    return { objectType, target, map };
  },
  (dispatch: T.Dispatch) => ({
    actions: {
      selectObject: (id: SO.ObjectID | null) => dispatch(OE.actions.selectObject(id)),
      updateRemoteBox: (box: SB.BoxData) => dispatch(SO.actions.updateRemoteBox(box)),
      updateRemoteCard: (card: SC.CardData) => dispatch(SO.actions.updateRemoteCard(card))
    }
  })
)(MapPage);
