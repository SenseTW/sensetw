import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, Label, Button, Icon, Dropdown, Popup } from 'semantic-ui-react';
import { DropdownProps } from 'semantic-ui-react/src/modules/Dropdown';
import { DropdownItemProps } from 'semantic-ui-react/src/modules/Dropdown/DropdownItem';
import * as R from '../../../types/routes';
import * as SM from '../../../types/sense/map';
import * as U from '../../../types/utils';
import * as moment from 'moment';
import './index.css';

const POPUP_DELAY = 500;

interface Props {
  disabled?: boolean;
  id?: string;
  data: SM.MapData;
  onShare?(url: string): void;
  onEdit?(map: SM.MapData): void;
  onRemove?(map: SM.MapData): void;
}

interface State {
  copied: boolean;
}

enum MapActionType {
  SHOW_MEMBER = 'SHOW_MEMBER',
  EDIT        = 'EDIT',
  REMOVE      = 'REMOVE',
  // TODO: member system
  LEAVE       = 'LEAVE',
}

class MapCard extends React.Component<Props, State> {
  state = {
    copied: false,
  };

  handleShare = () => {
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), POPUP_DELAY);
  }

  render() {
    const {
      disabled = false,
      id,
      data,
      onShare = U.noop,
      onEdit = U.noop,
      onRemove = U.noop,
    } = this.props;
    const { copied } = this.state;
    const mapUrl = R.toMapPath({ mid: data.id });
    const formattedTime = moment(data.updatedAt).format(U.TIME_FORMAT);
    const timeHint = data.createdAt === data.updatedAt
      ? `created at ${formattedTime}`
      : `updated at ${formattedTime}`;
    const dropdownOptions: DropdownItemProps[] = [{
    /*
      key: 0,
      disabled: true,
      text: 'member',
      value: MapActionType.SHOW_MEMBER,
    }, {
    */
      key: 1,
      disabled,
      text: 'edit detail',
      value: MapActionType.EDIT,
    }, {
      key: 2,
      disabled: disabled || true,
      text: 'delete',
      value: MapActionType.REMOVE,
    }];

    return (
      <Card id={id} className="map-card">
        <Card.Content className="map-card__header">
          <Card.Header title={timeHint}>
            <Icon float="left" name={data.type === SM.MapType.PUBLIC ? 'globe' : 'lock'} />
            Owned by <span className="map-card__username">{data.owner.username}</span>
          </Card.Header>
        </Card.Content>
        <Image as={Link} to={mapUrl} src={data.image || 'https://picsum.photos/360/200'} />
        <Card.Content extra className="map-card__content">
          {
            data.name &&
            <Card.Header title={timeHint} as={Link} to={mapUrl}>{data.name}</Card.Header>
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
            <Button as={Link} to={mapUrl}>enter</Button>
            <Popup
              inverted
              open={copied}
              position="top center"
              trigger={
                <Button
                  onClick={() => {
                    const fullUrl =
                      location.protocol + '//' + location.hostname + ':' + location.port + mapUrl;
                    onShare(fullUrl);
                    this.handleShare();
                  }}
                >
                    share
                </Button>
              }
              content="URL copied!"
            />
          </Button.Group>
          <Dropdown
            icon="ellipsis horizontal"
            pointing="bottom left"
            options={dropdownOptions}
            // tslint:disable-next-line:no-any
            onChange={(event: any, item: DropdownProps) => {
              switch (item.value) {
                case MapActionType.EDIT:
                  onEdit(data);
                  break;
                case MapActionType.REMOVE:
                  onRemove(data);
                  break;
                default:
              }
            }}
          />
        </Card.Content>
      </Card>
    );
  }
}

export default MapCard;
