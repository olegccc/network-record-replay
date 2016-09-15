import React from 'react';
import {connect} from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import * as StatusActions from '../actions/status';
import ContentCopyIcon from 'material-ui/svg-icons/content/content-copy';

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
}

const Status = ({message, pages}) => {

    function copyPage(page, event) {
        copyTextToClipboard(page);
        event.stopPropagation();
    }

    return (
        <div>
            <div className="message">
                {message}
            </div>
            {
                pages.length ?
                    <div className="pages">
                        <div>Available pages:</div>
                        <List>
                        { pages.map(page =>
                            <ListItem key={page}
                                      onTouchTap={StatusActions.showPage.bind(null, page)}
                                      rightIcon={<ContentCopyIcon onTouchTap={copyPage.bind(null, page)} />}
                            >{page}</ListItem>
                        )}
                        </List>
                    </div>
                    : ''
            }
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        message: state.status.get('message'),
        pages:  state.status.get('pages')
    };
};

export default connect(mapStateToProps)(Status);
