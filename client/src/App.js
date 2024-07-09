import React, { useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";
import { collection, doc, onSnapshot } from "firebase/firestore";

import { FirebaseContext } from "./firebaseContext";
import { setUserData } from "./redux/thunk/userDataThunk";
import { SET_CURRENT_USER, SET_USERS_LIST } from "./redux/actionTypes";

import "./App.css";
import NewRTCA from "./components/NewRTCA";
import Authenticate from "./components/Authenticate";
import About from "./components/About";
import Toast from "./components/Toast";
import Error from "./components/Error"
import withSplashScreen from "./components/withSplashScreen";


function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();
  const { db } = useContext(FirebaseContext);

  useEffect(() => {
    checkAuthStatus();

    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      let userList = {};
      snapshot.docs.forEach((doc) => {
        userList[doc.data()?.username] = { ...doc.data(), id: doc.id };
      });
      console.log('ul', userList)
      dispatch({ type: SET_USERS_LIST, payload: userList });
    });

// console.log('cu',auth.currentUser)
//     const userId = auth.currentUser.uid;
//     const userDocRef =doc(db, "users", userId);
//     userDocRef.get().then((doc) => {
//       if (doc.exists) {
//         console.log("User data:", doc.data());
//       } else {
//         console.log("No such document!");
//       }
//     })

      return () => unsubscribe();
    }, [])

    async function checkAuthStatus() {
      await auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const userFound = await dispatch(setUserData(user?.displayName, db))
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
        <>
          <Routes>
            <Route exact path="/" element={<Authenticate />} />
            <Route exact path="/chat" element={<NewRTCA />} />
            <Route exact path="/about" element={<About />} />
            <Route exact path="*" element={<Error />} />
          </Routes>
          {/* <div className="body-bg fs-5"><span><b>SKYCHAT</b></span></div> */}
        </>
        <Toast />
      </div>
    );
  }

export default withSplashScreen(App);