import React from 'react';
import OverrideEditor from './overrideEditor';
import {List} from 'material-ui/List';
import {connect} from 'react-redux';
import OverrideRecord from './overrideRecord';
import Section from './section';

const OverrideList = ({records}) => {
    return (
        <Section header="Edit Responses">
            <OverrideEditor/>
            <List>
                { records.toList().map(record => <OverrideRecord key={record.get('key')} record={record} />)}
            </List>
        </Section>
    );
};

const mapStateToProps = (state) => {
    return {
        records: state.override
    };
};

export default connect(mapStateToProps)(OverrideList);
