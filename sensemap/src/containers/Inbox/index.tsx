import { connect } from 'react-redux';
import * as T from '../../types';
import * as CO from '../../components/Inbox';

export default connect<CO.StateFromProps, CO.DispatchFromProps, CO.OwnProps>(
  (state: T.State) => {
    const allCards = Array(...Object.values(state.senseObject.cards))
      .sort((a, b) => b.updatedAt - a.updatedAt);
    const pageLimit = 16;
    const pager = {
      pageLimit,
      totalEntries: allCards.length,
      currentPage: 0,
    };
    const cards = allCards.slice(
      pager.currentPage * pager.pageLimit,
      (pager.currentPage + 1 ) * pager.pageLimit
    );
    return { cards, pager };
  },
  (dispatch: T.Dispatch) => ({
  })
)(CO.Inbox);
