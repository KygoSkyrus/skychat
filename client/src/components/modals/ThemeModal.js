import { Trash, Upload, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { getPatternUrl } from '../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { SET_THEME } from '../../redux/actionTypes'
import { showThemeModal } from '../../redux/actionCreators'


const ThemeModal = () => {

    const dispatch = useDispatch()
    const [selectedPattern, setSelectedPattern] = useState('');
    const isThemeModalVisible = useSelector((state) => state.ui.isThemeModalVisible);

    function setPattern(img) {
        // const body = document.querySelector('body');
        // body.style.backgroundImage = `url('${img}')`;
        setSelectedPattern(img);
        if(localStorage.getItem('theme') !== img){
            localStorage.setItem('theme',img)
            dispatch({ type: SET_THEME, payload: img })
        }
    }

    if(!isThemeModalVisible) return null;

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