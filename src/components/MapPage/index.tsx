import * as React from 'react';
import Map from '../../containers/Map';
import ObjectMenu from '../ObjectMenu';
import './index.css';

class MapPage extends React.Component {
  render() {
    return (
      <div className="map-page">
        <Map
          id="cjgdo1yhj0si501559s0hgw2a"
          width={1960}
          height={1200}
        />
        <ObjectMenu />
      </div>
    );
  }
}

export default MapPage;
