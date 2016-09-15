import React from 'react';

import Configuration from './configuration';
import Manage from './manage';
import Status from './status';
import Pages from './pages';
import OverrideList from './overrideList';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {connect} from 'react-redux';

const Root = ({overrideMode}) => {
    return (
        <MuiThemeProvider>
            <div className="root">
                <Configuration/>
                <Manage/>
                <Status/>
                <Pages/>
                { overrideMode ? <OverrideList/> : ''}
            </div>
        </MuiThemeProvider>
    );
};

const mapStateToProps = (state) => {
    return {
        overrideMode: state.configuration.get('overrideMode')
    };
};

export default connect(mapStateToProps)(Root);
