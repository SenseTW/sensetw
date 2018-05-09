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
    const { title, summary } = data;

    return (
      <Form className="box-content">
        <Form.Field className="box-content__summary">
          <label>Summary</label>
          <TextArea
            placeholder="Box 描述"
            value={summary}
            onChange={e => onChange && onChange(SB.updateSummary(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="box-content__title">
          <label>Title</label>
          <Input
            placeholder="Box 標題"
            value={title}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(SB.updateTitle(e.currentTarget.value))}
          />
        </Form.Field>
        {children}
      </Form>
    );
  }
}

export default BoxContent;