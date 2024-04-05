import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { getAuth } from 'firebase/auth'
import { Cog, LogOut,  Plus, Search, SearchCheck, Settings,  Tally1, Users2, X } from 'lucide-react'

import { debounce, hideSearchedUsersList, sidebarVisibility } from '../utils'
import UserModal from './modals/UserModal'
import GroupModal from './modals/GroupModal'
import SearchComponent from './SearchComponent'


const Sidebar = ({ handleSelectedUserToChat, searchedUserList, setSearchedUserList }) => {

    const auth = getAuth();
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

                    <span onClick={() => sidebarVisibility(false, setSearchedUserList)} className="pointer" style={{ position: "absolute", right: "-30px", top: "50%", transform: "translateY(-50%)", color: "#fff" }} >
                        {/* <X size="20" /> */}
                        <Tally1 strokeWidth={4} />
                    </span>

                    <SearchComponent
                        id={"userSearchDropdown"}
                        handleSelectedUserToChat={handleSelectedUserToChat}
                        searchedUserList={searchedUserList}
                        setSearchedUserList={setSearchedUserList}
                    />


                    {/* <div className="p-2 py-1 m-2 d-flex align-items-center border border-2 rounded-pill">
                        <span><Search /></span>
                        <input type="search" onChange={e => handleChangeUserSearch(e)} className="rounded-3 p-1 px-2 w-100" placeholder="find friends" />
                    </div>

                    <div className="d-none" id="userSearchDropdown">
                        {searchedUserList?.map(x => {
                            return (
                                <section className="dropdown-item pointer p-1 px-2" key={x} onClick={e => handleSelectedUserToChat(x)}>
                                    <img src={usersList[x]?.avatar} className='me-2' alt="" />
                                    <span>{x}</span>
                                </section>
                            )
                        })}
                        <div className="no-user d-none text-center">No user found</div>
                        <div className="custom-loader d-none" onClick={() => hideSearchedUsersList(setSearchedUserList)} ></div>
                    </div> */}

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
                        <span>
                            <img src={userData?.avatar} alt="" className="avatar pointer me-2" onClick={() => setShowUserModal(true)} />
                            <Cog className='setting-icon'/>
                            {currentUser?.displayName}
                        </span>
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
                        searchedUserList={searchedUserList}
                        setSearchedUserList={setSearchedUserList} 
                    />
                    <div className="overlay pointer zIndex4" onClick={() => setShowGroupModal(false)}></div>
                </>
            }
        </>
    )
}

export default Sidebar