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

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path={R.importer} component={ImportPage} />
            <Route path={`${R.index}`} component={MapPage} />
            <Route path={`${R.index}:bid`} component={MapPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
