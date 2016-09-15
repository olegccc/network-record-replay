export const STATUS_MESSAGE = 'STATUS_MESSAGE';

export function setStatusMessage(text) {
    return dispatch => {
        dispatch({
            type: STATUS_MESSAGE,
            message: text
        });
    }
}
