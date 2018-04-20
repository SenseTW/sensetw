import * as React from 'react';
import { Header, Input } from 'semantic-ui-react';
import * as SC from '../../types/sense-card';

interface Props {
  data: SC.CardData;
  isEditing: boolean;
  onKeyUp? (e: React.KeyboardEvent<HTMLInputElement>): void;
  onChange? (action: SC.Action): void;
}

class CoreCard extends React.PureComponent<Props> {
  static defaultProps = {
    data: SC.emptyCardData,
    isEditing: false
  };

  titleInput: Input | null;

  constructor(props: Props) {
    super(props);

    this.titleInput = null;
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isEditing === false && this.props.isEditing === true) {
      setImmediate(() => {
        if (this.titleInput) {
          this.titleInput.focus();
        }
      });
    }
  }

  render() {
    const { children, data, isEditing, onKeyUp, onChange } = this.props;
    const { type, title, description } = data;

    let titleSection =
      isEditing
        ? (
          <Input
            fluid
            transparent
            ref={e => this.titleInput = e}
            placeholder="卡片標題"
            value={title}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(SC.updateTitle(e.currentTarget.value))}
          />
        )
        : title;

    let descriptionSection =
      isEditing
        ? (
          <Input
            fluid
            transparent
            placeholder="卡片描述"
            value={description}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(SC.updateDescription(e.currentTarget.value))}
          />
        )
        : description;

    return (
      <div className="core-card">
        <Header as="h1" className="core-card__header">
          {titleSection}
          <Header.Subheader>{SC.typeToString(type)}</Header.Subheader>
        </Header>
        <div className="core-card__description">
          {descriptionSection}
        </div>
        {children}
      </div>
    );
  }
}

export default CoreCard;