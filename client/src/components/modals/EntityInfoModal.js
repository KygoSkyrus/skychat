import { ArrowLeft, Edit, Users, X } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import EditAvatarModal from './EditAvatarModal'
import BlockedConnectionsModal from './BlockedConnectionsModal'

const EntityInfoModal = ({ setShowEntityInfoModal, selectedUserToChat, selectedGroupName }) => {

    const userData = useSelector(state => state.user.userInfo)

    return (
        <>
            <div className="" id="userModal" >
                <div className="m-dialog justify-content-center bg-dark rounded-1">

                    <div className='d-flex align-items-center justify-content-between'>
                        <X size="20" className='btn-close' onClick={() => setShowEntityInfoModal(false)} />
                        {/* <ArrowLeft size="20" className='text-secondary '  onClick={() => setShowUserModal(false)} />
                        <span className='text-secondary fs-12'>Profile</span> */}
                    </div>


                    <div className="d-flex align-items-center justify-content-center flex-column text-light h-100">
                        <div className='uImg'>
                            <img src={userData?.avatar} className="pointer" alt=""
                            //  onClick={()=>changeAvatar(true)} 
                            />
                            <Users size={18} />
                        </div>

                        <section className='uname mt-2'>{selectedGroupName}</section>
                        <section className='email fs-10 text-secondary'>{userData?.email}</section>

                        <ul className='list mt-3'>
                            <li className='chat_list_item '>Group members</li>
                        </ul>

                        <section className='email fs-10 text-secondary'>Create by ____ at ___</section>

                        <section className='email fs-10 text-secondary'>add/remove members</section>


                    </div>

                </div>
            </div>
        </>
    )
}

export default EntityInfoModal