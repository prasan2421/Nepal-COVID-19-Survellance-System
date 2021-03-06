import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    AsyncStorage,
    Button,
    TextInput,
    Alert,
    Picker,
    StyleSheet,
    Modal,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    TouchableHighlight,
    Dimensions,
    Image,
    ActivityIndicator, Keyboard, StatusBar, Linking, TouchableNativeFeedback
} from 'react-native';
// import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons'
import {images} from "../constants/images";
import VersionNumber from "react-native-version-number";import Url from "../constants/Url";
import NetInfo, {NetInfoState, NetInfoSubscription} from '../components/src';
import ErrorHelper from "../commons/ErrorHelper";
interface State {
    connectionInfo: NetInfoState | null;
}

class New extends React.Component<{}, State>  {
    _subscription: NetInfoSubscription | null = null;
    constructor(props) {
        super(props);
        this.state = {
            name:this.props.navigation.getParam('name', 0),
            number:this.props.navigation.getParam('number', 0),

            refreshing:false,
            connectionInfo: null,
        }
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {

        });
        this._subscription = NetInfo.addEventListener(
            this._handleConnectionInfoChange,
        );
    }

    _handleConnectionInfoChange = (connectionInfo: NetInfoState) => {
        // alert(JSON.stringify(connectionInfo))
        this.setState({connectionInfo:connectionInfo.isInternetReachable});

    };


    netStatus(){
        if(!this.state.connectionInfo){
            return(
                <View style={{width:'100%',backgroundColor:'#ff1500',alignItems:'center'}}>
                    <Text style={{color:'#fff'}}>No Internet..</Text>
                </View>
            )
        }
    }

    render() {
        return (
            <ScrollView
                contentContainerStyle={{backgroundColor:'#ebeef3',flexGrow:1, flexDirection: 'column', justifyContent: 'space-between'}}>
                <View>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor='#1B7ED5'
                />
                {this.netStatus()}
                <View style={{width:'100%',marginBottom:10,marginTop:10,alignItems: 'center'}}>
                    <View style={{elevation:1,position:'relative',width:'95%',flexDirection: 'row',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',padding:20,borderRadius:5}}>

                        <View>
                        <Text style={{color:'#f9156c',fontSize:18,textAlign:'center',marginBottom:20,}}>PIN number will be changed as per your request and new PIN number will be sent through SMS shortly.</Text>

                            <Text style={{color:'#575757',fontSize:14,}}>
                                Please take care of your health and update your health status three times a day (around 9 AM, 2 PM and 10 PM).</Text>
                        </View>
                        {/*<TouchableHighlight onPress={()=>this.props.navigation.navigate('ChangePassword')} style={{position:'absolute',backgroundColor:'#1bb601',bottom:0,right:0,alignItems:'center',justifyContent:'center',borderBottomRightRadius:5}}>*/}

                           {/*<Text style={{color:'#fff',padding:4,fontSize:12}}>Change Password</Text>*/}
                        {/*</TouchableHighlight>*/}
                    </View>

                </View>
                </View>
                <View style={{alignItems:'flex-end'}}>
                    <View style={{width:'100%',backgroundColor:'#ebeef3', padding:5}}>
                        <View style={{
                            width:'100%',
                            borderRadius:3,
                            overflow:'hidden',
                            backgroundColor:'#059200'}}>
                            <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple('#c3c3c3')}
                                onPress={()=>this.props.navigation.navigate('Home')}
                            >
                                <View style={{alignItems:'center'}}>
                                    <View style={{padding:15,}}>
                                        <Text style={{color:'#fff'}}>{'Go to Dashboard'}</Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default New;
const styles = StyleSheet.create({
   fontwrapper:{
       flexDirection:'row',borderBottomWidth:1,borderColor:'#e6e6e6',padding:10
   },
    font1:{
        color:'#f9156c',width:'45%'
    },
    font2:{
        color:'#262626',width:'55%'
    },


});
