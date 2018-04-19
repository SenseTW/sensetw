import * as React from 'react';
import { Key } from 'ts-keycode-enum';
import { Header, Divider, Button, Input } from 'semantic-ui-react';
import * as SM from '../../types/sense-map';
import './index.css';

interface Props {
  data: SM.CardData;
  onChange? (value: SM.CardData): void;
}

interface State {
  isEditing: boolean;
  data: SM.CardData;
}

const showCardType = (type: SM.CardType): string => {
  switch (type) {
    case SM.CardType.Common:
      return 'Card';
    case SM.CardType.Box:
      return 'Box';
    case SM.CardType.Empty:
    default:
      return 'Unknown';
  }
};

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
      data: { ...props.data }
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.data !== nextProps.data) {
      this.setState({
        data: { ...nextProps.data }
      });
    }
  }

  handleEdit = () => {
    setImmediate(() => {
      if (this.titleInput) {
        this.titleInput.focus();
      }
    });

    this.setState({
      isEditing: true
    });
  }

  handleValueChange =
    (key: string) => (e: React.FormEvent<HTMLInputElement>) => {
      this.setState({
        data: {
          ...this.state.data,
          [key]: e.currentTarget.value
        }
      });
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
    const { onChange } = this.props;

    if (onChange) {
      onChange(this.state.data);
    }

    this.setState({
      isEditing: false
    });
  }

  handleCancel = () => {
    this.setState({
      isEditing: false,
      data: { ...this.props.data }
    });
  }

  render() {
    const { title, description } = this.props.data;
    const { isEditing, data } = this.state;

    let titleSection =
      isEditing
        ? (
          <Input
            fluid
            transparent
            ref={e => this.titleInput = e}
            placeholder={title}
            value={data.title}
            onKeyUp={this.handleKey}
            onChange={this.handleValueChange('title')}
          />
        )
        : title;

    let descriptionSection =
      isEditing
        ? (
          <Input
            fluid
            transparent
            placeholder={description}
            value={data.description}
            onKeyUp={this.handleKey}
            onChange={this.handleValueChange('description')}
          />
        )
        : description;

    return (
      <div className="card-content">
        <div className="card-content__content">
          <Header as="h1" className="card-content__header">
            {titleSection}
            <Header.Subheader>{showCardType(this.props.data.type)}</Header.Subheader>
          </Header>
          <div className="card-content__section">
            {descriptionSection}
          </div>
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