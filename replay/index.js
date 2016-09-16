import './styles/main.css';
import React from 'react';
import {render} from 'react-dom';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import {Provider} from 'react-redux';
import { fromJS } from 'immutable';

import {createStore, applyMiddleware} from 'redux';
import reducers from './redux/index';

import Root from './components/root';

import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

chrome.storage.sync.get(state => {

    if (state) {
        state = {
            configuration: state.configuration && fromJS(state.configuration),
            override: state.override && fromJS(state.override)
        }
    }

    const store = createStore(reducers,
        state || {},
        applyMiddleware(thunk, createLogger()));

    store.subscribe(() => {
        let state = store.getState();
        let override = {};
        if (state.override) {
            state.override.forEach((value, key) => {
                let newValue = value.toObject();
                newValue.file = undefined;
                override[key] = newValue;
            });
        }
        chrome.storage.sync.set({
            configuration: state.configuration && state.configuration.toJS(),
            override: override
        });
    });

    render((
        <Provider store={store}>
            <Root/>
        </Provider>
    ), document.getElementById('app'));
});
