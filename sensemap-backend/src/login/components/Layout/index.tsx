import * as React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';

type Style = {
  background: string;
}

type Props = {
  children: JSX.Element,
  style?: Style,
  header?: string,
}

const Layout = (props: Props) => {
  const header = !!props.header ? <Header>{props.header}</Header> : null;
  const style = { height: '100%', background: '#b3e5fc', ...props.style };

  return (
    <Grid textAlign="center" verticalAlign="middle" style={style}>
      <Grid.Column style={{ maxWidth: 400 }}>
        <Segment>
          {header}
          {props.children}
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default Layout;
