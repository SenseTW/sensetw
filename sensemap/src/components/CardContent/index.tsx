import * as React from 'react';
import { Form, TextArea, Input } from 'semantic-ui-react';
import CardTypeSelector from './CardTypeSelector';
import * as C from '../../types/sense/card';

interface Props {
  data: C.CardData;
  onKeyUp? (e: React.KeyboardEvent<HTMLInputElement>): void;
  onChange? (action: C.Action): void;
}

class CardContent extends React.PureComponent<Props> {
  static defaultProps = {
    data: C.emptyCardData,
  };

  render() {
    const { children, data, onKeyUp, onChange } = this.props;
    const { title, summary, description, tags, url, saidBy, stakeholder, cardType } = data;

    return (
      <Form className="card-content">
        <Form.Field className="card-content__summary">
          <label>Summary / Description</label>
          <TextArea
            placeholder="說重點"
            value={summary}
            onChange={e => onChange && onChange(C.updateSummary(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="card-content__tags">
          <label>Tag</label>
          <Input
            placeholder="tag1, tag2, tag3"
            value={tags}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(C.updateTags(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="card-content__title">
          <label>Source Title</label>
          <TextArea
            placeholder="資料來源，e.g. 【AI全面啟動Ⅱ：台灣企業行不行？關鍵在老闆｜天下雜誌】"
            value={title}
            onChange={e => onChange && onChange(C.updateTitle(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="card-content__description">
          <label>Quote</label>
          <TextArea
            placeholder="資料原文摘錄與補充資訊"
            value={description}
            onChange={e => onChange && onChange(C.updateDescription(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="card-content__url">
          <Input
            placeholder="https://o.sense.tw/abcd"
            value={url}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(C.updateUrl(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="card-content__said-by" inline>
          <label>發言人</label>
          <Input
            placeholder="誰提出的意見？ e.g. XX 大學校長 XXX"
            value={saidBy}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(C.updateSaidBy(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="card-content__stakeholder" inline>
          <label>利害關係人</label>
          <Input
            placeholder="誰會被影響？（用逗號隔開）e.g. 經濟部, 半導體廠商, 大學"
            value={stakeholder}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(C.updateStakeholder(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="card-content__card-type">
          <label>Card Type</label>
          <CardTypeSelector
            cardType={cardType}
            onChange={type => onChange && onChange(C.updateCardType(type))}
          />
        </Form.Field>
        {children}
      </Form>
    );
  }
}

export default CardContent;