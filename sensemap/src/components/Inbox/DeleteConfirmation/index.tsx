import * as React from 'react';
import { Header, Modal, Icon, Button } from 'semantic-ui-react';
import './index.css';

interface OwnProps {
  trigger: React.ReactNode;
  open: boolean;
  onClose?(): void;
  onSubmit?(): void;
}

class DeleteConfirmation extends React.PureComponent<OwnProps> {
  render() {
    const { trigger, open, onClose, onSubmit } = this.props;

    return (
      <Modal
        className="card-delete-modal"
        closeIcon
        trigger={trigger}
        open={open}
        onClose={onClose}
        size="tiny"
      >
        <Header>Delete Inbox Card</Header>
        <Modal.Content>
          <p>
            <Icon name="warning sign" color="yellow" />
            Are you sure you want to delete this Card from the Inbox?
          </p>
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