import { Map, List } from 'immutable';
import * as ConfigurationActions from '../actions/configuration';

const defaultState = new Map({
    overrideProxy: true,
    running: false,
    useDelays: false,
    replaceHttps: true,
    overrideMode: false,
    urls: new List([])
});

function configurationReducer(state = defaultState, action) {

    switch (action.type) {
        case ConfigurationActions.CONFIGURATION_TOGGLE_PROXY:
            return state.set('overrideProxy', !state.get('overrideProxy'));
        case ConfigurationActions.CONFIGURATION_STARTED:
            return state.set('running', true);
        case ConfigurationActions.CONFIGURATION_STOPPED:
            return state
                .set('running', false)
                .set('urls', new List([]));
        case ConfigurationActions.CONFIGURATION_TOGGLE_REPLACE_HTTPS:
            return state.set('replaceHttps', !state.get('replaceHttps'));
        case ConfigurationActions.CONFIGURATION_TOGGLE_OVERRIDE:
            return state.set('overrideMode', !state.get('overrideMode'));
        case ConfigurationActions.CONFIGURATION_URL_LIST:
            return state.set('urls', new List(action.list));
    }

    return state;
}

export default configurationReducer;
