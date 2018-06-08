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
import { CardData, BoxData, ObjectType, MapScopeType, State, actions, ActionProps, mapDispatch } from '../../types';
import * as OE from '../../types/object-editor';
import * as SM from '../../types/sense-map';
import * as SO from '../../types/sense-object';
import * as S from '../../types/storage';
import { Action as BoxAction } from '../../types/sense/box';
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
    let doesDataExist: boolean = false;
    switch (focus.objectType) {
      case ObjectType.BOX:
        data = S.getBoxOrDefault(editor.temp, senseObject, focus.data);
        isDirty = S.doesBoxExist(editor.temp, focus.data);
        doesDataExist = S.doesBoxExist(senseObject, focus.data);
        break;
      case ObjectType.CARD:
        data = S.getCardOrDefault(editor.temp, senseObject, focus.data);
        isDirty = S.doesCardExist(editor.temp, focus.data);
        doesDataExist = S.doesCardExist(senseObject, focus.data);
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
                submitText={doesDataExist ? '更新' : '送出'}
                submitDisabled={!isDirty}
                cancelDisabled={!isDirty}
                onUpdate={action => {
                  if (data === null) {
                    return;
                  }

                  switch (focus.objectType) {
                    case ObjectType.CARD:
                      acts.editor.updateCard(data.id, action as CardAction);
                      break;
                    case ObjectType.BOX:
                      acts.editor.updateBox(data.id, action as BoxAction);
                      break;
                    default:
                  }
                }}
                onSubmit={async (newData) => {
                  if (doesDataExist) {
                    // should update the object
                    switch (focus.objectType) {
                      case ObjectType.CARD:
                        await acts.senseObject.updateRemoteCard(newData as CardData);
                        acts.editor.clearObject(focus.objectType, focus.data);
                        break;
                      case ObjectType.BOX:
                        await acts.senseObject.updateRemoteBox(newData as BoxData);
                        acts.editor.clearObject(focus.objectType, focus.data);
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
                        const { payload: objects } = action as ReturnType<typeof SO.actions.updateObjects>;
                        if (scope.type === MapScopeType.BOX) {
                          const obj = Object.values(objects)[0];
                          const boxId = scope.box;
                          await acts.senseObject.addCardToBox(obj.id, boxId);
                        }
                        acts.editor.changeStatus(OE.StatusType.HIDE);
                        acts.editor.clearObject(focus.objectType, focus.data);
                        acts.editor.focusObject(F.focusNothing());
                        break;
                      case ObjectType.BOX:
                        acts.senseObject.createBoxObject(senseMap.map, newData as BoxData);
                        acts.editor.changeStatus(OE.StatusType.HIDE);
                        acts.editor.clearObject(focus.objectType, focus.data);
                        acts.editor.focusObject(F.focusNothing());
                        break;
                      default:
                    }
                  }
                }}
                onCancel={() => {
                  if (data) {
                    acts.editor.clearObject(focus.objectType, data.id);
                  }
                  if (!doesDataExist) {
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
