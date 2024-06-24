import { ArrowLeft, Edit, X } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EditAvatarModal from './EditAvatarModal'
import BlockedConnectionsModal from './BlockedConnectionsModal'
import ThemeModal from './ThemeModal'
import { doc, getFirestore, updateDoc } from 'firebase/firestore'
import { FirebaseContext } from '../../firebaseContext'
import { hideConfirmationModal } from '../../redux/actionTypes'

const ConfirmationModal = () => {

    const dispatch = useDispatch()
    const { isConfirmationModalVisible, onConfirm } = useSelector((state) => state.ui);

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        dispatch(hideConfirmationModal());
    }

    if (!isConfirmationModalVisible) return null;

    return (
        <>
            <div className="" id="confirmationModal" >
                <div className="m-dialog justify-content-center bg-dark rounded-1">

                    <div className="d-flex align-items-center justify-content-center flex-column text-light h-100 p-5">
                        <section className='text-center'>Do you want to toggle the privacy?</section>

                        <ul className='list d-flex mt-3'>
                            <li onClick={() => dispatch(hideConfirmationModal())}>Cancel</li>
                            <li onClick={handleConfirm}>Continue</li>
                        </ul>
                    </div>

                </div>
            </div>
            <div className="overlay pointer zIndex4" onClick={() => dispatch(hideConfirmationModal())}></div>
        </>
    )
}

export default ConfirmationModal