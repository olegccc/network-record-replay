import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {connect} from 'react-redux';
import * as ConfigurationActions from '../actions/configuration';

const Manage = ({ running, dispatch }) => {

    function startProxy() {
        dispatch(ConfigurationActions.startProxy());
    }

    function stopProxy() {
        dispatch(ConfigurationActions.stopProxy());
    }

    return (
        <div className="manage">
            <RaisedButton label="Start" primary={true} disabled={running} onTouchTap={startProxy} />
            <RaisedButton label="Stop" primary={true} disabled={!running} onTouchTap={stopProxy} />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        running: state.configuration.get('running')
    };
};

export default connect(mapStateToProps)(Manage);
