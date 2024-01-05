import React from 'react'
import { useSelector } from 'react-redux'

import { getAuth } from 'firebase/auth'
import { LogOut, X } from 'lucide-react'

import { debounce, hideSearchedUsersList, sidebarVisibility } from '../utils'


const Sidebar = ({handleSelectedUserToChat, searchedUserList, setSearchedUserList, }) => {

    const auth = getAuth();
    const currentUser = useSelector(state => state.user.currentUser)
    const userData = useSelector(state=> state.user.userInfo)


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
      let result = allUsersList.filter(user => user?.username?.includes(e.target.value))
  
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

        <div className="w3-sidebar  w3-animate-left w3-bar-block w3-border-right" style={{ display: "none" }} id="mySidebar" >
            <div style={{ height: "90%" }}>
                {/* <div className="sidebar-head">
              <span>close</span>
              <span onClick={() => sidebarVisibility(false)} className="closeButton" > &times; </span>
            </div> */}

                <span onClick={() => sidebarVisibility(false, setSearchedUserList)} className="pointer" style={{ position: "absolute", right: "-23px", color: "#fff" }} >
                    <X size="20" />
                </span>

                <div className="p-2">
                    <input type="search" onChange={e => handleChangeUserSearch(e)} className="rounded-3 p-1 px-2 w-100" placeholder="find friends" />
                </div>

                <div className="d-none" id="userSearchDropdown">
                    {searchedUserList?.map(x => {
                        return (
                            <section className="dropdown-item pointer" key={x.id} onClick={e => handleSelectedUserToChat(x?.username)} style={{ width: "unset", margin: "0 0.5rem" }}>
                                {/* <img className="me-3" src={x.image} alt="shoppitt" height="50px" width="55px" /> */}
                                <span>{x?.username}</span>
                            </section>
                        )
                    })}
                    <div className="no-user d-none text-center">No user found</div>
                    <div className="custom-loader d-none" onClick={() => hideSearchedUsersList(setSearchedUserList)} ></div>
                </div>
            </div>
            <section className="myProfile px-2">
                <span>
                    <img src={userData?.avatar} alt="" className="avatar me-2" />
                    {currentUser?.displayName}
                </span>
                <LogOut size="20" onClick={() => signOut()} className='pointer' />
            </section>

        </div>

    )
}

export default Sidebar