import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { Sidebar, Segment } from 'semantic-ui-react';
import ResizeDetector from 'react-resize-detector';
import Viewport from '../../containers/Viewport';
import Map from '../../containers/Map';
import WholeMap from '../../components/WholeMap';
import ObjectMenu from '../ObjectMenu';
import ObjectContent from '../ObjectContent';
import Inbox from '../../containers/Inbox';
import InboxToggler from '../InboxToggler';
import {
  MapID,
  CardData,
  BoxID,
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
import * as SS from '../../types/session';
import * as B from '../../types/sense/box';
import { Action as BoxAction } from '../../types/sense/box';
import * as C from '../../types/sense/card';
import { Action as CardAction } from '../../types/sense/card';
import * as F from '../../types/sense/focus';
import * as R from '../../types/routes';
import './index.css';
import { Key } from 'ts-keycode-enum';
const background = require('./background-map.png');

type RouteProps = RouteComponentProps<{ mid: MapID, bid: BoxID }>;

interface StateFromProps {
  mid: MapID;
  senseMap: State['senseMap'];
  senseObject: SO.State;
  editor: OE.State;
  scope: typeof SM.initial.scope;
  showAnotherMode: Boolean;
  isAuthenticated: Boolean;
}

type Props = StateFromProps & ActionProps;

class MapPage extends React.Component<Props> {
  handleResize = (width: number, height: number) => {
    const { actions: acts } = this.props;
    // the header height is 105px
    acts.viewport.resizeViewport({ width, height: height - 105 });
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
    const {
      actions: acts,
      mid,
      editor,
      scope,
      senseMap,
      senseObject,
      showAnotherMode,
      isAuthenticated,
    } = this.props;
    const { status, focus } = editor;
    const isInboxVisible = senseMap.inbox === SM.InboxVisibility.VISIBLE;

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
    const isWholePicture = senseMap.mode === SM.MapModeType.WHOLE;
    const shouldShowWholePicture = showAnotherMode ? !isWholePicture : isWholePicture;

    return (
      <div className="map-page">
        <Sidebar.Pushable style={{ backgroundImage: `url(${background})` }}>
          <Sidebar
            visible={isInboxVisible}
            animation="overlay"
            direction="left"
            width="wide"
          >
            {isAuthenticated && <Inbox />}
          </Sidebar>
          <Sidebar
            visible={status !== OE.StatusType.HIDE}
            animation="overlay"
            width="wide"
            direction="right"
          >{
            data
              ? (
                <ObjectContent
                  disabled={!isAuthenticated}
                  objectType={focus.objectType}
                  data={data}
                  submitText={isNew ? 'Submit' : 'Update'}
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
                            await acts.senseObject.createCardObject(mid, newData as CardData) as any;
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
                          acts.senseObject.createBoxObject(mid, newData as BoxData);
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
            <ResizeDetector handleWidth handleHeight resizableElementId="root" onResize={this.handleResize} />
            <Viewport>
              {(props) => (
                shouldShowWholePicture
                  ? <Map id={mid} {...props} component={WholeMap} />
                  : <Map id={mid} {...props} />
              )}
            </Viewport>
            <div className="map-page__menu">
              <ObjectMenu />
            </div>
            {
              isAuthenticated
                ? (
                  <InboxToggler
                    className="inbox__btn"
                    style={{ left: isInboxVisible ? 350 : 0 }}
                    open={isInboxVisible}
                    onToggle={open =>
                      open
                        ? acts.senseMap.openInbox()
                        : acts.senseMap.closeInbox()
                    }
                  />
                )
                : (
                  <div className="map-page__login-hint">
                    <Segment>
                      <Link to={R.login}>Sign up / Login</Link> to edit the map and create your own map
                    </Segment>
                  </div>
                )
            }
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default withRouter(connect<StateFromProps, ActionProps, RouteProps>(
  (state: State, router: RouteProps) => {
    const senseMap = state.senseMap;
    const senseObject = state.senseObject;
    const scope = state.senseMap.scope;
    const session = state.session;
    const { editor } = state;
    const { mid } = router.match.params;
    const showAnotherMode = state.input.keyStatus[Key.Alt];
    const isAuthenticated = SS.isAuthenticated(session);

    return {
      mid,
      senseMap,
      senseObject,
      scope,
      editor,
      showAnotherMode,
      isAuthenticated
    };
  },
  mapDispatch({ actions }),
)(MapPage));
