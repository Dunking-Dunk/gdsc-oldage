import React, {useEffect, useState, useCallback} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, FlatList, Image, Dimensions} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import moment from 'moment'
import firebase from 'firebase'

import Colors from '../../constants/Colors'

const FeedScreen = props => {
    const [posts, setPosts] = useState([])
    const feed = useSelector((state) => state.users.feed)
    const postLoaded = useSelector((state) => state.users.userLoaded)
    const followers = useSelector((state) => state.user.following)
  
    useEffect(() => {
            if (postLoaded == followers.length && followers.length !== 0) { 
                feed.sort((x, y) => {
                    return  y.creation - x.creation 
                })
                setPosts(feed)
            }
    }, [postLoaded, feed])

    const onLikePost = useCallback((userId, postId) => {
        firebase.firestore().collection("posts").doc(userId).collection('userPosts').doc(postId).set({
            totalLikes: firebase.firestore.FieldValue.increment(+1)
        }, {
            merge: true
        }).then(() => {
            posts.map((post) => {
                if (post.id === postId) {
                    post.totalLikes += 1
                    post.currentUserLike = true
                    setPosts(posts)
                }
            }
            )
            firebase.firestore().collection("posts").doc(userId).collection('userPosts').doc(postId).collection("likes").doc(firebase.auth().currentUser.uid).set({})
        })
    }, [onLikePost, posts])

    const onDisLikePost = useCallback((userId, postId) => {
        firebase.firestore().collection("posts").doc(userId).collection('userPosts').doc(postId).set({
            totalLikes: firebase.firestore.FieldValue.increment(-1)
        }, { merge: true }).then(() => {
            posts.map((post) => {
                if (post.id === postId) {
                    post.totalLikes -= 1
                    post.currentUserLike = false
                    setPosts(posts)
                }
            }
            )
            firebase.firestore().collection("posts").doc(userId).collection('userPosts').doc(postId).collection("likes").doc(firebase.auth().currentUser.uid).delete()
        })  
    }, [onDisLikePost, posts])

    const renderItem = ({ item }) => {
        return (
            <View style={styles.postContainer}>
                <View style={styles.postHeader}>
                    <Image style={styles.profileImage} source={{uri: item.found.profileImage? item.found.profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv7QVQc9yKaOnn0GEXJ_HJFSIi_w3G_lmZs_YW6g6cWTwPuBirWJQz-HWbL1I3joP2i2w&usqp=CAU'}}/>
                    <Text style={{ color: Colors.four, fontSize: 24, paddingLeft: 20 }} onPress={() => props.navigation.navigate('Profile', {uid: item.found.uid})}>{item?.found?.name}</Text>
                </View>
                <View style={styles.postImage}>
                    <Image style={styles.Image} source={{uri: item.DownloadURL}}/>
                </View>
                <View style={styles.disAndComment}>
                    <View style={styles.likeAndCapContainer}>
                        <Text style={{ color: Colors.four, fontSize: 14, paddingRight: 10}}><Text style={{ color: Colors.four, fontSize: 18, fontWeight: '900' }}>{item.found.name}  </Text>{item.caption.slice(0, 20)}<Text onPress={() => props.navigation.navigate('Comments', { postId: item.id, uid: item.found.uid, description: item.caption })}>{(item.caption.length > 20) ? '..... more' : ''}</Text></Text>
                        <Text style={{color: Colors.four, fontSize: 18}}>{item.totalLikes} {!item.currentUserLike ? <Ionicons name="heart-outline" size={30} color="red" style={{ margin: 0 }} onPress={() => onLikePost(item.found.uid, item.id)} />: <Ionicons name="heart" size={30} color="red" style={{ margin: 0 }} onPress={() => {
                            onDisLikePost(item.found.uid, item.id)
                        }} />}</Text>
                    </View>
                    <Text style={{ color: Colors.four, fontSize: 14, paddingVertical: 5, width: '50%' }} onPress={() => props.navigation.navigate('Comments', {postId: item.id, uid: item.found.uid, description: item.caption})}>View Comments...</Text>
                    <Text style={{ color: Colors.four, fontSize: 16 }}>{moment(new Date(item.creation.seconds * 1000)).fromNow()}</Text>
                </View>
            </View>
        )
        
    }
    
    return (<View style={styles.view}>
        <FlatList data={posts} renderItem={renderItem} numColumns={1} horizontal={false} />
        </View>)
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: Colors.one
    },
    postContainer: {
        width: '100%',
        height: Dimensions.get('screen').height/1.6,
        marginBottom: 20,
    },
    postHeader: {
        width: '100%',
        height: '13%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 5,
        flexDirection: 'row'
    },
    postImage: {
        width: '100%',
        height: '70%'
    },
    Image: {
        height: '100%',
        width: '100%'
    },
    disAndComment: {
        width: '90%',
        height: '17%',
        marginTop: 10,
        marginLeft: 10
    }, likeAndCapContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems:'center',
        justifyContent: 'space-between',
    }, profileImage: {
        width: 50,
        height: 50,
        borderRadius: 50
    }
})
export default FeedScreen