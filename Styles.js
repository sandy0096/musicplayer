import { StyleSheet, Dimensions } from "react-native";

const HEIGHT = Math.round(Dimensions.get('window').height);
const WIDTH = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    contentTop: {
        height:HEIGHT/3.5, width:WIDTH,
    },
    image: {
        flex: 1,
        width:WIDTH,
    },
    topIconContainer: {
        flexDirection:'row',
        justifyContent:'space-between'
    },

    contentBottom: {
        flex:1,
        backgroundColor: '#181b32',
        height:HEIGHT - HEIGHT/3,
        width:WIDTH,
        alignItems:'center',
        justifyContent:'flex-end'
    },
    containerRunningTime: {
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:0 ,
        minHeight:60,
        minWidth:WIDTH/1.1,
        flexWrap:'wrap'
    },
    containerSliderBox:{
        minWidth:WIDTH/1.2,
        marginTop:WIDTH/10
    },
    trackName: {
        fontWeight:'bold',
        fontSize:30,
        color:'#deddeb',
    },
    artistName: {
        fontSize:20,
        color:'#deddeb',
        backgroundColor:'rgba(0,0,0,0.5)',
    },
    controllerBox: {
        flex:2,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:WIDTH/1.2,
    },

    containerTabNavigation:{
        flex:1,
        width:WIDTH,
        maxHeight:HEIGHT/12,
        borderRadius:10,
        backgroundColor:'#fff',
        bottom:0
    },
    item:{
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    }


});

export default styles;