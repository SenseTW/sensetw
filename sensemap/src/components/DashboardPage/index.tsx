import * as React from 'react';
import MapCard from './MapCard';
import FloatingActionButton from './FloatingActionButton';
import { Container, Search, Card } from 'semantic-ui-react';
import './index.css';

class DashboardPage extends React.PureComponent {
  render() {
    const xs = [0, 1, 2, 3, 4, 5];

    return (
      <div className="dashboard-page">
        <Container>
          <Search disabled />
          <Card.Group itemsPerRow={3}>
            {xs.map((_, i) => <MapCard key={i} />)}
          </Card.Group>
          <FloatingActionButton />
        </Container>
      </div>
    );
  }
}

export default DashboardPage;