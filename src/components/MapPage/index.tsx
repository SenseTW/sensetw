import * as React from 'react';
import { Container } from 'semantic-ui-react';
import Map from '../../containers/Map';

class MapPage extends React.Component {
  render() {
    return (
      <Container text>
        <Map
          id="cjgdo1yhj0si501559s0hgw2a"
          width={960}
          height={600}
        />
      </Container>
    );
  }
}

export default MapPage;
