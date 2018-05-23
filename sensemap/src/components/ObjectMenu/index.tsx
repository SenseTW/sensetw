import * as React from 'react';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import * as T from '../../types';
import * as SL from '../../types/selection';
import * as SM from '../../types/sense-map';
import * as SO from '../../types/sense-object';
import * as SB from '../../types/sense-box';
import * as SC from '../../types/sense-card';
import * as OE from '../../types/object-editor';
import * as F from '../../types/focus';
import * as I from '../../types/input';

interface StateFromProps {
  selection:   SL.State;
  senseObject: T.State['senseObject'];
  scope:       T.State['senseMap']['scope'];
  senseMap:    T.State['senseMap'];
  input:       T.State['input'];
  editor:      T.State['editor'];
}

interface DispatchFromProps {
  actions: {
    focusObject(focus: F.Focus): T.ActionChain,
    changeStatus(status: OE.StatusType): T.ActionChain,
    addCardsToBox(cards: T.ObjectID[], box: SB.BoxID): T.ActionChain,
    removeCardsFromBox(card: T.ObjectID[], box: SB.BoxID): T.ActionChain,
    deleteObject(object: T.ObjectID): T.ActionChain,
    unboxCards(box: SB.BoxID): T.ActionChain,
    openInbox(): T.ActionChain,
  };
}

type Props = StateFromProps & DispatchFromProps;

const selectedCardsAndBoxes:
  (props: Props) => { cards: T.ObjectID[], boxes: T.ObjectID[] } =
  props => props.selection.reduce(
    (acc, id) => {
      switch (SO.getObject(props.senseObject, id).objectType) {
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
        this.props.actions.unboxCards(box);
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
    this.props.actions.addCardsToBox(cards, this.props.senseObject.objects[boxes[0]].data);
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
        this.props.actions.removeCardsFromBox(cards, box);
        break;
      }
      case T.MapScopeType.FULL_MAP:
      default:
    }
  }

  render() {
    const { actions, senseObject, selection, senseMap, input, editor } = this.props;
    const isMultiSelectable = I.isMultiSelectable(input);

    return (
      <Menu vertical>
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
          senseMap.inbox === SM.InboxVisibility.HIDDEN &&
          <Menu.Item
            name="open-inbox"
            onClick={actions.openInbox}
          >
            Inbox
          </Menu.Item>
        }
        {
          this.canCreateBox() &&
          <Menu.Item
            name="create-box"
            onClick={() => {
              const data = SB.boxData();
              actions.focusObject(F.focusBox(data.id));
              actions.changeStatus(OE.StatusType.CREATE);
            }}
          >
            新增 Box
          </Menu.Item>
        }
        <Menu.Item
          name="create-card"
          onClick={() => {
            const data = SC.cardData();
            actions.focusObject(F.focusCard(data.id));
            actions.changeStatus(OE.StatusType.CREATE);
          }}
        >
          新增卡片
        </Menu.Item>
        <Menu.Item
          name="edit"
          onClick={() => {
            if (editor.status === OE.StatusType.HIDE) {
              actions.changeStatus(OE.StatusType.EDIT);
            } else {
              actions.changeStatus(OE.StatusType.HIDE);
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
            onClick={() => {
              const { id } = SO.getObject(senseObject, selection[0]);
              actions.deleteObject(id);
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
      </Menu>
    );
  }
}

export default connect<StateFromProps, DispatchFromProps>(
  (state: T.State) => ({
    selection: state.selection,
    scope: state.senseMap.scope,
    senseObject: state.senseObject,
    senseMap: state.senseMap,
    input: state.input,
    editor: state.editor,
  }),
  (dispatch: T.Dispatch) => ({
    actions: {
      focusObject: (focus: F.Focus) =>
        dispatch(T.actions.editor.focusObject(focus)),
      changeStatus: (status: OE.StatusType) =>
        dispatch(T.actions.editor.changeStatus(status)),
      addCardsToBox: (cards, box) =>
        dispatch(T.actions.senseObject.addCardsToBox(cards, box)),
      removeCardsFromBox: (cards, box) =>
        dispatch(T.actions.senseObject.removeCardsFromBox(cards, box)),
      deleteObject: (object) =>
        dispatch(T.actions.senseObject.deleteObject(object)),
      unboxCards: (box) =>
        dispatch(T.actions.senseObject.unboxCards(box)),
      openInbox: () =>
        dispatch(T.actions.senseMap.openInbox()),
    }
  })
)(ObjectMenu);
