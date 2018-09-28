import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { State, actions, ActionProps, mapDispatch } from '../../types';
import { Menu, Popup, Icon } from 'semantic-ui-react';
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
import * as F from '../../types/sense/focus';
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

const selectedCardsAndBoxes:
  (props: Props) => { cards: T.ObjectID[], boxes: T.ObjectID[] } =
  props => props.selection.objects.reduce(
    (acc, id) => {
      switch (CS.getObject(props.senseObject, id).objectType) {
        case T.ObjectType.CARD: {
          return { ...acc, cards: [ ...acc.cards, id ] };
        }
        case T.ObjectType.BOX: {
          return { ...acc, boxes: [ ...acc.boxes, id ] };
        }
        default: {
          return acc;
        }
      }
    },
    { cards: [], boxes: [] }
  );

class ObjectMenu extends React.PureComponent<Props> {
  canCreateCard(): boolean {
    const { isAuthenticated } = this.props;
    return isAuthenticated;
  }

  handleCreateCard(): void {
    const { actions: acts } = this.props;
    const data = cardData({ id: U.objectId() });
    acts.senseObject.updateCard(data);
    acts.editor.focusObject(F.focusCard(data.id));
    acts.editor.changeStatus(OE.StatusType.SHOW);
  }

  canCreateBox(): boolean {
    const { isAuthenticated } = this.props;
    return (
      isAuthenticated
      && this.props.senseMap.scope.type === T.MapScopeType.FULL_MAP
    );
  }

  handleBox(): void {
    const { actions: acts } = this.props;
    const data = boxData({ id: U.objectId() });
    acts.senseObject.updateBox(data);
    acts.editor.focusObject(F.focusBox(data.id));
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

    return (
      isAuthenticated
      && SL.count(selection) === 2
      && this.findEdgeID(SL.get(selection, 0), SL.get(selection, 1)) === null
    );
  }

  handleCreateEdge(): void {
    if (!this.canCreateEdge()) {
      return;
    }
    const map  = this.props.senseMap.map;
    const selection = this.props.selection;
    const from = SL.get(selection, 0);
    const to   = SL.get(selection, 1);
    this.props.actions.senseObject.createEdge(map, from, to);
  }

  canRemoveEdge(): boolean {
    const { selection, isAuthenticated } = this.props;

    if (!isAuthenticated) { return false; }
    if (SL.count(selection) !== 2) { return false; }

    return this.findEdgeID(SL.get(selection, 0), SL.get(selection, 1)) !== null;
  }

  handleRemoveEdge(): void {
    const map  = this.props.senseMap.map;
    const selection = this.props.selection;
    const from = SL.get(selection, 0);
    const to   = SL.get(selection, 1);
    const r    = this.findEdgeID(from, to);
    if (r === null) {
      return;
    }
    r.forEach(edge => this.props.actions.senseObject.removeEdge(map, edge));
  }

  canCopy(): boolean {
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) { return false; }

    const { cards, boxes } = selectedCardsAndBoxes(this.props);
    return cards.length + boxes.length === 1;
  }

  canDeleteCard(): boolean {
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) { return false; }

    const { cards, boxes } = selectedCardsAndBoxes(this.props);
    return cards.length > 0 || boxes.length > 0;
  }

  async handleDeleteCard() {
    const { actions: acts, senseObject } = this.props;
    const { cards, boxes } = selectedCardsAndBoxes(this.props);
    try {
      if (cards.length > 0) {
        // remove card container objects
        // we don't remove cards and leave them in the inbox
        await acts.senseObject.removeObjects(cards);
      }
      if (boxes.length > 0) {
        const boxIDList =
          boxes.map(objID => CS.getObject(senseObject, objID).data as T.BoxID);
        // remove box container objects
        await acts.senseObject.removeObjects(boxes);
        // remove boxes
        await acts.senseObject.removeBoxes(boxIDList);
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
    acts.editor.focusObject(F.focusNothing());
  }

  canBatchTag(): boolean {
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) { return false; }

    const { cards, boxes } = selectedCardsAndBoxes(this.props);
    return cards.length + boxes.length > 1;
  }

  canAddCard(): boolean {
    const { isAuthenticated } = this.props;

    if (!isAuthenticated) { return false; }

    if (this.props.senseMap.scope.type !== T.MapScopeType.FULL_MAP) {
      return false;
    }

    const { cards, boxes } = selectedCardsAndBoxes(this.props);
    return cards.length >= 1 && boxes.length === 1;
  }

  handleAddCard(): void {
    if (!this.canAddCard()) {
      return;
    }
    const { cards, boxes } = selectedCardsAndBoxes(this.props);
    const object = CS.getObject(this.props.senseObject, boxes[0]);
    this.props.actions.senseObject.addCardsToBox(cards, object.data);
    return;
  }

  canOpenBox(): boolean {
    const { boxes } = selectedCardsAndBoxes(this.props);
    return boxes.length === 1;
  }

  handleOpenBox = (): void => {
    const { actions: acts } = this.props;
    acts.selection.clearSelection();
  }

  canRemoveCard(): boolean {
    return (
      this.props.isAuthenticated
      && this.props.senseMap.scope.type === T.MapScopeType.BOX
      && SL.count(this.props.selection) >= 1
    );
  }

  handleRemoveCard(): void {
    if (!this.canRemoveCard()) {
      return;
    }
    switch (this.props.senseMap.scope.type) {
      case T.MapScopeType.BOX: {
        const cards = this.props.selection.objects;
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

  canReset(): boolean {
    const { viewport } = this.props;
    return Math.abs(viewport.level - 1.0) >= Number.EPSILON;
  }

  resetZoomLevel(): void {
    const { actions: acts, viewport } = this.props;
    const center = V.getCenter(viewport);
    acts.viewport.zoomViewport(1.0, center);
  }

  render() {
    const { actions: acts, editor, senseObject, senseMap, selection } = this.props;
    const mid = senseMap.map;
    const oid = SL.get(selection, 0);
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
      <div className="sense-object-menu">
        <Menu compact inverted icon>
          <Popup
            {...popupProps}
            trigger={
              <Menu.Item
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
                trigger={<Menu.Item disabled onClick={U.noop}><Copy /></Menu.Item>}
                content="Copy"
              />
            }
            {
              canDeleteCard &&
              <Popup
                {...popupProps}
                trigger={<Menu.Item onClick={() => this.handleDeleteCard()}><Delete /></Menu.Item>}
                content="Delete"
              />
            }
            {
              canAddCard &&
              <Popup
                {...popupProps}
                trigger={<Menu.Item onClick={() => this.handleAddCard()}><BoxCard /></Menu.Item>}
                content="Add to Box"
              />
            }
            {
              canOpenBox &&
              <Popup
                {...popupProps}
                trigger={
                  <Menu.Item
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
                trigger={<Menu.Item onClick={() => this.handleRemoveCard()}><Eject /></Menu.Item>}
                content="Eject"
              />
            }
          </Menu>
        }
        {
          <Menu compact inverted icon>
            <Menu.Item onClick={() => this.handleZoom(0.9)}>
              <Icon name="zoom out" />
            </Menu.Item>
            <Menu.Item
              disabled={!this.canReset()}
              onClick={() => this.resetZoomLevel()}
            >
              <Icon name="crosshairs" />
            </Menu.Item>
            <Menu.Item onClick={() => this.handleZoom(1.1)}>
              <Icon name="zoom in" />
            </Menu.Item>
            <Menu.Item
              active={this.isWholePicture()}
              onClick={() => this.handleModeChange()}
            >
              <Icon name="globe" />
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
)(ObjectMenu);