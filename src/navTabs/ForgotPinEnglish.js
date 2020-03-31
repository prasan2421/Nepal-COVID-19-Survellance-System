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
    PermissionsAndroid,
    ActivityIndicator, Keyboard, StatusBar, Linking, TouchableWithoutFeedback, TouchableNativeFeedback
} from 'react-native';
import NetInfo, {NetInfoState, NetInfoSubscription} from '../components/src';
import Icon from 'react-native-vector-icons/Ionicons'
import {images} from "../constants/images";
import ActivityIcon from "../commons/ActivityIcon";
import ErrorText from "../commons/ErrorText";
import VersionNumber from "react-native-version-number";import Url from "../constants/Url";

import ErrorHelper from "../commons/ErrorHelper";
import Geolocation from "react-native-geolocation-service";
import EmptyProducts from "../svg/EmptyProducts";
import ContentLoader, {Rect} from "react-content-loader/native";
interface State {
    connectionInfo: NetInfoState | null;
}
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

class New extends React.Component<{}, State> {
    _subscription: NetInfoSubscription | null = null;

    constructor(props) {
        super(props);
        this.state = {
            name:'',
            number:'',
            name_Error:'',
            number_Error:'',
            pickerEnabled:false,

            locationError:'',
            connectionInfo: null,
            refreshing:false,
            dataName:[],
            gps:'',
            longitude:'',
            latitude:'',
            isLoading:false,
            pin:'',
            pin_Error:''


        }
    }
    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            // this.checkInternet()

        });
        this._subscription = NetInfo.addEventListener(
            this._handleConnectionInfoChange,
        );
    }
    _handleConnectionInfoChange = (connectionInfo: NetInfoState) => {
        // alert(JSON.stringify(connectionInfo.isInternetReachable));return;
        this.setState({connectionInfo:connectionInfo.isInternetReachable});
    };

    getNamesFromAsyncStorage = async () => {
        this.setState({
            dataName:[],
            name:''
        })
        let number = this.state.number;
        let pin = this.state.pin;
        let number_Error='';
        let pin_Error='';

        if(number==""){
            number_Error = 'Please enter your phone no.';
        }

        if(pin==""){
            pin_Error = 'Please enter your pin no.';
        }

        this.setState({
            number_Error:number_Error,
            pin_Error: pin_Error,

        });

        if(number_Error ||  pin_Error ) {
            return;
        }

        this.showLoader();

        let url=Url.baseUrl+'clients?phoneNum='+this.state.number+'&pin='+this.state.pin;
        // alert(url); return;
        fetch(url, {
            headers: {

            }
        })
            .then((response) => {
                if(!response.ok) {
                    this.hideLoader();
                    alert('An error occurred (Error Code: '+response.status + ')')

                }
                else {
                    this.hideLoader();
                    response.json().then((responseJson) => {
                        // alert(JSON.stringify(responseJson))

                        if(responseJson.success) {
                            this.setState(  {
                                dataName: responseJson.data.clients,
                                pickerEnabled:true
                            });
                        }
                        else{
                            // alert(JSON.stringify(responseJson))
                            if (responseJson.errors.token == "token_invalid") {

                                alert('You have logged in from another device.');
                                this.signOutAsync();
                            }
                            else {
                                // this.setState(
                                //     {
                                //         pin_Error:Object.values(responseJson.errors)
                                //     }
                                // )
                                alert(Object.values(responseJson.errors).join('\n'));
                            }
                        }
                    })}})

            .catch((error) => {
                this.hideLoader();
                alert(error);
            })

    };
    next = async() =>  {

        let number = this.state.number;
        let number_Error='';

        if(number.length<10){
            number_Error = 'Length of phone no. is not enough';
        }

        if(number==""){
            number_Error = 'Please enter your phone no.';
        }


        this.setState({
            number_Error: number_Error,
        });

        if(number_Error ) {
            return;
        }

        this.showLoader();

        let dataList=new FormData();
        dataList.append('phoneNum', number);

        // this.hideLoader();
        // alert(dataSave);return;

        let url=Url.baseUrl+'users/reset-pin'
        fetch(url,{
            method:'POST',
            headers:{
                // 'version':VersionNumber.buildVersion,
                // 'x-auth': access_token,
                // 'Accept':'application/json',
                // 'Content-Type':'application/json',
            },
            body: dataList
        })
            .then((response)=> {
                if(!response.ok) {
                    this.hideLoader();
                    alert('An error occurred (Error Code: '+response.status + ')')
                }
                else {
                    this.hideLoader()
                    response.json()
                        .then ((responseJson) => {
                            if(responseJson.success){
                                this.props.navigation.navigate('SuccessForgotPinEnglish');
                                // Alert.alert('Success','Updated successfully.')
                                // this.saveToAsyncStorage(responseJson);
                            }
                            else{
                            if(responseJson.errors.version){

                                    Alert.alert(
                                        'New update available',
                                        'Please update the app to latest version.',
                                        [
                                            {text: 'Go to playstore', onPress: ()=>Linking.openURL("market://details?id="+VersionNumber.bundleIdentifier)},
                                        ],
                                        { cancelable: false }
                                    )
                                }
                                alert(Object.values(responseJson.errors).join('\n'));
                            }
                        })
                        .catch((error) => {
                            this.hideLoader();
                            alert(error);
                        })
                }})

            .catch((error) => {
                this.hideLoader();
                // alert(error);
            })
            .done();

    };
    showLoader = () => {
        this.setState({ isLoading: true });
    };
    hideLoader = () => {
        this.setState({ isLoading: false });
    };
    signOutAsync = async (navigation) => {
        await AsyncStorage.clear();
        navigation.navigate('Auth');
    };
    toggle(){
        this.props.navigation.toggleDrawer();
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


    renderEmptyView() {

        return (<View style={{width:'100%',alignItems:'center'}}>
            <View style={{width:'95%',paddingTop:20}}>
                <MyListLoader/>
                <MyListLoader/>
                <MyListLoader/>
                <MyListLoader/>
            </View>
        </View>);

    }


    setName(){
        if(this.state.dataName.length>0){
            return(
                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:'95%',backgroundColor:this.state.pickerEnabled?'#fff':'#aeaeae',borderRadius:5,elevation: 1}}>
                        <Picker
                            selectedValue={this.state.name}
                            style={{width: '100%',}}
                            enabled={this.state.pickerEnabled}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({name: itemValue})
                            }>
                            <Picker.Item label="Select your name" value="" />
                            {this.state.dataName.length > 0 ? this.state.dataName.map(item => (<Picker.Item key={'' + item} label={'' + item} value={item} />)):null}
                        </Picker>
                    </View>
                    <ErrorText text={this.state.name_Error} />
                </View>
            )
        }
        else return null;
    }

    render() {
        return (
            <ScrollView
                contentContainerStyle={{backgroundColor:'#ebeef3',flexGrow:1, flexDirection: 'column', justifyContent: 'space-between'}}
                removeClippedSubviews={false}
                keyboardShouldPersistTaps={'handled'}
            >
                <View>
                    <StatusBar
                        barStyle="dark-content"
                        backgroundColor='#1B7ED5'
                    />
                    <ActivityIcon visible={this.state.isLoading}
                                  indicatorColor={'#333333'}
                                  messageColor={'#afafaf'}
                                  message='Please wait ...'
                    />

                    {this.netStatus()}
                    <View style={{width:'100%',marginBottom:10,alignItems: 'center',marginTop:10}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',width:'95%',backgroundColor:'#fff',alignItems:'center',borderRadius:5,elevation: 1}}>
                            <TextInput style={{paddingLeft:10,width:'100%'}}
                                       placeholder="Mobile no. (10 digits)"
                                       returnKeyType='done'
                                       keyboardType={'numeric'}
                                       maxLength={10}
                                       onSubmitEditing={Keyboard.dismiss}
                                       onChangeText={(number) => this.setState({number})}
                            />
                            {/*<TouchableOpacity onPress={() => this.getNamesFromAsyncStorage()} style={{width:'10%',alignItems:'center'}}>*/}
                            {/*    <Icon name="md-search" color={"#ff1f77"} size={24} style={{padding:5}} />*/}
                            {/*</TouchableOpacity>*/}
                        </View>
                        <ErrorText text={this.state.number_Error} />
                    </View>
                </View>
                <View>
                    <View style={{width:'100%',backgroundColor:'#ebeef3', padding:5}}>
                        <View style={{
                            width:'100%',
                            borderRadius:3,
                            overflow:'hidden',
                            backgroundColor:'#059200'}}>
                            <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple('#c3c3c3')}
                                onPress={this.next}
                            >
                                <View style={{alignItems:'center'}}>
                                    <View style={{padding:15,}}>
                                        <Text style={{color:'#fff'}}>Submit</Text>
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
    container: {
        flex: 1,
        marginTop: 5,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonWrapper: {
        flexDirection:'row',
        marginTop:10,
        marginBottom:10,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonText: {
        color: '#fff',
        paddingBottom:10
    },
    inputContainer: {
        marginTop:5,
        borderWidth:1.5,
        borderColor:'#dbdbdb',
        backgroundColor: '#ffffff',

        borderRadius:10,
        height:50,
        justifyContent:'center'
    },
    inputContainerTopWrapper:{
        flexDirection:'row'
    },
    modalButton:{
        fontSize:18,fontWeight:'bold',color:'#fff'
    },
    inputContainerTopLeft: {
        marginTop:5,
        borderWidth:1.5,
        borderColor:'#dbdbdb',
        backgroundColor: '#ffffff',
        width:'80%',
        borderRadius:10,
        height:50,
        justifyContent:'center'
    },
    inputContainerTopRight: {
        marginTop:5,
        borderWidth:1.5,
        borderColor:'#dbdbdb',
        backgroundColor: '#ffffff',
        width:'20%',
        borderRadius:10,
        height:50,
        justifyContent:'center'
    },


});
