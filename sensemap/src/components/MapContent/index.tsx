import * as React from 'react';
import { connect } from 'react-redux';
import { State, actions, ActionProps, MapData, mapDispatch } from '../../types';
import { Modal, Header, Button, Form, TextArea, Input, Radio } from 'semantic-ui-react';
import * as SM from '../../types/sense/map';
import * as CS from '../../types/cached-storage';
import './index.css';

interface StateFromProps {
  map: MapData;
  authenticated: boolean;
  isNew: boolean;
  isDirty: boolean;
  isEditing: boolean;
}

type Props = StateFromProps & ActionProps;

class MapContent extends React.PureComponent<Props> {
  handleMapChange = (action: SM.Action) => {
    const { actions: acts } = this.props;
    const oldMap = this.props.map as MapData;
    const map = SM.reducer(oldMap, action);

    acts.senseObject.updateMap(map);
  }

  render() {
    const { actions: acts, map, authenticated, isNew, isDirty, isEditing } = this.props;
    const disabled = !(isNew && map && map.name) && !isDirty;
    const mode = isNew ? 'create-map' : 'map-details';

    return (
      <Modal
        size="tiny"
        open={isEditing}
      >
        <Header>{isNew ? 'Add Map' : 'Edit Map'}</Header>
        <Modal.Content>
          <Form>
            <Form.Field className="map-content__name">
              <label>Map Name (required)</label>
              <Input
                id={`sense-${mode}__map-name-input`}
                disabled={!authenticated}
                placeholder="my wonderful map"
                value={map && map.name}
                onChange={e => this.handleMapChange(SM.updateName(e.currentTarget.value))}
              />
            </Form.Field>
            <Form.Field className="map-content__description">
              <label>Map Description</label>
              <TextArea
                id={`sense-${mode}__map-description-input`}
                disabled={!authenticated}
                placeholder="This is my wonderful map."
                value={map && map.description}
                onChange={e => this.handleMapChange(SM.updateDescription(e.currentTarget.value))}
              />
            </Form.Field>
            <Form.Field className="map-content__tags">
              <label>Tag</label>
              <Input
                id={`sense-${mode}__map-tags-input`}
                disabled={!authenticated}
                placeholder="Tag, tag"
                value={map && map.tags}
                onChange={e => this.handleMapChange(SM.updateTags(e.currentTarget.value))}
              />
            </Form.Field>
            <Form.Field className="map-content__type">
              <label>Access Type</label>
              <Radio
                id={`sense-${mode}__map-type-public`}
                disabled={!authenticated}
                label="Public"
                name="mapType"
                value={SM.MapType.PUBLIC}
                checked={map && map.type === SM.MapType.PUBLIC}
                onChange={() => this.handleMapChange(SM.updateType(SM.MapType.PUBLIC))}
              />
              {/*
              <Radio
                id={`sense-${mode}__map-type-private`}
                label="Private"
                name="mapType"
                value={SM.MapType.PRIVATE}
                checked={map && map.type === SM.MapType.PRIVATE}
                onChange={() => this.handleMapChange(SM.updateType(SM.MapType.PRIVATE))}
              />
              */}
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button.Group>
            <Button
              id={`sense-${mode}__cancel-btn`}
              onClick={() => {
                if (map) {
                  acts.cachedStorage.removeMap(map);
                }
                acts.senseMap.toggleEditor(false);
              }}
            >
              Cancel
            </Button>
            <Button.Or />
            <Button
              positive
              id={`sense-${mode}__${isNew ? 'create' : 'update'}-btn`}
              disabled={disabled}
              onClick={async () => {
                if (map) {
                  if (isNew) {
                    await acts.senseObject.createMap(map);
                  } else if (isDirty) {
                    await acts.senseObject.saveMap(map);
                  }
                }
                acts.senseMap.toggleEditor(false);
              }}
            >
              {isNew ? 'Create' : 'Update'}
            </Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default connect<StateFromProps, ActionProps>(
  (state: State) => {
    const { senseObject, session: { authenticated } } = state;
    const { map: mid, isEditing } = state.senseMap;
    const map = CS.getMap(senseObject, mid);
    const isNew = CS.isMapNew(senseObject, mid);
    const isDirty = CS.isMapDirty(senseObject, mid);

    return { map, authenticated, isNew, isDirty, isEditing };
  },
  mapDispatch({ actions })
)(MapContent);
