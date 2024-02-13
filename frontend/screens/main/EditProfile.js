import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, ScrollView, TextInput, Button, TouchableOpacity, Image } from 'react-native'
import {fetchUser} from '../../storage/actions/index'
import firebase from 'firebase'

import Colors from '../../constants/Colors'


const EditProfile = props => {
    const dispatch = useDispatch()
    const userId = props.route.params.ProfileId
    const user = useSelector((state) => state.user.currentUser)
    const [profile, setProfile] = useState({ name: user.name, discription: user.discription ? user.discription : '' })
    const [error, setError] = useState('')
    const uri  = props?.route?.params?.image?.uri
    
        const upLoadImage = async () => {
            const childPath = `profilePost/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
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
    
        }

    const savePostData = (DownloadURL) => {
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
            profileImage: DownloadURL
        }, { merge: true }).then(() => {
            dispatch(fetchUser())
        })
    }

    const handleTextChange = (value, text) => {
        setProfile({...profile, [value]: text})
    }

    const handleSubmit = () => {
        if (profile.name.length <= 3 || profile.discription.length <= 3) {
            setError('need minimum of 3 characters')
            setTimeout(() => {
                setError('')
            }, 3000)
            return
        } else {
            if (uri) {
                upLoadImage()
            }
            firebase.firestore().collection('users').doc(userId).set({ name: profile.name, discription: profile.discription }, { merge: true })
            dispatch(fetchUser())
            props.navigation.navigate('Profile')
        }
        
    }
    return (
            <View style={styles.view}>
                <ScrollView style={{ flex: 1}}>
                    <View style={styles.editContainer}>
                        <Text style={styles.header}>Edit Profile</Text>
                        <Text style={styles.error}>{error && error}</Text>
                    <TouchableOpacity style={{ width: 150, height: 150, borderRadius: 100, backgroundColor: Colors.four, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }} onPress={() => props.navigation.navigate('profileImage')}>
                        {user.profileImage ? <Image style={{ width: 150, height: 150, borderRadius: 100, resizeMode: 'cover' }} source={{uri: uri? uri:user.profileImage}}/>: <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                <Text>Add profile Image</Text>
                        </View>}
                    </TouchableOpacity>
                    <Text style={{color: Colors.four}}>Profile Image</Text>
                        <TextInput placeholder='Name' placeholderTextColor={Colors.four} style={styles.TextInput} value={profile.name} keyboardType="default" autoCorrect onChangeText={(text) => handleTextChange('name', text)}/>
                        <TextInput placeholder='About You' placeholderTextColor={Colors.four} style={styles.TextInput} keyboardType="default" autoCorrect onChangeText={(text) => handleTextChange('discription', text)} multiline maxLength={250} value={profile.discription}/>
                    <View style={styles.editBtn}>
                        <Button title="Edit" color={Colors.two} onPress={handleSubmit} />
                    </View>
                    </View>
                </ScrollView>
            </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: Colors.one,
    }, editContainer: {
        flex: 1,
        alignItems: 'center',
        position: 'relative'
    },
    header: {
        margin: 20,
        color: Colors.four,
        fontSize: 26,
    }, TextInput: {
        width: '80%',
        borderBottomColor: Colors.four,
        borderBottomWidth: 1,
        height: 70,
        margin: 10,
        color: Colors.four
    }, editBtn: {
        marginTop: 30
    }, error: {
        color: 'red',
        position: 'absolute'
    }
})
export default EditProfile