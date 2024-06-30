import { X } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { getPatternUrl } from '../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { showLoader, showThemeModal } from '../../redux/actionCreators'
import { doc, updateDoc } from 'firebase/firestore'
import { FirebaseContext } from '../../firebaseContext'


const ThemeModal = () => {

    const dispatch = useDispatch()
    const { db } = useContext(FirebaseContext);
    const userData = useSelector(state => state.user.userInfo);
    const isThemeModalVisible = useSelector((state) => state.ui.isThemeModalVisible);
    
    const [selectedPattern, setSelectedPattern] = useState('');

    async function setPattern(img) {
        dispatch(showLoader(true));
        // const body = document.querySelector('body');
        // body.style.backgroundImage = `url('${img}')`;
        setSelectedPattern(img);
        if (userData?.theme !== img) {
            const docRef = doc(db, "users", userData?.id);
            await updateDoc(docRef, {
                theme: img
            });
        }
        dispatch(showLoader(false));
    }

    if (!isThemeModalVisible) return null;

    return (
        <>
            <div className="" id="themeModal" >
                <div className="m-dialog d-flex flex-column justify-content-between bg-dark rounded-1">
                    {/* <button type="button" className="btn-close"></button> */}
                    <X size="20" className='btn-close' onClick={() => dispatch(showThemeModal(false))} />

                    <div className='avatar_grid'>
                        {Array.from(Array(40).keys()).map((x, i) => {
                            return <img src={getPatternUrl(i + 1)} key={i} alt='skychat' onClick={e => setPattern(e.target.src)}
                                className={`${getPatternUrl(i + 1) === selectedPattern ? 'selectedPattern' : ''}`} />
                        })}
                    </div>

                </div>
            </div>
            <div className="overlay pointer zIndex4" onClick={() => dispatch(showThemeModal(false))}></div>
        </>
    )
}

export default ThemeModal