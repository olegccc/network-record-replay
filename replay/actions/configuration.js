import Proxy from '../utilities/proxy';
import * as ProxyOverride from '../utilities/proxyOverride';
import * as StatusActions from './status';
import selectFile from '../utilities/selectFile';
import StringBuffer from '../utilities/stringBuffer';

export const CONFIGURATION_TOGGLE_PROXY = 'CONFIGURATION_TOGGLE_PROXY';
export const CONFIGURATION_TOGGLE_DELAYS = 'CONFIGURATION_TOGGLE_DELAYS';
export const CONFIGURATION_TOGGLE_OVERRIDE = 'CONFIGURATION_TOGGLE_OVERRIDE';
export const CONFIGURATION_STARTED = 'CONFIGURATION_STARTED';
export const CONFIGURATION_STOPPED = 'CONFIGURATION_STOPPED';
export const CONFIGURATION_TOGGLE_REPLACE_HTTPS = 'CONFIGURATION_TOGGLE_REPLACE_HTTPS';
export const CONFIGURATION_URL_LIST = 'CONFIGURATION_URL_LIST';

export function toggleOverrideProxy() {
    return dispatch => {
        dispatch({
            type: CONFIGURATION_TOGGLE_PROXY
        });
    };
}

export function toggleUseDelays() {
    return dispatch => {
        dispatch({
            type: CONFIGURATION_TOGGLE_DELAYS
        });
    };
}

export function toggleReplaceHttps() {
    return dispatch => {
        dispatch({
            type: CONFIGURATION_TOGGLE_REPLACE_HTTPS
        });
    };
}

export function toggleOverrideMode() {
    return async(dispatch, getState) => {
        await dispatch({
            type: CONFIGURATION_TOGGLE_OVERRIDE
        });
        let enabled = getState().configuration.get('overrideMode');
        onOverrideChanged(enabled ? getState().override : null);
    }
}

export function onOverrideChanged(override) {
    if (proxy) {
        proxy.replaceOverride(override);
    }
    return {
        type: 'UNHANDLED'
    };
}

let proxy = null;

export function startProxy() {

    return async(dispatch, getState) => {

        try {
            const { configuration, override } = getState();

            const overrideProxy = configuration.get('overrideProxy');

            let file = await selectFile('json');
            let body = StringBuffer.uint8ToString(new Uint8Array(file.body));
            body = JSON.parse(body);

            proxy = new Proxy({
                history: body.history,
                replaceHttps: configuration.get('replaceHttps'),
                handlePayload: {},
                useDelays: configuration.get('useDelays'),
                override
            });

            dispatch({
                type: CONFIGURATION_URL_LIST,
                list: proxy.getUrls()
            });

            const portNumber = await proxy.start();

            if (overrideProxy) {
                await ProxyOverride.setOverride(portNumber);
            }

            dispatch({
                type: CONFIGURATION_STARTED,
                portNumber
            });

            dispatch(StatusActions.setStatusMessage('Serving proxy at 127.0.0.1:' + portNumber + ', file: ' + file.path));
            dispatch(StatusActions.setStatusPages(body.pages));

        } catch (error) {
            dispatch(StatusActions.setStatusMessage(error));
        }
    };
}

export function stopProxy() {
    return async(dispatch, getState) => {

        const { configuration } = getState();

        const overrideProxy = configuration.get('overrideProxy');

        proxy.stop();
        proxy = null;

        if (overrideProxy) {
            await ProxyOverride.clearOverride();
        }

        dispatch({
            type: CONFIGURATION_STOPPED
        });

        dispatch(StatusActions.setStatusMessage('Stopped'));
        dispatch(StatusActions.setStatusPages([]));
    }
}
