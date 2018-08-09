import * as React from 'react';
import { Form, Checkbox } from 'semantic-ui-react';
import { CardType } from '../../../types';
import { noop } from '../../../types/utils';
import './index.css';

interface Props {
  disabled?: boolean;
  cardType: CardType;
  onChange? (type: CardType): void;
}

const groupName = 'card-type-selector';

const capitalize = (str: string): string => {
  if (str.length === 0) {
    return str;
  }
  return str[0] + str.slice(1).toLowerCase();
};

function CardTypeSelector(props: Props) {
  const { disabled = false, cardType, onChange = noop } = props;

  return (
    <div className="card-type-selector">{
      Object.keys(CardType).map(ty => (
        <Form.Field key={ty}>
          <Checkbox
            disabled={disabled}
            radio
            className={`card-type-selector__${ty.toLowerCase()}`}
            label={capitalize(ty)}
            name={groupName}
            value={ty}
            checked={cardType === ty}
            onChange={() => onChange(ty as CardType)}
          />
        </Form.Field>
      ))
    }</div>
  );
}

export default CardTypeSelector;