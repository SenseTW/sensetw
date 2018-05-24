import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../../types';
import * as F from '../../../types/sense/focus';
import { Button } from 'semantic-ui-react';
import './index.css';

interface StateFromProps {
  senseMap: T.State['senseMap'];
}

interface DispatchFromProps {
  actions: {
    focusObject(focus: F.Focus): T.ActionChain,
    createObjectForCard(mapId: T.MapID, cardId: T.CardID, box?: T.BoxID): T.ActionChain,
  };
}

interface OwnProps {
  card: T.CardData;
}

type Props = StateFromProps & DispatchFromProps & OwnProps;

function CardActions({ card, actions, senseMap }: Props) {
  const box =
    senseMap.scope.type === T.MapScopeType.BOX
      ? senseMap.scope.box
      : undefined;
  return (
    <div className="card-actions">
      <Button
        icon="edit"
        onClick={() => actions.focusObject(F.focusCard(card.id))}
      />
      <Button
        icon="plus square outline"
        onClick={() => actions.createObjectForCard(senseMap.map, card.id, box)}
      />
      <Button icon="trash" />
    </div>
  );
}

export default connect<StateFromProps, DispatchFromProps>(
  (state: T.State) => ({
    senseMap: state.senseMap,
  }),
  (dispatch: T.Dispatch) => ({
    actions: {
      focusObject: (focus: F.Focus) =>
        dispatch(T.actions.editor.focusObject(focus)),
      createObjectForCard: (mapId: T.MapID, cardId: T.CardID, box?: T.BoxID) =>
        dispatch(T.actions.senseObject.createObjectForCard(mapId, cardId, box)),
    }
  })
)(CardActions);
