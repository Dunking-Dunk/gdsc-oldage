import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Button } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import Colors from '../constants/Colors';

const Cameras = props => {
    const [hasGalleryStatus, setHasGalleryStatus] = useState(null)
    const [hasPermission, setHasPermission] = useState(null)
    const [camera, setCamera] = useState(null)
    const [image, setImage] = useState(null)
    const [type, setType] = useState(Camera.Constants.Type.back)

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync()
            setHasPermission(status)
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryStatus(galleryStatus.status)
        })()
    }, [])

    const takePictureHandler = async () => {
        try {
            if (camera) {
                const data = await camera.takePictureAsync()
                setImage(data)
            }
        } catch (err) {
            console.log(err)
        }
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result);
        }
    };


    if (hasPermission === null || hasGalleryStatus === null) {
        return <View />
    }
    if (hasPermission === false || hasGalleryStatus === false) {
        return <Text>No access to camera</Text>
    }
    return (
        <View style={styles.container} >
            {!image ?
                <>
                    <Camera style={styles.camera} type={type} ratio={'1:1'} ref={(ref) => setCamera(ref)}>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    setType(
                                        type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back
                                    );
                                }}>
                                <MaterialIcons name="flip-camera-android" size={24} color={Colors.four} />
                            </TouchableOpacity>
                        </View>
                    </Camera>
                    <View style={styles.center}>
                        <TouchableOpacity
                            onPress={takePictureHandler}>
                            <Ionicons name="md-at-circle-sharp" size={50} color={Colors.four} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pickImage}>
                            <Ionicons name="image" size={50} color={Colors.four} />
                        </TouchableOpacity>
                    </View>
                </>
                : (<View style={{ flex: 1 }}>
                    {type === Camera.Constants.Type.front ? <Image style={{ flex: 2, transform: [{ scaleX: -1 }], ratio: 1 / 1 }} source={{ uri: image.uri }} /> : <Image style={{ flex: 2 }} source={{ uri: image.uri }} />}
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Button title="Save" onPress={() => props.navigation.navigate(props.path, { image: image })} color={Colors.one} /></View>
                </View>)}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    camera: {
        flex: 5,
        aspectRatio: 1
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    center: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row'
    }
})

export default Cameras