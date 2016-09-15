import * as StatusActions from '../actions/status';

const defaultState = "";

function statusReducer(state = defaultState, action) {

    switch(action.type) {
        case StatusActions.STATUS_MESSAGE:
            return action.message || '';
    }

    return state;
}

export default statusReducer;
