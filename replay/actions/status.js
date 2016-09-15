export const STATUS_MESSAGE = 'STATUS_MESSAGE';
export const STATUS_PAGES = 'STATUS_PAGES';

export function setStatusMessage(text) {
    return dispatch => {
        dispatch({
            type: STATUS_MESSAGE,
            message: text
        });
    };
}

export function setStatusPages(pages) {
    return dispatch => {
        dispatch({
            type: STATUS_PAGES,
            pages: pages
        });
    };
}

export function showPage(page) {
    window.open(page, '_blank');
}