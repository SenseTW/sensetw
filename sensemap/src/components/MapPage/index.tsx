import * as React from 'react';
import { connect } from 'react-redux';
import { Sidebar } from 'semantic-ui-react';
import ResizeDetector from 'react-resize-detector';
import Viewport from '../../containers/Viewport';
import Map from '../../containers/Map';
import ObjectMenu from '../ObjectMenu';
import ObjectContent from '../ObjectContent';
import Breadcrumb from '../Breadcrumb';
import Inbox from '../../containers/Inbox';
import * as T from '../../types';
import * as SB from '../../types/sense-box';
import * as SC from '../../types/sense-card';
import * as OE from '../../types/object-editor';
import * as SM from '../../types/sense-map';
import * as SO from '../../types/sense-object';
import { Key } from 'ts-keycode-enum';
import './index.css';
const background = require('./background-map.png');

interface StateFromProps {
  senseMap: T.State['senseMap'];
  senseObject: SO.State;
  editor: OE.State;
  scope: typeof SM.initial.scope;
}

interface DispatchFromProps {
  actions: {
    changeStatus(status: OE.StatusType): T.ActionChain,
    createBoxObject(mapId: T.MapID, box: T.BoxData): T.ActionChain,
    createCardObject(mapID: T.MapID, card: T.CardData): T.ActionChain,
    updateRemoteBox(box: T.BoxData): T.ActionChain,
    updateRemoteCard(card: T.CardData): T.ActionChain,
    addCardToBox(cardObject: T.ObjectID, box: T.BoxID): T.ActionChain,
    resizeViewpart(dimension: SM.DimensionInMap): T.ActionChain,
    keyPress(key: Key): T.ActionChain,
    keyRelease(key: Key): T.ActionChain,
    updateBox(id: T.BoxID, action: SB.Action): T.ActionChain;
    updateCard(id: T.CardID, action: SC.Action): T.ActionChain;
    clearObject(objectType: T.ObjectType, id: T.BoxID | T.CardID): T.ActionChain;
  };
}

type Props = StateFromProps & DispatchFromProps;

class MapPage extends React.Component<Props> {
  handleResize = (width: number, height: number) => {
    const { actions } = this.props;
    actions.resizeViewpart([width, height]);
  }

  handleKeyUp = (e: KeyboardEvent) => {
    const { actions } = this.props;
    actions.keyRelease(e.which);
  }

  handleKeyDown = (e: KeyboardEvent) => {
    const { actions } = this.props;
    actions.keyPress(e.which);
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    const { actions, editor, scope, senseMap, senseObject } = this.props;
    const { status, focus } = editor;

    const object = SO.getObject(senseObject, focus || '');
    let data: T.CardData | T.BoxData | null = null;
    if (object) {
      switch (object.objectType) {
        case T.ObjectType.BOX:
          data = SO.getBoxOrDefault(editor.temp, senseObject, object.data);
          break;
        case T.ObjectType.CARD:
          data = SO.getCardOrDefault(editor.temp, senseObject, object.data);
          break;
        default:
      }
    }

    return (
      <Sidebar.Pushable className="map-page" style={{ backgroundImage: `url(${background})` }}>
        <Sidebar visible={senseMap.inbox === SM.InboxVisibility.VISIBLE} direction="left" width="wide">
          <Inbox />
        </Sidebar>
        <Sidebar visible={status !== OE.StatusType.HIDE} animation="overlay" width="wide" direction="right">{
          data
            ? (
              <ObjectContent
                objectType={object.objectType}
                data={data}
                changeText={status === OE.StatusType.CREATE ? '送出' : '更新'}
                onUpdate={action => {
                  if (data === null) {
                    return;
                  }

                  switch (object.objectType) {
                    case T.ObjectType.CARD:
                      actions.updateCard(data.id, action as SC.Action);
                      break;
                    case T.ObjectType.BOX:
                      actions.updateBox(data.id, action as SB.Action);
                      break;
                    default:
                  }
                }}
                onChange={async (newData) => {
                  if (status === OE.StatusType.CREATE) {
                    switch (object.objectType) {
                      case T.ObjectType.CARD:
                        const action = await actions.createCardObject(senseMap.map, newData as T.CardData);
                        const { payload: objects } = action as ReturnType<typeof SO.actions.updateObjects>;
                        if (scope.type === T.MapScopeType.BOX) {
                          const obj = Object.values(objects)[0];
                          const boxId = scope.box;
                          await actions.addCardToBox(obj.id, boxId);
                        }
                        actions.changeStatus(OE.StatusType.HIDE);
                        break;
                      case T.ObjectType.BOX:
                        actions.createBoxObject(senseMap.map, newData as T.BoxData);
                        actions.changeStatus(OE.StatusType.HIDE);
                        break;
                      default:
                    }
                  } else if (status === OE.StatusType.EDIT) {
                    switch (object.objectType) {
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
                onCancel={() => {
                  if (data === null) {
                    return;
                  }

                  actions.clearObject(object.objectType, data.id);
                }}
              />
            )
            : <div>請選擇卡片或 Box</div>
        }
        </Sidebar>
        <Sidebar.Pusher>
          <ResizeDetector handleWidth handleHeight onResize={this.handleResize} />
          <Viewport>
            {(props) => (<Map id={senseMap.map} {...props} />)}
          </Viewport>
          <ObjectMenu />
          <Breadcrumb />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export default connect<StateFromProps, DispatchFromProps>(
  (state: T.State) => {
    const senseMap = state.senseMap;
    const senseObject = state.senseObject;
    const scope = state.senseMap.scope;
    const { editor } = state;

    return { senseMap, senseObject, scope, editor };
  },
  (dispatch: T.Dispatch) => ({
    actions: {
      changeStatus: (status: OE.StatusType) =>
        dispatch(OE.actions.changeStatus(status)),
      createBoxObject: (mapId: T.MapID, box: T.BoxData) =>
        dispatch(T.actions.senseObject.createBoxObject(mapId, box)),
      createCardObject: (mapId: T.MapID, card: T.CardData) =>
        dispatch(T.actions.senseObject.createCardObject(mapId, card)),
      updateRemoteBox: (box: T.BoxData) =>
        dispatch(T.actions.senseObject.updateRemoteBox(box)),
      updateRemoteCard: (card: T.CardData) =>
        dispatch(T.actions.senseObject.updateRemoteCard(card)),
      addCardToBox: (cardObject: T.ObjectID, box: T.BoxID) =>
        dispatch(T.actions.senseObject.addCardToBox(cardObject, box)),
      resizeViewpart: (dimension: SM.DimensionInMap) =>
        dispatch(T.actions.senseMap.resizeViewport(dimension)),
      keyPress: (key: Key) =>
        dispatch(T.actions.input.keyPress(key)),
      keyRelease: (key: Key) =>
        dispatch(T.actions.input.keyRelease(key)),
      updateBox: (id: T.BoxID, action: SB.Action) =>
        dispatch(T.actions.editor.updateBox(id, action)),
      updateCard: (id: T.CardID, action: SC.Action) =>
        dispatch(T.actions.editor.updateCard(id, action)),
      clearObject: (objectType: T.ObjectType, id: T.BoxID | T.CardID) =>
        dispatch(T.actions.editor.clearObject(objectType, id)),
    }
  })
)(MapPage);
