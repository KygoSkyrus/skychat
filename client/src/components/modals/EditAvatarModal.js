import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Upload, X } from 'lucide-react'
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

import { getAvatarUrl } from '../../utils'
import { FirebaseContext } from '../../firebaseContext';
import { setToast, showEditAvatarModal, showLoader } from '../../redux/actionCreators';


const EditAvatarModal = () => {

    const dispatch = useDispatch();
    const { firebaseApp, db } = useContext(FirebaseContext);
    const storage = getStorage(firebaseApp);

    const userData = useSelector(state => state.user.userInfo)
    const isEditAvatarModalVisible = useSelector((state) => state.ui.isEditAvatarModalVisible);

    const [selectedAvatar, setSelectedAvatar] = useState(userData?.avatar)
    const [uploadAvatar, setUploadAvatar] = useState()


    async function changeAvatar() {
        if (selectedAvatar === userData?.avatar) {
            dispatch(setToast(`Select different avatar or upload new`, true))
            return;
        }
        dispatch(showLoader(true));

        let updatedAvatar;

        let storageRef = ref(storage, "skychatProfiles/" + uuidv4());

        if (uploadAvatar) {
            let ref = await uploadBytes(storageRef, uploadAvatar).then((snapshot) => {
                return snapshot.ref
            },
                (error) => {
                    console.log(error)
                },
            )

            await getDownloadURL(ref)
                .then((downloadURL) => {
                    updatedAvatar = downloadURL
                    return downloadURL
                });

            const userDocRef = doc(db, "users", userData.id);
            await updateDoc(userDocRef, {
                avatar: updatedAvatar
            });
        } else {
            if (selectedAvatar && userData.avatar !== selectedAvatar) {
                const userDocRef = doc(db, "users", userData.id);
                await updateDoc(userDocRef, {
                    avatar: selectedAvatar
                });
            }
        }
        dispatch(showLoader(false));
        dispatch(showEditAvatarModal(false))
        dispatch(setToast(`Profile updated`, false))
    }


    function setImageLabel(e) {
        let imageHolder = document.getElementById('imageHolder')
        imageHolder.innerHTML = "";
        imageHolder.style.display = 'block'
        if (e.target.files) {
            document.getElementById("dynamicLabel").innerHTML = e.target.files[0]?.name;
            if (imageHolder) {
                let div = document.createElement('div')
                div.classList.add('displayImg', 'me-2')
                div.style.backgroundImage = `url('${URL.createObjectURL(e.target.files[0])}')`
                imageHolder.appendChild(div)
            }
            setUploadAvatar(e.target.files[0])
            setSelectedAvatar(null)
        } else {
            document.getElementById("dynamicLabel").innerHTML = "Choose a file…"
        }
    }

    function handleAvatarChange(e) {
        setSelectedAvatar(e.target.src)
        document.getElementById('imageHolder').style.display = 'none'
        document.getElementById("dynamicLabel").innerHTML = "Choose a file…"
        setUploadAvatar(null)
    }

    if (!isEditAvatarModalVisible) return null;

    return (
        <>
            <div className="" id="avatarModal" >
                <div className="m-dialog d-flex flex-column justify-content-between bg-dark">
                    <X size="20" className='btn-close' onClick={() => dispatch(showEditAvatarModal(false))} />

                    <div className='avatar_grid'>
                        {Array.from(Array(20).keys()).map((x, i) =>
                            <img src={getAvatarUrl(i + 1)} alt='skychat' width='50px' onClick={e => handleAvatarChange(e)} className={`${getAvatarUrl(i + 1) === selectedAvatar ? 'slectedAvatar' : ''}`} key={i} />
                        )}
                    </div>
                    <div className='p-2 rounded-bottom select_avatar_btn'>
                        <div className="form-group d-flex align-items-center">
                            <div id='imageHolder'></div>
                            <input type="file" name="image" id="image" className="custom-input-file border-0 mb-3"
                                accept="image/*" onChange={e => setImageLabel(e)} />
                            <label htmlFor="image" id="customLabel" className='customLabel d-flex form-control' >
                                <Upload size={20} />&nbsp;&nbsp;
                                <span id='dynamicLabel'>Choose a file…</span>
                            </label>
                        </div>

                        <button className='btn w-100 mt-2' onClick={() => changeAvatar()}>Change Avatar</button>
                    </div>

                </div>
            </div>
            <div className="overlay pointer zIndex4" onClick={() => dispatch(showEditAvatarModal(false))}></div>
        </>
    )
}

export default EditAvatarModal