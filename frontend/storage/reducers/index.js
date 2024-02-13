import { combineReducers } from "redux";
import userReducer from './user'
import usersReducer from './users'

export default combineReducers({
    user: userReducer,
    users: usersReducer
})