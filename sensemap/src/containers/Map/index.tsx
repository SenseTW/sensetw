import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as CO from '../../components/Map';
import { ObjectMap } from '../../types/sense/has-id';
import { MapScopeType, MapID, BoxID, ObjectData, State, actions, ActionProps, mapDispatch } from '../../types';
import * as CS from '../../types/cached-storage';

// tslint:disable-next-line:no-any
type MyRouteProps = RouteComponentProps<any>;

interface StateFromProps extends CO.StateFromProps {
  scope: { type: MapScopeType, box?: BoxID };
}

interface OwnProps extends CO.OwnProps, MyRouteProps {
  id: MapID;
  component?: React.ComponentClass<CO.Props>; // defaults to CO.Map
}

type Props = StateFromProps & ActionProps & OwnProps;

interface OwnState {
  promisedObjects: Promise<ObjectMap<ObjectData>>;
}

class Map extends React.Component<Props, OwnState> {
  state = {
    promisedObjects: Promise.resolve({}),
  };

  componentWillMount() {
    // TODO:
    //   should test if the current map has been loaded
    //   or remove the warning prompt from the dashboard
    this.props.actions.senseObject.cleanUp();
    this.props.actions.viewport.resetViewPort();
    this.props.actions.senseObject.loadMaps();
    // tslint:disable-next-line:no-any
    const p = this.props.actions.senseObject.loadObjects(this.props.id) as any;
    this.props.actions.senseObject.loadCards(this.props.id);
    this.props.actions.senseObject.loadBoxes(this.props.id);
    this.props.actions.senseObject.loadEdges(this.props.id);
    this.props.actions.senseObject.keepUpdating(true);

    type ObjectAction = {
      payload: {
        objects: ObjectMap<ObjectData>,
      },
    };
    const promisedObjects =
      (p as Promise<ObjectAction>).then(({ payload: { objects } }) => objects);
    this.setState({ promisedObjects });
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
    return <Comp {...this.props} inScope={inScope} promisedObjects={this.state.promisedObjects} />;
  }
}

export default withRouter(connect<StateFromProps, ActionProps, OwnProps>(
  (state: State, props: OwnProps) => ({
    selection: state.selection,
    senseObject: state.senseObject,
    inScope: state.senseObject,
    scope: state.senseMap.scope,
    input: state.input,
    stage: state.stage,
    level: state.viewport.level,
    history: props.history,
    promisedObjects: Promise.resolve({}),
    isAuthenticated: state.session.authenticated,
  }),
  mapDispatch({ actions }),
)(Map));
