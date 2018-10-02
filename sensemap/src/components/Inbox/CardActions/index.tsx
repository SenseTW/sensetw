import * as React from 'react';
import { connect } from 'react-redux';
import { CardData, MapScopeType, State, actions, ActionProps, mapDispatch } from '../../../types';
import * as F from '../../../types/sense/focus';
import * as OE from '../../../types/object-editor';
import { Button } from 'semantic-ui-react';
import DeleteConfirmation from '../DeleteConfirmation';
import './index.css';

interface StateFromProps {
  senseMap: State['senseMap'];
}

interface OwnProps {
  card: CardData;
}

interface OwnState {
  open: boolean;
}

type Props = StateFromProps & ActionProps & OwnProps;

class CardActions extends React.PureComponent<Props, OwnState> {
  state = {
    open: false,
  };

  render() {
    const { card, actions: acts, senseMap } = this.props;
    const { open } = this.state;
    const box =
      senseMap.scope.type === MapScopeType.BOX
        ? senseMap.scope.box
        : undefined;
    const deleteTrigger = (
      <Button
        icon="trash"
        onClick={() => this.setState({ open: true })}
      />
    );

    return (
      <div className="card-actions">
        <Button
          icon="edit"
          onClick={() => {
            acts.editor.focusObject(F.focusCard(card.id));
            acts.editor.changeStatus(OE.StatusType.SHOW);
          }}
        />
        <Button
          icon="plus square outline"
          onClick={() => acts.senseObject.createObjectForCard(senseMap.map, card.id, box)}
        />
        <DeleteConfirmation
          trigger={deleteTrigger}
          open={open}
          onSubmit={() => {
            acts.senseObject.removeCardWithObject(card.id);
            this.setState({ open: false });
          }}
          onClose={() => this.setState({ open: false })}
        />
      </div>
    );
  }
}

export default connect<StateFromProps, ActionProps>(
  (state: State) => ({
    senseMap: state.senseMap,
  }),
  mapDispatch({ actions }),
)(CardActions);
