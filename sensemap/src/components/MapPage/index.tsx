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
import {
  CardData,
  BoxData,
  ObjectType,
  MapScopeType,
  State,
  actions,
  ActionProps,
  mapDispatch,
} from '../../types';
import * as OE from '../../types/object-editor';
import * as SM from '../../types/sense-map';
import * as SO from '../../types/sense-object';
import * as CS from '../../types/cached-storage';
import * as B from '../../types/sense/box';
import { Action as BoxAction } from '../../types/sense/box';
import * as C from '../../types/sense/card';
import { Action as CardAction } from '../../types/sense/card';
import * as F from '../../types/sense/focus';
import './index.css';
const background = require('./background-map.png');

interface StateFromProps {
  senseMap: State['senseMap'];
  senseObject: SO.State;
  editor: OE.State;
  scope: typeof SM.initial.scope;
}

type Props = StateFromProps & ActionProps;

class MapPage extends React.Component<Props> {
  handleResize = (width: number, height: number) => {
    const { actions: acts } = this.props;
    acts.viewport.resizeViewport({ width, height });
  }

  handleKeyUp = (e: KeyboardEvent) => {
    const { actions: acts } = this.props;
    acts.input.keyRelease(e.which);
  }

  handleKeyDown = (e: KeyboardEvent) => {
    const { actions: acts } = this.props;
    acts.input.keyPress(e.which);
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
    const { actions: acts, editor, scope, senseMap, senseObject } = this.props;
    const { status, focus } = editor;

    let data: BoxData | CardData | null = null;
    let isDirty: boolean = false;
    let isNew: boolean = false;
    switch (focus.objectType) {
      case ObjectType.BOX:
        data = CS.getBox(senseObject, focus.data);
        isDirty = CS.isBoxDirty(senseObject, focus.data);
        isNew = CS.isBoxNew(senseObject, focus.data);
        break;
      case ObjectType.CARD:
        data = CS.getCard(senseObject, focus.data);
        isDirty = CS.isCardDirty(senseObject, focus.data);
        isNew = CS.isCardNew(senseObject, focus.data);
        break;
      default:
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
                objectType={focus.objectType}
                data={data}
                submitText={isNew ? '送出' : '更新'}
                submitDisabled={!isDirty && !isNew}
                cancelDisabled={!isDirty && !isNew}
                onUpdate={action => {
                  if (data === null) {
                    return;
                  }

                  switch (focus.objectType) {
                    case ObjectType.CARD: {
                      const card = C.reducer(data as CardData, action as CardAction);
                      acts.senseObject.updateCard(card);
                      break;
                    }
                    case ObjectType.BOX: {
                      const box = B.reducer(data as BoxData, action as BoxAction);
                      acts.senseObject.updateBox(box);
                      break;
                    }
                    default:
                  }
                }}
                onSubmit={async (newData) => {
                  if (!isNew) {
                    // should update the object
                    switch (focus.objectType) {
                      case ObjectType.CARD:
                        await acts.senseObject.saveCard(newData as CardData);
                        break;
                      case ObjectType.BOX:
                        await acts.senseObject.saveBox(newData as BoxData);
                        break;
                      default:
                    }
                  } else {
                    // should create an object
                    switch (focus.objectType) {
                      case ObjectType.CARD:
                        const action =
                          // tslint:disable-next-line:no-any
                          await acts.senseObject.createCardObject(senseMap.map, newData as CardData) as any;
                        const { payload: { objects } } = action as ReturnType<typeof CS.actions.updateObjects>;
                        if (scope.type === MapScopeType.BOX) {
                          const obj = Object.values(objects)[0];
                          const boxId = scope.box;
                          await acts.senseObject.addCardToBox(obj.id, boxId);
                        }
                        acts.cachedStorage.removeCard(data as CardData);
                        acts.editor.changeStatus(OE.StatusType.HIDE);
                        acts.editor.focusObject(F.focusNothing());
                        break;
                      case ObjectType.BOX:
                        acts.senseObject.createBoxObject(senseMap.map, newData as BoxData);
                        acts.cachedStorage.removeBox(data as BoxData);
                        acts.editor.changeStatus(OE.StatusType.HIDE);
                        acts.editor.focusObject(F.focusNothing());
                        break;
                      default:
                    }
                  }
                }}
                onCancel={() => {
                  if (data) {
                    switch (focus.objectType) {
                      case ObjectType.CARD:
                        acts.cachedStorage.removeCard(data as CardData);
                        break;
                      case ObjectType.BOX:
                        acts.cachedStorage.removeBox(data as BoxData);
                        break;
                      default:
                    }
                  }
                  if (isNew) {
                    acts.editor.focusObject(F.focusNothing());
                    acts.editor.changeStatus(OE.StatusType.HIDE);
                  }
                }}
              />
            )
            : <div className="inspector-empty">
                <div>請選擇單一卡片或 Box</div>
              </div>
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

export default connect<StateFromProps, ActionProps>(
  (state: State) => {
    const senseMap = state.senseMap;
    const senseObject = state.senseObject;
    const scope = state.senseMap.scope;
    const { editor } = state;

    return { senseMap, senseObject, scope, editor };
  },
  mapDispatch({ actions }),
)(MapPage);
