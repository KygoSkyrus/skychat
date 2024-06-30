import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';

import App from './App';
import store from './redux/store';
import { FirebaseProvider } from './firebaseContext';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <FirebaseProvider>
        <Provider store={store}>
          <App/>
        </Provider>
      </FirebaseProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);