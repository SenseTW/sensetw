import * as React from 'react';
import { connect } from 'react-redux';
import { Container, Header, Form, Input, Divider } from 'semantic-ui-react';
import { State, ActionProps, actions, mapDispatch } from '../../types';

interface StateFromProps {
  url: string;
}

type Props = StateFromProps & ActionProps;

class ImportPage extends React.PureComponent<Props> {
  handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { actions: { importer } } = this.props;

    importer.changeUrl(e.currentTarget.value);
  }

  handleInputSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    const { actions: { importer }, url } = this.props;

    importer.fetchAnnotations(url);
  }

  render() {
    const { url } = this.props;

    return (
      <Container text>
        <Header as="h1">Hypothesis Annotation Importer</Header>
        <Form>
          <Form.Field>
            <label>文章地址</label>
            <Input
              action={{ icon: 'search', onClick: this.handleInputSubmit }}
              placeholder="文章地址"
              value={url}
              onChange={this.handleInputChange}
            />
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