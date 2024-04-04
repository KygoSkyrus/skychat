import React from 'react'

const SearchComponent = () => {
    return (
        <>    <div className="p-2 py-1 m-2 d-flex align-items-center border border-2 rounded-pill">
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
        </>

    )
}

export default SearchComponent