import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux'
import { thunk } from 'redux-thunk'

//reducers
import { userReducer } from './reducers/userReducer'
import { toastReducer } from './reducers/toastReducer'
import { messageReducer } from './reducers/messageReducer'
import { firebaseReducer } from './reducers/firebaseReducer'

const rootReducer = combineReducers({
  user: userReducer,
  toast: toastReducer,
  firebase: firebaseReducer,
  message: messageReducer,
})

let store = createStore(rootReducer, applyMiddleware(thunk))

export default store;