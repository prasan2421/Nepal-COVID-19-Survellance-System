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
        // if(connectionInfo.isInternetReachable){
        //     if(!this.state.data.length>0){
        //         this.checkInternet()
        //     }
        //
        // }

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
                        <Text style={{color:'#f9156c',fontSize:18,textAlign:'center',marginBottom:20}}>तपाईको सन्देश सफलतापूर्वक प्रेषित भयो |</Text>
                            <Text style={{color:'#575757',fontSize:14}}>कृपया आफ्नो स्वास्थ्यको ख्याल राखी दिनको तीनपटक (बिहान ६ बजेतिर, दिउस २ बजे तिर, र बेलुका १० बजे तिर) आफ्नो स्वास्थ्य अवस्था अपडेट गर्नुहोस् |</Text>
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
                                        <Text style={{color:'#fff'}}>{'बाहिर'}</Text>
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
