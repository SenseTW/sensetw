import * as React from 'react';
import { Form, Checkbox } from 'semantic-ui-react';
import { noop } from '../../types/utils';
import './index.css';

interface Props<T extends string> {
  disabled?: boolean;
  types: T[];
  type: T;
  onChange? (type: T): void;
}

const groupName = 'type-selector';

const capitalize = (str: string): string => {
  if (str.length === 0) {
    return str;
  }
  return str[0] + str.slice(1).toLowerCase();
};

function TypeSelector<T extends string>(props: Props<T>) {
  const { disabled = false, types, type, onChange = noop } = props;

  return (
    <div className={groupName}>{
      types.map(ty => (
        <Form.Field key={ty}>
          <Checkbox
            disabled={disabled}
            radio
            className={`${groupName}__${ty.toLowerCase()}`}
            label={capitalize(ty)}
            name={groupName}
            value={ty}
            checked={type === ty}
            onChange={() => onChange(ty)}
          />
        </Form.Field>
      ))
    }</div>
  );
}

export default TypeSelector;