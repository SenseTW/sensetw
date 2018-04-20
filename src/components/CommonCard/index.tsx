import * as React from 'react';
import { Input, Label } from 'semantic-ui-react';
import CoreCard from '../CoreCard';
import * as SC from '../../types/sense-card';

interface Props {
  data: SC.CommonCardData;
  isEditing: boolean;
  onKeyUp? (e: React.KeyboardEvent<HTMLInputElement>): void;
  onChange? (action: SC.Action): void;
}

class CommonCard extends React.PureComponent<Props> {
  static defaultProps = {
    data: SC.emptyCardData,
    isEditing: false
  };

  render() {
    const { data, isEditing, onKeyUp, onChange } = this.props;
    const { quote, tags } = data;

    let quoteSection =
      isEditing
        ? (
          <Input
            fluid
            transparent
            placeholder="卡片引言"
            value={quote}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(SC.updateQuote(e.currentTarget.value))}
          />
        )
        : quote;

    let tagsSection =
      isEditing
        ? (
          <Input
            fluid
            transparent
            placeholder="標籤"
            value={tags}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(SC.updateTags(e.currentTarget.value))}
          />
        )
        : SC.splitTags(tags)
            .filter(tag => tag)
            .map(tag => <Label key={tag}>{tag}</Label>);

    return (
      <CoreCard data={data} isEditing={isEditing} onChange={onChange}>
        <div className="common-card__quote">
          {quoteSection}
        </div>
        <div className="common-card__tags">
          {tagsSection}
        </div>
      </CoreCard>
    );
  }
}

export default CommonCard;