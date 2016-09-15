import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import {connect} from 'react-redux';
import * as ConfigurationActions from '../actions/configuration';
import Section from './section';

const Manage = ({ running, overrideMode, dispatch }) => {

    function startProxy() {
        dispatch(ConfigurationActions.startProxy());
    }

    function stopProxy() {
        dispatch(ConfigurationActions.stopProxy());
    }

    function toggleOverride() {
        dispatch(ConfigurationActions.toggleOverrideMode());
    }

    return (
        <Section className="manage" header="Manage">
            <RaisedButton label="Start" primary={true} disabled={running} onTouchTap={startProxy} />
            <RaisedButton label="Stop" primary={true} disabled={!running} onTouchTap={stopProxy} />
            <div>
                <Toggle label="Edit Responses" onTouchTap={toggleOverride} toggled={overrideMode} labelPosition="right" />
            </div>
        </Section>
    );
};

const mapStateToProps = (state) => {
    return {
        running: state.configuration.get('running'),
        overrideMode: state.configuration.get('overrideMode')
    };
};

export default connect(mapStateToProps)(Manage);
