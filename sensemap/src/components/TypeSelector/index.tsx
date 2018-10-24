import * as React from 'react';
import * as cx from 'classnames';
import { Form, Checkbox } from 'semantic-ui-react';
import { noop } from '../../types/utils';
import './index.css';

interface Props<T extends string> {
  className?: string;
  disabled?: boolean;
  types: T[];
  typeNames?: { [key: string]: string };
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
  const { className = '', disabled = false, types, typeNames = {}, type, onChange = noop } = props;
  const classes = cx(groupName, className);

  return (
    <div className={classes}>{
      types.map(ty => {
        const typeName = typeNames[ty];
        return (
          <Form.Field key={ty}>
            <Checkbox
              disabled={disabled}
              radio
              className={`${groupName}__${ty.toLowerCase()}`}
              label={typeName || capitalize(ty)}
              name={groupName}
              value={ty}
              checked={type === ty}
              onChange={() => onChange(ty)}
            />
          </Form.Field>
        );
      })
    }</div>
  );
}

export default TypeSelector;