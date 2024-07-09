import React from 'react'

import Loader from './Loader';
import SignInForm from './SignInForm';
import logo1 from './../assets/logo/logo (1).png'

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