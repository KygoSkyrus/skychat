import { collection, onSnapshot, query, where } from "firebase/firestore";
import { SET_USER_INFO } from "../actionTypes";
import { setToast } from "../actionCreators";


// Thunk Action Creator
export const setUserData = (username,db) => async (dispatch) => {

    try {
        const q = query(collection(db, 'users'), where('username', '==', username));

        let ret = false;
        onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let userObj = { ...doc.data(), id: doc.id };
                console.log('uo',userObj)
                ret = true;
                dispatch({ type: SET_USER_INFO, payload: userObj });
            });
        });
        return ret

    } catch (error) {
        dispatch(setToast(`Error: Unable to get user data`, true))
    }
};