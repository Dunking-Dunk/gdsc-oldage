import React from 'react'
import { Text, View, Button, Image, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import Colors from '../../constants/Colors'

export default profilePost = props => {
    const userPost = props.route.params.user
    const item = props.route.params.post
    return (
    <View style={styles.postModal}>
        <View style={styles.modalPostOwner}>
                <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={{uri: userPost.profileImage}}/>
                <Text style={{ color: Colors.four, fontSize: 20, marginLeft: 20 }}>{userPost.name}</Text>
        </View>
        <Image style={styles.modalImage} source={{ uri: item.DownloadURL }} />
        <View style={styles.modalPostInfo}>
                <Text style={{ color: Colors.four, fontSize: 16, marginBottom: 2 }}>{item.caption.slice(0, 80)}<Text style={{ fontSize: 14, fontWeight: '900' }} onPress={() => props.navigation.navigate('Comments', { postId: item.id, uid: props.route.params.uid ? props.route.params.uid : firebase.auth().currentUser.uid, description: item.caption })}>{item.caption.length > 100 ? '....more' : ''}</Text></Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{ color: Colors.four, marginBottom: 5 }}>Total Like {item.totalLikes}</Text>
                    <Ionicons name='heart' color="red" size={20} />
                </View>
                
            <Text style={{color: Colors.four, fontSize: 14}} onPress={() => props.navigation.navigate('Comments', {postId: item.id, uid:props.route.params.uid? props.route.params.uid: firebase.auth().currentUser.uid , description: item.caption})}>View Comments .....</Text>
        </View>
    </View>
    )
}
           
const styles = StyleSheet.create({
    postModal: {
        flex: 1,
        backgroundColor: Colors.one
    },
    modalPostOwner: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '10%'
    },
    modalImage: {
        width: '100%',
        height: '70%',
        marginBottom: 10
    },
    modalPostInfo: {
        width: '100%'
    }

})