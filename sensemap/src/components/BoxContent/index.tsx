import * as React from 'react';
import { Header, Form, TextArea, Input } from 'semantic-ui-react';
import BoxTypeSelector from './BoxTypeSelector';
import { SUMMARY_LIMIT } from '../Inspector';
import * as B from '../../types/sense/box';
import * as U from '../../types/utils';
import { isLength } from 'validator';
import * as moment from 'moment';
import { placeholders } from './placeholders';
import './index.css';

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
    const { title, summary, tags, boxType, updatedAt } = data;
    const isSummaryValid = isLength(summary, { max: SUMMARY_LIMIT });
    const updateTime = moment(updatedAt).format(U.TIME_FORMAT);

    return (
      <Form className="box-content">
        <Header color="grey">
          <h3>BOX INSPECTOR</h3>
          <h4>created by {data.owner.username}</h4>
          <h4>last updated on {updateTime}</h4>
        </Header>
        <Form.Field className="box-content__box-type">
          <BoxTypeSelector
            id="sense-box-inspector__type-selector"
            disabled={disabled}
            typePrefix="sense-box-inspector"
            boxType={boxType}
            onChange={type => onChange && onChange(B.updateBoxType(type))}
          />
        </Form.Field>
        <Form.Field className="box-content__title">
          <label>Title</label>
          <Input
            id="sense-box-inspector__title-input"
            disabled={disabled}
            placeholder={placeholders[boxType].title}
            value={title}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(B.updateTitle(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="box-content__summary" error={!isSummaryValid}>
          <label>Summary (max {SUMMARY_LIMIT} characters)</label>
          <TextArea
            id="sense-box-inspector__summary-input"
            disabled={disabled}
            placeholder={placeholders[boxType].summary}
            value={summary}
            onChange={e => onChange && onChange(B.updateSummary(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="box-content__tags">
          <label>Tag</label>
          <Input
            id="sense-box-inspector__tags-input"
            disabled={disabled}
            placeholder={placeholders[boxType].tags}
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