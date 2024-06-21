import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getAuth } from 'firebase/auth'
import { Cog, LogOut, Plus, Search, SearchCheck, Settings, Tally1, Users2, X } from 'lucide-react'

import { sidebarVisibility } from '../utils'
import UserModal from './modals/UserModal'
import GroupModal from './modals/GroupModal'
import SearchComponent from './SearchComponent'
import { RESET_USERS_LIST } from '../redux/actionTypes'


const Sidebar = ({ handleSelectedUserToChat }) => {

    const auth = getAuth();
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.user.currentUser)
    const userData = useSelector(state => state.user.userInfo)
    // const usersList = useSelector(state => state.user.usersList); // all the existing users in the db


    const [showUserModal, setShowUserModal] = useState(false)

    const [showGroupModal, setShowGroupModal] = useState(false)


    // const handleSearchUser = debounce(searchUser, 1000);

    // const handleChangeUserSearch = (e) => {
    //     setSearchedUserList(undefined)  //clearing all records
    //     let userSearchDropdown = document.getElementById('userSearchDropdown')

    //     if (e.target.value.length === 0) {
    //         userSearchDropdown?.classList.add('d-none')//hide search list
    //     } else {
    //         userSearchDropdown?.classList.remove('d-none')//make search result visible
    //         document.querySelector('.custom-loader').classList.remove('d-none')//showing loader while typing
    //         document.querySelector('.no-user')?.classList.add('d-none')//hiding no item message while typing
    //         handleSearchUser(e);
    //     }
    // }

    // async function searchUser(e) {
    //     // let result = usersList.filter(user => user?.username?.includes(e.target.value))
    //     let result = Object.keys(usersList).filter(user => user.includes(e.target.value))

    //     let noResult = document.querySelector('.no-user')
    //     document.querySelector('.custom-loader')?.classList.add('d-none')//showing loader while typing

    //     if (result.length === 0) {
    //         noResult?.classList.remove('d-none')
    //         setSearchedUserList(undefined)  //clearing all records
    //     } else {
    //         noResult?.classList.add('d-none')
    //         setSearchedUserList(result)
    //     }
    // }


    const signOut = () => {
        auth.signOut()
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            <div className="w3-sidebar w3-animate-left w3-bar-block w3-border-right" style={{ display: "none" }} id="mySidebar" >
                <div style={{ height: "75%" }}>

                    <span onClick={() => {sidebarVisibility(false); dispatch({ type: RESET_USERS_LIST, payload: true });}} className="pointer" style={{ position: "absolute", right: "-30px", top: "50%", transform: "translateY(-50%)", color: "#fff" }} >
                        {/* <X size="20" /> */}
                        <Tally1 strokeWidth={4} />
                    </span>

                    <SearchComponent
                        id={"userSearchDropdown"}
                        handleSelectedUserToChat={handleSelectedUserToChat}
                        // searchedUserList={searchedUserList}
                        // setSearchedUserList={setSearchedUserList}
                    />

                </div>
                <div>
                    <section onClick={() => setShowGroupModal(true)}>
                        <button className='w-100 px-2 py-2 bg-light d-flex justify-content-between'>
                            <span>Start a group</span>
                            <span>
                                <Users2 size={16} />
                                <Plus size={12} />
                            </span>
                        </button>
                    </section>
                    <section className="myProfile px-2">
                        <div>
                            <span onClick={() => setShowUserModal(true)} >
                                <img src={userData?.avatar} alt="" className="avatar pointer me-2" />
                                <Cog className='setting-icon' />
                            </span>
                            {currentUser?.displayName}
                        </div>
                        <LogOut size="20" onClick={() => signOut()} className='pointer' />
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
                        setShowGroupModal={setShowGroupModal}
                        handleSelectedUserToChat={handleSelectedUserToChat}
                        // searchedUserList={searchedUserList}
                        // setSearchedUserList={setSearchedUserList}
                        type="create_group"
                    />
                    <div className="overlay pointer zIndex4" onClick={() => setShowGroupModal(false)}></div>
                </>
            }
        </>
    )
}

export default Sidebar