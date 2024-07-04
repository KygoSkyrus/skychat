import React, { useState } from 'react'

import Toast from './Toast';
import Loader from './Loader';
import SignInForm from './SignInForm';
import signinImg from './../assets/signin-img.png'
import signinImg500 from './../assets/signin-img500.png'
import pagebg from './../assets/page-bg.png'

const Authenticate = () => {

    const [currAuthMethod, setCurrAuthMethod] = useState('signin')

    return (
        <>
            <div className='position-relative d-flex'>
                <div className="signin outer-join d-flex">
                    <div className='signin-img d-flex justify-content-center align-items-center ' style={{ zIndex: 2 }}>
                        <img src={signinImg500} width={300} alt='skychat' />
                    </div>
                    <div className="d-flex flex-row py-0 px-4 position-relative">
                        {/* <div className='w-25 signin-img d-flex bg-dark' style={{ zIndex: 2 }}>
                            <img src={signinImg} alt='skychat' />
                        </div> */}
                        <div className='forms-holder' >
                            {currAuthMethod === 'signin' ?
                                <div className={`signin-form`} >
                                    <SignInForm
                                        title="SignIn to your account"
                                        description="Enter your email and password to sign in to your account"
                                        btnText="Sign In"
                                        toggleText='New user? Create an account'
                                        signInOrSignUp="signin"
                                        switchTo="signup"
                                        setCurrAuthMethod={setCurrAuthMethod}
                                    />
                                </div>
                                :
                                <div className={`signup-form ${window.outerWidth < 768 && 'd-none'}`} >
                                    <SignInForm
                                        title="Create an account"
                                        description="Enter your details below to create your account"
                                        btnText="Create account"
                                        toggleText='Exsiting user? SignIn'
                                        signInOrSignUp="signup"
                                        switchTo="signin"
                                        setCurrAuthMethod={setCurrAuthMethod}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>

                {/* <Toast /> */}

                <Loader cName='absolute-centered' />
            </div>
        </>
    )
}

export default Authenticate