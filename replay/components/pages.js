import React from 'react';
import {connect} from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import * as StatusActions from '../actions/status';
import ContentCopyIcon from 'material-ui/svg-icons/content/content-copy';
import Section from './section';
import Proxy from '../utilities/proxy';

function copyTextToClipboard(text) {

    var textArea = document.createElement("textarea");

    textArea.style = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '2em',
        height: '2em',
        padding: 0,
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        background: 'transparent',
        opacity: 0
    };

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

const Pages = ({pages, replaceHttps}) => {

    function copyPage(page, event) {
        if (replaceHttps) {
            page = Proxy.replaceHttps(page);
        }
        copyTextToClipboard(page);
        event.stopPropagation();
    }

    function showPage(page) {
        if (replaceHttps) {
            page = Proxy.replaceHttps(page);
        }
        StatusActions.showPage(page);
    }

    if (!pages.length) {
        return null;
    }

    return (
        <Section header="Pages" className="pages">
            <List>
                { pages.map(page =>
                    <ListItem key={page}
                              onTouchTap={showPage.bind(null, page)}
                              rightIcon={<ContentCopyIcon onTouchTap={copyPage.bind(null, page)} />}
                    ><div className="page">{page}</div></ListItem>
                )}
            </List>
        </Section>
    );
};

const mapStateToProps = (state) => {
    return {
        pages:  state.status.get('pages'),
        replaceHttps: state.configuration.get('replaceHttps'),
    };
};

export default connect(mapStateToProps)(Pages);
