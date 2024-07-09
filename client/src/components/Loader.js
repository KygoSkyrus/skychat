import React from 'react'
import { useSelector } from 'react-redux'

const Loader = ({cName}) => {
    
    const isLoaderVisible = useSelector((state) => state.ui.isLoaderVisible);

    if (!isLoaderVisible) return null;
    return (
        <>
            <div className={`loader zIndex6 ${cName}`}>
                <section>
                    <div className="custom-loader"></div>
                </section>
            </div>
            <div className="overlay pointer zIndex4"></div>
        </>
    )
}

export default Loader