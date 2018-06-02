import * as React from 'react';
import { connect } from 'react-redux';
import { CardData, MapScopeType, State, actions, ActionProps, mapDispatch } from '../../../types';
import * as F from '../../../types/sense/focus';
import { Button } from 'semantic-ui-react';
import './index.css';

interface StateFromProps {
  senseMap: State['senseMap'];
}

interface OwnProps {
  card: CardData;
}

type Props = StateFromProps & ActionProps & OwnProps;

function CardActions({ card, actions: acts, senseMap }: Props) {
  const box =
    senseMap.scope.type === MapScopeType.BOX
      ? senseMap.scope.box
      : undefined;
  return (
    <div className="card-actions">
      <Button
        icon="edit"
        onClick={() => acts.editor.focusObject(F.focusCard(card.id))}
      />
      <Button
        icon="plus square outline"
        onClick={() => acts.senseObject.createObjectForCard(senseMap.map, card.id, box)}
      />
      <Button icon="trash" />
    </div>
  );
}

export default connect<StateFromProps, ActionProps>(
  (state: State) => ({
    senseMap: state.senseMap,
  }),
  mapDispatch({ actions }),
)(CardActions);
