import { createStore } from 'redux'
import { combineReducers } from 'redux'

//reducers
import {userReducer} from './reducers/userReducer'
import {messageReducer} from './reducers/messageReducer'
import { firebaseReducer } from './reducers/firebaseReducer'


const rootReducer = combineReducers({
    // Define a top-level state field named `user`, handled by `userReducer`
    user: userReducer,
    firebase: firebaseReducer,
    message: messageReducer,
  })

let store = createStore(rootReducer)


export default store;