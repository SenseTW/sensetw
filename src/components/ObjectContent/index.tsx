import * as React from 'react';
import { Key } from 'ts-keycode-enum';
import { Divider, Button } from 'semantic-ui-react';
import CardContent from '../CardContent';
import BoxContent from '../BoxContent';
import * as SO from '../../types/sense-object';
import * as SC from '../../types/sense-card';
import * as SB from '../../types/sense-box';
import './index.css';

type Data
  = SC.CardData
  | SB.BoxData;

interface Props {
  objectType: SO.ObjectType;
  data: Data;
  onChange? (value: Data): void;
}

interface State {
  isEditing: boolean;
  data: Data;
}

class ObjectContent extends React.Component<Props, State> {
  static defaultProps = {
    objectType: SO.ObjectType.CARD,
    data: SC.emptyCardData
  };

  constructor(props: Props) {
    super(props);

    const { objectType, data } = props;

    switch (objectType) {
      case SO.ObjectType.CARD:
        this.state = {
          isEditing: false,
          data: SC.reducer(data as SC.CardData)
        };
        break;
      case SO.ObjectType.BOX:
        this.state = {
          isEditing: false,
          data: SB.reducer(data as SB.BoxData)
        };
        break;
      default:
        this.state = {
          isEditing: false,
          data: SC.emptyCardData
        };
    }

  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.data !== nextProps.data) {
      const { objectType, data } = nextProps;

      switch (objectType) {
        case SO.ObjectType.CARD:
          this.setState({
            data: SC.reducer(data as SC.CardData)
          });
          break;
        case SO.ObjectType.BOX:
          this.setState({
            data: SB.reducer(data as SB.BoxData)
          });
          break;
        default:
      }
    }
  }

  handleEdit = () => {
    this.setState({
      isEditing: true
    });
  }

  handleChange = (action: SC.Action | SB.Action) => {
    const { objectType } = this.props;
    const { data } = this.state;

    switch (objectType) {
      case SO.ObjectType.CARD:
        this.setState({
          data: SC.reducer(data as SC.CardData, action as SC.Action)
        });
        break;
      case SO.ObjectType.BOX:
        this.setState({
          data: SB.reducer(data as SB.BoxData, action as SB.Action)
        });
        break;
      default:
    }

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
    const { objectType, data } = this.props;

    switch (objectType) {
      case SO.ObjectType.CARD:
        this.setState({
          isEditing: false,
          data: SC.reducer(data as SC.CardData)
        });
        break;
      case SO.ObjectType.BOX:
        this.setState({
          isEditing: false,
          data: SB.reducer(data as SB.BoxData)
        });
        break;
      default:
    }
  }

  render() {
    const { objectType } = this.props;
    const { isEditing, data } = this.state;

    let content;
    switch (objectType) {
      case SO.ObjectType.CARD:
        content = (
          <CardContent
            data={data as SC.CardData}
            isEditing={isEditing}
            onKeyUp={this.handleKey}
            onChange={action => this.handleChange(action)}
          />
        );
        break;
      case SO.ObjectType.BOX:
        content = (
          <BoxContent
            data={data as SB.BoxData}
            isEditing={isEditing}
            onKeyUp={this.handleKey}
            onChange={action => this.handleChange(action)}
          />
        );
        break;
      default:
    }

    return (
      <div className="card-content">
        {content}
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

export default ObjectContent;