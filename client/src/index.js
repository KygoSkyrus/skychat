import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { Provider } from 'react-redux';

import App from './App';
import store from './redux/store';
// import { initializeApp } from 'firebase/app';
// import { firebaseConfig } from './firebaseConfig';

// const firebaseApp = initializeApp(firebaseConfig);


import { FirebaseProvider } from './firebaseContext';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <FirebaseProvider>
        <Provider store={store}>
          <App
          // firebaseApp={firebaseApp}
          />
        </Provider>
      </FirebaseProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);