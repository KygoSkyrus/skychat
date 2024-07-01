import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, collection, query, where, doc, orderBy, getDocs, getDoc, addDoc, setDoc, serverTimestamp, toDate, limit, } from "firebase/firestore";

import { SET_CURRENT_USER } from '../redux/actionTypes';
import { defaultAvatar, toggleLoginFields } from '../utils';
import { setUserData } from '../redux/thunk/userDataThunk';
import { FirebaseContext } from '../firebaseContext';
import { setToast, showLoader } from '../redux/actionCreators';


const SignInForm = ({ title, description, toggleText, signInOrSignUp, switchTo, btnText, setCurrAuthMethod }) => {

    const auth = getAuth();
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const overlayRef = useRef()
    const { db } = useContext(FirebaseContext);
    const [userCredentials, setUserCredentials] = useState({ email: '', password: '', username: '' });

    useEffect(() => {
        if (signInOrSignUp === "signup")
            document.getElementById('username').focus();// focus on input field
        else
            document.getElementById('email1').focus();
    }, [signInOrSignUp])


    function handleClick(e) {
        e?.preventDefault();
        if (signInOrSignUp === "signup") {
            createUserAccountFirebase()
        } else if (signInOrSignUp === "signin") {
            loginUserFirebase()
        }
    }

    async function createUserAccountFirebase() {

        const isVerified = await verifyUserName(false);
        if (isVerified) {
            let isUserCreated = false;
            await createUserWithEmailAndPassword(auth, userCredentials?.email, userCredentials?.password)
                .then((response) => {
                    const user = response.user;
                    console.log('signup user', user)
                    let isRegistered = registerUserInDB(user?.email, userCredentials?.username, defaultAvatar)
                    if (isRegistered) isUserCreated = true;
                    // inProgressLoader(dispatch, false)
                    //navigate('/user');//sending user to user page for filling out other details
                })
                .catch((error) => {
                    // inProgressLoader(dispatch, false)
                    setUserCredentials({ email: '', password: '', username: '' })
                    let errMsg = error.message;
                    console.log('error', error)
                    if (error.code === 'auth/email-already-in-use') errMsg = "Email already exists!!! Try Signing in instead"
                    dispatch(setToast(errMsg, true))
                });

            if (isUserCreated) {
                await updateProfile(auth.currentUser, { displayName: userCredentials?.username })
                    .catch(
                        (err) => console.log('err', err)
                    );

                //setting user and redirecting to chats
                dispatch(setUserData(userCredentials?.username, db));
                dispatch({ type: SET_CURRENT_USER, payload: auth.currentUser })
                navigate('/chat')
            }
        }
        dispatch(showLoader(false));
    }

    function loginUserFirebase() {
        console.log('login')
        dispatch(showLoader(true));
        // inProgressLoader(dispatch, true)
        signInWithEmailAndPassword(auth, userCredentials?.email, userCredentials?.password)
            .then(
                (response) => {
                    const user = response.user;
                    console.log('signin user', user)
                    dispatch({ type: SET_CURRENT_USER, payload: auth.currentUser })
                    navigate('/chat')
                    dispatch(showLoader(false));
                }
            )
            .catch((error) => {
                dispatch(setToast(`Authentication Failed, Invalid email/password`, true))
                dispatch(showLoader(false));
                setUserCredentials({ email: '', password: '', username: '' })
            });

    }

    const handleGoogleAuth = async () => {
        if (signInOrSignUp === "signup") {
            overlayRef.current.classList.remove('d-none');
            toggleLoginFields(true);

            const isVerified = await verifyUserName(true);
            if (isVerified)  goWithGoogle();
            else dispatch(showLoader(false));
        } else {
            goWithGoogle();
        }
    }

    const goWithGoogle = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        let isUserCreated = false;
        await signInWithPopup(auth, provider)
            .then((result) => {

                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;// a Google Access Token. can be used to access the Google API.
                if (token) {

                    console.log('result--', result)
                    if (signInOrSignUp === "signup") {
                        let isRegistered = registerUserInDB(result?.user?.email, userCredentials?.username, result?.user?.photoURL)
                        if (isRegistered) isUserCreated = true;
                    } else if (signInOrSignUp === "signin") {
                        dispatch({ type: SET_CURRENT_USER, payload: auth.currentUser })
                        dispatch(showLoader(false));
                        navigate('/chat')
                    }

                }
            })
            .catch((error) => {
                setUserCredentials({ email: '', password: '', username: '' })
                let errMsg = error.message;
                if (error.code === 'auth/email-already-in-use') errMsg = "User already exists!!! Try Signing in instead"
                dispatch(showLoader(false));
                dispatch(setToast(errMsg, true))
            });

        if (isUserCreated) {
            await updateProfile(auth.currentUser, { displayName: userCredentials?.username })
                .catch(
                    (err) => console.log('err', err)
                );

            //setting user and redirecting to chats
            dispatch(setUserData(userCredentials?.username, db));
            dispatch(showLoader(false));
            dispatch({ type: SET_CURRENT_USER, payload: auth.currentUser })
            navigate('/chat')
        }

    }

    const verifyUserName = async (isGoogle = false) => {
        if (isGoogle && userCredentials?.username?.length === 0) {
            dispatch(setToast(`please fill out username field`, true))
            return false;
        } 

        if (!isGoogle && (userCredentials?.username?.length === 0 || userCredentials?.email.length === 0 || userCredentials?.password.length === 0)) {
            dispatch(setToast(`please fill out all required fields`, true))
            return false;
        }

        //for validating username
        let name = userCredentials?.username?.trim();
        if (name.includes(" ")) {
            dispatch(setToast(`user name can not contain blank spaces`, true))
            return false;
        }

        if (name.length < 4) {
            dispatch(setToast(`user name should be atleast 4 characters long`, true))
            return false;
        }

        const validUsername = name.match(/^(?![0-9]*$)[a-z0-9]+$/); // /^[a-z0-9]+$/
        if (validUsername == null) {
            dispatch(setToast(`Invalid username. Only characters a-z and numbers are  acceptable.`, true))
            return false;
        }

        dispatch(showLoader(true));

        //checks if username already exists or not
        let res = await fetch(`/api/doesUserExist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: name
            })
        })
        let data = await res.json()
        if (data.userFound) {
            dispatch(setToast(`username already exists, Try Logging in instead.`, true))
            return false;
        }

        return true;
    }

    async function registerUserInDB(email, username, avatar) {
        const userData = {
            // firstname: firstname,
            // lastname: lastname,
            username: username,
            email: email,
            avatar: avatar,
            connections: {},
            requests: {},
            blockList: {},
            theme: '',
            privacy: true,
            time: serverTimestamp(),
        };
        await addDoc(collection(db, "users"), userData);
        return true;
    }

    //toggles between signIn and signUp form
    const toggleSignIn = (form) => {
        console.log('form', form)
        setCurrAuthMethod(form)

        // let signin = document.querySelector('.signin-form')
        // let signup = document.querySelector('.signup-form')
        // if (form === 'signin') {
        //     if (window.outerWidth < 768) {
        //         signup.classList.add('d-none')
        //         signin.classList.remove('d-none')
        //     } else {
        //         signup.style.left = '0'
        //         signin.style.right = '0'
        //     }
        // } else {
        //     if (window.outerWidth < 768) {
        //         signup.classList.remove('d-none')
        //         signin.classList.add('d-none')
        //     } else {
        //         signup.style.left = '50%'
        //         signin.style.right = '50%'
        //     }
        // }
        setUserCredentials({ email: '', password: '', username: '' })
    }

    return (
        <>
            <div className='overlay d-none' style={{ position: 'fixed', left: 0, backdropFilter: 'none', background: '#ff000029' }} ref={overlayRef} onClick={() => { overlayRef.current.classList.add('d-none'); toggleLoginFields(false) }}></div>
            <h5 className='text-dark text-center fw-bold'>{title}</h5>
            <section className='text-center fs-14'>{description}</section>

            <form className='d-flex justify-content-center align-items-center flex-column h-100' onSubmit={e => handleClick(e)}>
                {signInOrSignUp === "signup" &&
                    <input
                        type="text" required
                        className="form-control mt-2"
                        name="username" id="username"
                        placeholder="Username"
                        value={userCredentials?.username}
                        onChange={(e) => setUserCredentials({ ...userCredentials, username: e.target.value })}
                        onKeyUp={(e) => e.key === "Enter" && e.target.value && document.getElementById('email1').focus()}
                    />
                }

                <input
                    type="email" required
                    className="form-control my-2"
                    name="email"
                    id="email1"
                    placeholder="Email address"
                    aria-describedby="emailHelp"
                    value={userCredentials?.email}
                    onChange={(e) => setUserCredentials({ ...userCredentials, email: e.target.value })}
                    onKeyUp={(e) => e.key === "Enter" && e.target.value && document.getElementById('password1').focus()}
                />

                <input
                    type="password" required
                    className="form-control"
                    id="password1"
                    name="password"
                    placeholder="Password*"
                    value={userCredentials?.password}
                    onChange={(e) => setUserCredentials({ ...userCredentials, password: e.target.value })}
                    onKeyUp={(e) => e.key === "Enter" && e.target.value && handleClick(e)}
                />

                <button type='submit' className='btn btn-outline-warning w-100 my-2 createAcc'>{btnText}</button>

                <section className='my-3 text-end w-100 pointer fs-14 toggle' onClick={() => toggleSignIn(switchTo)}>{toggleText}</section>

                <section className='continue-with position-relative w-100 text-center mt-2'>
                    <span className='fs-12'>OR CONTINUE WITH</span>
                    <section></section>
                </section>

                <button className='btn border w-100 m-2 d-flex justify-content-center align-items-center fs-5 text-black-50 py-1 googleBtn'
                    onClick={() => handleGoogleAuth()}
                >
                    <svg width="25" height="25" viewBox="5 5 35 35" xmlns="http://www.w3.org/2000/svg" style={{ height: "32px", width: "32px", marginLeft: "-8px" }}><g fill="none" fillRule="evenodd"><path d="M31.64 23.205c0-.639-.057-1.252-.164-1.841H23v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"></path><path d="M23 32c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711h-3.007v2.332A8.997 8.997 0 0 0 23 32z" fill="#34A853"></path><path d="M17.964 24.71a5.41 5.41 0 0 1-.282-1.71c0-.593.102-1.17.282-1.71v-2.332h-3.007A8.996 8.996 0 0 0 14 23c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"></path><path d="M23 17.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C27.463 14.891 25.426 14 23 14a8.997 8.997 0 0 0-8.043 4.958l3.007 2.332c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"></path><path d="M14 14h18v18H14V14z"></path></g></svg> <span>Google</span>
                </button>
            </form>
        </>
    )
}

export default SignInForm
