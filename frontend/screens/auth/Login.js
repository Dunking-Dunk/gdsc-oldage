import React, {useState} from 'react'
import { Text, View, StyleSheet, Button, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import firebase from 'firebase'

import Color from '../../constants/Colors'

const login = props => {
    const [login, setLogin] = useState({ email: '', password: ''})
    
    const inputHandler = (text, id) => {
        if (id === 'email') {
            setLogin({ ...login, email: text })
        }
        if (id === 'password') {
            setLogin({ ...login, password: text })
        }
    }

    const submitHandler = () => {
        firebase.auth().signInWithEmailAndPassword(login.email, login.password)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
              alert('Wrong password.');
            } else {
              alert(errorMessage);
            }
            console.log(error);
          });
    }

    return (
    <KeyboardAvoidingView style={styles.form} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
        <View style={styles.textInputContainer}>
            <Text style={styles.name}>Socialize</Text>
            <TextInput style={styles.input} placeholder="Email" onChangeText={(text) => inputHandler(text, 'email')} value={login.email} placeholderTextColor={Color.four} autoCorrect keyboardType="email-address"/>
            <TextInput style={styles.input} placeholder="Password" onChangeText={(text) => inputHandler(text, 'password')} value={login.password} placeholderTextColor={Color.four} secureTextEntry={true}/>
            <View style={styles.formButtons}>
                <Button title="Login" color={Color.one} onPress={submitHandler}/>
            </View>
        </View> 
    </KeyboardAvoidingView>
    )

}

const styles = StyleSheet.create({
    form: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: Color.one,
        justifyContent: 'center'
    },
    name: {
        color: Color.four,
        fontSize: 50,
        marginBottom: 30
    },
    textInputContainer: {
        width: '80%',
        alignItems: 'center',
        padding: 20,
        height: '80%'
    },
    input: {
        width: '90%',
        height: 50,
        marginBottom: 20,
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        color: Color.four
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    }
})

export default login