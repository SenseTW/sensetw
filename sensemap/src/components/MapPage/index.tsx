import * as React from 'react';
import { connect } from 'react-redux';
import { Sidebar } from 'semantic-ui-react';
import Map from '../../containers/Map';
import ObjectMenu from '../ObjectMenu';
import ObjectContent from '../ObjectContent';
import Breadcrumb from '../Breadcrumb';
import * as T from '../../types';
import * as OE from '../../types/object-editor';
import './index.css';
const background = require('./background-map.png');

interface StateFromProps {
  map: T.MapID;
  editor: OE.Status;
}

interface DispatchFromProps {
  actions: {
    selectObject(status: OE.Status): T.ActionChain,
    createBoxObject(mapId: T.MapID, box: T.BoxData): T.ActionChain,
    createCardObject(mapID: T.MapID, card: T.CardData): T.ActionChain,
    updateRemoteBox(box: T.BoxData): T.ActionChain,
    updateRemoteCard(card: T.CardData): T.ActionChain
  };
}

type Props = StateFromProps & DispatchFromProps;

class MapPage extends React.Component<Props> {
  render() {
    const { actions, editor, map } = this.props;
    const { objectType, data } = editor;

    return (
      <Sidebar.Pushable className="map-page" style={{ backgroundImage: `url(${background})` }}>
        <Sidebar visible={editor.type !== OE.StatusType.HIDE} animation="overlay" width="wide">{
          data &&
            <ObjectContent
              objectType={objectType}
              data={data}
              changeText={editor.type === OE.StatusType.CREATE ? '送出' : '更新'}
              onChange={(newData) => {
                if (editor.type === OE.StatusType.CREATE) {
                  switch (objectType) {
                    case T.ObjectType.CARD:
                      actions.createCardObject(map, newData as T.CardData);
                      // XXX: should we wait for the previous action to complete?
                      actions.selectObject(OE.hide());
                      break;
                    case T.ObjectType.BOX:
                      actions.createBoxObject(map, newData as T.BoxData);
                      actions.selectObject(OE.hide());
                      break;
                    default:
                  }
                } else if (editor.type === OE.StatusType.EDIT) {
                  switch (objectType) {
                    case T.ObjectType.CARD:
                      actions.updateRemoteCard(newData as T.CardData);
                      break;
                    case T.ObjectType.BOX:
                      actions.updateRemoteBox(newData as T.BoxData);
                      break;
                    default:
                  }
                }
              }}
              onCancel={() => actions.selectObject(OE.hide())}
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
    const { editor } = state;

    return { map, editor };
  },
  (dispatch: T.Dispatch) => ({
    actions: {
      selectObject: (status: OE.Status) => dispatch(OE.actions.selectObject(status)),
      createBoxObject: (mapId: T.MapID, box: T.BoxData) =>
        dispatch(T.actions.senseObject.createBoxObject(mapId, box)),
      createCardObject: (mapId: T.MapID, card: T.CardData) =>
        dispatch(T.actions.senseObject.createCardObject(mapId, card)),
      updateRemoteBox: (box: T.BoxData) => dispatch(T.actions.senseObject.updateRemoteBox(box)),
      updateRemoteCard: (card: T.CardData) => dispatch(T.actions.senseObject.updateRemoteCard(card))
    }
  })
)(MapPage);
