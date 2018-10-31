import * as React from 'react';
import { Header, Form, TextArea, Input } from 'semantic-ui-react';
import CardTypeSelector from './CardTypeSelector';
import Accordion from './Accordion';
import * as C from '../../types/sense/card';
import { isURL } from 'validator';
import * as moment from 'moment';
import * as U from '../../types/utils';
import { placeholders } from './placeholders';
import './index.css';

interface Props {
  disabled?: boolean;
  data: C.CardData;
  onKeyUp? (e: React.KeyboardEvent<HTMLInputElement>): void;
  onChange? (action: C.Action): void;
}

class CardContent extends React.PureComponent<Props> {
  static defaultProps = {
    data: C.emptyCardData,
  };

  render() {
    const { children, disabled = false, data, onKeyUp, onChange } = this.props;
    const { title, summary, quote, description, tags, url, saidBy, stakeholder, cardType, updatedAt } = data;
    const isAnnotation = quote.length !== 0;
    const isURLValid = isURL(url, { require_protocol: true });
    const updateTime = moment(updatedAt).format(U.TIME_FORMAT);

    return (
      <Form className="card-content">
        <Header color="grey">
          <h3>CARD INSPECTOR</h3>
          <h4>created by {data.owner.username}</h4>
          <h4>last updated on {updateTime}</h4>
        </Header>
        <Form.Field className="card-content__card-type">
          <CardTypeSelector
            id="sense-card-inspector__type-selector"
            disabled={disabled}
            typePrefix="sense-card-inspector"
            cardType={cardType}
            onChange={type => onChange && onChange(C.updateCardType(type))}
          />
        </Form.Field>
        <Form.Field className="card-content__summary">
          <label>Summary</label>
          <TextArea
            id="sense-card-inspector__summary-input"
            disabled={disabled}
            placeholder={placeholders[cardType].summary}
            value={summary}
            onChange={e => onChange && onChange(C.updateSummary(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="card-content__tags">
          <label>Tag</label>
          <Input
            id="sense-card-inspector__tags-input"
            disabled={disabled}
            placeholder={placeholders[cardType].tags}
            value={tags}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(C.updateTags(e.currentTarget.value))}
          />
        </Form.Field>
        <Form.Field className="card-content__url">
          <label>Source Link</label>
          <Input
            id="sense-card-inspector__source-link-input"
            disabled={disabled}
            placeholder={placeholders[cardType].sourceLink}
            value={url}
            action={{
              id: 'sense-card-inspector__source-link-btn',
              icon: 'share square',
              disabled: !isURLValid,
              /**
               * Remove window.opener for older browsers.
               * @see https://mathiasbynens.github.io/rel-noopener/
               */
              onClick: () => {
                const viaUrl = `https://via.sense.tw/${url}`;
                // tslint:disable-next-line:no-any
                const w: any | null = window.open(viaUrl);
                if (w) {
                  w.opener = null;
                  w.location = viaUrl;
                }
              },
            }}
            onKeyUp={onKeyUp}
            onChange={e => onChange && onChange(C.updateUrl(e.currentTarget.value))}
          />
        </Form.Field>
        {
          isAnnotation
            ? <Form.Field className="card-content__quote">
                <label>Quote</label>
                <TextArea
                  id="sense-card-inspector__quote-input"
                  disabled
                  value={quote}
                />
              </Form.Field>
            : <Form.Field className="card-content__description">
                <label>Description</label>
                <TextArea
                  id="sense-card-inspector__description-input"
                  disabled={disabled}
                  placeholder={placeholders[cardType].description}
                  value={description}
                  onChange={e => onChange && onChange(C.updateDescription(e.currentTarget.value))}
                />
              </Form.Field>
        }
        <Accordion id="sense-card-inspector__accordion" title="Advanced">
          <Form.Field className="card-content__title">
            <label>Source Title</label>
            <TextArea
              id="sense-card-inspector__source-title-input"
              disabled={disabled}
              placeholder={placeholders[cardType].sourceTitle}
              value={title}
              onChange={e => onChange && onChange(C.updateTitle(e.currentTarget.value))}
            />
          </Form.Field>
          <Form.Field className="card-content__said-by">
            <label>Said By</label>
            <Input
              id="sense-card-inspector__said-by-input"
              disabled={disabled}
              placeholder={placeholders[cardType].saidBy}
              value={saidBy}
              onKeyUp={onKeyUp}
              onChange={e => onChange && onChange(C.updateSaidBy(e.currentTarget.value))}
            />
          </Form.Field>
          <Form.Field className="card-content__stakeholder">
            <label>Stakeholders</label>
            <Input
              id="sense-card-inspector__stakeholders-input"
              disabled={disabled}
              placeholder={placeholders[cardType].stakeholders}
              value={stakeholder}
              onKeyUp={onKeyUp}
              onChange={e => onChange && onChange(C.updateStakeholder(e.currentTarget.value))}
            />
          </Form.Field>
        </Accordion>
        {children}
      </Form>
    );
  }
}

export default CardContent;
