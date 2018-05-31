import * as React from 'react';
import { connect } from 'react-redux';
import * as CO from '../../components/Map';
import * as T from '../../types';
import * as F from '../../types/sense/focus';
import * as SO from '../../types/sense-object';
import * as OE from '../../types/object-editor';

interface OwnProps extends CO.OwnProps {
  id: T.MapID;
}

interface StateFromProps extends CO.StateFromProps {
  scope: { type: T.MapScopeType, box?: T.BoxID };
}

interface DispatchFromProps extends CO.DispatchFromProps {
  actions: {
    removeObjectFromSelection: typeof T.actions.selection.removeObjectFromSelection,
    addObjectToSelection(id: T.ObjectID): T.ActionChain,
    toggleObjectSelection(id: T.ObjectID): T.ActionChain,
    clearSelection(): T.ActionChain,
    loadObjects(id: T.MapID): T.ActionChain,
    loadCards(id: T.MapID): T.ActionChain,
    loadBoxes(id: T.MapID): T.ActionChain,
    loadEdges(id: T.MapID): T.ActionChain,
    moveObject(id: T.ObjectID, x: number, y: number): T.ActionChain,
    addCardToBox(card: T.ObjectID, box: T.BoxID): T.ActionChain,
    removeCardFromBox(card: T.ObjectID, box: T.BoxID): T.ActionChain,
    openBox(box: T.BoxID): T.ActionChain,
    stageMouseUp(): T.ActionChain,
    stageMouseDown(): T.ActionChain,
    stageMouseMove({ dx, dy }: { dx: number, dy: number }): T.ActionChain,
    focusObject(focus: F.Focus): T.ActionChain,
    changeStatus(status: OE.StatusType): T.ActionChain,
  };
}

type Props = StateFromProps & DispatchFromProps & OwnProps;

class Map extends React.Component<Props> {
  componentDidMount() {
    this.props.actions.loadObjects(this.props.id);
    this.props.actions.loadCards(this.props.id);
    this.props.actions.loadBoxes(this.props.id);
    this.props.actions.loadEdges(this.props.id);
  }

  render() {
    const senseObject =
      (this.props.scope.type === T.MapScopeType.BOX
      && !!this.props.scope.box
      && SO.doesBoxExist(this.props.senseObject, this.props.scope.box))
        ? SO.scopedToBox(this.props.senseObject, this.props.scope.box)
        : SO.scopedToMap(this.props.senseObject);
    return <CO.Map {...this.props} senseObject={senseObject} />;
  }
}

export default connect<StateFromProps, DispatchFromProps, OwnProps>(
  (state: T.State) => ({
    selection: state.selection,
    senseObject: state.senseObject,
    scope: state.senseMap.scope,
    input: state.input,
    stage: state.stage,
  }),
  (dispatch: T.Dispatch) => ({
    actions: {
      addObjectToSelection: (id: T.ObjectID) =>
        dispatch(T.actions.selection.addObjectToSelection(id)),
      removeObjectFromSelection: (id: T.ObjectID) =>
        dispatch(T.actions.selection.removeObjectFromSelection(id)),
      toggleObjectSelection: (id: T.ObjectID) =>
        dispatch(T.actions.selection.toggleObjectSelection(id)),
      clearSelection: () =>
        dispatch(T.actions.selection.clearSelection()),
      loadObjects: (id: T.MapID) =>
        dispatch(T.actions.senseObject.loadObjects(id)),
      loadCards: (id: T.MapID) =>
        dispatch(T.actions.senseObject.loadCards(id)),
      loadBoxes: (id: T.MapID) =>
        dispatch(T.actions.senseObject.loadBoxes(id)),
      loadEdges: (id: T.MapID) =>
        dispatch(T.actions.senseObject.loadEdges(id)),
      moveObject: (id: T.ObjectID, x: number, y: number) =>
        dispatch(T.actions.senseObject.moveObject(id, x, y)),
      addCardToBox: (card: T.ObjectID, box: T.BoxID) =>
        dispatch(T.actions.senseObject.addCardToBox(card, box)),
      removeCardFromBox: (card: T.ObjectID, box: T.BoxID) =>
        dispatch(T.actions.senseObject.removeCardFromBox(card, box)),
      openBox: (box: T.BoxID) =>
        dispatch(T.actions.senseMap.openBox(box)),
      stageMouseDown: () =>
        dispatch(T.actions.stage.stageMouseDown()),
      stageMouseUp: () =>
        dispatch(T.actions.stage.stageMouseUp()),
      stageMouseMove: ({ dx, dy }: { dx: number, dy: number }) =>
        dispatch(T.actions.stage.stageMouseMove({ dx, dy })),
      focusObject: (focus: F.Focus) =>
        dispatch(T.actions.editor.focusObject(focus)),
      changeStatus: (status: OE.StatusType) =>
        dispatch(T.actions.editor.changeStatus(status)),
    }
  })
)(Map);
