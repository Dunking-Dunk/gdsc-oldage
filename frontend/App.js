import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import firebase from 'firebase';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {HeaderButtons, Item} from 'react-navigation-header-buttons'

import HeaderBtn from './component/ui/headerButton'
import Landing from './screens/auth/landing'
import Register from './screens/auth/Register';
import Login from './screens/auth/Login';
import env from './env'
import Color from './constants/Colors';
import Reducer from './storage/reducers/index'
import MainScreen from './screens/main/MainScreen';
import AddScreen from './screens/main/AddScreen';
import SaveScreen from './screens/main/saveScreen';
import EditProfile from './screens/main/EditProfile';
import EditProfileImage from './screens/main/EditProfileImage';
import CommentScreen from './screens/main/commentsScreen';
import profilePost from './screens/main/profilePost';

const store = createStore(Reducer, applyMiddleware(thunk))
const firebaseConfig = env.FIREBASECONFIG

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

const Stack = createStackNavigator()



export default function App() {
  const [loading, setLoading] = useState({ loggedIn: false, loaded: false })
  const { loggedIn, loaded } = loading

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoading({ ...loading, loggedIn: false, loaded: true })
      } else {
        setLoading({ ...loading, loggedIn: true, loaded: true })
      }

    })
  }, [firebase])

  const onLogout = () => {
    firebase.auth().signOut()
  }

  if (!loaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Color.four} />
      </View>
    )
  }
  if (!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing" screenOptions={{ headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }}>
          <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>

    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main" screenOptions={{ headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }}>
          <Stack.Screen name="Main" component={MainScreen} options={{
            headerTitle: "Socialize",
            headerTitleStyle: {
              textAlign: 'center',
              marginLeft: 50
            },
            headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderBtn}>
                <Item title="logout" iconName='log-out' onPress={onLogout}/>
            </HeaderButtons>
          }} />
          <Stack.Screen name="Add" component={AddScreen} />
          <Stack.Screen name="Save" component={SaveScreen} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="profileImage" component={EditProfileImage} />
          <Stack.Screen name="Comments" component={CommentScreen} />
          <Stack.Screen name="Post" component={profilePost} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )




}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.one
  }
})