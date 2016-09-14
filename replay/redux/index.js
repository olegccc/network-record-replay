import { combineReducers } from 'redux';

import configuration from './configuration';
import override from './override';
import status from './status';

export default combineReducers({
    configuration,
    override,
    status
});
