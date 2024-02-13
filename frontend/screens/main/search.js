import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native'
import Colors from '../../constants/Colors'
import firebase from 'firebase'

const SearchScreen = props => {
    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore().collection("users").where('name', '>=', search).get().then((snapshot) => {
            let users = snapshot.docs.map(doc => {
                const data = doc.data()
                const id = doc.id
                return { id, ...data }
            })
            setUsers(users)
        })
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => props.navigation.navigate('Profile', { uid: item.id })}>
                <View style={styles.userContainer}>
                    <Text style={styles.user}>{item.name}</Text>
                </View>
            </TouchableOpacity>


        )
    }

    return (<View style={styles.view}>
        <TextInput style={styles.TextInput} placeholder="Search User..." placeholderTextColor={Colors.four} onChangeText={(text) => fetchUsers(text)} />
        <FlatList data={users} numColumns={1} horizontal={false} renderItem={renderItem} contentContainerStyle={{ marginTop: 10 }} />
    </View>)
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.one,
    },
    userContainer: {
        width: '100%',
        margin: 15,
    },
    user: {
        color: Colors.four
    },
    TextInput: {
        marginTop: 20,
        width: '85%',
        height: 50,
        backgroundColor: Colors.one,
        color: Colors.four,
        borderBottomWidth: 1,
        borderBottomColor: Colors.four
    }
})
export default SearchScreen