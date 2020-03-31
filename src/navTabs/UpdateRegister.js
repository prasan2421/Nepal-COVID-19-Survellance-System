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
            this.requestLocationPermission()
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

        if(number.length<10){
            number_Error = 'मोबाइल न. को लम्बाइ पुगेन ';
        }

        if(number==""){
            number_Error = 'कृपया मोबाइल न. लेख्नु होस्';
        }

        if(pin==""){
            pin_Error = 'कृपया पिन न. लेख्नु होस्';
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
        let name = this.state.name;
        let number = this.state.number;
        let location = this.state.gps;
        let pin = this.state.pin;

        let name_Error = '';
        let number_Error='';
        let pin_Error='';
        let locationError = '';



        if(pin==""){
            pin_Error = 'कृपया पिन न. लेख्नु होस्';
        }

        if(name==""){
            name_Error = 'कृपया नाम छान्नु होस्';
        }
        if(number.length<10){
            number_Error = 'मोबाइल न. को लम्बाइ पुगेन ';
        }
        if(number==""){
            number_Error = 'कृपया मोबाइल न. लेख्नु होस्';
        }
        if(location==""){
            locationError = 'कृपया लोकेशन हाल्नु होस्';
        }

        this.setState({
            name_Error:name_Error,
            number_Error: number_Error,
            locationError: locationError,
            pin_Error:pin_Error
        });



        if(name_Error ||  number_Error || locationError || pin_Error) {
            return;
        }

        this.props.navigation.navigate('UpdateFeedback',{
            name:name,
            number:number,
            pin:pin,
            latitude:this.state.latitude,
            longitude:this.state.longitude
        });

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

    requestLocationPermission= async () =>  {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message:
                        'Access Location Permission',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    (position) => {
                        this.setState({
                            gps:position.coords.latitude+','+position.coords.longitude,
                            longitude:position.coords.longitude,
                            latitude:position.coords.latitude
                        })
                        // alert(JSON.stringify(position));
                        // console.log(position);
                    },
                    (error) => {
                        // See error code charts below.
                        console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );

            } else {
                Alert.alert('Error','Location permission denied');
            }
        } catch (err) {
            console.warn(err);
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
    bottomBox(){
        if(this.state.dataName.length>0){
            return(
                <View style={{alignItems:'flex-end'}}>
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
                                        <Text style={{color:'#fff'}}>पेश गर्नुहोस</Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </View>
            )
        }
        else return null;
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
                            <Picker.Item label="नाम छान्नु होस्" value="" />
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
                                   placeholder="मोबाइल न. (१० अंक)"
                                   returnKeyType='done'
                                   maxLength={10}
                                   keyboardType={'numeric'}
                                   onSubmitEditing={Keyboard.dismiss}
                                   onChangeText={(number) => this.setState({number})}
                        />
                        {/*<TouchableOpacity onPress={() => this.getNamesFromAsyncStorage()} style={{width:'10%',alignItems:'center'}}>*/}
                        {/*    <Icon name="md-search" color={"#ff1f77"} size={24} style={{padding:5}} />*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                    <ErrorText text={this.state.number_Error} />
                </View>
                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:'95%',backgroundColor:'#fff',alignItems:'center',borderRadius:5,elevation: 1}}>
                        <TextInput style={{paddingLeft:10,width:'100%'}}
                                   placeholder="पिन न."
                                   returnKeyType='done'
                                   keyboardType={'numeric'}
                                   onSubmitEditing={Keyboard.dismiss}
                                   onChangeText={(pin) => this.setState({pin})}
                        />
                    </View>
                    <ErrorText text={this.state.pin_Error} />
                </View>
                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>
                <TouchableOpacity onPress={() => this.getNamesFromAsyncStorage()}
                                  style={{borderRadius:5,width:'50%',alignItems:'center',flexDirection:'row',justifyContent:'center',backgroundColor:'#059200'}}>
                    <Icon name="md-search" color={"#fff"} size={24} style={{padding:5}} />
                    <Text style={{color:'#fff'}}>नाम खोज्नु होस् </Text>
                </TouchableOpacity>
                </View>
                {this.setName()}

                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:'95%',backgroundColor:'#fff',alignItems:'center',borderRadius:5,elevation: 1}}>
                        <TextInput style={{paddingLeft:10,width:'90%'}}
                                   value={this.state.gps}
                                   placeholder="लोकेशन डाटा"
                                   returnKeyType='done'
                                   editable={false}
                                   onSubmitEditing={Keyboard.dismiss}
                                   onChangeText={(gps) => this.setState({gps})}
                        />
                        <TouchableOpacity onPress={() => this.requestLocationPermission()}  style={{width:'10%',alignItems:'center'}}>
                            <Icon name="md-pin" color={"#ff1f77"} size={24} style={{padding:5}} />
                        </TouchableOpacity>
                    </View>
                    <ErrorText text={this.state.locationError} />
                </View>
                </View>
                {this.bottomBox()}
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
