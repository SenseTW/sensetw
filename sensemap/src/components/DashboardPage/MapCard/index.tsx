import * as React from 'react';
import { Prompt, Link, matchPath } from 'react-router-dom';
import { Card, Image, Label, Button, Icon, Dropdown, Modal, Header } from 'semantic-ui-react';
import * as R from '../../../types/routes';
import * as SM from '../../../types/sense/map';
import * as U from '../../../types/utils';
import './index.css';

interface Props {
  id?: string;
  currentMap?: SM.MapID;
  isMapClean?: boolean;
  data: SM.MapData;
  onEdit?(): void;
}

interface State {
  modalOpen: boolean;
}

enum MapActionType {
  SHOW_MEMBER = 'SHOW_MEMBER',
  EDIT = 'EDIT',
  LEAVE = 'LEAVE',
}

interface DropdownItemProps {
  key?: number;
  text: string;
  value: MapActionType;
}

const dropdownOptions: DropdownItemProps[] = [{
  key: 0,
  text: 'member',
  value: MapActionType.SHOW_MEMBER,
}, {
  key: 1,
  text: 'edit detail',
  value: MapActionType.EDIT,
}, {
  key: 2,
  text: 'leave map',
  value: MapActionType.LEAVE,
}];

class MapCard extends React.Component<Props, State> {
  state: State = {
    modalOpen: false,
  };

  render() {
    const { id, currentMap, isMapClean, data, onEdit = U.noop } = this.props;
    const { modalOpen } = this.state;

    return (
      <Card id={id} className="map-card">
        <Card.Content className="map-card__header">
          <Card.Header>
            <Icon float="left" name={data.type === SM.MapType.PUBLIC ? 'globe' : 'lock'} />
            Owned by <span className="map-card__username">Ael</span>
          </Card.Header>
        </Card.Content>
        <Image src={data.image || 'https://picsum.photos/360/200'} />
        <Card.Content extra className="map-card__content">
          {
            data.name &&
            <Card.Header>{data.name}</Card.Header>
          }
          {
            data.description &&
            <Card.Description>{data.description}</Card.Description>
          }
          {
            data.tags &&
            <Card.Meta className="map-card__tags">
              {U.toTags(data.tags).map((t, i) => <Label key={i}>{t}</Label>)}
            </Card.Meta>
          }
        </Card.Content>
        <Card.Content extra className="map-card__actions">
          <Button.Group widths={2}>
            <Button as={Link} to={R.toMapPath({ mid: data.id })}>enter</Button>
            <Button disabled>share</Button>
          </Button.Group>
          <Dropdown
            icon="ellipsis horizontal"
            pointing="bottom left"
            options={dropdownOptions}
            // tslint:disable-next-line:no-any
            onChange={(event: any, item: DropdownItemProps) => {
              if (item.value === MapActionType.EDIT) {
                onEdit();
              }
            }}
          />
        </Card.Content>

        <Prompt
          when={!modalOpen && !isMapClean}
          message={location => {
            const match = matchPath<{ mid: SM.MapID }>(
              location.pathname,
              { path: R.map, exact: true }
            );

            if (match) {
              const { params: { mid } } = match;
              if (mid !== currentMap) {
                // stop transition to the new map
                this.setState({ modalOpen: true });
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
            <Button primary as={Link} to={R.toMapPath({ mid: data.id })}>繼續</Button>
          </Modal.Actions>
        </Modal>
      </Card>
    );
  }
}

export default MapCard;