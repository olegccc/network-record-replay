import React from 'react';
import {connect} from 'react-redux';

const Status = ({message}) => {
    return (
        <div>
            {message}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        message: state.status
    };
};

export default connect(mapStateToProps)(Status);
