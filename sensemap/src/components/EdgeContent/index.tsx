import * as React from 'react';
import { Header, Form, Input, TextArea } from 'semantic-ui-react';
import EdgeTypeSelector from './EdgeTypeSelector';
import { Edge } from '../../types';
import * as E from '../../types/sense/edge';
import { placeholders } from './placeholders';

interface Props {
  disabled?: boolean;
  data: Edge;
  onChange? (action: E.Action): void;
}

class EdgeContent extends React.PureComponent<Props> {
  static defaultProps = {
    data: E.emptyEdge,
  };

  render() {
    const {
      children,
      disabled = false,
      data: {
        edgeType,
        title,
        tags,
        summary,
      },
      onChange,
    } = this.props;

    return (
      <Form className="edge-content">
        <Header color="grey">
          <h3>EDGE INSPECTOR</h3>
        </Header>
        <Form.Field className="edge-content__edge-type">
          <EdgeTypeSelector
            id="sense-edge-inspector__type-selector"
            disabled={disabled}
            typePrefix="sense-edge-inspector"
            edgeType={edgeType}
            onChange={type => onChange && onChange(E.edgeType(type))}
          />
        </Form.Field>
        <Form.Field className="edge-content__edge-title">
          <label>Title</label>
          <Input
            id="sense-edge-inspector__title-input"
            disabled={disabled}
            placeholder={placeholders[edgeType].title}
            value={title}
            onChange={e => onChange && onChange(E.edgeTitle(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="edge-content__edge-tags">
          <label>Tags</label>
          <Input
            id="sense-edge-inspector__tags-input"
            disabled={disabled}
            placeholder={placeholders[edgeType].tags}
            value={tags}
            onChange={e => onChange && onChange(E.edgeTags(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="edge-content__edge-summary">
          <label>Summary</label>
          <TextArea
            id="sense-edge-inspector__summary-input"
            disabled={disabled}
            placeholder={placeholders[edgeType].summary}
            value={summary}
            onChange={e => onChange && onChange(E.edgeSummary(e.currentTarget.value))}
          />
        </Form.Field>
        {children}
      </Form>
    );
  }
}

export default EdgeContent;