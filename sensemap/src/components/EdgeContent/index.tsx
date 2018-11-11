import * as React from 'react';
import { Header, Form, Input, TextArea } from 'semantic-ui-react';
import EdgeTypeSelector from './EdgeTypeSelector';
import { EDGE_SUMMARY_LIMIT } from '../Inspector';
import { Edge } from '../../types';
import * as E from '../../types/sense/edge';
import { placeholders } from './placeholders';
import { isLength } from 'validator';

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
    const isSummaryValid = isLength(summary, { max: EDGE_SUMMARY_LIMIT });

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
        <Form.Field className="edge-content__edge-summary" error={!isSummaryValid}>
          <label>Summary (max {EDGE_SUMMARY_LIMIT} characters)</label>
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