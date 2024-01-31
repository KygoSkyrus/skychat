import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { Provider } from 'react-redux';

import App from './App';
import store from './redux/store';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

const firebaseApp = initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App firebaseApp={firebaseApp}/>
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);