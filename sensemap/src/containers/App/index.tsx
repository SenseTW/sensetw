import { connect } from 'react-redux';
import { State } from '../../types';
import * as A from '../../components/App';

export default connect<A.StateFromProps>(
    (state: State) => {
        return {
            checked: state.session.checked,
            authenticated: state.session.authenticated,
            user: state.session.user
        };
    }
)(A.App);