import * as React from 'react';
import { Key } from 'ts-keycode-enum';
import { Header, Divider, Button, Input } from 'semantic-ui-react';
import * as SC from '../../types/sense-card';
import './index.css';

interface Props {
  data: SC.CardData;
  onChange? (value: SC.CardData): void;
}

interface State {
  isEditing: boolean;
  data: SC.CardData;
}

class CardContent extends React.Component<Props, State> {
  static defaultProps = {
    data: SC.emptyCardData
  };

  titleInput: Input | null;

  constructor(props: Props) {
    super(props);

    this.titleInput = null;

    this.state = {
      isEditing: false,
      data: SC.reducer(this.props.data)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.data !== nextProps.data) {
      this.setState({
        data: SC.reducer(nextProps.data)
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

  handleChange = (action: SC.Action) => {
    const { data } = this.state;
    this.setState({ data: SC.reducer(data, action) });
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
      data: SC.reducer(this.props.data)
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
            onChange={e => this.handleChange(SC.updateTitle(e.currentTarget.value))}
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
            onChange={e => this.handleChange(SC.updateDescription(e.currentTarget.value))}
          />
        )
        : description;

    return (
      <div className="card-content">
        <div className="card-content__content">
          <Header as="h1" className="card-content__header">
            {titleSection}
            <Header.Subheader>{SC.typeToString(this.props.data.type)}</Header.Subheader>
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