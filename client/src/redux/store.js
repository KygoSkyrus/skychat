import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux'
import { thunk } from 'redux-thunk'

//reducers
import { userReducer } from './reducers/userReducer'
import { toastReducer } from './reducers/toastReducer'
import { uiReducer } from './reducers/uiReducer'

const rootReducer = combineReducers({
  user: userReducer,
  toast: toastReducer,
  ui: uiReducer,
})

let store = createStore(rootReducer, applyMiddleware(thunk))
export default store;