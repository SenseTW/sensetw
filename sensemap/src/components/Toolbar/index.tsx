import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { State, actions, ActionProps, mapDispatch } from '../../types';
import { Menu, Popup, Icon } from 'semantic-ui-react';
import DeleteConfirmation from './DeleteConfirmation';
import Card from '../SVGIcon/Card';
import Box from '../SVGIcon/Box';
import Inspector from '../SVGIcon/Inspector';
import Edge from '../SVGIcon/Edge';
import RemoveEdge from '../SVGIcon/RemoveEdge';
import Copy from '../SVGIcon/Copy';
import Delete from '../SVGIcon/Delete';
import BoxCard from '../SVGIcon/BoxCard';
import OpenBox from '../SVGIcon/OpenBox';
import Eject from '../SVGIcon/Eject';
import * as T from '../../types';
import * as SL from '../../types/selection';
import * as SM from '../../types/sense-map';
import * as SO from '../../types/sense-object';
import * as OE from '../../types/object-editor';
import * as V from '../../types/viewport';
import * as CS from '../../types/cached-storage';
import * as R from '../../types/routes';
// TODO: use UUID v4
import * as U from '../../types/utils';
import { cardData } from '../../types/sense/card';
import { boxData } from '../../types/sense/box';
import './index.css';

interface StateFromProps {
  selection: SL.State;
  senseObject: SO.State;
  senseMap: SM.State;
  editor: OE.State;
  viewport: V.State;
  isAuthenticated: boolean;
}

interface OwnProps {}

type Props = StateFromProps & OwnProps & ActionProps;

interface OwnState {
  open: boolean;
}

class Toolbar extends React.PureComponent<Props, OwnState> {
  state = {
    open: false,
  };

  canCreateCard(): boolean {
    const { isAuthenticated } = this.props;
    return isAuthenticated;
  }

  handleCreateCard = async () => {
    const { actions: acts, senseMap: { map: mid } } = this.props;
    const data = cardData({ title: 'New Card' });
    // Force the result to be an action
    // tslint:disable-next-line:no-any
    const result: any = await acts.senseObject.createCardObject(mid, data);
    const object = Object.values(result.payload.objects)[0] as T.ObjectData;
    acts.selection.selectMapCard(object.id, object.data);
    acts.editor.changeStatus(OE.StatusType.SHOW);
  }

  canCreateBox(): boolean {
    const { isAuthenticated } = this.props;
    return (
      isAuthenticated
      && this.props.senseMap.scope.type === T.MapScopeType.FULL_MAP
    );
  }

  handleBox = async () => {
    const { actions: acts, senseMap: { map: mid } } = this.props;
    const data = boxData({ title: 'New Box' });
    // Force the result to be an action
    // tslint:disable-next-line:no-any
    const result: any = await acts.senseObject.createBoxObject(mid, data);
    const object = Object.values(result.payload.objects)[0] as T.ObjectData;
    acts.selection.selectMapBox(object.id, object.data);
    acts.editor.changeStatus(OE.StatusType.SHOW);
  }

  findEdgeID(from: T.ObjectID, to: T.ObjectID): T.EdgeID[] | null {
    const r = Object.values(CS.toStorage(this.props.senseObject).edges)
      .filter(edge => (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from))
      .map(edge => edge.id);
    return r.length === 0 ? null : r;
  }

  canCreateEdge(): boolean {
    const { selection, isAuthenticated } = this.props;
    const ids = SL.selectedObjects(selection);

    return (
      isAuthenticated
      && ids.length === 2
      && this.findEdgeID(ids[0], ids[1]) === null
    );
  }

  handleCreateEdge(): void {
    if (!this.canCreateEdge()) {
      return;
    }
    const map  = this.props.senseMap.map;
    const selection = this.props.selection;
    const ids = SL.selectedObjects(selection);
    const from = ids[0];
    const to   = ids[1];
    this.props.actions.senseObject.createEdge(map, from, to);
  }

  canRemoveEdge(): boolean {
    const { selection, isAuthenticated } = this.props;
    const ids = SL.selectedObjects(selection);

    if (!isAuthenticated) { return false; }
    if (ids.length !== 2) { return false; }

    return this.findEdgeID(ids[0], ids[1]) !== null;
  }

  handleRemoveEdge(): void {
    const map  = this.props.senseMap.map;
    const selection = this.props.selection;
    const ids = SL.selectedObjects(selection);
    const from = ids[0];
    const to   = ids[1];
    const r    = this.findEdgeID(from, to);
    if (r === null) {
      return;
    }
    r.forEach(edge => this.props.actions.senseObject.removeEdge(map, edge));
  }

  canCopy(): boolean {
    const { isAuthenticated, selection } = this.props;
    if (!isAuthenticated) { return false; }

    const { mapBoxes, mapCards } = selection;
    return mapBoxes.length + mapCards.length === 1;
  }

  canDeleteCard(): boolean {
    const { isAuthenticated, selection } = this.props;
    if (!isAuthenticated) { return false; }

    const { mapBoxes, mapCards } = selection;
    return mapBoxes.length > 0 || mapCards.length > 0;
  }

  async handleDelete() {
    const { actions: acts, selection } = this.props;
    const { mapBoxes, mapCards } = selection;
    try {
      if (mapBoxes.length > 0) {
        this.setState({ open: true });
      } else if (mapCards.length > 0) {
        // remove card container objects
        // we don't remove cards and leave them in the inbox
        acts.senseObject.removeObjects(mapCards.map(SL.getObjectId));
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  }

  getBoxedCardCount(): number {
    const { senseObject, selection } = this.props;
    const { mapBoxes } = selection;
    return mapBoxes.reduce(
      (acc, { objectId }) => {
        const obj = CS.getObject(senseObject, objectId);
        const box = CS.getBox(senseObject, obj.data as T.BoxID);
        return acc + Object.keys(box.contains).length;
      },
      0
    );
  }

  async doDelete() {
    const { actions: acts, selection } = this.props;
    const { mapBoxes, mapCards } = selection;
    const boxIDList = mapBoxes.map(SL.getBoxId);
    try {
      if (mapCards.length > 0) {
        // remove card container objects and cards remain in the inbox
        acts.senseObject.removeObjects(mapCards.map(SL.getObjectId));
      }
      // remove box container objects
      await acts.senseObject.removeObjects(mapBoxes.map(SL.getObjectId));
      // remove boxes
      await acts.senseObject.removeBoxes(boxIDList);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  }

  canBatchTag(): boolean {
    const { isAuthenticated, selection } = this.props;
    if (!isAuthenticated) { return false; }

    const ids = SL.selectedObjects(selection);
    return ids.length > 1;
  }

  canAddCard(): boolean {
    const { isAuthenticated, selection } = this.props;

    if (!isAuthenticated) { return false; }

    if (this.props.senseMap.scope.type !== T.MapScopeType.FULL_MAP) {
      return false;
    }

    const { mapBoxes, mapCards } = selection;
    return mapCards.length >= 1 && mapBoxes.length === 1;
  }

  handleAddCard(): void {
    if (!this.canAddCard()) {
      return;
    }
    const { mapBoxes, mapCards } = this.props.selection;
    const object = CS.getObject(this.props.senseObject, mapBoxes[0].objectId);
    const cardIds = mapCards.map(SL.getObjectId);
    this.props.actions.senseObject.addCardsToBox(cardIds, object.data);
    return;
  }

  canOpenBox(): boolean {
    const { mapBoxes } = this.props.selection;
    return mapBoxes.length === 1;
  }

  handleOpenBox = (): void => {
    const { actions: acts } = this.props;
    acts.selection.clearSelection();
  }

  canRemoveCard(): boolean {
    const ids = SL.selectedObjects(this.props.selection);
    return (
      this.props.isAuthenticated
      && this.props.senseMap.scope.type === T.MapScopeType.BOX
      && ids.length >= 1
    );
  }

  handleRemoveCard(): void {
    if (!this.canRemoveCard()) {
      return;
    }
    switch (this.props.senseMap.scope.type) {
      case T.MapScopeType.BOX: {
        const cards = this.props.selection.mapCards.map(SL.getObjectId);
        const box   = this.props.senseMap.scope.box;
        if (!box) {
          throw Error('This cannot happen: map scope has type BOX with null box ID.');
        }
        this.props.actions.senseObject.removeCardsFromBox(cards, box);
        break;
      }
      case T.MapScopeType.FULL_MAP:
      default:
    }
  }

  handleZoom(step: number): void {
    const { actions: acts, viewport } = this.props;
    const { level } = viewport;
    const center = V.getCenter(viewport);
    acts.viewport.zoomViewport(level * step, center);
  }

  isWholePicture(): boolean {
    const { viewport } = this.props;
    return !!viewport.prevViewport;
  }

  handleModeChange(): void {
    const { actions: acts, viewport } = this.props;
    if (!viewport.prevViewport) {
      acts.senseMap.toWholeMode();
    } else {
      acts.senseMap.toNormalMode();
    }
  }

  canZoom(): boolean {
    const { viewport: { level } } = this.props;
    if (level === Infinity || level === -Infinity) { return false; }
    if (isNaN(level)) { return false; }
    return true;
  }

  canReset(): boolean {
    const { viewport } = this.props;
    return Math.abs(viewport.level - 1.0) >= Number.EPSILON;
  }

  resetZoomLevel(): void {
    const { actions: acts, viewport } = this.props;
    const center = V.getCenter(viewport);
    acts.viewport.zoomViewport(1.0, center);
  }

  showZoomLevel(): string {
    const { viewport } = this.props;
    switch (viewport.level) {
      case Infinity:
      case -Infinity:
        return '---%';
      default:
        if (isNaN(viewport.level)) { return '---%'; }
        return Math.floor(viewport.level * 100) + '%';
    }
  }

  render() {
    const { actions: acts, editor, senseObject, senseMap, selection } = this.props;
    const { open } = this.state;
    const mid = senseMap.map;
    const oid = SL.selectedObjects(selection)[0];
    const obj = CS.getObject(senseObject, oid);
    const bid = obj.data;
    const canCreateCard = this.canCreateCard();
    const canCreateBox = this.canCreateBox();
    const isInspectorOpen = editor.status === OE.StatusType.SHOW;
    const canCreateEdge = this.canCreateEdge();
    const canRemoveEdge = this.canRemoveEdge();
    const canCopy = this.canCopy();
    const canDeleteCard = this.canDeleteCard();
    const canAddCard = this.canAddCard();
    const canOpenBox = this.canOpenBox();
    const canRemoveCard = this.canRemoveCard();
    const showSecondMenu =
      canCopy || canDeleteCard || canAddCard || canOpenBox || canRemoveCard;
    // setup the popup props and force the position to be a string literal
    const popupProps = { inverted: true, position: 'bottom center' as 'bottom center' };

    return (
      <div className="sense-toolbar">
        <Menu compact inverted icon>
          <Popup
            {...popupProps}
            trigger={
              <Menu.Item
                id="sense-toolbar__new-card-btn"
                disabled={!canCreateCard}
                onClick={() => this.handleCreateCard()}
              >
                <Card />
              </Menu.Item>}
            content="New Card"
          />
          <Popup
            {...popupProps}
            trigger={
              <Menu.Item
                id="sense-toolbar__new-box-btn"
                disabled={!canCreateBox}
                onClick={() => this.handleBox()}
              >
                <Box />
              </Menu.Item>
            }
            content={
              canCreateBox
                ? 'New Box'
                : 'Can\'t Create a Box in another Box'
            }
          />
          <Popup
            {...popupProps}
            trigger={
              <Menu.Item
                id="sense-toolbar__inspector-btn"
                active={isInspectorOpen}
                onClick={() =>
                  acts.editor.changeStatus(
                    isInspectorOpen
                      ? OE.StatusType.HIDE
                      : OE.StatusType.SHOW
                  )
                }
              >
                <Inspector />
              </Menu.Item>
            }
            content="Edit"
          />
          <Popup
            {...popupProps}
            trigger={
              <Menu.Item
                id="sense-toolbar__remove-edge-btn"
                disabled={!canRemoveEdge && !canCreateEdge}
                onClick={() =>
                  canRemoveEdge
                    ? this.handleRemoveEdge()
                    : this.handleCreateEdge()
                }
              >
                {canRemoveEdge ? <RemoveEdge /> : <Edge />}
              </Menu.Item>
            }
            content={
              canRemoveEdge
                ? 'Remove Edge'
                : canCreateEdge
                  ? 'Add Edge'
                  : 'Select Two Objects First'
            }
          />
        </Menu>
        {
          showSecondMenu &&
          <Menu compact inverted icon>
            {
              // the copy action is not implemented
              canCopy &&
              <Popup
                {...popupProps}
                trigger={
                  <Menu.Item
                    id="sense-toolbar__copy-btn"
                    disabled
                    onClick={U.noop}
                  >
                    <Copy />
                  </Menu.Item>
                }
                content="Copy"
              />
            }
            {
              canDeleteCard &&
              <DeleteConfirmation
                trigger={
                  <Popup
                    {...popupProps}
                    trigger={
                      <Menu.Item
                        id="sense-toolbar__delete-btn"
                        onClick={() => this.handleDelete()}
                      >
                        <Delete />
                      </Menu.Item>
                    }
                    content="Delete"
                  />
                }
                open={open}
                cardCount={this.getBoxedCardCount()}
                onClose={() => this.setState({ open: false })}
                onSubmit={() => {
                  this.doDelete();
                  this.setState({ open: false });
                }}
              />
            }
            {
              canAddCard &&
              <Popup
                {...popupProps}
                trigger={
                  <Menu.Item
                    id="sense-toolbar__add-to-box-btn"
                    onClick={() => this.handleAddCard()}
                  >
                    <BoxCard />
                  </Menu.Item>
                }
                content="Add to Box"
              />
            }
            {
              canOpenBox &&
              <Popup
                {...popupProps}
                trigger={
                  <Menu.Item
                    id="sense-toolbar__open-box-btn"
                    as={Link}
                    to={R.toSubmapPath({ mid, bid })}
                    onClick={this.handleOpenBox}
                  >
                    <OpenBox />
                  </Menu.Item>
                }
                content="Open Box"
              />
            }
            {
              canRemoveCard &&
              <Popup
                {...popupProps}
                trigger={
                  <Menu.Item
                    id="sense-toolbar__eject-btn"
                    onClick={() => this.handleRemoveCard()}
                  >
                    <Eject />
                  </Menu.Item>
                }
                content="Eject"
              />
            }
          </Menu>
        }
        {
          <Menu compact inverted icon>
            <Menu.Item
              id="sense-toolbar__zoom-out-btn"
              disabled={!this.canZoom()}
              onClick={() => this.handleZoom(0.9)}
            >
              <Icon name="zoom out" />
            </Menu.Item>
            <Menu.Item
              id="sense-toolbar__zoom-reset-btn"
              disabled={!this.canReset()}
              onClick={() => this.resetZoomLevel()}
            >
              <Icon name="crosshairs" />
            </Menu.Item>
            <Menu.Item
              id="sense-toolbar__zoom-in-btn"
              disabled={!this.canZoom()}
              onClick={() => this.handleZoom(1.1)}
            >
              <Icon name="zoom in" />
            </Menu.Item>
            <Menu.Item
              id="sense-toolbar__whole-picture-btn"
              active={this.isWholePicture()}
              onClick={() => this.handleModeChange()}
            >
              <Icon name="globe" />
            </Menu.Item>
            <Menu.Item className="sense-toolbar__zoom-level">
              {this.showZoomLevel()}
            </Menu.Item>
          </Menu>
        }
      </div>
    );
  }
}

export default connect<StateFromProps, ActionProps>(
  (state: State) => {
    const isAuthenticated = state.session.authenticated;

    return {
      selection: state.selection,
      senseObject: state.senseObject,
      senseMap: state.senseMap,
      editor: state.editor,
      viewport: state.viewport,
      isAuthenticated,
    };
  },
  mapDispatch({ actions }),
)(Toolbar);