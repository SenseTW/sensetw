import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Sidebar, Segment } from 'semantic-ui-react';
import ResizeDetector from 'react-resize-detector';
import Viewport from '../../containers/Viewport';
import Map from '../../containers/Map';
import Toolbar from '../Toolbar';
import Inspector from '../Inspector';
import Inbox from '../../containers/Inbox';
import SidebarToggler from '../SidebarToggler';
import {
  MapID,
  CardID,
  CardData,
  BoxID,
  BoxData,
  SelectionType,
  State,
  actions,
  ActionProps,
  mapDispatch,
} from '../../types';
import * as OE from '../../types/object-editor';
import * as SM from '../../types/sense-map';
import * as SO from '../../types/sense-object';
import * as CS from '../../types/cached-storage';
import * as V from '../../types/viewport';
import * as B from '../../types/sense/box';
import * as SL from '../../types/selection';
import { Action as BoxAction } from '../../types/sense/box';
import * as C from '../../types/sense/card';
import * as E from '../../types/sense/edge';
import { Action as CardAction } from '../../types/sense/card';
import './index.css';
const background = require('./background-map.png');

type RouteProps = RouteComponentProps<{ mid: MapID, bid: BoxID }>;

interface StateFromProps {
  mid: MapID;
  senseMap: State['senseMap'];
  senseObject: SO.State;
  editor: OE.State;
  scope: typeof SM.initial.scope;
  viewport: V.State;
  selection: SL.State;
  isAuthenticated: Boolean;
}

type Props = StateFromProps & ActionProps;

class MapPage extends React.Component<Props> {
  handleResize = (width: number, height: number) => {
    const { actions: acts } = this.props;
    // the header height is 95px
    acts.viewport.resizeViewport({ width, height: height - 95 });

    if (width <= 640) {
      acts.viewport.setBaseLevel(0.5);
    } else if (width <= 800) {
      acts.viewport.setBaseLevel(0.6);
    } else if (width <= 1024) {
      acts.viewport.setBaseLevel(0.7);
    } else {
      acts.viewport.setBaseLevel(1.0);
    }
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

  renderBoxInspector() {
    const { actions: acts, mid, isAuthenticated, senseObject, selection } = this.props;
    const isBoxSelected = selection.mapBoxes.length === 1;
    let data: BoxData | null = null;
    let isNew: boolean = false;
    let isDirty: boolean = false;
    if (isBoxSelected) {
      const boxId = selection.mapBoxes[0].boxId;
      data = CS.getBox(senseObject, boxId);
      isNew = CS.isBoxNew(senseObject, boxId);
      isDirty = CS.isBoxDirty(senseObject, boxId);
    }

    return data && (
      <Inspector
        disabled={!isAuthenticated}
        selectionType={SelectionType.MAP_BOX}
        data={data}
        submitText={isNew ? 'Submit' : 'Update'}
        submitDisabled={!isDirty && !isNew}
        cancelDisabled={!isDirty && !isNew}
        onUpdate={action => {
          if (!data) { return; }
          const box = B.reducer(data, action as BoxAction);
          acts.senseObject.updateBox(box);
        }}
        onSubmit={async (newData) => {
          if (!data) { return; }
          if (!isNew) {
            // should update the object
            await acts.senseObject.saveBox(newData as BoxData);
          } else {
            acts.senseObject.createBoxObject(mid, newData as BoxData);
            acts.cachedStorage.removeBox(data);
            acts.editor.changeStatus(OE.StatusType.HIDE);
          }
        }}
        onCancel={() => {
          if (!data) { return; }
          acts.cachedStorage.removeBox(data);
          if (isNew) {
            acts.editor.changeStatus(OE.StatusType.HIDE);
          }
        }}
      />
    );
  }

  renderCardInspector() {
    const { actions: acts, mid, isAuthenticated, senseObject, selection } = this.props;
    const isCardSelected = selection.mapCards.length === 1;
    const isInboxCardSelected = selection.inboxCards.length === 1;
    let data: CardData | null = null;
    let isNew: boolean = false;
    let isDirty: boolean = false;
    const cardId: CardID =
      isCardSelected ?
        selection.mapCards[0].cardId :
      isInboxCardSelected ?
        selection.inboxCards[0] :
      // otherwise
        '';
    if (isCardSelected || isInboxCardSelected) {
      data = CS.getCard(senseObject, cardId);
      isNew = CS.isCardNew(senseObject, cardId);
      isDirty = CS.isCardDirty(senseObject, cardId);
    }

    return data && (
      <Inspector
        disabled={!isAuthenticated}
        selectionType={isCardSelected ? SelectionType.MAP_CARD : SelectionType.INBOX_CARD}
        data={data}
        submitText={isNew ? 'Submit' : 'Update'}
        submitDisabled={!isDirty && !isNew}
        cancelDisabled={!isDirty && !isNew}
        onUpdate={action => {
          if (!data) { return; }
          const card = C.reducer(data, action as CardAction);
          acts.senseObject.updateCard(card);
        }}
        onSubmit={async (newData) => {
          if (!data) { return; }
          if (!isNew) {
            // should update the object
            await acts.senseObject.saveCard(newData as CardData);
          } else {
            acts.senseObject.createCardObject(mid, newData as CardData);
            acts.cachedStorage.removeCard(data);
            acts.editor.changeStatus(OE.StatusType.HIDE);
          }
        }}
        onCancel={() => {
          if (!data) { return; }
          acts.cachedStorage.removeCard(data);
          if (isNew) {
            acts.editor.changeStatus(OE.StatusType.HIDE);
          }
        }}
      />
    );
  }

  renderEdgeInspector() {
    const { senseObject, selection } = this.props;
    const edgeId = selection.mapEdges[0] || '';
    const data = CS.getEdge(senseObject, edgeId);
    const isEmpty = E.isEmpty(data);
    const isNew = CS.isEdgeNew(senseObject, edgeId);
    const isDirty = CS.isEdgeDirty(senseObject, edgeId);

    return !isEmpty && (
      <Inspector
        selectionType={SelectionType.MAP_EDGE}
        data={data}
        submitText={isNew ? 'Submit' : 'Update'}
        submitDisabled={!isDirty && !isNew}
        cancelDisabled={!isDirty && !isNew}
      />
    );
  }

  render() {
    const {
      actions: acts,
      mid,
      editor,
      senseMap,
      isAuthenticated,
      viewport,
    } = this.props;
    const { status } = editor;
    const isInboxVisible = senseMap.inbox === SM.InboxVisibility.VISIBLE;
    const isInspectorOpen = editor.status === OE.StatusType.SHOW;

    let sidebarWidth = 350;
    if (viewport.width <= 640) {
      sidebarWidth = 128;
    } else if (viewport.width <= 800) {
      sidebarWidth = 160;
    } else if (viewport.width <= 1024) {
      sidebarWidth = 204;
    }

    const boxInspector = this.renderBoxInspector();
    const cardInspector = this.renderCardInspector();
    const edgeInpsector = this.renderEdgeInspector();
    const emptyInspector = (
      <div className="inspector-empty">
        <div>請選擇單一卡片或 Box</div>
      </div>
    );

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
          >
            {boxInspector || cardInspector || edgeInpsector || emptyInspector}
          </Sidebar>
          <Sidebar.Pusher>
            <ResizeDetector handleWidth handleHeight resizableElementId="root" onResize={this.handleResize} />
            <Viewport>
              {(props) => <Map id={mid} {...props} />}
            </Viewport>
            <div className="map-page__toolbar">
              <Toolbar />
            </div>
            {
              isAuthenticated
                ? (
                  <SidebarToggler
                    className="inbox__btn"
                    style={{ left: isInboxVisible ? sidebarWidth : 0 }}
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
                      <a href="#" onClick={(e) => { e.preventDefault(); acts.account.loginRequest(); }}>
                        Sign up / Login
                      </a> to edit the map and create your own map
                    </Segment>
                  </div>
                )
            }
            <SidebarToggler
              right
              className="inspector__btn"
              style={{ right: isInspectorOpen ? sidebarWidth : 0 }}
              open={isInspectorOpen}
              onToggle={open =>
                open
                  ? acts.editor.changeStatus(OE.StatusType.SHOW)
                  : acts.editor.changeStatus(OE.StatusType.HIDE)
              }
            />
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
    const { editor, viewport, selection } = state;
    const { mid } = router.match.params;
    const isAuthenticated = session.authenticated;

    return {
      mid,
      senseMap,
      senseObject,
      scope,
      editor,
      viewport,
      selection,
      isAuthenticated,
    };
  },
  mapDispatch({ actions }),
)(MapPage));
