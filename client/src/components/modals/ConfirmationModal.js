import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { hideConfirmationModal } from '../../redux/actionTypes'

const ConfirmationModal = () => {

    const dispatch = useDispatch()
    const { isConfirmationModalVisible, onConfirm, confirmationText } = useSelector((state) => state.ui);

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
                        <section className='text-center mb-2'>{confirmationText}</section>

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