import { ArrowLeft, UserCheck, UserCheck2, X } from 'lucide-react'
import React, { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserDoc } from '../../utils'
import { doc, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore'
import { FirebaseContext } from '../../firebaseContext'
import { showBlockedConnectionsModal, showLoader } from '../../redux/actionCreators'

const BlockedConnectionsModal = () => {

    const dispatch = useDispatch();

    const userData = useSelector(state => state.user.userInfo)
    const usersList = useSelector(state => state.user.usersList); // all the existing users in the db
    const isBlockedConnectionsModalVisible = useSelector((state) => state.ui.isBlockedConnectionsModalVisible);

    // const firebaseApp = useSelector(state => state.firebase.firebaseApp)
    // const db = getFirestore(firebaseApp);
    const { db } = useContext(FirebaseContext);

    async function unblockSelectedUser(id) {

        //connection is moved to req list from blocked list 
        if (userData?.blockList?.hasOwnProperty(id)) {
            dispatch(showLoader(true));

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
            dispatch(showLoader(false));
        }
    }

    if(!isBlockedConnectionsModalVisible) return null;

    return (
        <>
            <div className="" id="blockedConnModal" >
                <div className="m-dialog rounded-1">

                    <div className='d-flex align-items-center justify-content-between bg-dark p-3'>
                        <ArrowLeft size="20" className='text-secondary pointer' onClick={() => dispatch(showBlockedConnectionsModal(false))} />
                        <span className='text-secondary fs-12'>Blocked connections</span>
                    </div>

                    <div className="block_list">
                        {Object.keys(userData?.blockList)?.length > 0 ?
                            Object.keys(userData?.blockList).map((x, i) => {
                                return (
                                    <div className="list" key={i}>
                                        <section className="block_list_item">
                                            <img src={usersList[x]?.avatar} className="me-2" alt="" />
                                            <span>{x}</span>
                                        </section>
                                        {/* <section className="deleteConnection" onClick={() => deleteConnection(x)} title="Delete connection"><Trash size={18} /></section> */}
                                        <section onClick={() => unblockSelectedUser(x)} className='unblock_overlay' title='Unblock connection'><UserCheck2 /></section>
                                    </div>
                                )
                            })
                            :
                            // <section className='emptyList'>No Blocked connections</section>
                            <section className='emptyList'>It's empty <br />Go block someone</section>
                        }
                    </div>

                </div>
            </div>
            <div className="overlay pointer zIndex4" onClick={() => dispatch(showBlockedConnectionsModal(false))}></div>
        </>
    )
}

export default BlockedConnectionsModal