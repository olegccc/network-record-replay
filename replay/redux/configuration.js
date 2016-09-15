import { Map } from 'immutable';
import * as ConfigurationActions from '../actions/configuration';

const defaultState = new Map({
    overrideProxy: true,
    running: false,
    useDelays: false,
    replaceHttps: true
});

function configurationReducer(state = defaultState, action) {

    switch (action.type) {
        case ConfigurationActions.CONFIGURATION_TOGGLE_PROXY:
            return state.set('overrideProxy', !state.get('overrideProxy'));
        case ConfigurationActions.CONFIGURATION_STARTED:
            return state.set('running', true);
        case ConfigurationActions.CONFIGURATION_STOPPED:
            return state.set('running', false);
        case ConfigurationActions.CONFIGURATION_TOGGLE_REPLACE_HTTPS:
            return state.set('replaceHttps', !state.get('replaceHttps'));
    }

    return state;
}

export default configurationReducer;
