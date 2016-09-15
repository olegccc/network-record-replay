import React from 'react';

import Configuration from './configuration';
import Manage from './manage';
import Status from './status';
import OverrideList from './overrideList';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';

export default () => {
    return (
        <MuiThemeProvider>
            <div className="root">
                <Configuration/>
                <Divider/>
                <Manage/>
                <Divider/>
                <Status/>
                <OverrideList/>
            </div>
        </MuiThemeProvider>
    );
};
