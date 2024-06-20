import { collection, onSnapshot, query, where } from "firebase/firestore";
import { SET_TOAST, SET_USER_INFO } from "../actionTypes";


// Thunk Action Creator
export const setUserData = (username,db) => async (dispatch) => {

    try {
        const q = query(collection(db, 'users'), where('username', '==', username));

        // Listen for real-time updates
        onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const userObj = { ...doc.data(), id: doc.id };
                dispatch({ type: SET_USER_INFO, payload: userObj });
            });
        });

    } catch (error) {
        dispatch({ type: SET_TOAST, payload: { toastContent: "Error: Unable to get user data", isError: true } })
    }
};