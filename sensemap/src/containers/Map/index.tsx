
import * as React from 'react';
import { connect } from 'react-redux';
import * as CO from '../../components/Map';
import * as T from '../../types';
import * as OE from '../../types/object-editor';

interface OwnProps extends CO.OwnProps {
  id: T.MapID;
}

interface StateFromProps extends CO.StateFromProps {
  scope: { type: T.MapScopeType, box?: T.BoxID };
}

interface DispatchFromProps extends CO.DispatchFromProps {
  actions: {
    toggleObjectSelection(id: T.ObjectID): T.ActionChain,
    loadObjects(id: T.MapID): T.ActionChain,
    loadCards(id: T.MapID): T.ActionChain,
    loadBoxes(id: T.MapID): T.ActionChain,
    moveObject(id: T.ObjectID, x: number, y: number): T.ActionChain,
    addCardToBox(card: T.ObjectID, box: T.BoxID): T.ActionChain,
    removeCardFromBox(card: T.ObjectID, box: T.BoxID): T.ActionChain,
    openBox(box: T.BoxID): T.ActionChain,
    selectObject(status: OE.Status): T.ActionChain,
  };
}

type Props = StateFromProps & DispatchFromProps & OwnProps;

class Map extends React.Component<Props> {
  componentDidMount() {
    this.props.actions.loadObjects(this.props.id);
    this.props.actions.loadCards(this.props.id);
    this.props.actions.loadBoxes(this.props.id);
  }

  render() {
    let componentProps = this.props;
    if (this.props.scope.type === T.MapScopeType.BOX && !!this.props.scope.box) {
      const box = this.props.boxes[this.props.scope.box];
      if (!!box) {
        const objects = Object.keys(box.contains).reduce(
          (acc, id) => {
            if (!!this.props.objects[id]) {
              acc[id] = this.props.objects[id];
            }
            return acc;
          },
          {});
        componentProps = { ...this.props, objects };
      }
    } else {
      const objects = Object.values(this.props.objects)
        .filter(o => !o.belongsTo)
        .reduce(
          (acc, o) => {
            acc[o.id] = o;
            return acc;
          },
          {});
      componentProps = { ...this.props, objects };
    }
    return <CO.Map {...componentProps} />;
  }
}

export default connect<StateFromProps, DispatchFromProps, OwnProps>(
  (state: T.State) => ({
    selection: state.selection,
    scope: state.senseMap.scope,
    objects: state.senseObject.objects,
    cards: state.senseObject.cards,
    boxes: state.senseObject.boxes,
  }),
  (dispatch: T.Dispatch) => ({
    actions: {
      toggleObjectSelection: (id: T.ObjectID) =>
        dispatch(T.actions.selection.toggleObjectSelection(id)),
      loadObjects: (id: T.MapID) =>
        dispatch(T.actions.senseObject.loadObjects(id)),
      loadCards: (id: T.MapID) =>
        dispatch(T.actions.senseObject.loadCards(id)),
      loadBoxes: (id: T.MapID) =>
        dispatch(T.actions.senseObject.loadBoxes(id)),
      moveObject: (id: T.ObjectID, x: number, y: number) =>
        dispatch(T.actions.senseObject.moveObject(id, x, y)),
      addCardToBox: (card: T.ObjectID, box: T.BoxID) =>
        dispatch(T.actions.senseObject.addCardToBox(card, box)),
      removeCardFromBox: (card: T.ObjectID, box: T.BoxID) =>
        dispatch(T.actions.senseObject.removeCardFromBox(card, box)),
      openBox: (box: T.BoxID) =>
        dispatch(T.actions.senseMap.openBox(box)),
      selectObject: (status: OE.Status) =>
        dispatch(T.actions.editor.selectObject(status)),
    }
  })
)(Map);
