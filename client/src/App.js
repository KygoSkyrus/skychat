import React from "react";
import { Routes, Route } from "react-router-dom";


// import firebase from "firebase/compat/app";
import { initializeApp } from 'firebase/app';

// Components
import "./App.css";
import { NewRTCA } from "./components/NewRTCA";
import Authenticate from "./components/Authenticate";
import Error from "./components/Error"
import { firebaseConfig } from "./firebaseConfig";



function App() {

  // const firebaseApp = firebase.initializeApp(firebaseConfig);
  const firebaseApp = initializeApp(firebaseConfig);

  return (
    <div className="App">
      <>
        <Routes>
          <Route exact path="/" element={<Authenticate firebaseApp={firebaseApp} />} />
          <Route exact path="/chat" element={<NewRTCA firebaseApp={firebaseApp}/>} />

          <Route exact path="*" element={<Error />} />
        </Routes>
      </>
    </div>
  );
}


export default App;