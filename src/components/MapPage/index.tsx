import * as React from 'react';
import { Container } from 'semantic-ui-react';
import CanvasMap from '../CanvasMap';

class MapPage extends React.Component {
  render() {
    return (
      <Container text>
        <CanvasMap />
      </Container>
    );
  }
}

export default MapPage;
