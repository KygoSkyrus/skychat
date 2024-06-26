import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { hideConfirmationModal } from '../../redux/actionCreators';

const ConfirmationModal = () => {

    const dispatch = useDispatch()
    // const { isConfirmationModalVisible, onConfirm, confirmationText } = useSelector((state) => state.ui);
    // why not using the above way of getting state? bcz we are getting the whole object ui here,and if any of the other state other than these three changes than this component will re-render for no reason
    const isConfirmationModalVisible = useSelector((state) => state.ui.isConfirmationModalVisible);
    const onConfirm = useSelector((state) => state.ui.onConfirm);
    const confirmationText = useSelector((state) => state.ui.confirmationText);

    console.log('`````````````````')
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
                        <section className='text-center mb-2' dangerouslySetInnerHTML={{ __html: confirmationText }}></section>

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