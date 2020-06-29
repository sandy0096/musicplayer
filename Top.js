import React, { Component } from 'react';
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import styles from './Styles';

import { observer } from "mobx-react";
import { observable } from "mobx";

import IconEntypo from 'react-native-vector-icons/Entypo';


import AlbumArt from 'album-art';

const state = observable({
    data:[],
    imageUrl:{uri: 'https://reactjs.org/logo-og.png'}
});

class Top extends Component {

    componentDidMount(){

        // AlbumArt('Linkin Park').then(x => state.imageUrl = {uri: x.toString()});
    }

    render(){
        const { imageUrl } = state;
        const { navigation, record, pIndex } = this.props;
        return(
            <View style={styles.container}>
                <ImageBackground source={ imageUrl } style={styles.image}>
                    <View style={styles.topIconContainer}>
                        <IconEntypo name={'magnifying-glass'} size={35} color="#fcfaff" style={{ margin: 10}}/>
                        <TouchableOpacity onPress={() => navigation.navigate('Playlist')}>
                            <IconEntypo name={'menu'} size={35} color="#fcfaff" style={{ margin: 10}}/>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

export default observer(Top);
