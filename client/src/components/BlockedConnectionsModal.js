import { ArrowLeft, X } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

const BlockedConnectionsModal = ({ setShowBlockedConnections }) => {

    const userData = useSelector(state => state.user.userInfo)

    async function unblockSelectedUser(id) {

    }
// glassify the overlay
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
                                    <section className='unblock_overlay'>Unblock connection</section>
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