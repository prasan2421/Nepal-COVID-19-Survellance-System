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
    TouchableWithoutFeedback,
    TouchableOpacity,
    RefreshControl,
    TouchableHighlight,
    Dimensions,
    Image,
    ActivityIndicator, Keyboard, StatusBar, Linking, PermissionsAndroid,Animated
} from 'react-native';
import ContentLoader, { Facebook,List, Rect, Circle } from 'react-content-loader/native'
// import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons'
import ErrorText from "../commons/ErrorText";
import EmptyProducts from "../svg/EmptyProducts";
import ActivityIcon from "../commons/ActivityIcon";

import moment from "moment";
import NetInfo, {NetInfoState, NetInfoSubscription} from '../components/src';
import VersionNumber from "react-native-version-number";
import Url from "../constants/Url";

const MyListLoader = () => (
    <ContentLoader
        // viewBox="0 0 200 400"
        width={'100%'}
        height={90}
        speed={0.5}
        title="Loading items..."
    >
        <Rect x="0" y="2.93" rx="5" ry="5" width="143.55" height="80" />
        <Rect x="155" y="9.67" rx="0" ry="0" width="197.72" height="12.12" />
        <Rect x="192.84" y="25.67" rx="0" ry="0" width="89" height="9" />
    </ContentLoader>
)

interface State {
    connectionInfo: NetInfoState | null;
}

class New extends React.Component<{}, State>  {
    _subscription: NetInfoSubscription | null = null;
    static navigationOptions  = ({ navigation }) => {
        return {
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:16,justifyContent:'center'}}>{navigation.getParam('Count')}</Text>,

            headerRight: <View/>

        };
    };
    constructor(props) {
        super(props);
        this.state = {
            connectionInfo: true,
            showEmptyView: false,
            isLoadingcheckin:false,
            language:'',
            refreshing:true,
            refreshing1:false
        }
    }


    componentDidMount() {

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.checkLanguage()
        });
        this._subscription = NetInfo.addEventListener(
            this._handleConnectionInfoChange,
        );
    }

    checkLanguage= async () =>{
        let language = await AsyncStorage.getItem('language');
        if (language){
            this.props.navigation.setParams({ Count: language=='en'?'Change Language':'भाषा परिवर्तन' });

            this.setState({
                refreshing:false,
                language:language
            })
        }
        else{
            this.props.navigation.setParams({ Count: 'भाषा परिवर्तन' });

            this.setState({
                refreshing:false,
                language:'np'
            })
        }

    }

    changeLanguage= async () =>{
        this.setState({
            refreshing1:true
        })
        if(this.state.language=='en'){
            await AsyncStorage.multiSet([
                ['language', 'np'],
            ]);
            this.setState({
                refreshing1:false
            })
        }
        else{
            await AsyncStorage.multiSet([
                ['language', 'en'],
            ]);
            this.setState({
                refreshing1:false
            })
        }
        this.checkLanguage()

    }

    _handleConnectionInfoChange = (connectionInfo: NetInfoState) => {
        this.setState({connectionInfo:connectionInfo.isInternetReachable});
    };
    componentWillUnmount() {
        this.focusListener.remove();
    }


    showLoader = () => {
        this.setState({ isLoadingcheckin: true });
    };
    hideLoader = () => {
        this.setState({ isLoadingcheckin: false });
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
        if(this.state.refreshing){
            return(<View style={{width:'100%',alignItems:'center'}}>
                <View style={{width:'95%',paddingTop:20}}>
                    <MyListLoader/>
                    <MyListLoader/>

                </View>
            </View>)
        }
        else{
        return (
            <View style={{flex:1,backgroundColor:'#ebeef3'}}>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor='#1B7ED5'
                />

                {this.netStatus()}

                <ActivityIcon visible={this.state.refreshing1}
                              indicatorColor={'#333333'}
                              messageColor={'#afafaf'}
                              message='Please wait...'
                />

                <View style={{flex:1,width:'100%',alignItems:'center',}}>
                    <View style={{width:'95%',marginTop:10,backgroundColor:'#fff',elevation:1,borderRadius:5,padding:5}}>
                        <View style={{width:'100%',backgroundColor:'#1B7ED5',padding:10,borderTopLeftRadius:5,borderTopRightRadius:5,alignItems:'center'}}>
                            <Text style={{color:'#fff'}}>Language</Text>
                        </View>
                    <View style={{marginTop:20}}>
                        <Text>{this.state.language=='en'?'Current language':'हालको भाषा'} : <Text style={{fontWeight: 'bold'}}>{this.state.language=='en'?'English':'नेपाली'}</Text></Text>
                    </View>
                    <View style={{flexDirection: 'row',justifyContent:'space-between',alignItems:'center',marginTop:10,marginBottom:10}}>
                        <Text>{this.state.language=='en'?'Change language':'भाषा परिवर्तन'}</Text>
                        <TouchableOpacity onPress={()=>this.changeLanguage()}>
                        <View style={{backgroundColor:this.state.language=='en'?'#059200':'#ff7353',borderRadius:5,padding:5,width:100,alignItems:'center'}}>

                                <Text style={{color:'#fff'}}>{this.state.language=='en'?'नेपाली':'English'}</Text>

                        </View>
                        </TouchableOpacity>
                    </View>

                    </View>
                </View>
            </View>
        );

        }
    }
}

export default New;
