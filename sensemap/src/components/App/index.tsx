import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import MapPage from '../MapPage';
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
      <Router>
        <div className="App">
          <Switch>
            <Route path={R.importer} component={ImportPage} />
            <Route exact path={`${R.index}`} component={MapPage} />
            <Route path={`${R.index}:bid`} component={MapPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;