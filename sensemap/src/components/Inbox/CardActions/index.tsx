import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../../types';
import * as OE from '../../../types/object-editor';
import { Button } from 'semantic-ui-react';
import './index.css';

interface StateFromProps {
  senseMap: T.State['senseMap'];
}

interface DispatchFromProps {
  actions: {
    selectObject(status: OE.Status): T.ActionChain,
    createObjectForCard(mapId: T.MapID, cardId: T.CardID): T.ActionChain,
  };
}

interface OwnProps {
  card: T.CardData;
}

type Props = StateFromProps & DispatchFromProps & OwnProps;

function CardActions({ card, actions, senseMap }: Props) {
  return (
    <div className="card-actions">
      <Button
        icon="edit"
        onClick={() => actions.selectObject(OE.editCard(card))}
      />
      <Button
        icon="plus square outline"
        onClick={() => actions.createObjectForCard(senseMap.map, card.id)}
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
      selectObject: (status: OE.Status) =>
        dispatch(T.actions.editor.selectObject(status)),
      createObjectForCard: (mapId: T.MapID, cardId: T.CardID) =>
        dispatch(T.actions.senseObject.createObjectForCard(mapId, cardId)),
    }
  })
)(CardActions);
