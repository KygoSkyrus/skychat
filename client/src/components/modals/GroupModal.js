import { ArrowLeft, Edit, X } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import SearchComponent from '../SearchComponent'
// import EditAvatarModal from './EditAvatarModal'
// import BlockedConnectionsModal from './BlockedConnectionsModal'

const GroupModal = ({ setShowGroupModal, handleSelectedUserToChat, searchedUserList, setSearchedUserList }) => {

    const userData = useSelector(state => state.user.userInfo)

    const [selectedUsersForGroup,setSelectedUsersForGroup]=useState([])

    



    // on creating group user can add any user by searcing the user name
    // there will be modal.. first there will be a  text box to enter username then when user click on search to search,,, it is exactly like search on sidebar
    // next below that there will be all the users in the connection list(maybe show req list or blocked connection too but then before adding them user has to unlock or approve his reuqest)
    //you can also show the slected users on the top 

    const createGroup = () => {

    }




    return (
        <>
            <div className="" id="groupModal" >
                <div className="m-dialog justify-content-center bg-dark rounded-1">

                <div className='d-flex align-items-center justify-content-between bg-dark p-3 text-white'>
                        <ArrowLeft size="20" className='text-secondary pointer' onClick={() => setShowGroupModal(false)} />
                        <span className='text-secondary fs-12'>Start a Group</span>
                        {/* <X size="20" className='btn-close' onClick={() => setShowGroupModal(false)} /> */}
                    </div>


                    <SearchComponent
                        id={"userSearchDropdownGroup"}
                        handleSelectedUserToChat={handleSelectedUserToChat}
                        searchedUserList={searchedUserList}
                        setSearchedUserList={setSearchedUserList}
                    />



                    {/* <div className="d-flex align-items-center justify-content-center flex-column text-light h-100">
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
                            <li className='chat_list_item ' onClick={()=>setShowBlockedConnections(true)}>Blocked connections</li>
                        </ul>



                    </div> */}

                </div>
            </div>
        </>
    )
}

export default GroupModal