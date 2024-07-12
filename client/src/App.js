import React, { useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";

import { FirebaseContext } from "./firebaseContext";
import { setUserData } from "./redux/thunk/userDataThunk";
import { SET_CURRENT_USER, SET_USERS_LIST } from "./redux/actionTypes";

import "./App.css";
import RTCA from "./components/RTCA";
import Authenticate from "./components/Authenticate";
import About from "./components/About";
import Toast from "./components/Toast";
import Error from "./components/Error"
import withSplashScreen from "./components/withSplashScreen";
import { getUsersList } from "./utils";


function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();
  const { db } = useContext(FirebaseContext);

  useEffect(() => {
    checkAuthStatus();
  }, [])

  async function checkAuthStatus() {
    await auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userFound = await dispatch(setUserData(user?.displayName, db))
          const userList = await getUsersList(db);
          dispatch({ type: SET_USERS_LIST, payload: userList });

          if (userFound) {
            dispatch({ type: SET_CURRENT_USER, payload: user })
            navigate('/chat')
          } else {
            navigate('/')
          }
        } catch (error) {
          console.error('An error occurred:', error);
          dispatch({ type: SET_CURRENT_USER, payload: null });
          navigate('/');
        }
      } else {
        dispatch({ type: SET_CURRENT_USER, payload: null })
        navigate('/')
      }
    });
  }

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Authenticate />} />
        <Route exact path="/chat" element={<RTCA />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="*" element={<Error />} />
      </Routes>
      <Toast />
    </div>
  );
}

export default withSplashScreen(App);