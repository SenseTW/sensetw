import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import GoogleTagManager from '../GoogleTagManager';
import RouteToState from './RouteToState';
import Header from '../Header';
import MapPage from '../MapPage';
import Sources from '../Sources';
import DashboardPage from '../DashboardPage';
import ImportPage from '../ImportPage';
import SignUpPage from '../SignupPage';
import SettingsPage from '../SettingsPage';
import TermsOfServicePage from '../TermsOfServicePage';
import LoginPage from '../LoginPage';
import MapContent from '../MapContent';
import { User } from '../../types';
import * as R from '../../types/routes';
import './index.css';

export interface StateFromProps {
  checked: boolean;
  authenticated: boolean;
  user?: User;
}

export type Props = StateFromProps;

/**
 * The application entry point.
 *
 * It matches the index page with exact path so it will not leave the bid undefined.
 *
 * @see https://github.com/SenseTW/sensetw/issues/81
 */
export class App extends React.Component<Props> {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
      { this.props.checked &&
          <div className="App">
            <Route render={(props) => <GoogleTagManager gtmId={process.env.REACT_APP_GTM_ID} />} />
            <RouteToState />
            <Header />
            <Switch>
              <Route exact path={R.index} component={DashboardPage} />
              <Route exact path={R.importer} component={ImportPage} />
              <Route exact path={R.settings} component={SettingsPage} />
              <Route exact path={R.mapList} component={DashboardPage} />
              <Route exact path={R.map} component={MapPage} />
              <Route path={R.submap} component={MapPage} />
              <Route path={R.mapSources} component={Sources} />
              <Route path={R.signup} component={SignUpPage} />
              <Route path={R.login} component={LoginPage} />
              <Route path={R.termsOfService} component={TermsOfServicePage} />
            </Switch>
            <MapContent />
          </div>
      }
      </Router>
    );
  }
}

export default App;
