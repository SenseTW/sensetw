import * as React from 'react';
import { Header, Input } from 'semantic-ui-react';
import * as SC from '../../types/sense-card';

interface Props {
  data: SC.CardData;
  isEditing: boolean;
  onKeyUp? (e: React.KeyboardEvent<HTMLInputElement>): void;
  onChange? (action: SC.Action): void;
}

class CardContent extends React.PureComponent<Props> {
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
    const { title, summary, saidBy, stakeholder, cardType } = data;

    const titleSection =
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

    const summarySection =
      isEditing
        ? (
          <Input
            fluid
            transparent
            placeholder="卡片描述"
            value={summary}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(SC.updateSummary(e.currentTarget.value))}
          />
        )
        : summary;

    const saidBySection =
      isEditing
        ? (
          <Input
            fluid
            transparent
            placeholder="發言人"
            value={saidBy}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(SC.updateSaidBy(e.currentTarget.value))}
          />
        )
        : saidBy;

    const stakeholderSection =
      isEditing
        ? (
          <Input
            fluid
            transparent
            placeholder="利害關係人"
            value={stakeholder}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(SC.updateStakeholder(e.currentTarget.value))}
          />
        )
        : stakeholder;

    return (
      <div className="card-content">
        <Header as="h1" className="card-content__header">
          {titleSection}
          <Header.Subheader>{SC.typeToString(cardType)}</Header.Subheader>
        </Header>
        <div className="card-content__summary">
          {summarySection}
        </div>
        <div className="card-content__said-by">
          <Header as="h3">發言人</Header>
          {saidBySection}
        </div>
        <div className="card-content__stakeholder">
          <Header as="h3">利害關係人</Header>
          {stakeholderSection}
        </div>
        {children}
      </div>
    );
  }
}

export default CardContent;