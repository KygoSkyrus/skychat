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
import { useDispatch } from "react-redux";
import { SET_FIREBASE_APP } from "./redux/actionTypes";



function App() {

  const dispatch=useDispatch()

  // const firebaseApp = firebase.initializeApp(firebaseConfig);
  const firebaseApp = initializeApp(firebaseConfig);
  dispatch({ type: SET_FIREBASE_APP, payload: firebaseApp })



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