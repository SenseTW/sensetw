import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import MapPage from '../MapPage';
import * as R from '../../types/routes';
import './index.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path={R.index} component={MapPage} />
          <Route path={`${R.index}:bid`} component={MapPage} />
        </div>
      </Router>
    );
  }
}

export default App;
