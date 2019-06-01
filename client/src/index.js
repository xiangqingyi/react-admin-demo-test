import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import * as serviceWorker from './serviceWorker';
import Reducer from './reducer';
const configureStore = () => {
    const store = createStore(Reducer);
    if (module.hot) {
        module.hot.accept('./reducer', () => {
            const nextRootReducer = require('./reducer/index');
            store.replaceReducer(nextRootReducer);
        })
    }
    return store;
}
const store = configureStore();


ReactDOM.render(
    <Provider store={store}><App /></Provider>, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
