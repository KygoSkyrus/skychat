import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, collection, query, where, doc, orderBy, getDocs, getDoc, addDoc, setDoc, serverTimestamp, toDate, limit, } from "firebase/firestore";

import { UPDATE_USER_INFO } from '../redux/actionTypes';

// import { goWithGoogle, signinAPI, defaultAvatar, inProgressLoader } from './Utility'

const SignInForm = ({ title, description, toggleText, signInOrSignUp, switchTo, btnText, currAuthMethod, setCurrAuthMethod, firebaseApp }) => {

    const auth = getAuth();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [userCredentials, setUserCredentials] = useState({ email: '', password: '', username: '' });

    const firestore = getFirestore(firebaseApp);


    // useEffect(() => {

    //     auth.onAuthStateChanged((user) => {
    //         const userInfo = document.getElementById('user-info');
    //         console.log('authstate changed', user)
    //         //set user in redux
    //         if (user) {
    //             dispatch({ type: UPDATE_USER_INFO, payload:user })
    //             navigate('/chat')
    //         } else {
    //             dispatch({ type: UPDATE_USER_INFO, payload:null })
    //             console.log('')
    //         }
    //     });
    // }, [])



    function handleClick() {
        if (signInOrSignUp === "signup") {
            createUserAccountFirebase()
        } else if (signInOrSignUp === "signin") {
            loginUserFirebase()
        }
    }

    async function createUserAccountFirebase() {
        /*
        // for breaking firstname and lastname from username
        //to trim firstname and username from a single input field
        let name = userCredentials?.username?.trim();
        if (name?.length === 0 || userCredentials?.email.length === 0 || userCredentials?.password.length === 0) {
            // dispatch(invokeToast({ isSuccess: false, message: 'Name is a mandatory field, Enter your name to proceed further' }))
            setUserCredentials({ ...userCredentials, username: '' })
            return;
        }
        // inProgressLoader(dispatch, true)
        name = name.split(' ')
        let firstname = '';
        let lastname = '';
        for (const str of name) {
            if (!firstname) {
                firstname = str;
            } else if (!lastname) {
                lastname = str;
                break;
            }
        }
        */

        //for validating username
        let name = userCredentials?.username?.trim();
        if (name?.length === 0 || userCredentials?.email.length === 0 || userCredentials?.password.length === 0) {
            alert('please fill out all required fields')
            //setUserCredentials({ ...userCredentials, username: '' })
            return;
        }

        if(name.includes(" ")){
            alert('user name can not contain blank spaces')
        }


        await createUserWithEmailAndPassword(auth, userCredentials?.email, userCredentials?.password)
            .then((response) => {
                const user = response.user;
                console.log('signup user', user)
                registerUserInDB(user?.email, userCredentials?.username, 'avatar 1')
                // inProgressLoader(dispatch, false)
                //navigate('/user');//sending user to user page for filling out other details
            })
            .catch((error) => {
                // inProgressLoader(dispatch, false)
                setUserCredentials({ email: '', password: '', username: '' })
                let errMsg = error.message;
                console.log('error', error)
                if (error.code === 'auth/email-already-in-use') errMsg = "User already exists!!! Try Signing in instead"
                // dispatch(invokeToast({ isSuccess: false, message: errMsg }))
            });

        await updateProfile(auth.currentUser, { displayName: userCredentials?.username })
            .catch(
                (err) => console.log('err', err)
            );


        setUserCredentials({ email: '', password: '', username: '' })

        //setting user and redirecting to chats
        dispatch({ type: UPDATE_USER_INFO, payload: auth.currentUser })
        navigate('/chat')

    }

    function loginUserFirebase() {
        // inProgressLoader(dispatch, true)
        signInWithEmailAndPassword(auth, userCredentials?.email, userCredentials?.password)
            .then(
                (response) => {
                    const user = response.user;
                    console.log('signin user', user)
                    dispatch({ type: UPDATE_USER_INFO, payload: auth.currentUser })
                    // signinAPI(user?.email, "", "", user?.photoURL, dispatch)//not needed 
                    // inProgressLoader(dispatch, false)
                    setUserCredentials({ email: '', password: '', username: '' })
                    navigate('/chat')
                }
            )
            .catch((error) => {
                // inProgressLoader(dispatch, false)
                setUserCredentials({ email: '', password: '', username: '' })
                // dispatch(invokeToast({ isSuccess: false, message: "Authentication Failed, Invalid email/password" }))
            });
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

    async function registerUserInDB(email, username, photo) {
        const userData = {
            // firstname: firstname,
            // lastname: lastname,
            username: username,
            email: email,
            avatar: photo,
            connections:{},
            requests:{},
            blockList:{},
            time: serverTimestamp(),
        };
        await addDoc(collection(firestore, "users"), userData);


        // for adding the custom document id (here username is used as document ID)
        // const collectionRef = collection(firestore, "users");
        // await setDoc(doc(collectionRef, username), {
        //     username: username,
        //     email: email,
        //     avatar: photo,
        //     connections:{},
        //     requests:{},
        //     time: serverTimestamp(),
        // });

    }

    // export const goWithGoogle = (val, navigate, dispatch, route, isAdminLogin) => {
    //     const auth = getAuth();
    //     const provider = new GoogleAuthProvider();
    //     signInWithPopup(auth, provider)
    //         .then((result) => {

    //             const credential = GoogleAuthProvider.credentialFromResult(result);
    //             const token = credential.accessToken;// a Google Access Token. can be used to access the Google API.
    //             if (token) {
    //                 let dname = result.user.displayName.split(" ")
    //                 let lastname = ''
    //                 let firstname = dname[0]
    //                 if (dname.length > 1) {
    //                     lastname = dname[dname.length - 1]
    //                 }

    //                 if (val === 'signup') {
    //                     signinAPI('signup', result.user.email, firstname, lastname, result.user.photoURL, dispatch)
    //                     navigate('/user');//sending user to user page for filling out other details
    //                 } else {
    //                     signinAPI('signin', result.user.email, '', '', '', dispatch, navigate, route, isAdminLogin)
    //                 }
    //             }
    //         })
    //         .catch((error) => {
    //             dispatch(invokeToast({ isSuccess: false, message: "Google login failed, Try Again with valid google account" }))
    //         });

    // }

    // export const signinAPI = (val, email, firstname, lastname, photo, dispatch, navigate, route, isAdminLogin = false) => {

    //     let resp;
    //     fetch(`/api/${val}`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             firstname, lastname, email, photo, isAdminLogin
    //         })
    //     })
    //         .then(response => {
    //             resp = response;
    //             return response.json()
    //         })
    //         .then(res => {
    //             document.getElementById('closeSignin').click()//closing the modal
    //             if (resp.status === 200) {
    //                 dispatch(invokeToast({ isSuccess: true, message: res.message }))
    //             } else {
    //                 dispatch(invokeToast({ isSuccess: false, message: res.message }))
    //             }

    //             if (res.is_user_logged_in) {
    //                 dispatch(isUserLoggedIn({ value: true }))
    //                 dispatch(setUserDetails({ user: res.user }))
    //             }

    //             if (isAdminLogin && res.is_user_logged_in) {
    //                 dispatch(setAdminAuthStatus({ value: res.is_user_logged_in }))
    //                 navigate(`/admin/${route}`)//navigates to requested route
    //             } 
    //         })
    // }

    return (
        <>
            <h5 className='text-dark'>{title}</h5>
            <section className='text-center'>{description}</section>
            {signInOrSignUp === "signup" &&
                <input type="text" className="form-control mt-2" name="username" id="username" placeholder="Username" value={userCredentials?.username} onChange={(e) => setUserCredentials({ ...userCredentials, username: e.target.value })} />
            }
            <input type="email" className="form-control my-2" name="email" id="email1" placeholder="Email address" aria-describedby="emailHelp" value={userCredentials?.email} onChange={(e) => setUserCredentials({ ...userCredentials, email: e.target.value })} />
            <input type="password" className="form-control" id="password1" name="password" placeholder="Password*" value={userCredentials?.password} onChange={(e) => setUserCredentials({ ...userCredentials, password: e.target.value })} />
            <button className='btn btn-outline-warning w-100 my-2' onClick={() => handleClick()}>{btnText}</button>

            <section className='my-3 text-end w-100 pointer' onClick={() => toggleSignIn(switchTo)}>{toggleText}</section>
            <section className='continue-with position-relative w-100 text-center'>
                <span >OR CONTINUE WITH</span>
                <section></section>
            </section>

            <button className='btn border w-100 m-2 d-flex justify-content-center align-items-center fs-5 text-black-50 py-1'
            // onClick={() => goWithGoogle(signInOrSignUp, navigate, dispatch)}
            >
                <svg width="25" height="25" viewBox="5 5 35 35" xmlns="http://www.w3.org/2000/svg" style={{ height: "32px", width: "32px", marginLeft: "-8px" }}><g fill="none" fillRule="evenodd"><path d="M31.64 23.205c0-.639-.057-1.252-.164-1.841H23v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"></path><path d="M23 32c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711h-3.007v2.332A8.997 8.997 0 0 0 23 32z" fill="#34A853"></path><path d="M17.964 24.71a5.41 5.41 0 0 1-.282-1.71c0-.593.102-1.17.282-1.71v-2.332h-3.007A8.996 8.996 0 0 0 14 23c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"></path><path d="M23 17.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C27.463 14.891 25.426 14 23 14a8.997 8.997 0 0 0-8.043 4.958l3.007 2.332c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"></path><path d="M14 14h18v18H14V14z"></path></g></svg> <span>Google</span>
            </button>
        </>
    )
}

export default SignInForm