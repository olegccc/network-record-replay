import React from 'react';

import Configuration from './configuration';
import Manage from './manage';
import Status from './status';
import OverrideList from './overrideList';

export default () => {
    return (
        <div>
            <Configuration/>
            <Manage/>
            <Status/>
            <OverrideList/>
        </div>
    );
};
