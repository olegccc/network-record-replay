import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import {connect} from 'react-redux';
import Section from './section';
import * as ConfigurationActions from '../actions/configuration';

const Configuration = ({overrideProxy, replaceHttps, dispatch, disabled, useDelays}) => {

    function toggleOverrideProxy() {
        dispatch(ConfigurationActions.toggleOverrideProxy());
    }

    function toggleReplaceHttps() {
        dispatch(ConfigurationActions.toggleReplaceHttps());
    }

    function toggleUseDelays() {
        dispatch(ConfigurationActions.toggleUseDelays());
    }

    return (
        <Section header="Configuration">
            <Checkbox disabled={disabled} label="Override Proxy" checked={overrideProxy} onCheck={toggleOverrideProxy}/>
            <Checkbox disabled={disabled} label="Replace HTTPS in data and URLs" checked={replaceHttps} onCheck={toggleReplaceHttps}/>
            <Checkbox disabled={disabled} label="Replay delays" checked={useDelays} onCheck={toggleUseDelays} />
        </Section>
    );
};

const mapStateToProps = (state) => {
    return {
        overrideProxy: state.configuration.get('overrideProxy'),
        replaceHttps: state.configuration.get('replaceHttps'),
        useDelays: state.configuration.get('useDelays'),
        disabled: state.configuration.get('running')
    };
};

export default connect(mapStateToProps)(Configuration);
