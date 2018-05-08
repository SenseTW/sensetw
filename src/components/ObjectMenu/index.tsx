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

interface StateFromProps {
  selection:   SL.State;
  senseObject: SO.State;
  scope:       SM.State['scope'];
}

interface DispatchFromProps {
  actions: {
    selectObject(status: OE.Status): T.ActionChain,
    addCardToBox(card: SO.ObjectID, box: SB.BoxID): T.ActionChain,
    removeCardFromBox(card: SO.ObjectID, box: SB.BoxID): T.ActionChain,
    unboxCards(box: SB.BoxID): T.ActionChain,
  };
}

type Props = StateFromProps & DispatchFromProps;

const selectedCardsAndBoxes:
  (props: Props) => { cards: SO.ObjectID[], boxes: SO.ObjectID[] } =
  props => props.selection.reduce(
    (acc, id) => {
      switch (props.senseObject.objects[id].objectType) {
        case SO.ObjectType.CARD: {
          return { ...acc, cards: [ ...acc.cards, id ] };
        }
        case SO.ObjectType.BOX: {
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

  canUnbox(): Boolean {
    return this.props.scope.type === SM.MapScopeType.BOX;
  }

  handleUnbox(): void {
    if (!this.canUnbox()) {
      return;
    }
    const box = this.props.scope.box;
    if (!box) {
      throw Error('Scope BOX without a box ID.');
    }
    this.props.actions.unboxCards(box);
    return;
  }

  canAddCard(): Boolean {
    if (this.props.scope.type !== SM.MapScopeType.FULL_MAP) {
      return false;
    }
    const { cards, boxes } = selectedCardsAndBoxes(this.props);
    return cards.length === 1 && boxes.length === 1;
  }

  handleAddCard(): void {
    if (!this.canAddCard()) {
      return;
    }
    const { cards, boxes } = selectedCardsAndBoxes(this.props);
    this.props.actions.addCardToBox(cards[0], this.props.senseObject.objects[boxes[0]].data);
    return;
  }

  canRemoveCard(): Boolean {
    return this.props.scope.type === SM.MapScopeType.BOX
      && this.props.selection.length === 1;
  }

  handleRemoveCard(): void {
    if (!this.canRemoveCard()) {
      return;
    }
    const card = this.props.selection[0];
    const box  = this.props.scope.box;
    if (!box) {
      throw Error('This cannot happen: map scope has type BOX with null box ID.');
    }
    this.props.actions.removeCardFromBox(card, box);
    return;
  }

  render() {
    const { actions, senseObject, selection } = this.props;

    return (
      <Menu vertical>
        <Menu.Item>{
          selection.length === 0
            ? '功能選單'
            : `選取了 ${selection.length} 張卡片`
        }</Menu.Item>
        <Menu.Item
          name="create-box"
          onClick={() => actions.selectObject(OE.createBox(SB.emptyBoxData))}
        >
          新增 Box
        </Menu.Item>
        <Menu.Item
          name="create-card"
          onClick={() => actions.selectObject(OE.createCard(SC.emptyCardData))}
        >
          新增卡片
        </Menu.Item>
        <Menu.Item
          name="edit"
          disabled={selection.length !== 1}
          onClick={() => {
            const id = selection[0];
            const object = SO.getObject(senseObject, id);

            switch (object.objectType) {
              case SO.ObjectType.BOX:
                actions.selectObject(OE.editBox(SO.getBox(senseObject, object.data)));
                break;
              case SO.ObjectType.CARD:
                actions.selectObject(OE.editCard(SO.getCard(senseObject, object.data)));
                break;
              default:
            }
          }}
        >
          編輯
        </Menu.Item>
        <Menu.Item
          name="addCard"
          disabled={!this.canAddCard()}
          onClick={this.handleAddCard}
        >
          加入
        </Menu.Item>
        <Menu.Item
          name="removeCard"
          disabled={!this.canRemoveCard()}
          onClick={this.handleRemoveCard}
        >
          退出
        </Menu.Item>
        <Menu.Item
          name="unbox"
          disabled={!this.canUnbox()}
          onClick={this.handleUnbox}
        >
          Unbox
        </Menu.Item>
      </Menu>
    );
  }
}

export default connect<StateFromProps, DispatchFromProps>(
  (state: T.State) => ({
    selection: state.selection,
    scope: state.senseMap.scope,
    senseObject: state.senseObject,
  }),
  (dispatch: T.Dispatch) => ({
    actions: {
      selectObject: (status: OE.Status) => dispatch(T.actions.editor.selectObject(status)),
      addCardToBox: (card, box) =>
        dispatch(T.actions.senseObject.addCardToBox(card, box)),
      removeCardFromBox: (card, box) =>
        dispatch(T.actions.senseObject.removeCardFromBox(card, box)),
      unboxCards: (box) =>
        dispatch(T.actions.senseObject.unboxCards(box)),
    }
  })
)(ObjectMenu);
