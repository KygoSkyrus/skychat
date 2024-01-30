import React, { useState } from 'react'

import SignInForm from './SignInForm';
// import loginImg from "./../../assets/images/login-cover.svg"

const Authenticate = ({ firebaseApp }) => {

    const [currAuthMethod, setCurrAuthMethod] = useState('signin')

    return (
        <>
        <div>
        <div className="signin outer-join">
            {/* <button type="button" id='closeSignin' className="d-none" data-bs-dismiss="modal" aria-label="Close"><i className='fa fa-times'></i></button> */}

            <div className="d-flex flex-row py-0 px-4 position-relative">
                {/* <div className='w-50 signin-img d-flex bg-dark' style={{ zIndex: 2 }}>
                            <img src={loginImg} alt='shoppitt' />
                        </div> */}
                <div className='forms-holder' >
                    {currAuthMethod === 'signin' ?
                        <div className={`signin-form d-flex justify-content-center align-items-center flex-column h-100`} >
                            <SignInForm
                                title="SignIn to your account"
                                description="Enter your email and password to sign in to your account"
                                btnText="Sign In"
                                toggleText='New user? Create an account'
                                signInOrSignUp="signin"
                                switchTo="signup"
                                setCurrAuthMethod={setCurrAuthMethod}
                                firebaseApp={firebaseApp}
                            />
                        </div>
                        :
                        <div className={`signup-form d-flex justify-content-center align-items-center flex-column h-100 ${window.outerWidth < 768 && 'd-none'}`} >
                            <SignInForm
                                title="Create an account"
                                description="Enter your email below to create your account"
                                btnText="Create account"
                                toggleText='Exsiting user? SignIn'
                                signInOrSignUp="signup"
                                switchTo="signin"
                                setCurrAuthMethod={setCurrAuthMethod}
                                firebaseApp={firebaseApp}
                            />
                        </div>
                    }
                </div>
            </div>
        </div>
        <div className='notify'>sfhdsjkdjksfdkjjd</div>
        </div>
        </>
    )
}

export default Authenticate