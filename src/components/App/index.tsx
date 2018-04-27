import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import Header from '../Header';
import MainPage from '../MainPage';
import MapPage from '../MapPage';
import * as R from '../../types/routes';
import './index.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Route exact path={R.index} component={MainPage} />
          <Route exact path={R.map} component={MapPage} />
        </div>
      </Router>
    );
  }
}

export default App;
