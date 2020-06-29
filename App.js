/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import IconFeather from 'react-native-vector-icons/Feather';

import { PermissionsAndroid, View, Text } from 'react-native';

import MusicFiles from 'react-native-get-music-files';

import Main from './Main';
import Playlist from './Playlist';

import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

const Tab = createMaterialTopTabNavigator();

const App: () => React$Node = () => {
    const [record, setRecord] = useState({ tracks:[], total:0});
    const [pIndex, setPIndex] = useState({id:0});
    const [grant, setGrant] = useState(false);

    const saveRecord = (data) => {
        const { tracks, total } = data;
        setRecord({tracks: tracks, total:total});
    };

    useEffect(() => {
        if(!grant){
            checkStoragePermission();
        }
    }, []);

    const callBack$Playlist = (id) => {
        if(pIndex.id!==id){
            setPIndex({id:id});
        }
    };

    callBack$Bottom = (id) => {
        if(pIndex.id!==id){
            setPIndex({id:id});
        }
    };

    const RequestStoragePermission = async() =>  {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'External Storage Permission',
                    message: 'This app needs access to your storage',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Permission granted');
                checkStoragePermission();

            } else {
                console.log('Permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const checkStoragePermission = () => {
        check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
            .then(result => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        console.log('This feature is not available (on this device / in this context)');
                        break;
                    case RESULTS.DENIED:
                        console.log('The permission has not been requested / is denied but requestable');
                        RequestStoragePermission();
                        break;
                    case RESULTS.GRANTED:
                        console.log('The permission is granted');
                        gettingAllMusicFiles();
                        break;
                    case RESULTS.BLOCKED:
                        console.log('The permission is denied and not request able anymore');
                        break;
                }
            })
            .catch(error => {
                console.log('There is some error in requesting permission', error)
            });
    };

    const gettingAllMusicFiles = () => {
        MusicFiles.getAll({})
            .then(tracks => {
                if (Array.isArray(tracks)){
                    assortDataPath(tracks);
                } else {
                    alert('Hah! No tracks found on this device.');
                }
            })
            .catch(error => {
                console.log(error);
                alert('Something went wrong while getting Music Files');
            });
    };

    const assortDataPath = (array) => {
        let tracks = [];

        array.map(it => {
            let x = it.path;
            let directoryPath = x.split('/');

            let spaces = 0;
            let address = '';
            let file_name = it.fileName;
            let title = it.title;
            let album = it.album;
            let duration = it.duration;

            while (spaces !== directoryPath.length - 1) {
                if (directoryPath[spaces].length > 0) {
                    address = address + '/' + directoryPath[spaces];
                }
                spaces += 1;
            }
            let obj = {
                title: title,
                album: album,
                duration: duration,
                filename: file_name,
                address: address,
            };
            tracks.push(obj);
        });

        saveRecord({tracks:tracks, total:tracks.length - 1});
        setGrant(true);
    };
    if(grant){
        return (
            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName="Home"
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;

                            if (route.name === 'Home') {
                                iconName = 'home'
                            } else if (route.name === 'Playlist') {
                                iconName = 'list';
                            }

                            return <IconFeather name={iconName} size={25} color={color} />;
                        },
                    })}
                    tabBarOptions={{
                        activeTintColor: '#feffff',
                        inactiveTintColor: 'gray',
                        tabStyle:{backgroundColor:'#181b32'},
                        indicatorStyle:{height:0},
                        showIcon:true,
                        lazy:true,
                    }}
                    tabBarPosition={'bottom'}
                >
                    <Tab.Screen name="Home">
                        {(navigation) => <Main {...navigation} record={ record }
                                               pIndex={ pIndex }
                                               callBack$Bottom = {callBack$Bottom}
                        />}
                    </Tab.Screen>
                    <Tab.Screen  name="Playlist">
                        {(navigation) => <Playlist record={ record }
                                                   {...navigation}
                                                   callBack$Playlist={ callBack$Playlist }
                                                   pIndex={ pIndex }
                        />}
                    </Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
        );
    }
    else{
        return(<View style={{ flex:1, flexDirection:'row', alignContent:'center', justifyContent:'center' }}><Text>Loading...</Text></View>)
    }
};

export default App;
