
import React, { createContext, } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

export const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {

    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);

    return (
        <FirebaseContext.Provider value={{ firebaseApp, db }}>
            {children}
        </FirebaseContext.Provider>
    );
};