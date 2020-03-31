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
    AppState,
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
    ActivityIndicator, Keyboard, StatusBar, Linkin, Linking, TouchableNativeFeedback
} from 'react-native';
import firebase from 'react-native-firebase';

import {images} from "../constants/images";
import NetInfo, {NetInfoState, NetInfoSubscription} from '../components/src';



interface State {
    connectionInfo: NetInfoState | null;
}

class New extends React.Component<{}, State> {
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
            appState: AppState.currentState,
            connectionInfo: null,
            async:false,
            refreshing:false,
            language:''
        };
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.checkLanguage()
            firebase.messaging().subscribeToTopic('general');
            firebase.messaging().subscribeToTopic('reminder');
        });
        this._subscription = NetInfo.addEventListener(
            this._handleConnectionInfoChange,
        );

        AppState.addEventListener('change', this.handleAppStateChange);

    }
    // sendDeviceToken() {
    //
    //         firebase
    //             .messaging()
    //             .getToken()
    //             .then(fcmToken => {
    //                 if (fcmToken) {
    //                     let url =
    //                         Url.deviceTokenUrl +
    //                         '?mobile=' +
    //                         registrationDetails.mobileNumber +
    //                         '&devicetoken=' +
    //                         fcmToken +
    //                         '&companyid=' +
    //                         Url.companyId;
    //
    //                     fetch(url)
    //                         .then(response => response.json())
    //                         .then(responseJson => {})
    //                         .catch(error => {});
    //                 }
    //             });
    //
    // }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
        this.focusListener.remove();
    }
    handleAppStateChange = (nextAppState) => {
        if(this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            // this.sendDeviceToken();
            firebase.messaging().subscribeToTopic('general');

        }

        this.setState({appState: nextAppState});
    }


    _handleConnectionInfoChange = (connectionInfo: NetInfoState) => {
        // alert(JSON.stringify(connectionInfo))
        this.setState({connectionInfo:connectionInfo.isInternetReachable});

    };

    checkLanguage= async () =>{
        let language = await AsyncStorage.getItem('language');
        // alert(language)

        if (language){
            this.props.navigation.setParams({ Count: language=='en'?'Dashboard':'ड्यासबोर्ड' });
            this.setState({
                language: language
            })
        }
        else{
            this.props.navigation.setParams({ Count: 'ड्यासबोर्ड' });
            this.setState({
                language:'np'
            })

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

    headerTitle(){
        if(this.state.language=='np'){
            return(
                <View style={{ width:'90%',marginTop: 10}}>
                    <Text style={{fontSize:16,color:'#fff',fontFamily:'Karla-Bold',lineHeight:25,marginBottom:15}}>{'कृपया निम्न बटनहरु मध्ये आफुलाई उपयुक्त छानेर त्रियाज टेस्ट गरि दर्ता तथा डाटा पठाउनु होस् |  एउटै मोबाइल न. बाट एक भन्दा बढी व्यक्तिहरुको दर्ता गर्न सक्नु हुनेछ |'}</Text>
                    <Text style={{fontSize:14,color:'#fff',fontFamily:'Karla-Bold',marginBottom:10,lineHeight:20}}>{'१. पहिलो पटक दर्ता गर्नुपरेमा "त्रियाज परिक्षण" मा क्लीक गर्नुहोस् |'}</Text>
                    <Text style={{fontSize:14,color:'#fff',fontFamily:'Karla-Bold',marginBottom:10,lineHeight:20}}>{'२. पहिला दर्ता भइसकेको व्यक्तिको दैनिक डाटा पठाउनु परेमा "पुरानो दर्ता अपडेट" मा क्लीक गर्नुहोस् |'}</Text>
                    <Text style={{fontSize:14,color:'#fff',fontFamily:'Karla-Bold',marginBottom:10,lineHeight:20}}>{'३. पहिला दर्ता भएको डाटाहरु हेर्नुपरेमा "पुरानो दर्ताको विवरण" मा क्लीक गर्नुहोस् |'}</Text>
                    <Text style={{fontSize:14,color:'#fff',fontFamily:'Karla-Bold',lineHeight:20}}>{'४. स्वास्थ्य अवस्था बिग्रिएर अति आवस्यक परेको खण्डमा "आपतकालीन नोट" मा क्लीक गरेर संदेश छोड्नुहोस् |'}</Text>

                </View>
            )}
        else{
            return(
                <View style={{ width:'90%',marginTop: 10}}>
                    <Text style={{fontSize:16,color:'#fff',fontFamily:'Karla-Bold',lineHeight:20,marginBottom:15}}>{'Please select following appropriate button to take Triage Test, register and send data. One mobile number can be used to register more than one person.'}</Text>
                    <Text style={{fontSize:14,color:'#fff',fontFamily:'Karla-Bold',marginBottom:10,lineHeight:18}}>1. Please click on "Triage Test" for new registration</Text>
                    <Text style={{fontSize:14,color:'#fff',fontFamily:'Karla-Bold',marginBottom:10,lineHeight:18}}>2. Please click on "Update Triage Status" to update data on daily basis, if
                        the User is already registered</Text>
                    <Text style={{fontSize:14,color:'#fff',fontFamily:'Karla-Bold',marginBottom:10,lineHeight:18}}>3. Please click on "Check Triage History" to review old registered data</Text>
                    <Text style={{fontSize:14,color:'#fff',fontFamily:'Karla-Bold',lineHeight:18}}>4. Please click on "Emergency Note", to leave a message in case of
                        deteriorating health condition</Text>
                </View>
            )
        }

    }
    languageBoxes(){
        if(this.state.language=='np'){
            return(
                <View style={{
                    marginBottom:20
                }}>
                <View style={{elevation:2,
                    width:'100%',
                    borderRadius:3,
                    overflow:'hidden',
                    marginBottom:10
                }}>
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#c3c3c3')}
                        onPress={()=>this.props.navigation.navigate('Feedback')}>
                        <View
                            style={{
                                backgroundColor:'#ffffff',

                            }}>
                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                <Text style={[styles.iconText,{color:'#1B7ED5'}]}>त्रियाज परिक्षण</Text>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                </View>
                <View style={{elevation:2,
                width:'100%',
                borderRadius:3,
                overflow:'hidden',
                marginBottom:10
            }}>
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('#c3c3c3')}
            onPress={()=>this.props.navigation.navigate('UpdateRegister')}>
        <View
            style={{
                backgroundColor:'#ffffff',
            }}>
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>

        <Text style={styles.iconText}>पुरानो दर्ता अपडेट</Text>
        </View>
        </View>
        </TouchableNativeFeedback>
        </View>
        <View style={{elevation:2,
        width:'100%',
        borderRadius:3,
        overflow:'hidden',
        marginBottom:10
        }}>
        <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple('#c3c3c3')}
        onPress={()=>this.props.navigation.navigate('RecordHistory')}>
        <View
        style={{
        backgroundColor:'#ffffff',
        }}>
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        {/*<Image style={{width:60,height:60}}  source={images.icon2}/>*/}
        <Text style={styles.iconText}>पुरानो दर्ताको विवरण</Text>
        </View>
        </View>
        </TouchableNativeFeedback>

        </View>

                    <View style={{elevation:2,
                        width:'100%',
                        borderRadius:3,
                        overflow:'hidden',
                        marginBottom:10
                    }}>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple('#c3c3c3')}
                            onPress={()=>this.props.navigation.navigate('Emergency')}>
                            <View
                                style={{
                                    backgroundColor:'#ffffff',
                                }}>
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    {/*<Image style={{width:60,height:60}}  source={images.icon2}/>*/}
                                    <Text style={styles.iconText}>आपतकालिन नोट</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={{elevation:2,
                        width:'100%',
                        borderRadius:3,
                        overflow:'hidden',
                        marginBottom:10
                    }}>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple('#c3c3c3')}
                            onPress={()=>this.props.navigation.navigate('Settings')}>
                            <View
                                style={{
                                    backgroundColor:'#ffffff',
                                }}>
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    {/*<Image style={{width:60,height:60}}  source={images.icon2}/>*/}
                                    <Text style={styles.iconText}>भाषा परिवर्तन</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={{elevation:2,
                        width:'100%',
                        borderRadius:3,
                        overflow:'hidden',
                        marginBottom:10
                    }}>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple('#c3c3c3')}
                            onPress={()=>this.props.navigation.navigate('ForgotPin')}>
                            <View
                                style={{
                                    backgroundColor:'#ffffff',
                                }}>
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    {/*<Image style={{width:60,height:60}}  source={images.icon2}/>*/}
                                    <Text style={styles.iconText}>पिन न. बिर्सनुभयो</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    {/*<View style={{alignItems:'center',marginTop: 20}}>*/}
                    {/*    <TouchableOpacity onPress={()=>this.props.navigation.navigate('ForgotPin')}>*/}
                    {/*        <Text style={{color:'#6155ff',padding:10}}>पिन न. बिर्सनुभयो</Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}
                </View>
            )
        }
        else{
            return(
                <View style={{
                    marginBottom:20
                }}>
                    <View style={{elevation:2,
                        width:'100%',
                        borderRadius:3,
                        overflow:'hidden',
                        marginBottom:10
                    }}>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple('#c3c3c3')}
                            onPress={()=>this.props.navigation.navigate('FeedbackEnglish')}>
                            <View
                                style={{
                                    backgroundColor:'#ffffff',

                                }}>
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    <Text style={[styles.iconText,{color:'#1B7ED5'}]}>Triage Test</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={{elevation:2,
                        width:'100%',
                        borderRadius:3,
                        overflow:'hidden',
                        marginBottom:10
                    }}>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple('#c3c3c3')}
                            onPress={()=>this.props.navigation.navigate('UpdateRegisterEnglish')}>
                            <View
                                style={{
                                    backgroundColor:'#ffffff',
                                }}>
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>

                                    <Text style={styles.iconText}>Update Triage Status</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={{elevation:2,
                        width:'100%',
                        borderRadius:3,
                        overflow:'hidden',
                        marginBottom:10
                    }}>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple('#c3c3c3')}
                            onPress={()=>this.props.navigation.navigate('RecordHistoryEnglish')}>
                            <View
                                style={{
                                    backgroundColor:'#ffffff',
                                }}>
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    {/*<Image style={{width:60,height:60}}  source={images.icon2}/>*/}
                                    <Text style={styles.iconText}>Check Triage History</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </View>

                    <View style={{elevation:2,
                        width:'100%',
                        borderRadius:3,
                        overflow:'hidden',
                        marginBottom:10
                    }}>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple('#c3c3c3')}
                            onPress={()=>this.props.navigation.navigate('EmergencyEnglish')}>
                            <View
                                style={{
                                    backgroundColor:'#ffffff',
                                }}>
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    {/*<Image style={{width:60,height:60}}  source={images.icon2}/>*/}
                                    <Text style={styles.iconText}>Emergency Note</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={{elevation:2,
                        width:'100%',
                        borderRadius:3,
                        overflow:'hidden',
                        marginBottom:10
                    }}>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple('#c3c3c3')}
                            onPress={()=>this.props.navigation.navigate('Settings')}>
                            <View
                                style={{
                                    backgroundColor:'#ffffff',
                                }}>
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    {/*<Image style={{width:60,height:60}}  source={images.icon2}/>*/}
                                    <Text style={styles.iconText}>Change Language</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <View style={{elevation:2,
                        width:'100%',
                        borderRadius:3,
                        overflow:'hidden',
                        marginBottom:10
                    }}>
                        <TouchableNativeFeedback
                            background={TouchableNativeFeedback.Ripple('#c3c3c3')}
                            onPress={()=>this.props.navigation.navigate('ForgotPinEnglish')}>
                            <View
                                style={{
                                    backgroundColor:'#ffffff',
                                }}>
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                    {/*<Image style={{width:60,height:60}}  source={images.icon2}/>*/}
                                    <Text style={styles.iconText}>Forgot Pin</Text>
                                </View>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    {/*<View style={{alignItems:'center',marginTop: 20}}>*/}
                    {/*    <TouchableOpacity onPress={()=>this.props.navigation.navigate('ForgotPinEnglish')}>*/}
                    {/*    <Text style={{color:'#6155ff',padding:10}}>Forgot Pin</Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}
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

                <ImageBackground  style={{justifyContent:'center',alignItems:'center',height:400}} source={images.blue}>

                    {/*<View style={{marginTop:30,height:90,width:90,backgroundColor:'#aa3f00',borderRadius:90,justifyContent:'center',borderColor:'#298ade',borderWidth:3}}>*/}
                    {/*    <Image style={{height:84,width:84,backgroundColor:'#aa3f00',borderRadius:84,justifyContent:'center',borderColor:'#f3f7ec',borderWidth:2}}  source={images.face}/>*/}
                    {/*</View>*/}

                        {/*<Text style={{fontSize:14,color:'#f1e4a3',/*fontWeight:'bold',width:'100%'*!/}>Welcome</Text>*/}
                        {/*<Text style={{fontSize:14,color:'#f1e4a3',/*fontWeight:'bold',width:'100%'*!/}>To</Text>*/}
                    {this.headerTitle()}

                </ImageBackground>

                    <View style={{flex:2,width:'100%',alignItems:'center',marginBottom:20,marginTop:30}}>
                        {/*<Text>{this.state.language}</Text>*/}
                    <View
                        showsVerticalScrollIndicator={false}
                        style={{width:'85%',}}>

                            {this.languageBoxes()}

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
        fontFamily:'Karla',
        paddingVertical:15,
        textAlign:'center'
    },

    map: {
        flex:1,
    },

});
