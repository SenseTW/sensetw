import * as React from 'react';
import { Header, Modal, Icon, Button } from 'semantic-ui-react';
import './index.css';

interface OwnProps {
  trigger: React.ReactNode;
  open: boolean;
  cardCount: number;
  onClose?(): void;
  onSubmit?(): void;
}

class DeleteConfirmation extends React.PureComponent<OwnProps> {
  render() {
    const { trigger, open, cardCount, onClose, onSubmit } = this.props;
    let cardStr = '';
    if (cardCount > 1) {
      cardStr = ` and ${cardCount} Cards in the Box`;
    } else if (cardCount === 1) {
      cardStr = ' and the Card in it';
    }

    return (
      <Modal
        className="box-delete-modal"
        closeIcon
        trigger={trigger}
        open={open}
        onClose={onClose}
        size="tiny"
      >
        <Header>Delete Box</Header>
        <Modal.Content>
          <p>
            <Icon name="warning sign" color="yellow" />
            Warning: This action cannot be undone
          </p>
          <p>
            Are you sure you want to delete this Box{cardStr} on the Map?
          </p>
          <p className="box-delete-modal__note">Note:</p>
          <ol className="box-delete-modal__note">
            <li>Only Cards will be restored in the Inbox.</li>
            <li>You can remove a Card out of a Box by "eject" button on the toolbar after you open the box.</li>
          </ol>
        </Modal.Content>
        <Modal.Actions>
          <Button secondary onClick={onClose}>
            Cancel
          </Button>
          <Button negative onClick={onSubmit}>
            Delete
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default DeleteConfirmation;