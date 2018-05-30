import * as React from 'react';
import { Container, Header, Form, Input, Divider } from 'semantic-ui-react';

interface Props {}

class ImportPage extends React.PureComponent<Props> {
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

export default ImportPage;