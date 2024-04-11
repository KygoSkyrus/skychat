import { Search } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux';
import { debounce, hideSearchedUsersList } from '../utils'


const SearchComponent = ({ handleSelectedUserToChat,handleSelectedGroupMember, searchedUserList, setSearchedUserList, id }) => {


    const usersList = useSelector(state => state.user.usersList); // all the existing users in the db


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

    async function searchUser(e) {
        // let result = usersList.filter(user => user?.username?.includes(e.target.value))
        let result = Object.keys(usersList).filter(user => user.includes(e.target.value))

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


    const handleSelect=(x)=>{
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
                        <section className="dropdown-item pointer p-1 px-2" key={x} onClick={e => handleSelect(x)}>
                            <img src={usersList[x]?.avatar} className='me-2' alt="" />
                            <span>{x}</span>
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