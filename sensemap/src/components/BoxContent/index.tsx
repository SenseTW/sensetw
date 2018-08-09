import * as React from 'react';
import { Header, Form, TextArea, Input } from 'semantic-ui-react';
import * as B from '../../types/sense/box';

interface Props {
  disabled?: boolean;
  data: B.BoxData;
  onKeyUp? (e: React.KeyboardEvent<HTMLElement>): void;
  onChange? (action: B.Action): void;
}

class BoxContent extends React.PureComponent<Props> {
  static defaultProps = {
    data: B.emptyBoxData,
  };

  render() {
    const { children, disabled = false, data, onKeyUp, onChange } = this.props;
    const { title, summary, tags } = data;

    return (
      <Form className="box-content">
        <Header as="h3" color="grey">
          BOX INSPECTOR
        </Header>
        <Form.Field className="box-content__title">
          <label>Title</label>
          <Input
            disabled={disabled}
            placeholder="one concept or one argument"
            value={title}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(B.updateTitle(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="box-content__summary">
          <label>Summary</label>
          <TextArea
            disabled={disabled}
            placeholder="文化部提供的議題分析表"
            value={summary}
            onChange={e => onChange && onChange(B.updateSummary(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="box-content__tags">
          <label>Tag</label>
          <Input
            disabled={disabled}
            placeholder="tag1, tag2, tag3"
            value={tags}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(B.updateTags(e.currentTarget.value))}
          />
        </Form.Field>
        {children}
      </Form>
    );
  }
}

export default BoxContent;