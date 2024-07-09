import { collection, onSnapshot, query, where } from "firebase/firestore";
import { SET_USER_INFO } from "../actionTypes";
import { setToast } from "../actionCreators";

// Thunk Action Creator
export const setUserData = (username, db) => (dispatch) => {
    return new Promise((resolve, reject) => {
        try {
            const q = query(collection(db, 'users'), where('username', '==', username));
            onSnapshot(q, (querySnapshot) => {
                if (!querySnapshot.empty) {
                    querySnapshot.forEach((doc) => {
                        let userObj = { ...doc.data(), id: doc.id };
                        dispatch({ type: SET_USER_INFO, payload: userObj });
                    });
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, (error) => {
                dispatch(setToast(`Error: Unable to get user data`, true));
                reject(error);
            });
        } catch (error) {
            dispatch(setToast(`Error: Unable to get user data`, true));
            reject(error);
        }
    });
};