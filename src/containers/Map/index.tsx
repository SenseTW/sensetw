
import * as React from 'react';
import { connect } from 'react-redux';
import * as CO from '../../components/Map';
import * as SM from '../../types/sense-map';
import * as SO from '../../types/sense-object';
// import * as SC from '../../types/sense-card';
import * as SB from '../../types/sense-box';
import * as T from '../../types';

interface OwnProps extends CO.OwnProps {
  id: SM.MapID;
}

interface StateFromProps extends CO.StateFromProps {
  scope: { type: SM.MapScopeType, box?: SB.BoxID };
}

interface DispatchFromProps extends CO.DispatchFromProps {
  actions: {
    toggleObjectSelection(id: SO.ObjectID): T.Action,
    loadObjects(id: SM.MapID): Promise<T.Action>,
    loadCards(id: SM.MapID): Promise<T.Action>,
    loadBoxes(id: SM.MapID): Promise<T.Action>,
    moveObject(id: SO.ObjectID, x: number, y: number): Promise<T.Action>,
    addCardToBox(card: SO.ObjectID, box: SB.BoxID): Promise<T.Action>,
    removeCardFromBox(card: SO.ObjectID): Promise<T.Action>,
    openBox(box: SB.BoxID): T.Action,
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
    if (this.props.scope.type === SM.MapScopeType.BOX && !!this.props.scope.box) {
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
      toggleObjectSelection: (id: SO.ObjectID) =>
        dispatch(T.actions.selection.toggleObjectSelection(id)),
      loadObjects: (id: SM.MapID) =>
        dispatch(T.actions.senseObject.loadObjects(id)),
      loadCards: (id: SM.MapID) =>
        dispatch(T.actions.senseObject.loadCards(id)),
      loadBoxes: (id: SM.MapID) =>
        dispatch(T.actions.senseObject.loadBoxes(id)),
      moveObject: (id: SO.ObjectID, x: number, y: number) =>
        dispatch(T.actions.senseObject.moveObject(id, x, y)),
      addCardToBox: (card: SO.ObjectID, box: SB.BoxID) =>
        dispatch(T.actions.senseObject.addCardToBox(card, box)),
      removeCardFromBox: (card: SO.ObjectID) =>
        dispatch(T.actions.senseObject.removeCardFromBox(card)),
      openBox: (box: SB.BoxID) =>
        dispatch(T.actions.senseMap.openBox(box)),
    }
  })
)(Map);
