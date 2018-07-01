import * as React from 'react';
import { connect } from 'react-redux';
import { State, ActionProps, actions, mapDispatch, MapID } from '../../types';
import MapCard from './MapCard';
import FloatingActionButton from './FloatingActionButton';
import MapContent from './MapContent';
import { Container, Search, Card } from 'semantic-ui-react';
import * as CS from '../../types/cached-storage';
import './index.css';

interface StateFromProps {
  senseObject: CS.CachedStorage;
  map: MapID;
}

interface OwnProps {}

type Props = OwnProps & StateFromProps & ActionProps;

class DashboardPage extends React.Component<Props> {
  componentDidMount() {
    const { actions: acts } = this.props;
    acts.senseObject.loadMaps();
  }

  render() {
    const { actions: acts, senseObject, map } = this.props;
    const maps = CS.toStorage(senseObject).maps;
    const isClean = CS.isClean(senseObject);

    return (
      <div className="dashboard-page">
        <Container>
          <Search disabled />
          <Card.Group stackable itemsPerRow={3}>
            {Object.values(maps).map(
              (m, i) =>
                <MapCard
                  key={i}
                  currentMap={map}
                  isMapClean={isClean}
                  data={m}
                  onEdit={() => acts.editor.focusMap(m.id)}
                />
            )}
          </Card.Group>
          <FloatingActionButton />
          <MapContent />
        </Container>
      </div>
    );
  }
}

export default connect(
  (state: State) => {
    const { senseObject, senseMap } = state;
    return { senseObject, map: senseMap.map };
  },
  mapDispatch({ actions })
)(DashboardPage);