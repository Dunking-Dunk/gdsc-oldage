import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { View, Text, StyleSheet, FlatList, Button, TextInput, Keyboard, Image} from 'react-native'
import firebase from 'firebase'

import Colors from '../../constants/Colors'

const CommentScreen = props => {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState('')
    const [comment, setComment] = useState('')

    const user = useSelector((state) => state.user.currentUser)

    useEffect(() => {
        if (props.route.params.postId !== postId) {
            firebase.firestore().collection('posts').doc(props.route.params.uid).collection('userPosts').doc(props.route.params.postId).collection('comments').get().then((snapshot) => {
                let com = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    return {id, ...data}
                })
                setComments(com)
            })
            setPostId(props.route.params.postId)
        }

    }, [props.route.params.postId, user.profileImage])

    const renderComments = ({ item }) => {
        return (
            <View style={styles.commentView}>
                <View style={{alignItems: 'center'}}>
                    <Image style={styles.imageProfile} source={{uri: item.profileImage? item.profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv7QVQc9yKaOnn0GEXJ_HJFSIi_w3G_lmZs_YW6g6cWTwPuBirWJQz-HWbL1I3joP2i2w&usqp=CAU'}}/>
                    <Text style={{color: Colors.four, fontSize: 18, fontWeight: '900', width: 100}}>{item.name}</Text>
                </View>
                <Text style={{color: Colors.four, paddingHorizontal: 40, paddingVertical: 10}}>{item.text}</Text>
            </View>
        )
    }

    const handleSubmit = useCallback(() => {
        Keyboard.dismiss()
        firebase.firestore().collection('posts').doc(props.route.params.uid).collection('userPosts').doc(props.route.params.postId).collection('comments').add({
            creator: firebase.auth().currentUser.uid,
            text: comment,
            name: user.name,
            profileImage: user.profileImage
        })
        firebase.firestore().collection('posts').doc(props.route.params.uid).collection('userPosts').doc(props.route.params.postId).collection('comments').get().then((snapshot) => {
            let com = snapshot.docs.map(doc => {
                const data = doc.data()
                const id = doc.id
                return {id, ...data}
            })
            setComments(com)
        })
        setComment('')
    },[handleSubmit, props.route.params.postId, comment])
    
    return (
    <View style={styles.view}>
        <View style={{padding: 20}}>
            <Text style={{color: Colors.four}}><Text style={{color: Colors.four, fontSize: 22}}>Caption: </Text>{props.route.params.description}</Text>
        </View>
        <View style={styles.commentContainer}>
                    <TextInput multiline maxLength={200} autoCorrect autoFocus style={styles.TextInput} placeholder="Add your Comment ..." placeholderTextColor={Colors.four} onChangeText={(text) => setComment(text)} value={comment}/>
            <Button title="Submit" color={Colors.one} onPress={() => {
                handleSubmit()
                Keyboard.dismiss()
            }} />
        </View>
            <View style={styles.comments}>
                <Text style={{color: Colors.four, fontSize:30, marginBottom: 5}}>Comments</Text>
            <FlatList data={comments} renderItem={renderComments} numColumns={1} horizontal={false}/>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: Colors.one,
        alignItems: 'center'
    }, 
    commentContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        borderBottomColor: Colors.two,
        borderBottomWidth: 1
    },
    TextInput: {
        color: Colors.four,
        borderBottomWidth: 1,
        borderBottomColor: Colors.four,
        height: 50,
        width: '75%',
        marginBottom: 15
    },
    comments: {
        flex: 5,
        width: '100%',
        alignItems: 'center',
        marginTop: 20
    },
    commentView: {
        width: '85%',
        alignItems: 'center',
        marginBottom: 10,
        paddingRight: 50,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }, imageProfile: {
        width: 30,
        height: 30,
        borderRadius: 50
    }
})
export default CommentScreen