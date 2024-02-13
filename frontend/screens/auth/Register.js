import React, {useState} from 'react'
import { Text, View, StyleSheet, Button, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import firebase from 'firebase'

import Color from '../../constants/Colors'

const Register = props => {
    const [register, setRegister] = useState({ email: '', password: '', name: '' })
    
    const inputHandler = (text, id) => {
        if (id === 'name') {
            setRegister({ ...register, name: text })
        }
        if (id === 'email') {
            setRegister({ ...register, email: text })
        }
        if (id === 'password') {
            setRegister({ ...register, password: text })
        }
    }

    const submitHandler = () => {
        const { email, name, password } = register
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase.firestore().collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        name,
                        email
                    
                })
            }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <KeyboardAvoidingView style={styles.form} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
                <View style={styles.textInputContainer}>
                    <Text style={styles.name}>Socialize</Text>
                    <TextInput style={styles.input} placeholder="Name" onChangeText={(text) => inputHandler(text, 'name')} value={register.name} placeholderTextColor={Color.four} autoCorrect keyboardType="default"/>
                    <TextInput style={styles.input} placeholder="Email" onChangeText={(text) => inputHandler(text, 'email')} value={register.email} placeholderTextColor={Color.four} autoCorrect keyboardType="email-address"/>
                    <TextInput style={styles.input} placeholder="Password" onChangeText={(text) => inputHandler(text, 'password')} value={register.password} placeholderTextColor={Color.four} secureTextEntry={true}/>
                    <View style={styles.formButtons}>
                        <Button title="Cancel" color={Color.one} onPress={() => props.navigation.goBack()} />
                        <Button title="Register" color={Color.one} onPress={submitHandler}/>
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

export default Register