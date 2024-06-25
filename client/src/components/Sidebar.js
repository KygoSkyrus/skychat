import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getAuth } from 'firebase/auth'
import { Cog, LogOut, Plus, Tally1, Users2} from 'lucide-react'

import UserModal from './modals/UserModal'
import GroupModal from './modals/GroupModal'
import SearchComponent from './SearchComponent'
import { RESET_USERS_LIST, SET_SIDEBAR, showConfirmationModal } from '../redux/actionTypes'


const Sidebar = ({ handleSelectedUserToChat }) => {

    const auth = getAuth();
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser)
    const userData = useSelector(state => state.user.userInfo)

    const [showUserModal, setShowUserModal] = useState(false)
    const [showGroupModal, setShowGroupModal] = useState(false)


    const signOut = () => {
        auth.signOut()
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            <div className="w3-sidebar w3-animate-left w3-bar-block w3-border-right" id="mySidebar" >
                <div style={{ height: "75%" }}>
                    <span onClick={() => { dispatch({ type: SET_SIDEBAR, payload: false }); dispatch({ type: RESET_USERS_LIST, payload: true });}} className="pointer" style={{ position: "absolute", right: "-30px", top: "50%", transform: "translateY(-50%)", color: "#fff" }} >
                        <Tally1 strokeWidth={4} />
                    </span>

                    <SearchComponent
                        id={"userSearchDropdown"}
                        handleSelectedUserToChat={handleSelectedUserToChat}
                    />
                </div>
                <div>
                    <section className='m-1' onClick={() => setShowGroupModal(true)}>
                        <button className='w-100 px-2 py-2 br-16 d-flex justify-content-between' style={{background: "linear-gradient(#f8f9fa, #e1e1e1)"}}>
                            <span>Start a group</span>
                            <span>
                                <Users2 size={16} />
                                <Plus size={12} />
                            </span>
                        </button>
                    </section>
                    <section className="myProfile px-2 m-1 br-16">
                        <div>
                            <span onClick={() => setShowUserModal(true)} >
                                <img src={userData?.avatar} alt="" className="avatar pointer me-2" />
                                <Cog className='setting-icon' />
                            </span>
                            {currentUser?.displayName}
                        </div>
                        <LogOut size="20" onClick={() => dispatch(showConfirmationModal('Do you want to logout of your account?', () => signOut()))} className='pointer' />  
                    </section>
                </div>

            </div>

            {showUserModal &&
                <>
                    <UserModal setShowUserModal={setShowUserModal} />
                    <div className="overlay pointer zIndex4" onClick={() => setShowUserModal(false)}></div>
                </>
            }

            {showGroupModal &&
                <>
                    <GroupModal
                        type="create_group"
                        handleSelectedUserToChat={handleSelectedUserToChat}
                        setShowGroupModal={setShowGroupModal}
                    />
                    <div className="overlay pointer zIndex4" onClick={() => setShowGroupModal(false)}></div>
                </>
            }
        </>
    )
}

export default Sidebar