import React from 'react';
import {ListItem} from 'material-ui/List';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import * as OverrideActions from '../actions/override';
import {connect} from 'react-redux';

const OverrideRecord = ({record, dispatch}) => {

    function selectFile() {
        dispatch(OverrideActions.overrideSelectFile(record.get('key')));
    }

    function getBodySize() {
        let file = record.get('file');
        return file ? '[' + (file.length || file.byteLength) + ' bytes]' : '[body not selected]';
    }

    function deleteRecord(event) {
        dispatch(OverrideActions.overrideDeleteFile(record.get('key')));
        event.stopPropagation();
    }

    let text = record.get('method')+' '+record.get('url') + ' ' + getBodySize();

    return (
        <ListItem primaryText={text} rightIcon={<DeleteIcon onTouchTap={deleteRecord.bind(null)}/>} onTouchTap={selectFile} />
    );
};

export default connect()(OverrideRecord);
