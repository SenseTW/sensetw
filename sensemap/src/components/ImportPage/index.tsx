import * as React from 'react';
import { connect } from 'react-redux';
import { Container, Header, Form, Input, Divider, List, Button } from 'semantic-ui-react';
import { MapID, State, ActionProps, actions, mapDispatch } from '../../types';
import * as HA from '../../types/hypothesis/annotation';
import * as IP from '../../types/importer';
import { noop } from '../../types/utils';
import { map } from 'ramda';

interface StateFromProps {
  mapId: MapID;
  url: string;
  logs: IP.ImportLog[];
}

type Props = StateFromProps & ActionProps;

const ImportedItem = (
  props: IP.ImportLog &
  { onImport?: (e: React.FormEvent<HTMLButtonElement>, annotations: HA.Annotation[]) => void }
) => {
  const { onImport = noop } = props;

  return (
    <List.Item key={props.url}>
      <List.Content floated="right">
        <Button
          primary
          onClick={e => onImport(e, props.annotations)}
        >
          匯入
        </Button>
      </List.Content>
      <List.Content>
        <List.Header>{props.url}</List.Header>
        <List.Description>發現 {props.annotations.length} 條註記</List.Description>
      </List.Content>
    </List.Item>
  );
};

class ImportPage extends React.PureComponent<Props> {
  handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { actions: { importer } } = this.props;

    importer.changeUrl(e.currentTarget.value);
  }

  handleInputSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    const { actions: { importer }, url } = this.props;

    importer.fetchAnnotations(url);
  }

  handleImport = async (e: React.FormEvent<HTMLButtonElement>, annotations: HA.Annotation[]) => {
    const { actions: { senseObject }, mapId } = this.props;

    for (const ann of annotations) {
      try {
        await senseObject.createCard(mapId, HA.toCardData(ann));
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.error('Fail to create card from annotation:', ann);
      }
    }

    // tslint:disable-next-line:no-console
    alert('匯入完畢');
  }

  render() {
    const { url, logs } = this.props;

    return (
      <Container text>
        <Header as="h1">Hypothesis Annotation Importer</Header>
        <Form>
          <Form.Field>
            <Input
              action={{ icon: 'search', onClick: this.handleInputSubmit }}
              placeholder="文章地址"
              value={url}
              onChange={this.handleInputChange}
            />
          </Form.Field>
        </Form>
        <Divider />
        <List verticalAlign="middle">
          {map(log => <ImportedItem {...log} onImport={this.handleImport} />, logs)}
        </List>
      </Container>
    );
  }
}

export default connect<StateFromProps, ActionProps>(
  (state: State) => {
    const { map: mapId } = state.senseMap;
    const { url, logs } = state.importer;
    return { mapId, url, logs };
  },
  mapDispatch({ actions })
)(ImportPage);
