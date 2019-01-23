import * as React from 'react';
import { connect } from 'react-redux';
import { List } from 'semantic-ui-react';
import {
  State,
  actions,
  ActionProps,
  mapDispatch,
} from '../../../types';
import {
  History,
  RenderHistory,
  ChangeType,
  RenderChange,
  toRenderHistory,
} from '../../../types/sense/history';
import { UserData } from '../../../types/sense/user';
import { TIME_FORMAT } from '../../../types/utils';
import * as moment from 'moment';

interface OwnProps {
  data: History;
}

interface Props {
  data: RenderHistory;
}

class ChangeItem extends React.PureComponent<RenderChange> {
  render() {
    const { changeType } = this.props;

    switch (changeType) {
      case ChangeType.CREATE_MAP:
        return (<span>created a map</span>);
      case ChangeType.UPDATE_MAP:
        return (<span>updated a map</span>);
      case ChangeType.DELETE_MAP:
        return (<span>removed a map</span>);
      case ChangeType.CREATE_OBJECT:
        return (<span>created a map object</span>);
      case ChangeType.UPDATE_OBJECT:
        return (<span>updated a map object</span>);
      case ChangeType.DELETE_OBJECT:
        return (<span>removed a map object</span>);
      case ChangeType.CREATE_CARD:
        return (<span>created a card</span>);
      case ChangeType.UPDATE_CARD_SUMMARY:
        return (<span>updated the card summary</span>);
      case ChangeType.UPDATE_CARD_TYPE:
        return (<span>updated the card type</span>);
      case ChangeType.UPDATE_CARD:
        return (<span>updated a card</span>);
      case ChangeType.DELETE_CARD:
        return (<span>removed a card</span>);
      case ChangeType.CREATE_EDGE:
        return (<span>created an edge</span>);
      case ChangeType.UPDATE_EDGE:
        return (<span>updated an edge</span>);
      case ChangeType.DELETE_EDGE:
        return (<span>removed an edge</span>);
      case ChangeType.ADD_OBJECT_TO_BOX:
        return (<span>added an object to a box</span>);
      case ChangeType.REMOVE_OBJECT_FROM_BOX:
        return (<span>removed an object from a box</span>);
      default:
        return (<span>did something</span>);
    }
  }
}

class HistoryItem extends React.PureComponent<Props> {
  render() {
    const { user, createdAt, changes } = this.props.data;
    const createdDate = moment(createdAt).format(TIME_FORMAT);

    return (
      <List.Item>
        {user.username}
        <ul>{changes.map((c, i) => <li key={i}><ChangeItem {...c} /></li>)}</ul>
        at {createdDate}
      </List.Item>
    );
  }
}

// XXX: should get user, object, card data from the store
export default connect<State, ActionProps, OwnProps, Props>(
  (state: State) => state,
  mapDispatch({ actions }),
  (stateProps, { actions: acts }, ownProps) => {
    const { senseObject } = stateProps;
    const { data: history } = ownProps;
    const { user: uid } = history;

    // tslint:disable-next-line:no-any
    const user: UserData = acts.senseObject.getUser(senseObject, uid) as any;

    return { data: toRenderHistory(senseObject, user, history) };
  }
)(HistoryItem);