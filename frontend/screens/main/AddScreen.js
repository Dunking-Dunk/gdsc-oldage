import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

import Camera from '../../component/camera'


const AddScreen = props => {
    return (<View style={styles.view}>
        <Camera navigation={props.navigation} path="Save"/>
    </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: Colors.one,
    }
})
export default AddScreen