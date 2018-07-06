import * as React from 'react';
import { connect } from 'react-redux';
import { Prompt, Link, matchPath } from 'react-router-dom';
import { State, ActionProps, actions, mapDispatch, MapID } from '../../types';
import MapCard from './MapCard';
import FloatingActionButton from './FloatingActionButton';
import MapContent from './MapContent';
import { Container, Search, Card, Modal, Header, Button } from 'semantic-ui-react';
import * as SM from '../../types/sense/map';
import * as CS from '../../types/cached-storage';
import * as R from '../../types/routes';
import * as U from '../../types/utils';
import './index.css';

interface StateFromProps {
  senseObject: CS.CachedStorage;
  map: MapID;
}

interface OwnProps {}

type Props = OwnProps & StateFromProps & ActionProps;

interface OwnState {
  modalOpen: boolean;
  mid: MapID;
}

class DashboardPage extends React.Component<Props, OwnState> {
  state: OwnState = {
    modalOpen: false,
    mid: '0',
  };

  componentDidMount() {
    const { actions: acts } = this.props;
    acts.senseObject.loadMaps();
  }

  render() {
    const { actions: acts, senseObject, map } = this.props;
    const { modalOpen, mid } = this.state;
    const maps = CS.toStorage(senseObject).maps;
    const isClean = CS.isClean(senseObject);

    return (
      <div className="dashboard-page">
        <Container>
          <Search disabled />
          <Card.Group stackable itemsPerRow={3}>
            {Object.values(maps).sort((a, b) => b.createdAt - a.createdAt).map(
              (m) =>
                <MapCard
                  key={m.id}
                  data={m}
                  onEdit={() => acts.editor.focusMap(m.id)}
                  onRemove={() => acts.senseObject.removeMap(m.id)}
                />
            )}
          </Card.Group>
          <FloatingActionButton
            onClick={() => {
              const newMap = SM.mapData({ id: U.objectId() });
              acts.senseObject.updateMap(newMap);
              acts.editor.focusMap(newMap.id);
            }}
          />

          <Prompt
            when={!modalOpen && !isClean}
            message={location => {
              const match = matchPath<{ mid: SM.MapID }>(
                location.pathname,
                { path: R.map, exact: true }
              );

              if (match) {
                const { params } = match;
                if (params.mid !== map) {
                  // stop transition to the new map
                  this.setState({ modalOpen: true, mid: params.mid });
                  return false;
                }
              }

              return true;
            }}
          />

          <Modal
            closeOnDocumentClick
            size="tiny"
            open={modalOpen}
            onClose={() => this.setState({ modalOpen: false })}
          >
            <Header>切換 Map</Header>
            <Modal.Content>
              切換 Map 將拋棄所有未儲存的修改，您要繼續嗎？
            </Modal.Content>
            <Modal.Actions>
              <Button primary as={Link} to={R.toMapPath({ mid })}>繼續</Button>
            </Modal.Actions>
          </Modal>
          <MapContent />
        </Container>
      </div>
    );
  }
}

export default connect(
  (state: State) => {
    const { senseObject, senseMap } = state;
    return { senseObject, map: senseMap.map };
  },
  mapDispatch({ actions })
)(DashboardPage);