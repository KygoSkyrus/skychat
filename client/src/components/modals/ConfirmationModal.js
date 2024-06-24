import { ArrowLeft, Edit, X } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EditAvatarModal from './EditAvatarModal'
import BlockedConnectionsModal from './BlockedConnectionsModal'
import ThemeModal from './ThemeModal'
import { doc, getFirestore, updateDoc } from 'firebase/firestore'
import { FirebaseContext } from '../../firebaseContext'
import { SHOW_CONFIMATION_MODAL } from '../../redux/actionTypes'

const ConfirmationModal = () => {

    const dispatch = useDispatch()
    const showConfirmationModal = useSelector(state => state.ui.showConfirmationModal)

    if (!showConfirmationModal) return null;

    return (
        <>
            <div className="" id="confirmationModal" >
                <div className="m-dialog justify-content-center bg-dark rounded-1">

                    {/* <div className='d-flex align-items-center justify-content-between'>
                        <X size="20" className='btn-close'
                        //  onClick={() => setShowUserModal(false)} 
                         />
                    </div> */}


                    <div className="d-flex align-items-center justify-content-center flex-column text-light h-100 p-5">
                        <section className='text-center'>Do you want to toggle the privacy?</section>

                        <ul className='list d-flex mt-3'>
                            <li>Cancel</li>
                            <li>Continue</li>
                        </ul>
                    </div>

                </div>
            </div>
            <div className="overlay pointer zIndex4" onClick={() => dispatch({ type: SHOW_CONFIMATION_MODAL, payload: false })}></div>
        </>
    )
}

export default ConfirmationModal