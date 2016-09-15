import React from 'react';
import {connect} from 'react-redux';
import Section from './section';

const Status = ({message}) => {

    if (!message) {
        return null;
    }

    return (
        <Section header="Status" className="status">
            <div className="message">
                {message}
            </div>
        </Section>
    );
};

const mapStateToProps = (state) => {
    return {
        message: state.status.get('message'),
    };
};

export default connect(mapStateToProps)(Status);
