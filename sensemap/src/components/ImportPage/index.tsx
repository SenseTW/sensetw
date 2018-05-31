import * as React from 'react';
import { connect } from 'react-redux';
import { Container, Header, Form, Input, Divider } from 'semantic-ui-react';
import { State, ActionProps, actions, mapDispatch } from '../../types';

interface StateFromProps {
  url: string;
}

type Props = StateFromProps & ActionProps;

class ImportPage extends React.PureComponent<Props> {
  componentDidMount() {
    const { actions: acts } = this.props;

    acts.importer.changeUrl('http://example.com/');
  }
  render() {
    return (
      <Container text>
        <Header as="h1">Hypothesis Annotation Importer</Header>
        <Form>
          <Form.Field>
            <label>文章地址</label>
            <Input />
          </Form.Field>
        </Form>
        <Divider />
      </Container>
    );
  }
}

export default connect<StateFromProps, ActionProps>(
  (state: State) => {
    const { url } = state.importer;
    return { url };
  },
  mapDispatch({ actions })
)(ImportPage);