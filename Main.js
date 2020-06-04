import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from './Styles';

import Top from './Top';
import Bottom from './Bottom';

import { observer } from "mobx-react";

class Main extends Component {
    render(){
        const { record, navigation, pIndex, callBack$Bottom } = this.props;
        return(
            <View style={styles.container}>
                <Top navigation={ navigation }
                     record={ record }
                     pIndex={ pIndex }
                />
                <Bottom record={ record }
                        pIndex={ pIndex }
                        navigation={ navigation }
                        callBack$Bottom = { callBack$Bottom }
                />
            </View>
        );
    }
}

export default observer(Main);