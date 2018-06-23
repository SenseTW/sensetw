import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import Header from '../Header';
import MapPage from '../MapPage';
import DashboardPage from '../DashboardPage';
import ImportPage from '../ImportPage';
import * as R from '../../types/routes';
import './index.css';

/**
 * The application entry point.
 *
 * It matches the index page with exact path so it will not leave the bid undefined.
 *
 * @see https://github.com/SenseTW/sensetw/issues/81
 */
class App extends React.Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path={R.dashboard} component={DashboardPage} />
            <Route exact path={R.importer} component={ImportPage} />
            <Route exact path={R.map} component={MapPage} />
            <Route path={`${R.map}/:bid`} component={MapPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
