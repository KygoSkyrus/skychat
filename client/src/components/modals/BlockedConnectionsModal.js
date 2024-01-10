import { ArrowLeft, UserCheck, UserCheck2, X } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { updateUserDoc } from '../../utils'
import { doc, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore'

const BlockedConnectionsModal = ({ setShowBlockedConnections }) => {

    const userData = useSelector(state => state.user.userInfo)

    const firebaseApp = useSelector(state => state.firebase.firebaseApp)
    const db = getFirestore(firebaseApp);

    async function unblockSelectedUser(id) {

        //connection is moved to req list from blocked list 
        if (userData?.blockList?.hasOwnProperty(id)) {

            let connectionId = userData.blockList[id]?.id;
            let deletedTill = userData.blockList[id]?.blockedAt;

            //removing connection from block list 
            delete userData.blockList[id];

            const docRef = doc(db, "users", userData?.id);
            await updateDoc(docRef, {
                blockList: userData.blockList,
                requests: {
                    ...userData.requests,
                    [id]: {
                        id: connectionId,
                        deletedTill: deletedTill,
                        // deletedTill: serverTimestamp(),
                    }
                },
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

                    <div className="block_list">
                        {Object.keys(userData?.blockList)?.length > 0 ?
                            Object.keys(userData?.blockList).map((x, i) => {
                                return (
                                    <div className="list" key={i}>
                                        <section className="block_list_item">{x}</section>
                                        {/* <section className="deleteConnection" onClick={() => deleteConnection(x)} title="Delete connection"><Trash size={18} /></section> */}
                                        <section onClick={() => unblockSelectedUser(x)} className='unblock_overlay' title='Unblock connection'><UserCheck2 /></section>
                                    </div>
                                )
                            })
                            :
                            // <section className='emptyList'>No Blocked connections</section>
                            <section className='emptyList'>It's empty <br/>Go block someone</section>
                        }
                    </div>

                </div>
            </div>
        </>
    )
}

export default BlockedConnectionsModal