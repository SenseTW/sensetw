
import * as React from 'react';
import { connect } from 'react-redux';
import * as CO from '../../components/Map';
import * as SM from '../../types/sense-map';
import * as SO from '../../types/sense-object';
// import * as SC from '../../types/sense-card';
// import * as SB from '../../types/sense-box';
import * as T from '../../types';

interface PropsFromParent extends CO.PropsFromParent {
  id: SM.MapID;
}

interface DispatchFromProps extends CO.DispatchFromProps {
  actions: {
    toggleObjectSelection(id: SO.ObjectID): T.Action,
    loadObjects(id: SM.MapID): Promise<T.Action>,
    loadCards(id: SM.MapID): Promise<T.Action>,
    loadBoxes(id: SM.MapID): Promise<T.Action>,
  };
}

type Props = CO.StateFromProps & DispatchFromProps & PropsFromParent;

class Map extends React.Component<Props> {
  componentDidMount() {
    // tslint:disable-next-line:no-console
    console.log(this.props.id);
    this.props.actions.loadObjects(this.props.id);
    this.props.actions.loadCards(this.props.id);
    this.props.actions.loadBoxes(this.props.id);
  }

  render() {
    return <CO.Map {...this.props} />;
  }
}

export default connect<CO.StateFromProps, DispatchFromProps, PropsFromParent>(
  (state: T.State) => ({
    selection: state.selection,
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
    }
  })
)(Map);
