import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import Colors from '../../constants/Colors'
import Camera from '../../component/camera'

const EditProfileImage = props => {
    return (
        <View style={styles.view}>
            <Camera path="EditProfile" navigation={props.navigation}/>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: Colors.one,
        flex: 1
    }
})

export default EditProfileImage