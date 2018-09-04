import * as React from 'react';
import { connect } from 'react-redux';
import * as CO from '../../components/Map';
import { MapScopeType, MapID, BoxID, State, actions, ActionProps, mapDispatch } from '../../types';
import * as CS from '../../types/cached-storage';

interface StateFromProps extends CO.StateFromProps {
  scope: { type: MapScopeType, box?: BoxID };
}

interface OwnProps extends CO.OwnProps {
  id: MapID;
  component?: React.ComponentClass<CO.Props>; // defaults to CO.Map
}

type Props = StateFromProps & ActionProps & OwnProps;

class Map extends React.Component<Props> {
  componentDidMount() {
    // TODO:
    //   should test if the current map has been loaded
    //   or remove the warning prompt from the dashboard
    this.props.actions.senseObject.cleanUp();
    this.props.actions.viewport.resetViewPort();
    this.props.actions.senseObject.loadMaps();
    this.props.actions.senseObject.loadObjects(this.props.id);
    this.props.actions.senseObject.loadCards(this.props.id);
    this.props.actions.senseObject.loadBoxes(this.props.id);
    this.props.actions.senseObject.loadEdges(this.props.id);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id) {
      this.props.actions.senseObject.cleanUp();
      this.props.actions.viewport.resetViewPort();
      this.props.actions.senseObject.loadMaps();
      this.props.actions.senseObject.loadObjects(this.props.id);
      this.props.actions.senseObject.loadCards(this.props.id);
      this.props.actions.senseObject.loadBoxes(this.props.id);
      this.props.actions.senseObject.loadEdges(this.props.id);
    }
  }

  render() {
    const { component: Comp = CO.Map } = this.props;
    const inScope =
      (this.props.scope.type === MapScopeType.BOX
      && !!this.props.scope.box
      && CS.doesBoxExist(this.props.senseObject, this.props.scope.box))
        ? CS.scopedToBox(this.props.senseObject, this.props.scope.box)
        : CS.scopedToMap(this.props.senseObject);
    return <Comp {...this.props} inScope={inScope} />;
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
    level: state.viewport.level,
  }),
  mapDispatch({ actions }),
)(Map);
