import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { View, Text, StyleSheet, Image, FlatList, Button,TouchableOpacity, Modal } from 'react-native'
import firebase from 'firebase'

import Colors from '../../constants/Colors'


const ProfileScreens = props => {
    const [userPost, setUserPost] = useState(null)
    const [userPosts, setUserPosts] = useState([])
    const [following, setFollowing] = useState(false)
    const [othersFollowing, setOthersFollowing] = useState([])
    const [otherFollowers, setOtherFollowers] = useState([])
    const [userFollower, setUserFollower] = useState()

    const posts = useSelector((state) => state.user.posts)
    const user = useSelector((state) => state.user.currentUser)
    const followers = useSelector((state) => state.user.following)

    useEffect(() => {
        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUserPost(user)
            setUserPosts(posts)
            firebase.firestore().collection("following").doc(props.route.params.uid).collection('Followers').onSnapshot((snapshot) => {
                let Follower = snapshot.docs.map(doc => {
                    const id = doc.id
                    return id
                })
                setUserFollower(Follower)
            })
        } else {
            firebase.firestore().collection("users").doc(props.route.params.uid).get().then((snapshot) => {
                if (snapshot.exists) {
                    setUserPost(snapshot.data())
                }
            })
            firebase.firestore().collection("posts").doc(props.route.params.uid).collection('userPosts').orderBy("creation", "asc").get().then((snapshot) => {
                let otherposts = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    return { id, ...data }
                })
                setUserPosts(otherposts)
            })
            firebase.firestore().collection("following").doc(props.route.params.uid).collection('userFollowing').onSnapshot((snapshot) => {
                let otherFollow = snapshot.docs.map(doc => {
                    const id = doc.id
                    return id
                })
                setOthersFollowing(otherFollow)
            })
            firebase.firestore().collection("following").doc(props.route.params.uid).collection('Followers').onSnapshot((snapshot) => {
                let otherFollow = snapshot.docs.map(doc => {
                    const id = doc.id
                    return id
                })
                setOtherFollowers(otherFollow)
            })
        }
        if (followers.indexOf(props.route.params.uid) > -1) {
            setFollowing(true)
        } else {
            setFollowing(false)
        }
    }, [props.route.params.uid, followers, user, posts])

    const follow = useCallback(() => {
        firebase.firestore().collection('following').doc(firebase.auth().currentUser.uid).collection("userFollowing").doc(props.route.params.uid).set({})
        firebase.firestore().collection('following').doc(props.route.params.uid).collection("Followers").doc(firebase.auth().currentUser.uid).set({})
    }, [follow, props.route.params.uid])

    const unFollow = useCallback(() => {
        firebase.firestore().collection('following').doc(firebase.auth().currentUser.uid).collection("userFollowing").doc(props.route.params.uid).delete({})
        firebase.firestore().collection('following').doc(props.route.params.uid).collection("Followers").doc(firebase.auth().currentUser.uid).delete({})
    }, [unFollow, props.route.params.uid])
    
    const renderItem = ({ item }) => {
        return (
            <View style={styles.containerImage}>
                <TouchableOpacity onPress={() => props.navigation.navigate('Post', {post: item, user: userPost, uid: props.route.params.uid})} >
                    <Image style={styles.post} source={{ uri: item.DownloadURL }} />
                </TouchableOpacity>
            </View> 
        )
    }

    if (userPost === null) {
        return <View style={{ backgroundColor: Colors.one }} />
    }
    return (
        <View style={styles.view}>
            <View style={styles.profileContainer}>
                {<View style={styles.followInfoContainer}>
                    <Image style={styles.profileImage} source={{uri: userPost.profileImage}}/>
                    <View style={styles.subFollowInfoContainer}>
                        <Text style={{ color: Colors.four, marginBottom: 10 }}>{userPost.email}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={{ color: Colors.four }}>Following</Text>
                                {props.route.params.uid !== firebase.auth().currentUser.uid ? <Text style={{ color: Colors.four, textAlign: 'center' }}>{othersFollowing.length}</Text> : <Text style={{ color: Colors.four, textAlign: 'center' }}>{followers.length - 1}</Text>}

                            </View>
                            <View style={{flexDirection: 'column'}}>
                                <Text style={{ color: Colors.four}}>Followers</Text>
                                {props.route.params.uid !== firebase.auth().currentUser.uid ? <Text style={{ color: Colors.four, textAlign: 'center' }}>{otherFollowers.length}</Text> : <Text style={{ color: Colors.four, textAlign: 'center' }}>{userFollower?.length}</Text>}
                            </View>
                        </View>
                    </View>
                </View>}
                <View style={styles.profileContainerInfo}>
                    <View style={styles.nameEditContainer}>
                        <Text style={{ color: Colors.four, fontSize: 20, marginBottom: 5 }}>{userPost.name}</Text>
                        {props.route.params.uid === firebase.auth().currentUser.uid && <Button title='Edit Profile' onPress={() => props.navigation.navigate('EditProfile', { ProfileId: firebase.auth().currentUser.uid})} color={Colors.one} />}
                    </View>
                    {userPost.discription ? <Text style={{ color: Colors.four}}>{userPost?.discription}</Text> : null}
                    {props.route.params.uid !== firebase.auth().currentUser.uid &&
                        <View style={styles.followButton}>
                            {following ? <Button title="Following" color={Colors.two} onPress={unFollow} /> : <Button title="Follow" color={Colors.two} onPress={follow} />}
                        </View>
                    }
                </View>
            </View>
            <View style={styles.postContainer}>
                <FlatList data={userPosts} renderItem={renderItem} numColumns={3} horizontal={false} />
            </View>
        </View>)
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: Colors.one,
    },
    profileContainer: {
        flex: 1.5,
        marginTop: 10,
        borderBottomColor: Colors.two,
        borderBottomWidth: 2
    },
    profileContainerInfo: {
        flex: 1,
        margin: 10,
    },
    postContainer: {
        flex: 2
    },
    containerImage: {
        flex: 1 / 3
    },
    post: {
        flex: 1,
        aspectRatio: 1 / 1,
        borderWidth: 1,
        borderColor: '#000'
    },
    followButton: {
        marginTop: 20,
        width: '100%',
    }, followInfoContainer: {
        width: '100%',
        alignItems: 'center',
        margin: 0,
        flexDirection: 'row'
    }, nameEditContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    }, subFollowInfoContainer: {
        marginLeft: 30
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    }
})
export default ProfileScreens