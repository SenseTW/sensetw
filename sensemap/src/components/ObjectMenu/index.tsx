import * as React from 'react';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import * as T from '../../types';
import { actions, ActionProps, mapDispatch } from '../../types';
import * as SL from '../../types/selection';
import * as CS from '../../types/cached-storage';
import * as OE from '../../types/object-editor';
import { cardData } from '../../types/sense/card';
import { boxData } from '../../types/sense/box';
import * as F from '../../types/sense/focus';
import * as I from '../../types/input';
// TODO: use UUID v4
import { objectId } from '../../types/utils';

interface StateFromProps {
  selection:   SL.State;
  senseObject: T.State['senseObject'];
  scope:       T.State['senseMap']['scope'];
  senseMap:    T.State['senseMap'];
  input:       T.State['input'];
  editor:      T.State['editor'];
}

interface OwnProps {
  // tslint:disable-next-line:no-any
  style: any;
}

type Props = StateFromProps & ActionProps & OwnProps;

const selectedCardsAndBoxes:
  (props: Props) => { cards: T.ObjectID[], boxes: T.ObjectID[] } =
  props => props.selection.reduce(
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
  constructor(props: Props) {
    super(props);
    this.canAddCard = this.canAddCard.bind(this);
    this.handleAddCard = this.handleAddCard.bind(this);
    this.canRemoveCard = this.canRemoveCard.bind(this);
    this.handleRemoveCard = this.handleRemoveCard.bind(this);
    this.handleUnbox = this.handleUnbox.bind(this);
  }

  canCreateBox(): Boolean {
    return this.props.scope.type === T.MapScopeType.FULL_MAP;
  }

  canUnbox(): Boolean {
    return this.props.scope.type === T.MapScopeType.BOX;
  }

  handleUnbox(): void {
    switch (this.props.scope.type) {
      case T.MapScopeType.BOX: {
        const box = this.props.scope.box;
        if (!box) {
          throw Error('Scope BOX without a box ID.');
        }
        this.props.actions.senseObject.unboxCards(box);
        break;
      }
      case T.MapScopeType.FULL_MAP:
      default:
    }
  }

  canAddCard(): Boolean {
    if (this.props.scope.type !== T.MapScopeType.FULL_MAP) {
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

  canRemoveCard(): Boolean {
    return this.props.scope.type === T.MapScopeType.BOX
      && this.props.selection.length >= 1;
  }

  canDeleteCard(): Boolean {
    const { cards } = selectedCardsAndBoxes(this.props);
    return cards.length === 1;
  }

  handleRemoveCard(): void {
    if (!this.canRemoveCard()) {
      return;
    }
    switch (this.props.scope.type) {
      case T.MapScopeType.BOX: {
        const cards = this.props.selection;
        const box   = this.props.scope.box;
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

  canCreateEdge(): boolean {
    return this.props.selection.length === 2
      && this.findEdgeID(this.props.selection[0], this.props.selection[1]) === null;
  }

  handleCreateEdge(): void {
    if (!this.canCreateEdge()) {
      return;
    }
    const map  = this.props.senseMap.map;
    const from = this.props.selection[0];
    const to   = this.props.selection[1];
    this.props.actions.senseObject.createEdge(map, from, to);
  }

  findEdgeID(from: T.ObjectID, to: T.ObjectID): T.EdgeID[] | null {
    const r = Object.values(CS.toStorage(this.props.senseObject).edges)
      .filter(edge => (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from))
      .map(edge => edge.id);
    return r.length === 0 ? null : r;
  }

  canRemoveEdge(): boolean {
    if (this.props.selection.length !== 2) {
      return false;
    }
    return this.findEdgeID(this.props.selection[0], this.props.selection[1]) !== null;
  }

  handleRemoveEdge(): void {
    const map  = this.props.senseMap.map;
    const from = this.props.selection[0];
    const to   = this.props.selection[1];
    const r    = this.findEdgeID(from, to);
    if (r === null) {
      return;
    }
    r.forEach(edge => this.props.actions.senseObject.removeEdge(map, edge));
  }

  render() {
    const { style, actions: acts, senseObject, selection, input, editor } = this.props;
    const isMultiSelectable = I.isMultiSelectable(input);

    return (
      <Menu vertical style={style}>
        <Menu.Item>{
          selection.length === 0
            ? '功能選單'
            : selection.length === 1
              ? isMultiSelectable
                ? '多選模式'
                : '按 Shift/Ctrl 選取多張卡片'
              : `選取了 ${selection.length} 張卡片`
        }</Menu.Item>
        {
          this.canCreateBox() &&
          <Menu.Item
            name="create-box"
            onClick={() => {
              const data = boxData({ id: objectId() });
              acts.senseObject.updateBox(data);
              acts.editor.focusObject(F.focusBox(data.id));
              acts.editor.changeStatus(OE.StatusType.SHOW);
            }}
          >
            新增 Box
          </Menu.Item>
        }
        <Menu.Item
          name="create-card"
          onClick={() => {
            const data = cardData({ id: objectId() });
            acts.senseObject.updateCard(data);
            acts.editor.focusObject(F.focusCard(data.id));
            acts.editor.changeStatus(OE.StatusType.SHOW);
          }}
        >
          新增卡片
        </Menu.Item>
        <Menu.Item
          name="edit"
          onClick={() => {
            if (editor.status === OE.StatusType.HIDE) {
              acts.editor.changeStatus(OE.StatusType.SHOW);
            } else {
              acts.editor.changeStatus(OE.StatusType.HIDE);
            }
          }}
        >
          編輯器
        </Menu.Item>
        {
          this.canAddCard() &&
          <Menu.Item
            name="addCard"
            onClick={this.handleAddCard}
          >
            加入
          </Menu.Item>
        }
        {
          this.canRemoveCard() &&
          <Menu.Item
            name="removeCard"
            onClick={this.handleRemoveCard}
          >
            退出
          </Menu.Item>
        }
        {
          this.canDeleteCard() &&
          <Menu.Item
            name="deleteCard"
            onClick={async () => {
              const { id, data } = CS.getObject(senseObject, selection[0]);
              const card = CS.getCard(senseObject, data);
              // remove the card container object
              await acts.senseObject.removeObject(id);
              // clear any local modifications
              acts.cachedStorage.removeCard(card);
              acts.editor.focusObject(F.focusNothing());
            }}
          >
            刪除
          </Menu.Item>
        }
        {
          this.canUnbox() &&
          <Menu.Item
            name="unbox"
            onClick={this.handleUnbox}
          >
            Unbox
          </Menu.Item>
        }
        {
          this.canCreateEdge() &&
          <Menu.Item
            name="createEdge"
            onClick={() => this.handleCreateEdge()}
          >
            連線
          </Menu.Item>
        }
        {
          this.canRemoveEdge() &&
          <Menu.Item
            name="deleteEdge"
            onClick={() => this.handleRemoveEdge()}
          >
            刪除連線
          </Menu.Item>
        }
      </Menu>
    );
  }
}

export default connect<StateFromProps, ActionProps>(
  (state: T.State) => ({
    selection: state.selection,
    scope: state.senseMap.scope,
    senseObject: state.senseObject,
    senseMap: state.senseMap,
    input: state.input,
    editor: state.editor,
  }),
  mapDispatch({ actions }),
)(ObjectMenu);
