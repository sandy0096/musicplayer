import React, { Component } from 'react';
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import styles from './Styles';

import { observer } from "mobx-react";
import { observable } from "mobx";

import IconEntypo from 'react-native-vector-icons/Entypo';


import AlbumArt from 'album-art';
import NotificationService from "./NotificationService";

const state = observable({
    data:[],
    imageUrl:{uri: 'https://reactjs.org/logo-og.png'}
});

class Top extends Component {
    constructor(props){
        super(props);
        this.notification = new NotificationService(this.onNotification);
    }

    componentDidMount(){

        // AlbumArt('Linkin Park').then(x => state.imageUrl = {uri: x.toString()});
        const { record, pIndex } = this.props;
        let id = pIndex.id;
        this.notification.localNotification({
            message:record.tracks[id].title?record.tracks[id].title:'Title Not Found',
            subText:'Now playing',
            autoCancel:false,
            ignoreInForeground:true,
            invokeApp: true,
            playSound: false,
            showWhen:false,
        });

    }

    componentWillReceiveProps(nextProps){

        if(JSON.stringify(this.props.pIndex!==JSON.stringify(nextProps.pIndex))){
            const { record, pIndex } = nextProps;
            let id = pIndex.id;
            this.notification.localNotification({
                message:record.tracks[id].title?record.tracks[id].title:'Title Not Found',
                subText:'Now playing',
                autoCancel:false,
                ignoreInForeground:true,
                invokeApp: true,
                playSound: false,
                showWhen:false,
            });
        }

    }

    onNotification = (notif) => {{
        console.log('Notification Action will be here', notif);
    }};

    componentWillUnmount(){
        this.notification.cancelAll()
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
