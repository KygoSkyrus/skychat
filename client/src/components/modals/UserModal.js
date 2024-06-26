import { ArrowLeft, Edit, X } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EditAvatarModal from './EditAvatarModal'
import BlockedConnectionsModal from './BlockedConnectionsModal'
import ThemeModal from './ThemeModal'
import { doc, updateDoc } from 'firebase/firestore'
import { FirebaseContext } from '../../firebaseContext'
import { setToast, showBlockedConnectionsModal, showConfirmationModal, showEditAvatarModal, showThemeModal, showUserModal } from '../../redux/actionCreators'

const UserModal = () => {

    const dispatch = useDispatch()
    const { db } = useContext(FirebaseContext);
    const userData = useSelector(state => state.user.userInfo)
    const isUserModalVisible = useSelector((state) => state.ui.isUserModalVisible);

    console.log('``````````usermodal')


    const handleTogglePrivacy = async (e) => {
        const newPrivacySetting = e.target.checked;
        dispatch(showConfirmationModal(`Are you sure you want to turn your account privacy ${e.target.checked ? 'on' : 'off'}?`, () => togglePrivacy(newPrivacySetting)))
    }

    const togglePrivacy = async (newPrivacySetting) => {
        const docRef = doc(db, "users", userData?.id);
        await updateDoc(docRef, {
            privacy: newPrivacySetting,
        });
        dispatch(setToast(`Account privacy turned ${newPrivacySetting ? 'on' : 'off'}`, false))
    };

    if (!isUserModalVisible) return null;

    return (
        <>
            <div className="" id="userModal" >
                <div className="m-dialog justify-content-center bg-dark rounded-1">

                    <div className='d-flex align-items-center justify-content-between p-3' style={{ position: 'absolute', width: '100%' }}>
                        {/* <X size="20" className='btn-close' onClick={() => dispatch(showUserModal(false))} /> */}
                        <ArrowLeft size="16" className='text-secondary ' onClick={() => dispatch(showUserModal(false))} />
                        <span className='text-secondary fs-12'>Settings</span>
                    </div>


                    <div className="d-flex align-items-center justify-content-center flex-column text-light h-100">
                        <div className='uImg'>
                            <img src={userData?.avatar} className="pointer" alt=""
                            //  onClick={()=>changeAvatar(true)} 
                            />
                            <div className='avatar_edit_btn' onClick={() => dispatch(showEditAvatarModal(true))}>
                                <Edit />
                            </div>
                        </div>

                        <section className='uname mt-2'>{userData?.username}</section>
                        <section className='email fs-10 text-secondary'>{userData?.email}</section>

                        <ul className='list mt-3'>
                            <li className='chat_list_item ' onClick={() => dispatch(showBlockedConnectionsModal(true))}>Blocked connections</li>
                            <li className='chat_list_item ' onClick={() => dispatch(showThemeModal(true))}>Themes</li>
                            <li className='chat_list_item privacy'>
                                <span>Privacy</span>
                                <span className='d-flex justify-content-end'>
                                    <input type="checkbox" id='privacy' checked={userData?.privacy} onChange={(e) => handleTogglePrivacy(e)} />
                                    <label htmlFor="privacy"></label>
                                </span>
                            </li>
                        </ul>

                    </div>

                </div>
            </div>
            <div className="overlay pointer zIndex4" onClick={() => dispatch(showUserModal(false))}></div>


            <EditAvatarModal />
            <BlockedConnectionsModal />
            <ThemeModal />
        </>
    )
}

export default UserModal