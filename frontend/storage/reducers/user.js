const initialState = {
    currentUser: null,
    posts: [],
    following: []
}

import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, CLEAR_DATA } from "../constants/index";

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }
        case USER_FOLLOWING_STATE_CHANGE:
            return {
                ...state,
                following: action.following
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state
    }

}

export default userReducer