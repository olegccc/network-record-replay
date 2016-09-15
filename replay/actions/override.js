import selectFile from '../utilities/selectFile';
import * as ConfigurationActions from './configuration';

export const OVERRIDE_ADD_ITEM = 'OVERRIDE_ADD_ITEM';
export const OVERRIDE_SELECT_FILE = 'OVERRIDE_SELECT_FILE';
export const OVERRIDE_DELETE_FILE = 'OVERRIDE_DELETE_FILE';

export function overrideAddItem(method, url) {
    return async(dispatch, getState) => {
        await dispatch({
            type: OVERRIDE_ADD_ITEM,
            method,
            url
        });
        dispatch(ConfigurationActions.onOverrideChanged(getState().override));
    };
}

export function overrideSelectFile(key) {
    return async(dispatch, getState) => {

        let file = await selectFile();

        await dispatch({
            type: OVERRIDE_SELECT_FILE,
            key,
            file
        });

        dispatch(ConfigurationActions.onOverrideChanged(getState().override));
    };
}

export function overrideDeleteFile(key) {
    return async(dispatch, getState) => {
        await dispatch({
            type: OVERRIDE_DELETE_FILE,
            key
        });
        dispatch(ConfigurationActions.onOverrideChanged(getState().override));
    };
}
