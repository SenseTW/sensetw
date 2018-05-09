import * as React from 'react';
import { Form, Checkbox } from 'semantic-ui-react';
import * as SC from '../../../types/sense-card';
import { noop } from '../../../types/utils';
import './index.css';

interface Props {
  cardType: SC.CardType;
  onChange? (type: SC.CardType): void;
}

const groupName = 'card-type-selector';

const capitalize = (str: string): string => {
  if (str.length === 0) {
    return str;
  }
  return str[0] + str.slice(1).toLowerCase();
};

function CardTypeSelector(props: Props) {
  const { cardType, onChange = noop } = props;

  return (
    <div className="card-type-selector">{
      Object.keys(SC.CardType).map(ty => (
        <Form.Field>
          <Checkbox
            radio
            className={`card-type-selector__${ty.toLowerCase()}`}
            label={capitalize(ty)}
            name={groupName}
            value={ty}
            checked={cardType === ty}
            onChange={() => onChange(ty as SC.CardType)}
          />
        </Form.Field>
      ))
    }</div>
  );
}

export default CardTypeSelector;