import * as React from 'react';
import { connect } from 'react-redux';
import { Header, Form, Input } from 'semantic-ui-react';
import { State, ObjectType, ActionProps, mapDispatch, actions } from '../../types';
import * as E from '../../types/sense/edge';
import * as CS from '../../types/cached-storage';
// import './index.css'

interface StateFromProps {
  senseObject: CS.CachedStorage;
}

interface OwnProps {
  data: E.Edge;
}

interface Props {
  from: string;
  to: string;
}

class EdgeContent extends React.PureComponent<Props> {
  render() {
    const { children, from, to } = this.props;

    return (
      <Form className="edge-content">
        <Header color="grey">
          <h3>EDGE INSPECTOR</h3>
        </Header>
        <Form.Field className="edge-content__edge-from">
          <label>From</label>
          <Input
            disabled
            value={from}
          />
        </Form.Field>
        <Form.Field className="edge-content__edge-to">
          <label>To</label>
          <Input
            disabled
            value={to}
          />
        </Form.Field>
        {children}
      </Form>
    );
  }
}

export default connect<StateFromProps, ActionProps, OwnProps, Props, State>(
  (state) => {
    return { senseObject: state.senseObject };
  },
  mapDispatch({ actions }),
  (stateProps, actionProps, ownProps) => {
    const { senseObject } = stateProps;
    const { data } = ownProps;
    let obj = CS.getObject(senseObject, data.from);
    const fromObj = obj.objectType === ObjectType.BOX
      ? CS.getBox(senseObject, obj.data)
      : CS.getCard(senseObject, obj.data);
    const from = fromObj.title || fromObj.summary;
    obj = CS.getObject(senseObject, data.to);
    const toObj = obj.objectType === ObjectType.BOX
      ? CS.getBox(senseObject, obj.data)
      : CS.getCard(senseObject, obj.data);
    const to = toObj.title || toObj.summary;
    return { from, to };
  }
)(EdgeContent);