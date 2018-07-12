import * as React from 'react';
import { connect } from 'react-redux';
import { State, actions, ActionProps, mapDispatch } from '../../types';
import { Menu, Popup } from 'semantic-ui-react';
import Card from '../SVGIcon/Card';
import Box from '../SVGIcon/Box';
import Unbox from '../SVGIcon/Unbox';
import Inspector from '../SVGIcon/Inspector';
import Edge from '../SVGIcon/Edge';
import RemoveEdge from '../SVGIcon/RemoveEdge';
import * as T from '../../types';
import * as SL from '../../types/selection';
import * as SM from '../../types/sense-map';
import * as SO from '../../types/sense-object';
import * as OE from '../../types/object-editor';
import * as CS from '../../types/cached-storage';
import * as F from '../../types/sense/focus';
import * as U from '../../types/utils';
import { boxData } from '../../types/sense/box';
import './index.css';

interface StateFromProps {
  selection: SL.State;
  senseObject: SO.State;
  senseMap: SM.State;
  editor: OE.State;
}

interface OwnProps {}

type Props = StateFromProps & OwnProps & ActionProps;

class ObjectMenu2 extends React.PureComponent<Props> {
  canCreateBox(): boolean {
    return this.props.senseMap.scope.type === T.MapScopeType.FULL_MAP;
  }

  handleBox(): void {
    const { actions: acts } = this.props;
    const data = boxData({ id: U.objectId() });
    acts.senseObject.updateBox(data);
    acts.editor.focusObject(F.focusBox(data.id));
    acts.editor.changeStatus(OE.StatusType.SHOW);
  }

  canUnbox(): Boolean {
    return this.props.senseMap.scope.type === T.MapScopeType.BOX;
  }

  handleUnbox(): void {
    switch (this.props.senseMap.scope.type) {
      case T.MapScopeType.BOX: {
        const box = this.props.senseMap.scope.box;
        if (!box) {
          throw Error('Scope BOX without a box ID.');
        }
        this.props.actions.senseObject.unboxCards(box);
        break;
      }
      case T.MapScopeType.FULL_MAP:
      default:
    }
  }

  findEdgeID(from: T.ObjectID, to: T.ObjectID): T.EdgeID[] | null {
    const r = Object.values(CS.toStorage(this.props.senseObject).edges)
      .filter(edge => (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from))
      .map(edge => edge.id);
    return r.length === 0 ? null : r;
  }

  canCreateEdge(): boolean {
    return this.props.selection.length === 2
      && this.findEdgeID(this.props.selection[0], this.props.selection[1]) === null;
  }

  handleCreateEdge(): void {
    if (!this.canCreateEdge()) {
      return;
    }
    const map  = this.props.senseMap.map;
    const from = this.props.selection[0];
    const to   = this.props.selection[1];
    this.props.actions.senseObject.createEdge(map, from, to);
  }

  canRemoveEdge(): boolean {
    if (this.props.selection.length !== 2) {
      return false;
    }
    return this.findEdgeID(this.props.selection[0], this.props.selection[1]) !== null;
  }

  handleRemoveEdge(): void {
    const map  = this.props.senseMap.map;
    const from = this.props.selection[0];
    const to   = this.props.selection[1];
    const r    = this.findEdgeID(from, to);
    if (r === null) {
      return;
    }
    r.forEach(edge => this.props.actions.senseObject.removeEdge(map, edge));
  }

  render() {
    const { actions: acts, editor } = this.props;
    const canCreateBox = this.canCreateBox();
    const canUnbox = this.canUnbox();
    const isInspectorOpen = editor.status === OE.StatusType.SHOW;
    const canCreateEdge = this.canCreateEdge();
    const canRemoveEdge = this.canRemoveEdge();

    return (
      <div className="object-menu-2">
        <Menu inverted icon>
          <Popup
            inverted
            position="bottom center"
            trigger={<Menu.Item onClick={U.noop}><Card /></Menu.Item>}
            content="New Card"
          />
          <Popup
            inverted
            position="bottom center"
            trigger={
              <Menu.Item
                disabled={!canUnbox && !canCreateBox}
                onClick={() =>
                  canUnbox
                    ? this.handleUnbox()
                    : this.handleBox()
                }
              >
                {canUnbox ? <Unbox /> : <Box />}
              </Menu.Item>
            }
            content={
              canUnbox
                ? 'Unbox'
                : canCreateBox
                  ? 'New Box'
                  : 'Can\'t Create a Box in a Box'
            }
          />
          <Popup
            inverted
            position="bottom center"
            trigger={
              <Menu.Item
                active={isInspectorOpen}
                onClick={() =>
                  acts.editor.changeStatus(
                    isInspectorOpen
                      ? OE.StatusType.HIDE
                      : OE.StatusType.SHOW
                  )
                }
              >
                <Inspector />
              </Menu.Item>
            }
            content="Edit"
          />
          <Popup
            inverted
            position="bottom center"
            trigger={
              <Menu.Item
                disabled={!canRemoveEdge && !canCreateEdge}
                onClick={() =>
                  canRemoveEdge
                    ? this.handleRemoveEdge()
                    : this.handleCreateEdge()
                }
              >
                {canRemoveEdge ? <RemoveEdge /> : <Edge />}
              </Menu.Item>
            }
            content={
              canRemoveEdge
                ? 'Remove Edge'
                : canCreateEdge
                  ? 'Add Edge'
                  : 'Select Two Objects First'
            }
          />
        </Menu>
      </div>
    );
  }
}

export default connect<StateFromProps, ActionProps>(
  (state: State) => ({
    selection: state.selection,
    senseObject: state.senseObject,
    senseMap: state.senseMap,
    editor: state.editor,
  }),
  mapDispatch({ actions }),
)(ObjectMenu2);