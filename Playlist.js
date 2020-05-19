import React, { Component } from 'react';
import { Text, View, ImageBackground, List, ListItem, FlatList, TouchableOpacity } from 'react-native';
import styles from './Styles';

import { observer } from "mobx-react";
import { observable } from "mobx";

import IconEntypo from 'react-native-vector-icons/Entypo';

const state = observable({
    data:[{id:'1', title:'Item 1', album:'haha', duration:30000}, {id:'2', title:'Item 2', album:'fake', duration:20000}],
    tracks:[],
    playingIndex:0,
});

function Item({ id, title, album }) {
    const { pIndex } = state.playingIndex;
    return (
        <TouchableOpacity
            // onPress={() => onSelect(id)}
        >
            <View style={{ flexDirection: 'row', margin:2 }}>
                { pIndex === id
                    ?<IconEntypo name={'play'} size={30} color="#fcfaff" style={{margin: 10}}/>:
                    <IconEntypo name={'music'} size={30} color="#fcfaff" style={{margin: 10}}/>
                }
                <Text style={{ fontSize: 22, marginLeft:5, color:'#e6e5ff', fontFamily:'sans-serif-medium' }}>{title}
                    {"\n"}
                    <Text style={{ fontSize:20, marginLeft:5, color:'#575462', fontFamily:'Roboto' }} numberOfLines={1}>{album}</Text>
                </Text>
            </View>
        </TouchableOpacity>
    );
}

class Playlist extends Component {

    componentDidMount(){
        console.log(
            // 'Parameter', this.props.route.params
        )
    }

    componentWillReceiveProps(nextProps){

        // if(this.props.route.params){
        //     const { pIndex, tracks } = this.props.route.params;
        //     state.playingIndex = pIndex;
        //     state.tracks = tracks;
        // }
    }

    render(){
       // const { tracks } = state;
        const { pIndex, tracks } = this.props.route.params;
        console.log('Tracks', tracks, pIndex);
        return(
            <View style={{flex:1, backgroundColor:'#161b27'}}>
                <FlatList
                    data={ tracks }
                    renderItem={({item, index}) => {
                        return <Item key={index} id={index} title={item.title} album={item.album}/>
                    }}
                    keyExtractor={item => item.id}
                />
            </View>
        );
    }
}

export default observer(Playlist);
