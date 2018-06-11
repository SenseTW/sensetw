import { connect } from 'react-redux';
import { State, actions, ActionProps, mapDispatch } from '../../types';
import * as CS from '../../types/cached-storage';
import * as CO from '../../components/Inbox';

export default connect<CO.StateFromProps, ActionProps, CO.OwnProps>(
  (state: State) => {
    const cards = Array(...Object.values(CS.toStorage(state.senseObject).cards))
      .sort((a, b) => b.updatedAt - a.updatedAt);
    return {
      cards,
      senseMap: state.senseMap,
    };
  },
  mapDispatch({ actions }),
)(CO.Inbox);
