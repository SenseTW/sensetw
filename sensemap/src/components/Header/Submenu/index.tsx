import * as React from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import * as R from '../../../types/routes';
import './index.css';

type MyRouteProps = RouteComponentProps<{}>;

type Props = {} & MyRouteProps;

class Submenu extends React.PureComponent<Props> {
  render() {
    const className = 'sense-header__submenu';

    return (
      <Menu tabular className={`${className} right`}>
        <Menu.Item
          className={`${className}__annotation`}
          as="a"
          href="https://via.sense.tw/"
        >
          Annotation
        </Menu.Item>
        <Switch>
          <Route path={R.map}>
            {() => <Menu.Item active>Map</Menu.Item>}
          </Route>
        </Switch>
      </Menu>
    );
  }
}

export default withRouter<MyRouteProps>(Submenu);