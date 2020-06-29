import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import styles from './Styles';

import Top from './Top';
import Bottom from './Bottom';

import NotificationService from './NotificationService';

import { observer } from "mobx-react";

class Main extends Component {
    constructor(props){
        super(props);
        this.notification = new NotificationService(this.onNotification);
    }

    onNotification = (notif) => {{
        console.log('notif action is here', notif);
    }};

    componentDidMount(){
        const { record, pIndex } = this.props;
        this.notification.localNotification({
            message:'No Title',
            // message:record.tracks[pIndex.id].title,
            subText:record.tracks[pIndex.id].album,
            autoCancel:false,
            allowWhileIdle:false,
            ignoreInForeground:true,
            actions:["Prev", "Next"]
        });
    }

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