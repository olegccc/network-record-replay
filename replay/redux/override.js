import { List } from 'immutable';

const defaultState = List([]);

function overrideReducer(state = defaultState, action) {

    switch(action.type) {

    }

    return state;
}

export default overrideReducer;
