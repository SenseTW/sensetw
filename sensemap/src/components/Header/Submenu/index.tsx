import * as React from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { Menu, Dropdown } from 'semantic-ui-react';
import * as SM from '../../../types/sense/map';
import * as R from '../../../types/routes';
import './index.css';

type MyRouteProps = RouteComponentProps<{}>;

type Props = {
  map: SM.MapData,
  onEditMap?(map: SM.MapData): void,
} & MyRouteProps;

class Submenu extends React.PureComponent<Props> {
  render() {
    const { map, onEditMap } = this.props;
    const className = 'sense-submenu';

    return (
      <Menu tabular className={`${className} right`}>
        <Menu.Item
          className={`${className}__annotation`}
          as="a"
          href="https://via.sense.tw/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Annotation
        </Menu.Item>
        <Switch>
          <Route path={R.map}>
            {() => <Menu.Item active>Map</Menu.Item>}
          </Route>
        </Switch>
        <Dropdown
          direction="left"
          icon="ellipsis horizontal"
        >
          <Dropdown.Menu>
            <Dropdown.Item
              disabled={SM.isEmpty(map)}
              onClick={() => onEditMap && onEditMap(map)}
            >
              MAP Detail
            </Dropdown.Item>
            <Dropdown.Item disabled>MEMBER</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    );
  }
}

export default withRouter<Props>(Submenu);