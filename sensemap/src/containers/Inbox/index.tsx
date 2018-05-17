import { connect } from 'react-redux';
import * as T from '../../types';
import * as CO from '../../components/Inbox';

export default connect<CO.StateFromProps, CO.DispatchFromProps, CO.OwnProps>(
  (state: T.State) => {
    const cards = Array(...Object.values(state.senseObject.cards))
      .sort((a, b) => b.updatedAt - a.updatedAt);
    return { cards };
  },
  (dispatch: T.Dispatch) => ({
  })
)(CO.Inbox);
