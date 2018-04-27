import * as React from 'react';
import { Form, TextArea, Input } from 'semantic-ui-react';
import * as SC from '../../types/sense-card';

interface Props {
  data: SC.CardData;
  onKeyUp? (e: React.KeyboardEvent<HTMLInputElement>): void;
  onChange? (action: SC.Action): void;
}

class CardContent extends React.PureComponent<Props> {
  static defaultProps = {
    data: SC.emptyCardData,
  };

  render() {
    const { children, data, onKeyUp, onChange } = this.props;
    const { title, summary, url, saidBy, stakeholder, cardType } = data;

    return (
      <Form className="card-content">
        <Form.Field className="card-content__card-type">
          <label>Card Type</label>
          {SC.typeToString(cardType)}
        </Form.Field>
        <Form.Field className="card-content__summary">
          <label>Summary</label>
          <TextArea
            placeholder="卡片描述"
            value={summary}
            onChange={e => onChange && onChange(SC.updateSummary(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="card-content__title">
          <label>Source Title</label>
          <Input
            placeholder="卡片標題"
            value={title}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(SC.updateTitle(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="card-content__url">
          <Input
            placeholder="網址"
            value={url}
            onKeyUp={onKeyUp}
          />
        </Form.Field>
        <Form.Field className="card-content__said-by" inline>
          <label>發言人</label>
          <Input
            placeholder="發言人"
            value={saidBy}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(SC.updateSaidBy(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="card-content__stakeholder" inline>
          <label>利害關係人</label>
          <Input
            placeholder="利害關係人"
            value={stakeholder}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(SC.updateStakeholder(e.currentTarget.value))}
          />
        </Form.Field>
        {children}
      </Form>
    );
  }
}

export default CardContent;