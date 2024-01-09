import { ArrowLeft, UserCheck, UserCheck2, X } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

const BlockedConnectionsModal = ({ setShowBlockedConnections }) => {

    const userData = useSelector(state => state.user.userInfo)

    async function unblockSelectedUser(id) {

        //connection is moved to req list from blocked list 
        console.log('id', id)
        //current only connection list is handled here
        if (userData?.blockList?.hasOwnProperty(id)) {

            let connectionId = userData.connections[id]?.id;
            delete userData.connections[id];

            //deleting connection req from req list 
            const docRef = doc(db, "users", userData?.id);
            await updateDoc(docRef, {
                connections: userData.connections,
                blockList: {
                    ...userData.blockList,
                    [id]: {
                        id: connectionId,
                        blockedAt: serverTimestamp(),
                    }
                }
            });

            // setSelectedUserToChat(undefined)//only call when inner block button is clicked, not on list's btn, so that component wont render bcz of unneccesary state update
        }
    }


    return (
        <>
            <div className="" id="blockedConnModal" >
                <div className="m-dialog rounded-1">

                    <div className='d-flex align-items-center justify-content-between bg-dark p-3'>
                        <ArrowLeft size="20" className='text-secondary pointer' onClick={() => setShowBlockedConnections(false)} />
                        <span className='text-secondary fs-12'>Blocked connections</span>
                    </div>

                    <div className="block_list">{
                        Object.keys(userData?.blockList).map((x, i) => {
                            return (
                                <>
                                    <div className="list" key={i}>
                                        <section className="block_list_item" onClick={() => unblockSelectedUser(x)} >{x}</section>
                                        {/* <section className="deleteConnection" onClick={() => deleteConnection(x)} title="Delete connection"><Trash size={18} /></section> */}
                                        <section className='unblock_overlay'><UserCheck2 /></section>
                                    </div>
                                </>
                            )
                        })}
                    </div>

                </div>
            </div>
        </>
    )
}

export default BlockedConnectionsModal