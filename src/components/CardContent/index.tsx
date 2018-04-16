import * as React from 'react';
import { Key } from 'ts-keycode-enum';
import { Divider, Button, Input } from 'semantic-ui-react';
import * as SM from '../../types/sense-map';
import './index.css';

interface Props {
  data: SM.CardData;
  onChange? (value: SM.CardData): void;
}

interface State {
  isEditing: boolean;
  title: string;
  description: string;
}

class CardContent extends React.Component<Props, State> {
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
      <div className="card-content">
        <div className="card-content__content">
          <h1 className="card-content__header">{
            isEditing
              ? (
                <Input
                  fluid
                  transparent
                  ref={e => this.titleInput = e}
                  placeholder={title}
                  value={newTitle}
                  onKeyUp={this.handleKey}
                  onChange={this.handleTitleChange}
                />
              )
              : title
          }</h1>
          <div className="card-content__description">{
            isEditing
              ? (
                <Input
                  fluid
                  transparent
                  placeholder={description}
                  value={newDescription}
                  onKeyUp={this.handleKey}
                  onChange={this.handleDescriptionChange}
                />
              )
              : description
          }</div>
        </div>
        <Divider />
        <div className="card-content__actions">{
          isEditing
            ? <Button.Group>
                <Button onClick={this.handleCancel}>取消</Button>
                <Button.Or />
                <Button positive onClick={this.handleSave}>完成</Button>
              </Button.Group>
            : <Button primary onClick={this.handleEdit}>
                編輯
              </Button>
        }</div>
      </div>
    );
  }
}

export default CardContent;