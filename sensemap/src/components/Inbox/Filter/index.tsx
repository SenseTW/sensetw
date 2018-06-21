import * as React from 'react';
import { Input } from 'semantic-ui-react';
import './index.css';

const Filter = (props: {}) => (
  <Input
    disabled
    className="inbox__filter"
    icon="filter"
    iconPosition="left"
    placeholder="Filter"
    action={{ icon: 'search' }}
  />
);

export default Filter;