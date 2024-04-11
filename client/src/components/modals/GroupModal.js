import { ArrowLeft, Edit, X, Check } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SearchComponent from '../SearchComponent'
import { SET_CURRENT_USER, SET_TOAST } from '../../redux/actionTypes';
// import EditAvatarModal from './EditAvatarModal'
// import BlockedConnectionsModal from './BlockedConnectionsModal'

const GroupModal = ({ setShowGroupModal, handleSelectedUserToChat, searchedUserList, setSearchedUserList }) => {

    const dispatch = useDispatch();
    const userData = useSelector(state => state.user.userInfo)
    const usersList = useSelector(state => state.user.usersList); // all the existing users in the db

    const [selectedUsersForGroup, setSelectedUsersForGroup] = useState([])



    // on creating group user can add any user by searcing the user name
    // there will be modal.. first there will be a  text box to enter username then when user click on search to search,,, it is exactly like search on sidebar
    // next below that there will be all the users in the connection list(maybe show req list or blocked connection too but then before adding them user has to unlock or approve his reuqest)
    //you can also show the slected users on the top 



    const handleSelectedGroupMember = (member) => {
        if (selectedUsersForGroup.includes(member)) {
            dispatch({ type: SET_TOAST, payload: { toastContent: "User already exists", isError: true } })
        } else {
            setSelectedUsersForGroup(prev => [...prev, member])
        }
    }




    return (
        <>
            <div className="" id="groupModal" >
                <div className="m-dialog bg-dark rounded-1">

                    <div className='d-flex align-items-center justify-content-between bg-dark p-3 text-white'>
                        <ArrowLeft size="20" className='text-secondary pointer' onClick={() => setShowGroupModal(false)} />
                        <span className={`text-secondary fs-12`} >Create Group</span>
                        {/* <X size="20" className='btn-close' onClick={() => setShowGroupModal(false)} /> */}
                    </div>

                    <div className='groupMembers d-flex bg-secondary overflow-auto'>
                        {selectedUsersForGroup?.map(x =>
                            <section className="selectedMember position-relative d-flex flex-column pointer p-1 px-2" key={x} onClick={() => setSelectedUsersForGroup(prev => prev.filter(y => y !== x))} >
                                <img src={usersList[x]?.avatar} className='position-relative' alt="" width="35px" height="35px" />
                                <X size="20" />
                                <span className='fs-12 text-center'>{x}</span>
                            </section>
                        )
                        }
                    </div>


                    <SearchComponent
                        id={"userSearchDropdownGroup"}
                        handleSelectedGroupMember={handleSelectedGroupMember}
                        searchedUserList={searchedUserList}
                        setSearchedUserList={setSearchedUserList}
                    />

                    { selectedUsersForGroup.length > 0 &&
                        <section className='pointer bold bg-success rounded-3 d-flex justify-content-center align-items-center' style={{ width: "30px", height: "30px",position: "absolute", bottom: "16px", right: "16px"  }}>
                            <Check size={20} strokeWidth={4} />
                        </section>
                    }


                </div>
            </div>
        </>
    )
}

export default GroupModal