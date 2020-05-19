/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import IconFeather from 'react-native-vector-icons/Feather';

import Main from './Main';
import Playlist from './Playlist';

const Tab = createMaterialTopTabNavigator();

const App: () => React$Node = () => {
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
                }}
                tabBarPosition={'bottom'}
            >
                <Tab.Screen name="Home" component={Main} />
                <Tab.Screen  name="Playlist" component={Playlist} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default App;
