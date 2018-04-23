import * as React from 'react';
import { Container } from 'semantic-ui-react';
import Map from '../Map';

class MapPage extends React.Component {
  render() {
    return (
      <Container text>
        <Map />
      </Container>
    );
  }
}

export default MapPage;
