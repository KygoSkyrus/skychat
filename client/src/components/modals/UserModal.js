import { ArrowLeft, Edit, X } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EditAvatarModal from './EditAvatarModal'
import BlockedConnectionsModal from './BlockedConnectionsModal'
import ThemeModal from './ThemeModal'
import { doc, updateDoc } from 'firebase/firestore'
import { FirebaseContext } from '../../firebaseContext'
import { showConfirmationModal } from '../../redux/actionTypes'

const UserModal = ({ setShowUserModal }) => {

    const dispatch = useDispatch()
    const { db } = useContext(FirebaseContext);
    const userData = useSelector(state => state.user.userInfo)


    const [showEditAvatarModal, setShowEditAvatarModal] = useState(false)
    const [showBlockedConnections, setShowBlockedConnections] = useState(false)
    const [showThemeModal, setShowThemeModal] = useState(false)

    const handleTogglePrivacy = async (e) => {
        const newPrivacySetting = e.target.checked;
        dispatch(showConfirmationModal('Do you want to toggle the privacy?', () => togglePrivacy(newPrivacySetting)))
    }

    const togglePrivacy = async (newPrivacySetting) => {
        const docRef = doc(db, "users", userData?.id);
        await updateDoc(docRef, {
            privacy: newPrivacySetting,
        });
    };

    return (
        <>
            <div className="" id="userModal" >
                <div className="m-dialog justify-content-center bg-dark rounded-1">

                    <div className='d-flex align-items-center justify-content-between p-3' style={{position: 'absolute',width: '100%'}}>
                        {/* <X size="20" className='btn-close' onClick={() => setShowUserModal(false)} /> */}
                        <ArrowLeft size="16" className='text-secondary '  onClick={() => setShowUserModal(false)} />
                        <span className='text-secondary fs-12'>Settings</span>
                    </div>


                    <div className="d-flex align-items-center justify-content-center flex-column text-light h-100">
                        <div className='uImg'>
                            <img src={userData?.avatar} className="pointer" alt=""
                            //  onClick={()=>changeAvatar(true)} 
                            />
                            <div className='avatar_edit_btn' onClick={() => setShowEditAvatarModal(true)}>
                                <Edit />
                            </div>
                        </div>

                        <section className='uname mt-2'>{userData?.username}</section>
                        <section className='email fs-10 text-secondary'>{userData?.email}</section>

                        <ul className='list mt-3'>
                            <li className='chat_list_item ' onClick={() => setShowBlockedConnections(true)}>Blocked connections</li>
                            <li className='chat_list_item ' onClick={() => setShowThemeModal(true)}>Themes</li>
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

            {showEditAvatarModal &&
                <>
                    <EditAvatarModal setShowEditAvatarModal={setShowEditAvatarModal} />
                    {/* <div className="overlay pointer zIndex4" onClick={() => setShowEditAvatarModal(false)}></div> */}
                </>
            }

            {showBlockedConnections &&
                <>
                    <BlockedConnectionsModal setShowBlockedConnections={setShowBlockedConnections} />
                    {/* <div className="overlay pointer zIndex4" onClick={() => setShowEditAvatarModal(false)}></div> */}
                </>
            }

            {showThemeModal &&
                <>
                    <ThemeModal setShowThemeModal={setShowThemeModal} />
                    {/* <div className="overlay pointer zIndex4" onClick={() => setShowEditAvatarModal(false)}></div> */}
                </>
            }
        </>
    )
}

export default UserModal