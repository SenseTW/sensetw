import * as React from 'react';
import Header from '../Header';

class DashboardPage extends React.PureComponent {
  render() {
    return (
      <div className="dashboard-page">
        <Header />
        <p>The dashboard.</p>
      </div>
    );
  }
}

export default DashboardPage;