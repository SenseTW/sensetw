import * as React from 'react';
import { connect } from 'react-redux';
import * as CO from '../../components/Map';
import { MapScopeType, MapID, BoxID, State, actions, ActionProps, mapDispatch } from '../../types';
import * as SO from '../../types/sense-object';

interface StateFromProps extends CO.StateFromProps {
  scope: { type: MapScopeType, box?: BoxID };
}

interface OwnProps extends CO.OwnProps {
  id: MapID;
}

type Props = StateFromProps & ActionProps & OwnProps;

class Map extends React.Component<Props> {
  componentDidMount() {
    this.props.actions.senseObject.loadObjects(this.props.id);
    this.props.actions.senseObject.loadCards(this.props.id);
    this.props.actions.senseObject.loadBoxes(this.props.id);
    this.props.actions.senseObject.loadEdges(this.props.id);
  }

  render() {
    const inScope =
      (this.props.scope.type === MapScopeType.BOX
      && !!this.props.scope.box
      && SO.doesBoxExist(this.props.senseObject, this.props.scope.box))
        ? SO.scopedToBox(this.props.senseObject, this.props.scope.box)
        : SO.scopedToMap(this.props.senseObject);
    return <CO.Map {...this.props} inScope={inScope} />;
  }
}

export default connect<StateFromProps, ActionProps, OwnProps>(
  (state: State) => ({
    selection: state.selection,
    senseObject: state.senseObject,
    inScope: state.senseObject,
    scope: state.senseMap.scope,
    input: state.input,
    stage: state.stage,
  }),
  mapDispatch({ actions }),
)(Map);
