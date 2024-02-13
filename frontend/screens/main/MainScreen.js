import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Text, StyleSheet } from 'react-native'
import { clearData, fetchUser, fetchUserFollowing, fetchUserPosts } from '../../storage/actions/index'
import { Ionicons } from '@expo/vector-icons'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import firebase from 'firebase'

import FeedScreen from './FeedScreen'
import Colors from '../../constants/Colors'
import ProfileScreen from './ProfileScreens'
import SearchScreen from './search'

const Tab = createMaterialBottomTabNavigator()
const emptyScreen = () => {
    return null
}

const MainScreen = props => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.currentUser)

    useEffect(() => {
        dispatch(clearData())
        dispatch(fetchUser())
        dispatch(fetchUserPosts())
        dispatch(fetchUserFollowing())
    }, [dispatch])

    if (user == undefined) {
        return <Text>No user</Text>
    }
    return (
        <Tab.Navigator initialRouteName="Feed" independent={true} activeColor={Colors.three} inactiveColor={Colors.one}
            barStyle={{ backgroundColor: Colors.one }}>
            <Tab.Screen name="Feed" component={FeedScreen} options={{
                tabBarIcon: () => <Ionicons name="home" color={Colors.three} size={26} />,
            }} />
            <Tab.Screen name="Search" component={SearchScreen} options={{
                tabBarIcon: () => <Ionicons name="search" color={Colors.three} size={26} />,
            }} />
            <Tab.Screen name="Add Image" component={emptyScreen} listeners={({ navigation }) => ({
                tabPress: event => {
                    event.preventDefault()
                    navigation.navigate("Add")
                }
            })} options={{
                tabBarIcon: () => <Ionicons name="md-add" color={Colors.three} size={26} />,
            }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{
                tabBarIcon: () => <Ionicons name="person" color={Colors.three} size={26} />,
            }} listeners={({ navigation }) => ({
                tabPress: event => {
                    event.preventDefault()
                    navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid })
                }
                })} />
        </Tab.Navigator >
    )
}

export default MainScreen