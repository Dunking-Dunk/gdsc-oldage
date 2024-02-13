import React from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'

import Color from '../../constants/Colors'

const LandingPage = props => {
    return (
        <View style={styles.view}>
            <Text style={styles.title}>Socialize</Text>
            <View style={styles.buttonView}>
                <Button title="register" onPress={() => { props.navigation.navigate('Register') }} color={Color.one} />
                <Button title="login" onPress={() => { props.navigation.navigate('Login') }} color={Color.one}/>
            </View>
        </View>
    )
        

}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.one
    },
    buttonView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    }, title: {
        fontSize: 60,
        marginBottom: 20,
        color: Color.four
    }
})

export default LandingPage