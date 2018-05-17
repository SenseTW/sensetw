import * as React from 'react';
import { Form, TextArea, Input } from 'semantic-ui-react';
import * as SB from '../../types/sense-box';

interface Props {
  data: SB.BoxData;
  onKeyUp? (e: React.KeyboardEvent<HTMLElement>): void;
  onChange? (action: SB.Action): void;
}

class BoxContent extends React.PureComponent<Props> {
  static defaultProps = {
    data: SB.emptyBoxData,
  };

  render() {
    const { children, data, onKeyUp, onChange } = this.props;
    const { title, summary, tags } = data;

    return (
      <Form className="box-content">
        <Form.Field className="box-content__title">
          <label>Title</label>
          <Input
            placeholder="one concept or one argument"
            value={title}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(SB.updateTitle(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="box-content__summary">
          <label>Summary</label>
          <TextArea
            placeholder="文化部提供的議題分析表"
            value={summary}
            onChange={e => onChange && onChange(SB.updateSummary(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="box-content__tags">
          <label>Tag</label>
          <Input
            placeholder="tag1, tag2, tag3"
            value={tags}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(SB.updateTags(e.currentTarget.value))}
          />
        </Form.Field>
        {children}
      </Form>
    );
  }
}

export default BoxContent;