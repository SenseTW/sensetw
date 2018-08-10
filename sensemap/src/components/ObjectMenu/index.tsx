import * as React from 'react';
import { connect } from 'react-redux';
import { State, actions, ActionProps, mapDispatch } from '../../types';
import { Menu, Popup, Icon } from 'semantic-ui-react';
import Card from '../SVGIcon/Card';
import Box from '../SVGIcon/Box';
import Inspector from '../SVGIcon/Inspector';
import Edge from '../SVGIcon/Edge';
import RemoveEdge from '../SVGIcon/RemoveEdge';
import Copy from '../SVGIcon/Copy';
import Delete from '../SVGIcon/Delete';
import BatchTag from '../SVGIcon/BatchTag';
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

    const { cards } = selectedCardsAndBoxes(this.props);
    return cards.length === 1;
  }

  async handleDeleteCard() {
    const { actions: acts, senseObject, selection } = this.props;
    const { id, data } = CS.getObject(senseObject, SL.get(selection, 0));
    const card = CS.getCard(senseObject, data);
    // remove the card container object
    await acts.senseObject.removeObject(id);
    // clear any local modifications
    acts.cachedStorage.removeCard(card);
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

  handleOpenBox(): void {
    const { actions: acts, selection, senseObject } = this.props;
    const objectId = SL.get(selection, 0);
    const obj = CS.getObject(senseObject, objectId);
    acts.selection.clearSelection();
    acts.senseMap.openBox(obj.data);
  }

  canRemoveCard(): Boolean {
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
    const { senseMap } = this.props;
    return senseMap.mode === SM.MapModeType.WHOLE;
  }

  handleModeChange(): void {
    const { actions: acts, senseMap } = this.props;
    if (senseMap.mode === SM.MapModeType.PART) {
      acts.senseMap.toWholeMode();
    } else {
      acts.senseMap.toNormalMode();
    }
  }

  render() {
    const { actions: acts, editor } = this.props;
    const canCreateCard = this.canCreateCard();
    const canCreateBox = this.canCreateBox();
    const isInspectorOpen = editor.status === OE.StatusType.SHOW;
    const canCreateEdge = this.canCreateEdge();
    const canRemoveEdge = this.canRemoveEdge();
    const canCopy = this.canCopy();
    const canDeleteCard = this.canDeleteCard();
    const canBatchTag = this.canBatchTag();
    const canAddCard = this.canAddCard();
    const canOpenBox = this.canOpenBox();
    const canRemoveCard = this.canRemoveCard();
    const showSecondMenu =
      canCopy || canDeleteCard || canBatchTag || canAddCard || canOpenBox || canRemoveCard;
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
              canBatchTag &&
              <Popup
                {...popupProps}
                trigger={<Menu.Item disabled onClick={U.noop}><BatchTag /></Menu.Item>}
                content="Batch Tag"
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
                trigger={<Menu.Item onClick={() => this.handleOpenBox()}><OpenBox /></Menu.Item>}
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
              <Icon name="minus" />
            </Menu.Item>
            <Menu.Item
              active={this.isWholePicture()}
              onClick={() => this.handleModeChange()}
            >
              <Icon name="eye" />
            </Menu.Item>
            <Menu.Item onClick={() => this.handleZoom(1.1)}>
              <Icon name="plus" />
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