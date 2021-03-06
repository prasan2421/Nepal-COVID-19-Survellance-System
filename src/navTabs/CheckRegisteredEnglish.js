import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    AsyncStorage,
    Button,
    TextInput,
    Alert,
    StyleSheet,
    Modal,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    RefreshControl,
    TouchableHighlight,
    Dimensions,
    Image,
    processColor,
    I18nManager,
    ActivityIndicator, Keyboard, StatusBar, Linkin, Linking, TouchableNativeFeedback, PermissionsAndroid
} from 'react-native';

import {images} from "../constants/images";
import NetInfo, {NetInfoState, NetInfoSubscription} from '../components/src';
import Icon from "react-native-vector-icons/Ionicons";
import Geolocation from "react-native-geolocation-service";
import Url from "../constants/Url";
import VersionNumber from "react-native-version-number";



interface State {
    connectionInfo: NetInfoState | null;
}



class New extends React.Component<{}, State> {
    _subscription: NetInfoSubscription | null = null;

    static navigationOptions  = ({ navigation }) => {

            return {
                headerRight: <View/>

            };

    };

    constructor(props) {
        super(props);
        this.state = {
            data:JSON.parse(this.props.navigation.getParam('data', 0)),
            travelled:this.props.navigation.getParam('travelled', 0),
            countries:JSON.parse(this.props.navigation.getParam('countries', 0)),
            contact:this.props.navigation.getParam('contact', 0),
            connectionInfo: null,
            async:false,
            refreshing:false,
            language:'',
            longitude:'',
            latitude:'',
            latitude_Error:'',
            longitude_Error:'',
            access:false,
            message:false,
            isLoading:false,
            indicator:true
        };
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.requestLocationPermission()
        });
        this._subscription = NetInfo.addEventListener(
            this._handleConnectionInfoChange,
        );
    }
    showLoader = () => {
        this.setState({ isLoading: true });
    };
    hideLoader = () => {
        this.setState({ isLoading: false });
    };

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
                            longitude:position.coords.longitude,
                            latitude:position.coords.latitude
                        },()=>this.gpsValidation())
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
    gpsValidation(){
        let latitude = this.state.latitude;
        let longitude = this.state.longitude;
        let latitude_Error='';
        let longitude_Error='';

        if(latitude==""){
            latitude_Error = 'No.latitude found';
        }

        if(longitude==""){
            longitude_Error = 'No. longitude found';
        }

        this.setState({
            latitude_Error:latitude_Error,
            longitude_Error: longitude_Error,

        });

        if(latitude_Error ||  longitude_Error ) {
            alert('Location could not be found.')
            return;
        }

        this.showLoader();

        let url=Url.baseUrl+'clients/check-location?longitude='+longitude+'&latitude='+latitude;
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
                                access:true,
                                indicator:false
                            });

                        }
                        else{
                            this.setState(  {
                                message:true,
                                indicator:false
                            });
                            // alert(JSON.stringify(responseJson))
                            if (responseJson.errors.token == "token_invalid") {

                                alert('You have logged in from another device.');
                                this.signOutAsync();
                            }
                            else if(responseJson.errors.version){

                                Alert.alert(
                                    'New update available',
                                    'Please update the app to latest version.',
                                    [
                                        {text: 'Go to playstore', onPress: ()=>Linking.openURL("market://details?id="+VersionNumber.bundleIdentifier)},
                                    ],
                                    { cancelable: false }
                                )
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
                this.setState({
                    indicator:false
                })
                alert(error);
            })
    }

    message(){
        if(this.state.message){
            return(
                <View style={{marginTop:15,marginBottom:15,width:'100%',alignItems:'center'}}>
                    <View style={{width:'95%',backgroundColor:'#fff',borderWidth: 1,borderColor:'#353535',padding:10}}>
                        <Text>Currently, the registration facility is available for Kathmandu Metropolitan City only.</Text>
                    </View>
                </View>
            )
        }
        else return null;
    }

    _handleConnectionInfoChange = (connectionInfo: NetInfoState) => {
        // alert(JSON.stringify(connectionInfo))
        this.setState({connectionInfo:connectionInfo.isInternetReachable});

    };
    actIndicator(){
        if(this.state.indicator){
            return(
                <View style={{width:'100%',alignItems:'center'}}>
                    <View style={{flexDirection:'row',}}>
                        <ActivityIndicator size="small" color="#0000ff" />
                        <Text>Checking Location</Text>
                    </View>
                </View>

            )
        }
    }

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
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={()=>this.checkLanguage()}
                    />
                }
                style={{flex:1,backgroundColor:'#ebeef3'}}>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor='#1B7ED5'
                />
                {this.netStatus()}

                    <View style={{flex:2,width:'100%',alignItems:'center',marginBottom:20,marginTop:30}}>
                        {/*<Text>{this.state.language}</Text>*/}
                    <View
                        showsVerticalScrollIndicator={false}
                        style={{width:'85%',}}>

                        <View style={{
                            marginBottom:20
                        }}>
                            <Text style={{marginBottom:50}}>If you are registering for the first time, you will get 4 digit PIN number after registering your mobile
                                number. The PIN is required to register more than one person through the same mobile number. Please keep it safely.</Text>
                            <View style={{elevation:2,
                                width:'100%',
                                borderRadius:3,
                                overflow:'hidden',
                                marginBottom:10
                            }}>
                                <TouchableNativeFeedback
                                    background={TouchableNativeFeedback.Ripple('#c3c3c3')}
                                    onPress={this.state.access?()=>this.props.navigation.navigate('NumberRegisterEnglish',{
                                        data:JSON.stringify(this.state.data),
                                        travelled:this.state.travelled,
                                        countries:JSON.stringify(this.state.countries),
                                        contact:this.state.contact
                                    }):null}>
                                    <View
                                        style={{
                                            backgroundColor:this.state.access?'#059200':'#828282',

                                        }}>
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                            <Text style={styles.iconText}>Register new mobile no.</Text>
                                        </View>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>

                            <Text style={{marginTop:30,marginBottom:20}}>You can register additional person of your family through the same PIN number and registered mobile
                                number.</Text>
                            <View style={{elevation:2,
                                width:'100%',
                                borderRadius:3,
                                overflow:'hidden',
                                marginBottom:10
                            }}>
                                <TouchableNativeFeedback
                                    background={TouchableNativeFeedback.Ripple('#c3c3c3')}
                                    onPress={this.state.access?()=>this.props.navigation.navigate('RegisterEnglish' ,{
                                        data:JSON.stringify(this.state.data),
                                        travelled:this.state.travelled,
                                        countries:JSON.stringify(this.state.countries),
                                        contact:this.state.contact
                                    }):null}>
                                    <View
                                        style={{
                                            backgroundColor:this.state.access?'#059200':'#828282',
                                        }}>
                                        <View style={{flex:1,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                                            <View/>
                                            <Text style={[styles.iconText,{paddingLeft:10}]}>If the number is already registered please continue to Register New Person</Text>
                                            <Icon name="md-arrow-round-forward" color={"#fff"} size={24} style={{ padding: 20 }} />
                                        </View>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>

                        </View>
                        {this.actIndicator()}
                        {this.message()}
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
    slide:{
        flex: 1,
    },
    container1: {
        flex: 1,
    },
    chart: {
        flex: 1
    },
    Text: {
        fontFamily:'Karla-Bold',
        // fontWeight:'bold',
        fontSize:12,
        marginLeft:5,
        color: 'white',
        justifyContent:'center',
        alignItems:'center'
    },
    Text2: {
        fontFamily:'Karla-Bold',
    fontWeight:'bold',
        fontSize:22,
        marginLeft:5,
        color: 'white',
        justifyContent:'center',
        alignItems:'center'
},
    iconText:{
        color:'#fff',
        fontFamily:'Karla',
        paddingVertical:15,
        textAlign:'center'
    },

    map: {
        flex:1,
    },

});
