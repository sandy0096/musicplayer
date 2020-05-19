import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from './Styles';

import Top from './Top';
import Bottom from './Bottom';

import { observer } from "mobx-react";
import { observable } from "mobx"

const state = observable({
    tracks:[],
    playingIndex:0,
});

class Main extends Component {

    onUpdateProps = (tracks, index) => {
      state.tracks = tracks;
      state.playingIndex = index;
    };

    render(){
        const { navigation } = this.props;
        return(
            <View style={styles.container}>
                <Top navigation={ navigation } pIndex={ state.playingIndex } tracks={ state.tracks } />
                <Bottom navigation={ navigation } state={ state }  onUpdate={this.onUpdateProps} />
            </View>
        );
    }
}

export default observer(Main);