import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { View, StyleSheet, Image, TextInput, ScrollView, Button,ActivityIndicator } from 'react-native'
import firebase from 'firebase'

import { fetchUserPosts} from '../../storage/actions/index'
import Colors from '../../constants/Colors'

const SaveScreen = props => {
    const dispatch = useDispatch()
    const { uri } = props.route.params.image
    const [caption, setCaptions] = useState('')
    const [loading, setLoading] = useState(false)

    const upLoadImage = useCallback(async () => {
        setLoading(true)
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
        const response = await fetch(uri)
        const blob = await response.blob()

        const task = firebase.storage().ref().child(childPath).put(blob)
        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }
        task.on("state_changed", taskProgress, taskError, taskCompleted)

    }, [upLoadImage, uri])

    const savePostData = useCallback((DownloadURL) => {
        firebase.firestore().collection('posts').doc(firebase.auth().currentUser.uid).collection("userPosts").add({
            DownloadURL,
            caption,
            creation: firebase.firestore.FieldValue.serverTimestamp(),
            totalLikes: 0
        }).then(() => {
            dispatch(fetchUserPosts())
            setLoading(false)
            props.navigation.navigate('Feed')
        })
    }, [savePostData, caption])
    if (loading) {
        return (<View style={{alignItems: 'center', justifyContent: 'center', flex :1, backgroundColor: Colors.one}}>
        <ActivityIndicator size="large" color={Colors.four}/>
        </View>)
    }
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.view}>
            <Image source={{ uri: uri }} style={styles.image} />
            <View style={styles.TextInputContainer}>
                <TextInput placeholder="Write a Caption .  .  . " style={styles.TextInput} onChangeText={(text) => setCaptions(text)} value={caption} placeholderTextColor={Colors.four} autoCorrect autoFocus keyboardType="default" maxLength={1000} />
            </View>
            <View style={styles.btn}>
                <Button title="Post" color={Colors.two} onPress={upLoadImage} />
            </View>
        </View>
        </ScrollView >
    )
   
        


}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    view: {
        backgroundColor: Colors.one,
        flex: 1
    },
    image: {
        width: '100%',
        height: '50%'
    },
    TextInputContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    TextInput: {
        marginTop: 20,
        width: '85%',
        height: 50,
        backgroundColor: Colors.one,
        color: Colors.four,
        borderBottomWidth: 1,
        borderBottomColor: Colors.four
    },
    btn: {
        marginTop: 50,
    }
})

export default SaveScreen