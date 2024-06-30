import React from 'react'
import { useSelector } from 'react-redux'
import { MessageCircle, MessageSquare, MessageSquareCode, MessageSquareDashed, MessageSquareDiff } from 'lucide-react';

const Loader = ({cName}) => {

    const isLoaderVisible = useSelector((state) => state.ui.isLoaderVisible);


    console.log('`````````````````Loader')


    if (!isLoaderVisible) return null;

    return (
        <>
            <div className={`loader zIndex6 ${cName}`}>
                <section>
                    <div className="custom-loader"></div>
                    {/* <MessageSquare size={44} className='svg1'/>
                    <MessageSquareDashed size={44} className='svg2'/> */}
                </section>
            </div>
            <div className="overlay pointer zIndex4"></div>
        </>
    )
}

export default Loader