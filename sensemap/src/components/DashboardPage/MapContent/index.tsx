import * as React from 'react';
import { connect } from 'react-redux';
import { State, actions, ActionProps, MapID, MapData, mapDispatch } from '../../../types';
import { Modal, Header, Button, Form, TextArea, Input, Radio } from 'semantic-ui-react';
import * as SM from '../../../types/sense/map';
import * as CS from '../../../types/cached-storage';
import './index.css';

interface StateFromProps {
  mid?: MapID;
  map?: MapData;
  isNew?: boolean;
  isDirty?: boolean;
}

type Props = StateFromProps & ActionProps;

class MapContent extends React.PureComponent<Props> {
  handleMapChange = (action: SM.Action) => {
    const { mid } = this.props;

    if (mid === undefined) {
      return;
    }

    const { actions: acts } = this.props;
    const oldMap = this.props.map as MapData;
    const map = SM.reducer(oldMap, action);

    acts.senseObject.updateMap(map);
  }

  render() {
    const { mid } = this.props;

    if (mid === undefined) {
      return false;
    }

    const { actions: acts, map, isNew, isDirty } = this.props;
    const disabled = !isNew && !isDirty;

    return (
      <Modal
        size="tiny"
        open={!!mid}
      >
        <Header>{isNew ? '新增 Map' : '編輯 Map'}</Header>
        <Modal.Content>
          <Form>
            <Form.Field className="map-content__name">
              <label>Map Name</label>
              <Input
                placeholder="my wonderful map"
                value={map && map.name}
                onChange={e => this.handleMapChange(SM.updateName(e.currentTarget.value))}
              />
            </Form.Field>
            <Form.Field className="map-content__description">
              <label>Map Description</label>
              <TextArea
                placeholder="This is my wonderful map."
                value={map && map.description}
                onChange={e => this.handleMapChange(SM.updateDescription(e.currentTarget.value))}
              />
            </Form.Field>
            <Form.Field className="map-content__tags">
              <label>Tag</label>
              <Input
                placeholder="Tag, tag"
                value={map && map.tags}
                onChange={e => this.handleMapChange(SM.updateTags(e.currentTarget.value))}
              />
            </Form.Field>
            <Form.Field className="map-content__type">
              <label>Type</label>
              <Radio
                label="Public"
                name="mapType"
                value={SM.MapType.PUBLIC}
                checked={map && map.type === SM.MapType.PUBLIC}
                onChange={() => this.handleMapChange(SM.updateType(SM.MapType.PUBLIC))}
              />
              <Radio
                label="Private"
                name="mapType"
                value={SM.MapType.PRIVATE}
                checked={map && map.type === SM.MapType.PRIVATE}
                onChange={() => this.handleMapChange(SM.updateType(SM.MapType.PRIVATE))}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button.Group>
            <Button
              onClick={() => {
                if (map) {
                  acts.cachedStorage.removeMap(map);
                }
                acts.editor.focusMap();
              }}
            >
              取消
            </Button>
            <Button.Or />
            <Button
              positive
              disabled={disabled}
              onClick={async () => {
                if (map) {
                  if (isNew) {
                    await acts.senseObject.createMap(map);
                  } else if (isDirty) {
                    await acts.senseObject.saveMap(map);
                  }
                }
                acts.editor.focusMap();
              }}
            >
              {isNew ? '送出' : '儲存'}
            </Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default connect<StateFromProps, ActionProps>(
  (state: State) => {
    const { map: mid } = state.editor;
    if (mid === undefined) { return {}; }

    const { senseObject } = state;
    const map = CS.getMap(senseObject, mid);
    const isNew = CS.isMapNew(senseObject, mid);
    const isDirty = CS.isMapDirty(senseObject, mid);

    return { mid, map, isNew, isDirty };
  },
  mapDispatch({ actions })
)(MapContent);