import { createStore } from 'redux'
import { combineReducers } from 'redux'

//reducers
import {userReducer} from './reducers/userReducer'
import {messageReducer} from './reducers/messageReducer'


const rootReducer = combineReducers({
    // Define a top-level state field named `user`, handled by `userReducer`
    user: userReducer,
    message: messageReducer,
  })

let store = createStore(rootReducer)


export default store;