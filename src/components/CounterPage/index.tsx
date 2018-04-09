import * as React from 'react';
import { Container } from 'semantic-ui-react';
import Counter from '../Counter';

class CounterPage extends React.PureComponent {
  render() {
    return (
      <Container text>
        <p>This page has a counter.</p>
        <p><Counter /></p>
      </Container>
    );
  }
}

export default CounterPage;