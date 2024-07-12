import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { LockIcon, Search } from 'lucide-react'
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

import { debounce } from '../utils'
import { setToast } from '../redux/actionCreators';
import { FirebaseContext } from '../firebaseContext';


const SearchComponent = ({ handleSelectedUserToChat, handleSelectedGroupMember, id }) => {

    const dispatch = useDispatch();
    const searchInputRef = useRef();
    const { db } = useContext(FirebaseContext);
    // const usersList = useSelector(state => state.user.usersList); // all the existing users in db
    const userData = useSelector(state => state.user.userInfo)
    const resetUserSearchList = useSelector(state => state.ui.resetUserSearchList)
    const [searchedUserList, setSearchedUserList] = useState(undefined) // queries user list

    useEffect(() => {
        if (resetUserSearchList) {
            setSearchedUserList(undefined); // clearing all records
            searchInputRef.current.value = "";
        }
    }, [resetUserSearchList])

    const handleSearchUser = debounce(searchUser, 1500);

    const handleChangeUserSearch = (e) => {
        setSearchedUserList(undefined)  //clearing all records
        let userSearchDropdown = document.getElementById(id)

        if (e.target.value.length === 0) {
            userSearchDropdown?.classList.add('d-none'); // hide search list
        } else {
            userSearchDropdown?.classList.remove('d-none'); // make search result visible
            userSearchDropdown?.querySelector('.custom-loader')?.classList.remove('d-none'); // showing loader while typing
            userSearchDropdown?.querySelector('.no-user')?.classList.add('d-none'); // hiding no item message while typing
            handleSearchUser(e);
        }
    }

    async function searchUser(e) {
        let userSearchDropdown = document.getElementById(id)
        try {
            // let result = Object.keys(usersList)?.filter(user => user.includes(e.target?.value?.toLowerCase()) && user !== userData.username)//excludes self
            let result = {};
            let q = query(collection(db, "users"),
                where("username", ">=", e.target?.value?.toLowerCase()),
                where("username", "<=", e.target?.value?.toLowerCase() + "\uf8ff"),
                where("username", "!=", userData?.username),
                limit(15));
            const querySnapshot = await getDocs(q);
            console.log('querySnapshot', querySnapshot)
            for (const doc of querySnapshot?.docs) {
                const data = doc.data();
                result[data?.username] = {
                    avatar: data?.avatar,
                    privacy: data?.privacy,
                };
            }

            let noResult = userSearchDropdown.querySelector('.no-user')
            userSearchDropdown.querySelector('.custom-loader')?.classList.add('d-none') // show loader while typing

            if (Object.keys(result)?.length === 0) {
                console.log('res 0')
                noResult?.classList.remove('d-none')
                setSearchedUserList(undefined);
            } else {
                noResult?.classList.add('d-none')
                setSearchedUserList(result)
            }
        } catch (error) {
            console.log('error searching user', error)
            setSearchedUserList(undefined);
            userSearchDropdown.querySelector('.custom-loader')?.classList.add('d-none');
            searchInputRef.current.value = "";
        }
    }

    const handleSelect = (x, privacy) => {
        if (privacy) {
            dispatch(setToast(`${id === "userSearchDropdownGroup" ? "Can not add private account to a group *" : "Messaging private account is prohibited *"}`, true))
            return;
        }
        id === "userSearchDropdownGroup" ? handleSelectedGroupMember(x) : handleSelectedUserToChat(x)
    }

    return (
        <>
            <div className="p-2 py-1 m-2 d-flex align-items-center border border-2 br-16">
                <span><Search /></span>
                <input type="search" ref={searchInputRef} onChange={e => handleChangeUserSearch(e)} className={`rounded-3 p-1 px-2 w-100 ${id === 'userSearchDropdownGroup' && ' bg-dark text-light'}`} placeholder="find friends" />
            </div>

            <div className="d-none" id={id}>
                {searchedUserList &&
                    Object.keys(searchedUserList)?.map(x =>
                        <section className="dropdown-item pointer p-1 px-2 d-flex align-items-center justify-content-between" key={x} onClick={() => handleSelect(x, searchedUserList[x]?.privacy)}>
                            <span>
                                <img src={searchedUserList[x]?.avatar} className='me-2 rounded-circle' alt="" />
                                <span>{x}</span>
                            </span>
                            {searchedUserList[x]?.privacy &&
                                <LockIcon size={16} />
                            }
                        </section>
                    )
                }
                <div className="no-user d-none text-center">No user found</div>
                <div className="custom-loader d-none"></div>
            </div>
        </>
    )
}

export default SearchComponent