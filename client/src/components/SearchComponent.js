import { Lock, LockIcon, LockKeyhole, LockKeyholeIcon, Search } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { debounce, hideSearchedUsersList } from '../utils'
import { SET_TOAST } from '../redux/actionTypes';


const SearchComponent = ({ handleSelectedUserToChat, handleSelectedGroupMember, searchedUserList, setSearchedUserList, id }) => {

    
    const dispatch = useDispatch();
    const usersList = useSelector(state => state.user.usersList); // all the existing users in the db
    const userData = useSelector(state => state.user.userInfo)

    const handleSearchUser = debounce(searchUser, 1000);

    const handleChangeUserSearch = (e) => {
        setSearchedUserList(undefined)  //clearing all records
        let userSearchDropdown = document.getElementById(id)

        if (e.target.value.length === 0) {
            userSearchDropdown?.classList.add('d-none')//hide search list
        } else {
            userSearchDropdown?.classList.remove('d-none')//make search result visible
            userSearchDropdown.querySelector('.custom-loader').classList.remove('d-none')//showing loader while typing
            userSearchDropdown.querySelector('.no-user')?.classList.add('d-none')//hiding no item message while typing
            handleSearchUser(e);
        }
    }

    // NOTE::: Move the "setSearchedUserList" to this component,, why its being passed from top to here? when its main use is here only

    async function searchUser(e) {
        let result = Object.keys(usersList).filter(user => user.includes(e.target.value) && user !== userData.username)//excludes self

        let userSearchDropdown = document.getElementById(id)
        let noResult = userSearchDropdown.querySelector('.no-user')
        userSearchDropdown.querySelector('.custom-loader')?.classList.add('d-none')//showing loader while typing

        if (result.length === 0) {
            noResult?.classList.remove('d-none')
            setSearchedUserList(undefined)  //clearing all records
        } else {
            noResult?.classList.add('d-none')
            setSearchedUserList(result)
        }
    }


    const handleSelect = (x, privacy) => {
        if (privacy) {
            dispatch({ type: SET_TOAST, payload: { toastContent: id === "userSearchDropdownGroup"? "Can not add private account to a group *" : "Messaging private account is prohibited *", isError: true } })
            return;
        }
        id === "userSearchDropdownGroup" ? handleSelectedGroupMember(x) : handleSelectedUserToChat(x)
    }




    return (
        <>
            <div className="p-2 py-1 m-2 d-flex align-items-center border border-2 rounded-pill">
                <span><Search /></span>
                {/* <span>Search a connection</span> */}
                <input type="search" onChange={e => handleChangeUserSearch(e)} className={`rounded-3 p-1 px-2 w-100 ${id === 'userSearchDropdownGroup' && ' bg-dark text-light'}`} placeholder="find friends" />
            </div>

            <div className="d-none" id={id}>
                {searchedUserList?.map(x => {
                    return (
                        <section className="dropdown-item pointer p-1 px-2 d-flex align-items-center justify-content-between" key={x} onClick={() => handleSelect(x, usersList[x]?.privacy)}>
                            <span>
                                <img src={usersList[x]?.avatar} className='me-2' alt="" />
                                <span>{x}</span>
                            </span>
                            {usersList[x]?.privacy &&
                                <LockIcon size={16} />
                            }
                        </section>
                    )
                })}
                <div className="no-user d-none text-center">No user found</div>
                <div className="custom-loader d-none" onClick={() => hideSearchedUsersList(setSearchedUserList)} ></div>
            </div>
        </>

    )
}

export default SearchComponent