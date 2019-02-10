import * as React from 'react';
import { connect } from 'react-redux';
import { List } from 'semantic-ui-react';
import {
  State,
  actions,
  ActionProps,
  mapDispatch,
  ObjectType,
} from '../../../../types';
import {
  History,
  RenderHistory,
  ChangeType,
  RenderChange,
  toRenderHistory,
} from '../../../../types/sense/history';
import { UserData } from '../../../../types/sense/user';
import * as moment from 'moment';
import '../../history-item.css';
import { HISTORY_TIME_FORMAT } from '../../../../types/utils';

interface OwnProps {
  data: History;
}

interface Props {
  data: RenderHistory;
}

interface ChangeProps {
  change: RenderChange;
}

class ChangeItem extends React.PureComponent<ChangeProps> {
  render() {
    const { change } = this.props;

    switch (change.changeType) {
      case ChangeType.CREATE_MAP: {
        return (
          <span className="change">
            <span className="change__action">created</span>&nbsp;
            <span>the</span>&nbsp;
            <span className="change__target">Map</span>
          </span>
        );
      }
      case ChangeType.UPDATE_MAP: {
        const { field, before, after } = change;
        return (
          <span className="change">
            <span className="change__action">updated</span>&nbsp;
            <span>the</span>&nbsp;
            <span className="change__field">{field}</span>&nbsp;
            <span className="change__value">{after}</span>&nbsp;
            <span>from</span>&nbsp;
            <span className="change__value">{before}</span>
          </span>
        );
      }
      case ChangeType.DELETE_MAP: {
        return (
          <span className="change">
            <span className="change__action">deleted</span>&nbsp;
            <span>the</span>&nbsp;
            <span className="change__target">Map</span>
          </span>
        );
      }
      case ChangeType.CREATE_OBJECT: {
        const { card } = change;
        return (
          <span className="change">
            <span className="change__action">put</span>&nbsp;
            <span className="change__target">Card</span>&nbsp;
            <span className="change__value">{card.summary || card.title}</span>&nbsp;
            <span>into a map</span>
          </span>
        );
      }
      case ChangeType.UPDATE_OBJECT: {
        const { card } = change;
        return (
          <span className="change">
            <span className="change__action">moved</span>&nbsp;
            <span className="change__target">Card</span>&nbsp;
            <span className="change__value">{card.summary || card.title}</span>
          </span>
        );
      }
      case ChangeType.DELETE_OBJECT: {
        const { card } = change;
        return (
          <span className="change">
            <span className="change__action">removed</span>&nbsp;
            <span className="change__target">Card</span>&nbsp;
            <span className="change__value">{card.summary || card.title}</span>&nbsp;
            <span>from a map</span>
          </span>
        );
      }
      case ChangeType.CREATE_CARD: {
        const { card } = change;
        return (
          <span className="change">
            <span className="change__action">added</span>&nbsp;
            <span className="change__target">Card</span>&nbsp;
            <span className="change__value">{card.summary || card.title}</span>
          </span>
        );
      }
      case ChangeType.UPDATE_CARD_SUMMARY: {
        const { before, after } = change;
        return (
          <span className="change">
            <span className="change__action">updated</span>&nbsp;
            <span className="change__target">Card</span>&nbsp;
            <span className="change__field">summary</span>&nbsp;
            <span className="change__value">{after}</span>&nbsp;
            <span>from</span>&nbsp;
            <span className="change__value">{before}</span>
          </span>
        );
      }
      case ChangeType.UPDATE_CARD_TYPE: {
        const { card, before, after } = change;
        return (
          <span className="change">
            <span className="change__action">updated</span>&nbsp;
            <span className="change__target">Card</span>&nbsp;
            <span className="change__value">{card.summary || card.title}</span>&nbsp;
            <span className="change__field">type</span>&nbsp;
            <span className="change__value">{after}</span>&nbsp;
            <span>from</span>&nbsp;
            <span className="change__value">{before}</span>
          </span>
        );
      }
      case ChangeType.UPDATE_CARD: {
        const { card, field, before, after } = change;
        return (
          <span className="change">
            <span className="change__action">updated</span>&nbsp;
            <span className="change__target">Card</span>&nbsp;
            <span className="change__value">{card.summary || card.title}</span>&nbsp;
            <span className="change__field">{field}</span>&nbsp;
            <span className="change__value">{after}</span>&nbsp;
            <span>from</span>&nbsp;
            <span className="change__value">{before}</span>
          </span>
        );
      }
      case ChangeType.DELETE_CARD: {
        const { card } = change;
        return (
          <span className="change">
            <span className="change__action">deleted</span>&nbsp;
            <span className="change__target">Card</span>&nbsp;
            <span className="change__value">{card.summary || card.title}</span>&nbsp;
          </span>
        );
      }
      case ChangeType.CREATE_EDGE: {
        const { from, to } = change;
        return (
          <span className="change">
            <span className="change__action">linked</span>&nbsp;
            <span className="change__target">{from.objectType === ObjectType.BOX ? 'Box' : 'Card'}</span>&nbsp;
            { from.objectType === ObjectType.BOX
                ? <span className="change__value">{from.data.title || from.data.summary}</span>
                : <span className="change__value">{from.data.summary || from.data.title}</span>
            }&nbsp;
            <span>with</span>&nbsp;
            <span className="change__target">{to.objectType === ObjectType.BOX ? 'Box' : 'Card'}</span>&nbsp;
            { to.objectType === ObjectType.BOX
                ? <span className="change__value">{to.data.title || to.data.summary}</span>
                : <span className="change__value">{to.data.summary || to.data.title}</span>
            }
          </span>
        );
      }
      case ChangeType.UPDATE_EDGE: {
        return (
          <span className="change">
            <span className="change__action">updated</span>&nbsp;
            <span>an</span>&nbsp;
            <span className="change__target">Edge</span>
          </span>
        );
      }
      case ChangeType.DELETE_EDGE: {
        const { from, to } = change;
        return (
          <span className="change">
            <span className="change__action">unlinked</span>&nbsp;
            <span className="change__target">{from.objectType === ObjectType.BOX ? 'Box' : 'Card'}</span>&nbsp;
            { from.objectType === ObjectType.BOX
                ? <span className="change__value">{from.data.title || from.data.summary}</span>
                : <span className="change__value">{from.data.summary || from.data.title}</span>
            }&nbsp;
            <span>from</span>&nbsp;
            <span className="change__target">{to.objectType === ObjectType.BOX ? 'Box' : 'Card'}</span>&nbsp;
            { to.objectType === ObjectType.BOX
                ? <span className="change__value">{to.data.title || to.data.summary}</span>
                : <span className="change__value">{to.data.summary || to.data.title}</span>
            }
          </span>
        );
      }
      case ChangeType.ADD_OBJECT_TO_BOX: {
        const { object } = change;
        return (
          <span className="change">
            <span className="change__action">added</span>&nbsp;
            <span className="change__target">{object.objectType === ObjectType.BOX ? 'Box' : 'Card'}</span>&nbsp;
            { object.objectType === ObjectType.BOX
                ? <span className="change__value">{object.data.title || object.data.summary}</span>
                : <span className="change__value">{object.data.summary || object.data.title}</span>
            }
            <span>into this</span>&nbsp;
            <span className="change__target">Box</span>
          </span>
        );
      }
      case ChangeType.REMOVE_OBJECT_FROM_BOX: {
        const { object } = change;
        return (
          <span className="change">
            <span className="change__action">ejected</span>&nbsp;
            <span className="change__target">{object.objectType === ObjectType.BOX ? 'Box' : 'Card'}</span>&nbsp;
            { object.objectType === ObjectType.BOX
                ? <span className="change__value">{object.data.title || object.data.summary}</span>
                : <span className="change__value">{object.data.summary || object.data.title}</span>
            }
            <span>from this</span>&nbsp;
            <span className="change__target">Box</span>&nbsp;
          </span>
        );
      }
      default: {
        return (
          <span className="change">
            <span className="change__action">did something</span>
          </span>
        );
      }
    }
  }
}

class HistoryItem extends React.PureComponent<Props> {
  render() {
    const { user, createdAt, changes } = this.props.data;
    const createDate = moment(createdAt).format(HISTORY_TIME_FORMAT);

    return (
      <List.Item className="history-item">
        {user.username} {changes.map((c, i) => <ChangeItem key={i} change={c} />)} at {createDate}
      </List.Item>
    );
  }
}

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