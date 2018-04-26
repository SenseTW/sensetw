import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import Header from '../Header';
import MainPage from '../MainPage';
import CounterPage from '../CounterPage';
import MapPage from '../MapPage';
import './index.css';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <Route exact path="/" component={MainPage} />
          <Route exact path="/counter" component={CounterPage} />
          <Route exact path="/map" component={MapPage} />
        </div>
      </Router>
    );
  }
}

export default App;
