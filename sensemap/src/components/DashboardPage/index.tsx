import * as React from 'react';
import { connect } from 'react-redux';
import { State, ActionProps, actions, mapDispatch } from '../../types';
import MapCard from './MapCard';
import FloatingActionButton from './FloatingActionButton';
import { Container, Search, Card } from 'semantic-ui-react';
import * as CS from '../../types/cached-storage';
import './index.css';

interface StateFromProps {
  senseObject: CS.CachedStorage;
}

interface OwnProps {}

type Props = OwnProps & StateFromProps & ActionProps;

class DashboardPage extends React.PureComponent<Props> {
  componentDidMount() {
    const { actions: acts } = this.props;
    acts.senseObject.loadMaps();
  }

  render() {
    const { senseObject } = this.props;
    const maps = CS.toStorage(senseObject).maps;

    return (
      <div className="dashboard-page">
        <Container>
          <Search disabled />
          <Card.Group stackable itemsPerRow={3}>
            {Object.values(maps).map((m, i) => <MapCard key={i} data={m}/>)}
          </Card.Group>
          <FloatingActionButton />
        </Container>
      </div>
    );
  }
}

export default connect(
  (state: State) => {
    const { senseObject } = state;
    return { senseObject };
  },
  mapDispatch({ actions })
)(DashboardPage);