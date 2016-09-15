import { Map } from 'immutable';
import * as StatusActions from '../actions/status';

const defaultState = new Map({
    message: '',
    pages: []
});

function statusReducer(state = defaultState, action) {

    switch(action.type) {
        case StatusActions.STATUS_MESSAGE:
            return state.set('message', action.message || '');
        case StatusActions.STATUS_PAGES:
            return state.set('pages', action.pages || []);
    }

    return state;
}

export default statusReducer;
