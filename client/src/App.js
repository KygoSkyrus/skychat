import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


import Home from "./Home";
import { Rtca } from "./Rtca";
import { NewRTCA } from "./NewRTCA";
import Error from "./components/Error"


import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import firebase from "firebase/compat/app";



//for firestore
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore';
import Temp from "./Temp";
import Authenticate from "./components/Authenticate";











function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyBUwUDMBV60Bo_EAUcXuPV4Xk7SkVmnVMo",
    authDomain: "skyrus-3416b.firebaseapp.com",
    projectId: "skyrus-3416b",
    storageBucket: "skyrus-3416b.appspot.com",
    messagingSenderId: "1014608195968",
    appId: "1:1014608195968:web:19d0c28fa58278de6dd165",
    measurementId: "G-KYYRGB8KNR",
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setdisplayName] = useState("");
  const [user, setuser] = useState("");
  const navigate = useNavigate();

  const provider = new GoogleAuthProvider();

  const handleAction = (id) => {
    console.log(id);

    const authentication = getAuth();

    if (id === 2) {
      createUserWithEmailAndPassword(authentication, email, password).then(
        function (response) {
          console.log(response);

          updateProfile(authentication.currentUser, {
            displayName: displayName,
          })
            .then(() => {
              // Profile updated!
            })
            .catch((error) => {
              console.log(error);
            });

          const user33 = authentication.currentUser;
          console.log(user33); //userdata

          if (user !== null) {
            const displayName1 = user33.email; //every detail can be retrieved but the displaNAme (have to figure it out)
            console.log(displayName1);
          }
          document.cookie = `email=${user33.email};  max-age=3600; path=/`;
          //will set the displayname cookie later when the above problem would have been solved
          navigate("/home");
          sessionStorage.setItem(
            "Auth Token",
            response._tokenResponse.refreshToken
          );
        }
      );
    }

    if (id === 1) {
      signInWithEmailAndPassword(authentication, email, password).then(
        (response) => {
          console.log(response)
          document.cookie = `email=${response.user.email};  max-age=3600; path=/`;
          document.cookie = `name=${response.user.displayName};  max-age=3600; path=/`;
          navigate("/home");
          sessionStorage.setItem(
            "Auth Token",
            response._tokenResponse.refreshToken
          );
        }
      );
    }

    if (id === 3) {
      signInWithPopup(authentication, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          console.log(token);
          setuser(result.user);

          //setting cookies to later to identify if the user has signed in (have to set a reasonablke expiry time)
          document.cookie = `name=${result.user.displayName};  max-age=3600; path=/`;
          document.cookie = `email=${result.user.email};  max-age=3600; path=/`;

          navigate("/home");
          sessionStorage.setItem("Auth Token", token);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(
            "errorCode:",
            errorCode,
            ",",
            "errorMessage: ",
            errorMessage,
            ",",
            "email: ",
            email,
            ",",
            "credential:",
            credential
          );
        });
    }
  };
  console.log(user);
  //this will send you to the home screen if you have logged in already
  useEffect(() => {

    let authToken = sessionStorage.getItem("Auth Token");

    if (authToken) {
      navigate("/home");
    }

    fetch('/')
  }, []);


  
  return (
    <div className="App">
      <>
        <Routes>
          <Route path="/" exact element={<Authenticate firebaseApp={firebaseApp} />} />
          
          <Route path="/chat" exact element={<NewRTCA firebaseApp={firebaseApp}/>} />


          <Route path="/home" element={<Home user={user} />} />
          <Route path="*" exact element={<Error />} />
        </Routes>
      </>
    </div>
  );
}


export default App;