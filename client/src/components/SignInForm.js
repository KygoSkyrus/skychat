import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { v4 as uuid } from 'uuid'
import { collection, addDoc, serverTimestamp, doc, query, where, updateDoc, getDocs, limit } from "firebase/firestore";
import { getAuth, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { FirebaseContext } from '../firebaseContext';
import { SET_CURRENT_USER } from '../redux/actionTypes';
import { setToast, showLoader } from '../redux/actionCreators';
import { setUserData } from '../redux/thunk/userDataThunk';
import { defaultAvatar, doesUserExistApi, toggleUsernameField, writeToDb } from '../utils';


const SignInForm = () => {

    const auth = getAuth();
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const overlayRef = useRef()
    const { db } = useContext(FirebaseContext);
    const [userCredentials, setUserCredentials] = useState({ email: '', photoURL: '', username: '' });


    const handleGoogleLogin = async () => {
        dispatch(showLoader(true));
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                if (token) {
                    const data = await doesUserExistApi(undefined, result?.user?.email); // checks if email already exists or not
                    if (data) {
                        dispatch(showLoader(false));
                        if (data.userFound) { //login
                            dispatch({ type: SET_CURRENT_USER, payload: auth.currentUser })
                            navigate('/chat')
                        } else { //create account
                            dispatch(setToast(`Enter username to continue`, false))
                            overlayRef.current.classList.remove('d-none');
                            toggleUsernameField(true);
                            setUserCredentials({ ...userCredentials, email: result?.user?.email, photoURL: result?.user?.photoURL })
                        }
                    } else {
                        dispatch(setToast(`Please wait for few seconds while server is loading`, false))
                    }
                }
            })
            .catch((error) => {
                setUserCredentials({ email: '', photoURL: '', username: '' })
                let errMsg = error.message;
                if (error.code === 'auth/email-already-in-use') errMsg = "User already exists!!! Try Signing in instead"
                console.log(error)
                dispatch(showLoader(false));
                dispatch(setToast(errMsg, true))
            });
    }

    const createAccount = async (e) => {
        e.preventDefault()

        const isVerified = await verifyUserName();
        if (isVerified && userCredentials?.email) {
            let isRegistered = registerUserInDB(userCredentials?.email, userCredentials?.username, userCredentials?.photoURL)
            if (isRegistered) {
                await updateProfile(auth.currentUser, { displayName: userCredentials?.username })
                    .catch(
                        (err) => console.log('err', err)
                    );

                dispatch(setUserData(userCredentials?.username, db));
                dispatch(showLoader(false));
                dispatch({ type: SET_CURRENT_USER, payload: auth.currentUser })
                navigate('/chat')
            }
        } else {
            dispatch(showLoader(false))
        }

    }

    const verifyUserName = async () => {
        if (userCredentials?.username?.length === 0) {
            dispatch(setToast(`please fill out username field`, true))
            return false;
        }

        let name = userCredentials?.username?.trim();
        if (name.includes(" ")) {
            dispatch(setToast(`user name can not contain blank spaces`, true))
            return false;
        }

        if (name.length < 4) {
            dispatch(setToast(`user name should be atleast 4 characters long`, true))
            return false;
        }

        const validUsername = name.match(/^(?![0-9]*$)[a-z0-9]+$/);
        if (validUsername == null) {
            dispatch(setToast(`Invalid username. Only characters a-z and numbers are acceptable.`, true))
            return false;
        }

        if (validUsername === "skychat" || validUsername?.includes('skychat')) {
            dispatch(setToast(`Users are not authorized to create account with username 'skychat'`, true))
            return false;
        }

        dispatch(showLoader(true));

        const data = await doesUserExistApi(userCredentials?.username, userCredentials?.email); // checks if username already exists or not
        if (data.userFound) {
            dispatch(setToast(`username already exists, Try Logging in instead.`, true))
            return false;
        }
        return true;
    }

    async function registerUserInDB(email, username, avatar) {
        try {
            const id = uuid();
            const userData = {
                username: username,
                email: email,
                avatar: avatar || defaultAvatar,
                connections: {
                    "skychat": {
                        id,
                    },
                },
                requests: {},
                blockList: {},
                theme: '',
                privacy: true,
                time: serverTimestamp(),
            };
            await addDoc(collection(db, "users"), userData);

            // adding current user in skychat's list
            let q = query(collection(db, "users"), where("username", "==", 'skychat'), limit(1));
            const querySnapshot = await getDocs(q);
            let skychatDoc = {};
            querySnapshot.forEach((doc) => {
                skychatDoc = { ...doc.data(), id: doc.id }
                return;
            });
            const userDocRef = doc(db, "users", skychatDoc?.id);
            await updateDoc(userDocRef, {
                connections: {
                    ...skychatDoc?.connections,
                    [username]: {
                        id
                    },
                }
            });

            const msgData = {
                connectionId: id,
                author: 'skychat',
                message: 'Help us improve by sharing your overall experience with skychat',
                time: serverTimestamp(),
                deletedBy: [],
            };
            writeToDb(db, msgData); // sending msg on behalf of skychat
            return true;
        } catch (error) {
            console.log(error);
            return false
        }
    }

    return (
        <>
            <div className='overlay d-none' style={{ position: 'fixed', left: 0, backdropFilter: 'none', background: 'transparent' }} ref={overlayRef} onClick={() => { overlayRef.current.classList.add('d-none'); toggleUsernameField(false); dispatch(showLoader(false)); }}></div>

            <h5 className='text-dark text-center fw-bold'>Login to your account</h5>

            <section className='text-center fs-14 mb-3'>Step into SkyChat, Begin the Conversation!</section>

            <div className='d-flex justify-content-center align-items-center flex-column h-100'>
                <input
                    type="text" required
                    className="form-control mt-2 d-none"
                    name="username" id="username"
                    placeholder="Username"
                    value={userCredentials?.username}
                    onChange={(e) => setUserCredentials({ ...userCredentials, username: e.target.value })}
                />

                <button className='btn border w-100 m-2 d-flex justify-content-center align-items-center fs-5 text-black-50 py-1 d-none continue' onClick={(e) => createAccount(e)}>
                    <span>Continue</span>
                </button>

                <button className='btn border w-100 mt-2 d-flex justify-content-center align-items-center fs-5 text-black-50 py-1 googleBtn' onClick={() => handleGoogleLogin()} >
                    <svg width="25" height="25" viewBox="5 5 35 35" xmlns="http://www.w3.org/2000/svg" style={{ height: "32px", width: "32px", marginLeft: "-8px" }}><g fill="none" fillRule="evenodd"><path d="M31.64 23.205c0-.639-.057-1.252-.164-1.841H23v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"></path><path d="M23 32c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711h-3.007v2.332A8.997 8.997 0 0 0 23 32z" fill="#34A853"></path><path d="M17.964 24.71a5.41 5.41 0 0 1-.282-1.71c0-.593.102-1.17.282-1.71v-2.332h-3.007A8.996 8.996 0 0 0 14 23c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"></path><path d="M23 17.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C27.463 14.891 25.426 14 23 14a8.997 8.997 0 0 0-8.043 4.958l3.007 2.332c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"></path><path d="M14 14h18v18H14V14z"></path></g></svg>
                    <span>Google</span>
                </button>
            </div>
        </>
    )
}

export default SignInForm