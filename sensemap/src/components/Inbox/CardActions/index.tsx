import * as React from 'react';
import { connect } from 'react-redux';
import * as T from '../../../types';
import * as OE from '../../../types/object-editor';
import { Button } from 'semantic-ui-react';
import './index.css';

interface StateFromProps {}

interface DispatchFromProps {
  actions: {
    selectObject(status: OE.Status): T.ActionChain,
  };
}

interface OwnProps {
  card: T.CardData;
}

type Props = StateFromProps & DispatchFromProps & OwnProps;

function CardActions({ card, actions }: Props) {
  return (
    <div className="card-actions">
      <Button
        icon="edit"
        onClick={() => actions.selectObject(OE.editCard(card))}
      />
      <Button icon="plus square outline" />
      <Button icon="trash" />
    </div>
  );
}

export default connect<StateFromProps, DispatchFromProps>(
  (state: T.State) => ({}),
  (dispatch: T.Dispatch) => ({
    actions: {
      selectObject: (status: OE.Status) => dispatch(T.actions.editor.selectObject(status)),
    }
  })
)(CardActions);
