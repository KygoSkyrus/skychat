import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { getAuth } from 'firebase/auth'
import { LogOut, Search, SearchCheck, Tally1, X } from 'lucide-react'

import { debounce, hideSearchedUsersList, sidebarVisibility } from '../utils'
import UserModal from './modals/UserModal'


const Sidebar = ({ handleSelectedUserToChat, searchedUserList, setSearchedUserList }) => {

    const auth = getAuth();
    const currentUser = useSelector(state => state.user.currentUser)
    const userData = useSelector(state => state.user.userInfo)
    const usersList = useSelector(state => state.user.usersList); // all the existing users in the db


    const [showUserModal, setShowUserModal] = useState(false)


    const handleSearchUser = debounce(searchUser, 1000);

    const handleChangeUserSearch = (e) => {
        setSearchedUserList(undefined)  //clearing all records
        let userSearchDropdown = document.getElementById('userSearchDropdown')

        if (e.target.value.length === 0) {
            userSearchDropdown?.classList.add('d-none')//hide search list
        } else {
            userSearchDropdown?.classList.remove('d-none')//make search result visible
            document.querySelector('.custom-loader').classList.remove('d-none')//showing loader while typing
            document.querySelector('.no-user')?.classList.add('d-none')//hiding no item message while typing
            handleSearchUser(e);
        }
    }

    async function searchUser(e) {
        // let result = usersList.filter(user => user?.username?.includes(e.target.value))
        let result = Object.keys(usersList).filter(user => user.includes(e.target.value))

        let noResult = document.querySelector('.no-user')
        document.querySelector('.custom-loader')?.classList.add('d-none')//showing loader while typing

        if (result.length === 0) {
            noResult?.classList.remove('d-none')
            setSearchedUserList(undefined)  //clearing all records
        } else {
            noResult?.classList.add('d-none')
            setSearchedUserList(result)
        }
    }


    const signOut = () => {
        auth.signOut()
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            <div className="w3-sidebar w3-animate-left w3-bar-block w3-border-right" style={{ display: "none" }} id="mySidebar" >
                <div style={{ height: "90%" }}>

                    <span onClick={() => sidebarVisibility(false, setSearchedUserList)} className="pointer" style={{ position: "absolute", right: "-30px", top: "50%", transform: "translateY(-50%)", color: "#fff" }} >
                        {/* <X size="20" /> */}
                        <Tally1 strokeWidth={4} />
                    </span>

                    <div className="p-2 py-1 m-2 d-flex align-items-center border border-2 rounded-pill">
                        <span><Search /></span>
                        {/* <span>Search a connection</span> */}
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
                    </div>
                </div>
                <section className="myProfile px-2">
                    <span>
                        <img src={userData?.avatar} alt="" className="avatar pointer me-2" onClick={() => setShowUserModal(true)} />
                        {currentUser?.displayName}
                    </span>
                    <LogOut size="20" onClick={() => signOut()} className='pointer' />
                </section>

            </div>

            {showUserModal &&
                <>
                    <UserModal setShowUserModal={setShowUserModal} />
                    <div className="overlay pointer zIndex4" onClick={() => setShowUserModal(false)}></div>
                </>
            }
        </>
    )
}

export default Sidebar