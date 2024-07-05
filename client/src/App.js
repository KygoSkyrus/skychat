import React, { useContext, useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { getAuth } from "firebase/auth";
import { collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";

// Components
import "./App.css";
import { NewRTCA } from "./components/NewRTCA";
import Authenticate from "./components/Authenticate";
import Error from "./components/Error"
import { SET_CURRENT_USER, SET_FIREBASE_APP, SET_USERS_LIST, SET_USER_INFO } from "./redux/actionTypes";
import { Info } from "lucide-react";
import Toast from "./components/Toast";
import { setUserData } from "./redux/thunk/userDataThunk";
import { FirebaseContext } from "./firebaseContext";
import About from "./components/About";
import Loader from "./components/Loader";
import withSplashScreen from "./components/withSplashScreen";
import { dbUsers } from "./utils";
// import { firebaseApp, db } from "./firebaseConfig";


function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = getAuth();
  const { db } = useContext(FirebaseContext);


  useEffect(() => {
    checkAuthStatus();
    dispatch({ type: SET_USERS_LIST, payload: dbUsers })
    //uncomment this
    // const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
    //   console.log('+++++++++++++++++++++getAllUsersList',snapshot)
    //   let userList = {};
    //   snapshot.docs.forEach((doc) => {
    //     // let data = {...doc.data(),id:doc.id};
    //     userList[doc.data()?.username] = {...doc.data(),id:doc.id};
    //   });
    //   console.log('ul',userList)
    //   dispatch({ type: SET_USERS_LIST, payload: userList });
    // });

    // return () => unsubscribe();
  }, [])

  async function checkAuthStatus() {
    await auth.onAuthStateChanged(async (user) => {
      console.log('authstate changed NWRTC', user, user?.displayName)
      if (user) {
        try {
          const userFound = await dispatch(setUserData(user?.displayName, db))
          console.log('userFound', userFound)
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
      {/* <div className="transparent-overlay"></div> */}
      <>
        <Routes>
          <Route exact path="/" element={<Authenticate />} />
          <Route exact path="/chat" element={<NewRTCA />} />

          <Route exact path="/about" element={<About />} />
          <Route exact path="*" element={<Error />} />
        </Routes>
        {/* <div className="body-bg fs-5"><span><b>SKYCHAT</b></span></div> */}
      </>

      <Link to={'/about'} className="info">
        <Info />
      </Link>

      <Toast />
      {/* <div className="info" >
        <Info className="" data-bs-toggle="dropdown" aria-expanded="false" />
        <div className="dropdown-menu p-2">
          <h4>SKYCHAT</h4>
          <p>info</p>
        </div>
      </div> */}
    </div>

  );
}


export default withSplashScreen(App);