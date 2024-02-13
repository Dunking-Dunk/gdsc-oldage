import firebase from "firebase";

import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA, USERS_LIKE_STATE_CHANGE, } from "../constants/index";

export const clearData = () => (dispatch) => {
    dispatch({type: CLEAR_DATA})
}
export const fetchUser = () => async (dispatch) => {
    try {
        const response = await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get()
        dispatch({ type: USER_STATE_CHANGE, currentUser: response.data() })
    } catch (err) {
        console.log(err)
    }

}

export const fetchUserPosts = () => async (dispatch) => {
    try {
        firebase.firestore().collection("posts").doc(firebase.auth().currentUser.uid).collection('userPosts').orderBy("creation", "asc").get().then((snapshot) => {
            let posts = snapshot.docs.map(doc => {
                const data = doc.data()
                const id = doc.id
                return { id, ...data }
            })
            dispatch({ type: USER_POSTS_STATE_CHANGE, posts: posts })
        })
    } catch (err) {
        console.log(err)
    }
}

export const fetchUserFollowing = () => async (dispatch) => {
    try {
        firebase.firestore().collection("following").doc(firebase.auth().currentUser.uid).collection('userFollowing').onSnapshot((snapshot) => {
            let following = snapshot.docs.map(doc => {
                const id = doc.id
                return id
            })
            let allfollowing = [...following,firebase.auth().currentUser.uid]
            dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following: allfollowing})
            for (let i = 0; i < allfollowing.length; i++) {
                dispatch(fetchUsersData(allfollowing[i]))
            }
        } )
    } catch (err) {
        console.log(err)
    }

}

export const fetchUsersData = (uid) => (dispatch, getState) => {
    const found = getState().users.users.some(el => el.uid === uid)
    try {
        if (!found) {
            firebase.firestore().collection("users").doc(uid).get().then((snapshot) => {
                let user = snapshot.data()
                user.uid = snapshot.id
                dispatch({ type: USERS_DATA_STATE_CHANGE, user })
                dispatch(fetchUserFollowingPosts(user.uid))
            })
        }
    } catch (err) {
        console.log(err)
    }
}

export const fetchUserFollowingPosts = (uid) => (dispatch, getState) => {
    try {
        firebase.firestore().collection("posts").doc(uid).collection('userPosts').orderBy("creation", "desc").get().then((snapshot) => {
            const uid = snapshot.query._.C_.path.segments[1]
            const found = getState().users.users.find(el => el.uid === uid)

            let posts = snapshot.docs.map(doc => {
                const data = doc.data()
                const id = doc.id
                return { id, ...data, found }
            })
            for (let i = 0; i < posts.length; i++) {
                dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
            }
            dispatch({ type: USERS_POSTS_STATE_CHANGE, posts: posts, uid })
        })
    } catch (err) {
        console.log(err)
    }
}

export const fetchUsersFollowingLikes = (uid, postId) => (dispatch, getState) => {
    try {
        firebase.firestore().collection("posts").doc(uid).collection('userPosts').doc(postId).collection("likes").doc(firebase.auth().currentUser.uid).onSnapshot((snapshot) => {
            const postId = snapshot.ref.path.split('/')[3]
            let currentUserLike = false
            if (snapshot.exists) {
                currentUserLike = true
            }
            dispatch({type: USERS_LIKE_STATE_CHANGE, postId, currentUserLike})
        })
    } catch (err) {
        console.log(err)
    }
}
