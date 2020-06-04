import React, { Component } from 'react';
import { Text, View, ImageBackground, List, ListItem, FlatList, TouchableOpacity, Button } from 'react-native';
import styles from './Styles';

import { observer } from "mobx-react";
import { observable } from "mobx";

import IconEntypo from 'react-native-vector-icons/Entypo';

const state = observable({
    tracks:[],
    playingIndex:0,
});

function Item({ id, title, album, callBack$Playlist }) {
    let pIndex = state.playingIndex;
    return (
        <TouchableOpacity
            onPress={() => {callBack$Playlist(id); state.playingIndex = id}}
        >
            <View style={{ flexDirection: 'row', margin:2 }}>
                { pIndex === id
                    ?<IconEntypo name={'controller-play'} size={30} color="#fcfaff" style={{margin: 10}}/>:
                    <IconEntypo name={'music'} size={30} color="#fcfaff" style={{margin: 10}}/>
                }
                <Text style={{ fontSize: 22, marginLeft:5, color:'#e6e5ff', fontFamily:'sans-serif-medium' }}>{title?title:'Unavailable'}
                    {"\n"}
                    <Text style={{ fontSize:20, marginLeft:5, color:'#575462', fontFamily:'Roboto' }} numberOfLines={1}>{album?album:'unavailable'}</Text>
                </Text>
            </View>
        </TouchableOpacity>
    );
}

class Playlist extends Component {

    componentDidMount(){
        const { tracks } = this.props.record;
        state.tracks = tracks;
    }

    componentWillReceiveProps(nextProps){
        const { tracks } = nextProps.record;
        const { id } = nextProps.pIndex;
        if(JSON.stringify(state.tracks)!==JSON.stringify(tracks)){
            state.tracks = tracks;
        }
        if(state.playingIndex!==id){
            state.playingIndex = id;
        }
    }

    render(){
        const { tracks, playingIndex } = state;
        const { navigation, callBack$Playlist, pIndex } = this.props;
        return(
            <View style={{flex: 1, backgroundColor: '#161b27'}}>
                <FlatList
                    data={ tracks }
                    renderItem={({item, index}) => {
                        return <Item key={index} id={index} title={item.title} album={item.album} callBack$Playlist={callBack$Playlist}/>
                    }}
                    keyExtractor={item => item.id}
                />
            </View>
        );
    }
}

export default observer(Playlist);
