import React, { Component } from 'react';
import { Text, View, ImageBackground, PermissionsAndroid, TouchableOpacity, Animated } from 'react-native';
import styles from './Styles';

import { observer } from "mobx-react";
import { observable } from "mobx";

import IconSimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

import MusicFiles from 'react-native-get-music-files';

import Slider from 'react-native-slider';

import moment from 'moment';
import momentFormatter from 'moment-duration-format';

import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

let Sound = require('react-native-sound');
Sound.setCategory('Playback');

const state = observable({
    record:{tracks:null, total:0},
    currentTrack:{player:null, trackIndex:0},
    slider: {minValue:0, maxValue:100, currentValue:0, interval:0},
    time: {elapsed:"--:--", max_duration:"--:--"},
    shuffle:false,
    loop:false,
});

function getTime(secs){
    let seconds = parseInt(secs);
    if(seconds < 3600)     return moment.duration(seconds,'seconds').format('mm:ss', {trim:false});
    else return moment.duration(seconds,'seconds').format('HH:mm:ss', {trim: false});
};

async function RequestStoragePermission() {
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
        } else {
            console.log('Permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
}

class Bottom extends Component {
    constructor(props){
        super(props);
        this.marqueeText = new Animated.ValueXY();
        this.interval = null;
    }

    componentDidMount(){
        this.checkStoragePermission();
    }

    componentDidUpdate(){
        this.props.onUpdate(state.record.tracks, state.currentTrack.trackIndex);
    }

    checkStoragePermission = () => {
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
                        this._gettingAllMusicFiles();
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

    _gettingAllMusicFiles = () => {
        MusicFiles.getAll({})
            .then(tracks => {
                if (tracks && tracks.length > 0) {
                    this._assortDataPath(tracks);
                } else {
                    alert('Hah! No tracks found on this device.');
                }
            })
            .catch(error => {
                console.log(error);
                alert('Something went wrong while getting Music Files');
            });
    };

    _assortDataPath = (array) => {
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
        state.record = {tracks:tracks, currentTrack:0, total:tracks.length - 1};
        this._loadTrack(0);
    };

    _loadTrack = (trackIndex) => {
        const { tracks } = state.record;
        let player = new Sound(tracks[trackIndex].filename, tracks[trackIndex].address, error => {
            if (error) {
                console.log('Failed to load track', error);
                alert('Failed to load track', error);
                return;
            }
            state.currentTrack = { player:player, trackIndex:trackIndex };
            this._resetSlider();
            // this._animate();
        });
    };

    _loadTrack$Play = (trackIndex) => {
        const { tracks } = state.record;
        let player = new Sound(tracks[trackIndex].filename, tracks[trackIndex].address, error => {
            if (error) {
                console.log('Failed to load track', error);
                alert('Failed to load track', error);
                return;
            }
            state.currentTrack = { player:player, trackIndex:trackIndex };
            this._resetSlider();
            this._play(trackIndex);
            // this._animate();
        });
    };

    _resetSlider = () => {
        let maxValue = Math.floor(state.currentTrack.player.getDuration());
        clearInterval(state.slider.interval);
        state.slider = {minValue:0, maxValue:maxValue, currentValue:0, interval:null};
    };

    _onSliderMove = (secs) => {
        state.time.elapsed = getTime(secs);
    };

    _onSliderPlay = () => {
        let interval = setInterval(this._runSlider, 1000);
        let copy_slider = state.slider;
        copy_slider['interval'] = interval;
        state.slider = copy_slider;
    };

    _onSlideChange = (seconds) => {
        let maxDuration = Math.floor(state.currentTrack.player.getDuration());
        let interval = state.slider.interval;
        state.slider = { minValue:0, maxValue:maxDuration, currentValue:seconds, interval:interval };
        state.currentTrack.player.setCurrentTime(seconds);
    };

    _sliderOnPause = () => {
        clearInterval(state.slider.interval);
        let copy_slider = state.slider;
        copy_slider['interval'] = null;
        state.slider = copy_slider;
    };

    _runSlider = () => {
        let seconds = state.slider.currentValue;
        let interval = state.slider.interval;
        let { trackIndex } = state.currentTrack;
        let maxDuration = Math.floor(state.currentTrack.player.getDuration());
        state.currentTrack.player.getCurrentTime((s) => {
            let max_time = getTime(state.currentTrack.player.getDuration());
            let elapsed_time = getTime(s);
            state.time = {elapsed:elapsed_time, max_duration:max_time};
        });

        if(seconds >= maxDuration){
            this._ascendIndex(trackIndex);
        }
        else {
            seconds += 1;
            state.slider = { minValue: 0, maxValue: maxDuration, currentValue: seconds, interval:interval };
        }
    };

    __checkIndexExistence = (index) => {
        const { total } = state.record;
        if(index > total || index <= 0){
            return false;
        }
        else return true;
    };

    _descendIndex = (trackIndex) => {
        const { total } = state.record;
        const { player } = state.currentTrack;
        trackIndex -= 1;
        player.release();
        if(this.__checkIndexExistence(trackIndex)){
            this._loadTrack$Play(trackIndex);
        }
        else{
            this._loadTrack$Play(total);
        }
    };

    _play = (trackIndex) => {
        const { player } = state.currentTrack;
        if(player._playing){
            player.pause(() => state.currentTrack = { player:player, trackIndex:trackIndex });
            this._sliderOnPause();
        }
        else{
            player.play(() => state.currentTrack = { player:player, trackIndex:trackIndex });
            this._onSliderPlay();
        }
    };

    _ascendIndex = (trackIndex) => {
        const { player } = state.currentTrack;
        trackIndex += 1;
        player.release();
        if(this.__checkIndexExistence(trackIndex)){
            this._loadTrack$Play(trackIndex);
        }
        else{
            this._loadTrack$Play(0);
        }
    };

    _animate = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.marqueeText, {
                    toValue: 50,
                    duration: 1000,
                    delay: 1000,
                    useNativeDriver:true,
                }),
                Animated.timing(this.marqueeText, {
                    toValue: -50,
                    duration: 1000,
                    useNativeDriver:true,
                })
            ]),
            {
                iterations: -1
            }
        ).start()
    };

    render() {
        const {player, trackIndex} = state.currentTrack;
        const {tracks} = state.record;
        const _playing = player ? player._playing ? 'pause' : 'play' : 'play';
        const _track_name = tracks ? tracks[trackIndex].title : 'No Track';
        const _album_name = tracks ? tracks[trackIndex].album : 'No Album';
        const {max_duration, elapsed} = state.time;
        return(
            <View style={styles.contentBottom}>

                <View style={styles.containerSliderBox}>
                    <Slider
                        minimumValue={state.slider.minValue}
                        maximumValue={state.slider.maxValue}
                        step={1}
                        onValueChange={(sec) => this._onSliderMove(sec)}
                        onSlidingComplete={(sec) => this._onSlideChange(sec)}
                        value={state.slider.currentValue}
                        minimumTrackTintColor="#000000"
                        maximumTrackTintColor="#f50049"
                        thumbTintColo   r="#fff"
                    />

                </View>

                <View style={styles.containerRunningTime}>
                    <IconFontAwesome size={25} name={'caret-left'} color="#F0FFF0" style={{ marginLeft: 10}}/>
                    <View style={{ flex:1, flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={{ marginLeft:10, color:'#F0FFF0', fontSize:18 }}>{elapsed}</Text>
                        <Text style={{ marginRight:10, color:'#F0FFF0', fontSize:18 }}>{max_duration}</Text>
                    </View>
                    <IconFontAwesome size={25} name={'caret-right'} color="#F0FFF0" style={{ marginRight: 10}}/>
                </View>

                <View style={{ flex:1, flexDirection:'column', justifyContent:'flex-end', alignContent:'center', width:300}}>
                    <Text style={styles.trackName}>{_track_name}</Text>
                    <Animated.Text numberOfLines={1} style={[styles.artistName, {transform:[{translateX:this.marqueeText.x}]}]}>{_album_name}</Animated.Text>
                </View>

                <View style={styles.controllerBox}>
                    <IconSimpleLineIcons size={25} name={'loop'} color='#5d4e62'/>
                    <TouchableOpacity onPress={() => this._descendIndex(trackIndex)}>
                        <IconFontAwesome size={35} name={'step-backward'} color='#4e5988'/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._play(trackIndex)}>
                        <IconFontAwesome size={45} name={_playing} color='#4e5988'/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._ascendIndex(trackIndex)}>
                        <IconFontAwesome size={35} name={'step-forward'} color='#4e5988'/>
                    </TouchableOpacity>
                    <IconSimpleLineIcons size={25} name={'shuffle'} color='#5d4e62'/>
                </View>
            </View>
        );
    }
}

export default observer(Bottom);
