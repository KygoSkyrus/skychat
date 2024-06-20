import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { getAuth } from "firebase/auth";
import { collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";

// Components
import "./App.css";
import { NewRTCA } from "./components/NewRTCA";
import Authenticate from "./components/Authenticate";
import Error from "./components/Error"
import { SET_CURRENT_USER, SET_FIREBASE_APP, SET_USER_INFO } from "./redux/actionTypes";
import { Info } from "lucide-react";
import Toast from "./components/Toast";
import { fetchUserData } from "./redux/thunk/userDataThunk";
import { firebaseApp, db } from "./firebaseConfig";


function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const firebaseApp = firebase.initializeApp(firebaseConfig);
  const auth = getAuth();
  // const db = getFirestore(firebaseApp);



  // dispatch({ type: SET_FIREBASE_APP, payload: firebaseApp })// moved into useeffect

  
  useEffect(() => {
    dispatch({ type: SET_FIREBASE_APP, payload: firebaseApp })
    checkAuthStatus();
  }, [])

  async function checkAuthStatus() {
    await auth.onAuthStateChanged((user) => {
      // console.log('authstate changed NWRTC', user)
      if (user) {
        dispatch({ type: SET_CURRENT_USER, payload: user })
        navigate('/chat')

        //have to store the result of this query in cache 
        // getCurrentUserData(user.displayName);
        dispatch(fetchUserData(user.displayName,db));
      } else {
        dispatch({ type: SET_CURRENT_USER, payload: null })
        navigate('/')
      }
    });
  }

  /* // converted this function in thunk
  async function getCurrentUserData(username) {
    //when the connection is not found in cached data only then go further and query db to check if the connection is created recently
    let userObj;
    const q = query(collection(db, "users"), where("username", "==", username));

    //for getting real-time updates of user doc
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // console.log("UPDATED USER => ", doc.data());
        userObj = doc.data();
        userObj.id = doc.id
        // setUserData(userObj)
        dispatch({ type: SET_USER_INFO, payload: userObj })
      });
    });
    // console.log('USEROBJ------_________', userObj)

    return userObj;
  }
  */

  return (
    <div className="App">
      <div className="layer"></div>
      <>
        <Routes>
          <Route exact path="/" element={<Authenticate firebaseApp={firebaseApp} />} />
          <Route exact path="/chat" element={<NewRTCA firebaseApp={firebaseApp} />} />

          <Route exact path="*" element={<Error />} />
        </Routes>
        {/* <div className="body-bg"><span>SKYCHAT</span></div> */}
      </>

      <div className="info" >
        <Info className="" data-bs-toggle="dropdown" aria-expanded="false" />
        <div className="dropdown-menu p-2">
          <h4>SKYCHAT</h4>
          <p>info</p>
        </div>
      </div>
    </div>
  );
}


export default App;