import * as React from 'react';
import { Key } from 'ts-keycode-enum';
import { Card, Button, Input } from 'semantic-ui-react';
import * as SM from '../../types/sense-map';

interface Props {
  data: SM.CardData;
  onChange? (value: SM.CardData): void;
}

interface State {
  isEditing: boolean;
  title: string;
  description: string;
}

class SenseCard extends React.Component<Props, State> {
  static defaultProps = {
    data: SM.emptyCardData
  };

  titleInput: Input | null;

  constructor(props: Props) {
    super(props);

    this.titleInput = null;

    this.state = {
      isEditing: false,
      title: '',
      description: ''
    };
  }

  handleEdit = () => {
    const { title, description } = this.props.data;

    setImmediate(() => {
      if (this.titleInput) {
        this.titleInput.focus();
      }
    });

    this.setState({
      isEditing: true,
      title,
      description
    });
  }

  handleTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ title: e.currentTarget.value });
  }

  handleDescriptionChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ description: e.currentTarget.value });
  }

  handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.keyCode) {
      case Key.Enter:
        this.handleSave();
        break;
      case Key.Escape:
        this.handleCancel();
        break;
      default:
    }
  }

  handleSave = () => {
    const { data, onChange } = this.props;
    const { title, description } = this.state;

    if (onChange) {
      onChange({ ...data, title, description });
    }

    this.setState({
      isEditing: false,
      title: '',
      description: ''
    });
  }

  handleCancel = () => {
    this.setState({
      isEditing: false,
      title: '',
      description: ''
    });
  }

  render() {
    const { isEditing, title: newTitle, description: newDescription } = this.state;
    const { title, description } = this.props.data;

    return (
      <Card onKeyUp={isEditing && this.handleKey}>
        <Card.Content>
          <Card.Header>{
            isEditing
              ? (
                <Input
                  ref={e => this.titleInput = e}
                  placeholder={title}
                  value={newTitle}
                  onChange={this.handleTitleChange}
                />
              )
              : title
          }</Card.Header>
          <Card.Description>{
            isEditing
              ? (
                <Input
                  placeholder={description}
                  value={newDescription}
                  onChange={this.handleDescriptionChange}
                />
              )
              : description
          }</Card.Description>
        </Card.Content>
        <Card.Content extra>{
          isEditing
            ? <Button.Group floated="right">
                <Button onClick={this.handleCancel}>取消</Button>
                <Button.Or />
                <Button positive onClick={this.handleSave}>完成</Button>
              </Button.Group>
            : <Button primary floated="right" onClick={this.handleEdit}>
                編輯
              </Button>
        }</Card.Content>
      </Card>
    );
  }
}

export default SenseCard;