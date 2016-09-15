import { Map } from 'immutable';
import * as OverrideActions from '../actions/override';

const defaultState = Map();

function overrideReducer(state = defaultState, action) {

    switch(action.type) {
        case OverrideActions.OVERRIDE_ADD_ITEM:
            let key = action.method + ':' + action.url;
            return state.set(key, new Map({
                url: action.url,
                method: action.method,
                key
            }));
        case OverrideActions.OVERRIDE_SELECT_FILE:
            return state.update(action.key, record => record.set('file', action.file));
        case OverrideActions.OVERRIDE_DELETE_FILE:
            return state.delete(action.key);
    }

    return state;
}

export default overrideReducer;
