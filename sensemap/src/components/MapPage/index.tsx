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
import * as OE from '../../types/object-editor';
import * as SM from '../../types/sense-map';
import * as SO from '../../types/sense-object';
import { Key } from 'ts-keycode-enum';
import './index.css';
const background = require('./background-map.png');

interface StateFromProps {
  senseMap: T.State['senseMap'];
  editor: OE.Status;
  scope: typeof SM.initial.scope;
}

interface DispatchFromProps {
  actions: {
    selectObject(status: OE.Status): T.ActionChain,
    createBoxObject(mapId: T.MapID, box: T.BoxData): T.ActionChain,
    createCardObject(mapID: T.MapID, card: T.CardData): T.ActionChain,
    updateRemoteBox(box: T.BoxData): T.ActionChain,
    updateRemoteCard(card: T.CardData): T.ActionChain,
    addCardToBox(cardObject: T.ObjectID, box: T.BoxID): T.ActionChain,
    resizeViewpart(dimension: SM.DimensionInMap): T.ActionChain,
    keyPress(key: Key): T.ActionChain,
    keyRelease(key: Key): T.ActionChain,
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
    const { actions, editor, scope, senseMap } = this.props;
    const { objectType, data } = editor;

    return (
      <Sidebar.Pushable className="map-page" style={{ backgroundImage: `url(${background})` }}>
        <Sidebar visible={senseMap.inbox === SM.InboxVisibility.VISIBLE} direction="left" width="wide">
          <Inbox />
        </Sidebar>
        <Sidebar visible={editor.type !== OE.StatusType.HIDE} animation="overlay" width="wide" direction="right">{
          data &&
            <ObjectContent
              objectType={objectType}
              data={data}
              changeText={editor.type === OE.StatusType.CREATE ? '送出' : '更新'}
              onChange={async (newData) => {
                if (editor.type === OE.StatusType.CREATE) {
                  switch (objectType) {
                    case T.ObjectType.CARD:
                      const action = await actions.createCardObject(senseMap.map, newData as T.CardData);
                      const { payload: objects } = action as ReturnType<typeof SO.actions.updateObjects>;
                      if (scope.type === T.MapScopeType.BOX) {
                        const object = Object.values(objects)[0];
                        const boxId = scope.box;
                        await actions.addCardToBox(object.id, boxId);
                      }
                      actions.selectObject(OE.hide());
                      break;
                    case T.ObjectType.BOX:
                      actions.createBoxObject(senseMap.map, newData as T.BoxData);
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
    const scope = state.senseMap.scope;
    const { editor } = state;

    return { senseMap, scope, editor };
  },
  (dispatch: T.Dispatch) => ({
    actions: {
      selectObject: (status: OE.Status) =>
        dispatch(OE.actions.selectObject(status)),
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
    }
  })
)(MapPage);
