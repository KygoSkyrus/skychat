import { ArrowLeft, Edit, X } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import EditAvatarModal from './EditAvatarModal'

const UserModal = ({ setShowUserModal }) => {

    const userData = useSelector(state => state.user.userInfo)

    const [showEditAvatarModal,setShowEditAvatarModal]=useState(false)


    return (
        <>
            <div className="" id="userModal" >
                <div className="m-dialog justify-content-center bg-dark rounded-1">
                    
                    <div className='d-flex align-items-center justify-content-between'>
                        <X size="20" className='btn-close' onClick={() => setShowUserModal(false)} />
                        {/* <ArrowLeft size="20" className='text-secondary '  onClick={() => setShowUserModal(false)} />
                        <span className='text-secondary fs-12'>Profile</span> */}
                    </div>


                    <div className="d-flex align-items-center justify-content-center flex-column text-light h-100">
                        <div className='uImg'>
                            <img src={userData?.avatar} className="pointer" alt=""
                            //  onClick={()=>changeAvatar(true)} 
                            />
                            <div className='avatar_edit_btn' onClick={()=>setShowEditAvatarModal(true)}>
                                <Edit/>
                            </div>
                        </div>

                        <section className='uname mt-2'>{userData?.username}</section>
                        <section className='email fs-10 text-secondary'>{userData?.email}</section>

                        <ul className='list list-group-item-danger mt-3'>
                            <li className='chat_list_item '>Blocked connections</li>
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

        </>
    )
}

export default UserModal