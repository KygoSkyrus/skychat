import React from 'react'

import Loader from './Loader';
import SignInForm from './SignInForm';

import signinImg from './../assets/signin-img.png'
import signinImg500 from './../assets/signin-img500.png'
import pagebg from './../assets/page-bg.png'

import logo1 from './../assets/logo/logo (1).png'
import logo2 from './../assets/logo/logo (2).png'
import logo3 from './../assets/logo/logo (3).png'
import logo4 from './../assets/logo/logo (4).png'
import logo5 from './../assets/logo/logo (5).png'
import logo7 from './../assets/logo/logo (7).png'

const Authenticate = () => {
    return (
        <>
            <div className='position-relative d-flex'>
                <div className="signin outer-join d-flex">
                    <div className='signin-img d-flex justify-content-center align-items-center ' style={{ zIndex: 2 }}>
                        <img src={logo1} width={300} alt='skychat' />
                    </div>
                    <div className="d-flex flex-row py-0 px-4 position-relative">
                        <div className='forms-holder' >
                            <div className='signin-form' >
                                <SignInForm />
                            </div>
                        </div>
                    </div>
                </div>
                <Loader cName='absolute-centered' />
            </div>
        </>
    )
}

export default Authenticate