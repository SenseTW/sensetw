import * as React from 'react';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import * as T from '../../types';
import * as SL from '../../types/selection';
import * as SO from '../../types/sense-object';
import * as OE from '../../types/object-editor';

interface StateFromProps {
  selection: SL.State;
}

interface DispatchFromProps {
  actions: {
    selectObject: typeof OE.actions.selectObject
  };
}

type Props = StateFromProps & DispatchFromProps;

class ObjectMenu extends React.PureComponent<Props> {
  render() {
    const { actions, selection } = this.props;

    return (
      <Menu vertical>
        <Menu.Item>{
          selection.length === 0
            ? '功能選單'
            : `選取了 ${selection.length} 張卡片`
        }</Menu.Item>
        <Menu.Item
          name="edit"
          disabled={selection.length !== 1}
          onClick={() => actions.selectObject(selection[0])}
        >
          編輯
        </Menu.Item>
        <Menu.Item
          name="close"
          onClick={() => actions.selectObject(null)}
        >
          關閉
        </Menu.Item>
      </Menu>
    );
  }
}

export default connect(
  (state: T.State) => ({ selection: state.selection }),
  (dispatch: T.Dispatch) => ({
    actions: {
      selectObject: (id: SO.ObjectID | null) => dispatch(T.actions.editor.selectObject(id))
    }
  })
)(ObjectMenu);