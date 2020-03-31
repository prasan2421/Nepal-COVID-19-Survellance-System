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
import SessionHelper from "../helpers/SessionHelper";
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

class New extends React.Component<{}, State>  {
    _subscription: NetInfoSubscription | null = null;
    constructor(props) {
        super(props);
        this.state = {
            refreshing:false,
            connectionInfo: null,
            name:this.props.navigation.getParam('name', 0),
            number:this.props.navigation.getParam('number', 0),
            pin:this.props.navigation.getParam('pin', 0),
            chart:[
                {id:0,level:'० - १५.५',text1:'COVID-19 को सम्भावना देखिदैन',text2:'नाकबाट सिंगान बगिरहेमा अरु फ्लु (Flu) को  लक्षण हुन सक्छ |',color:'#9cc2e5'},
                {id:1,level:'१५.६ – १९.३',text1:'COVID-19 को सम्भावना कम छ',text2:'सजगताको लागि तपाई अलग्गै बस्नुहोस (Self - Quarantine) र दिनको ३ पटक आफ्ना लक्षणहरु नियमितरुपमा  अपडेट गर्नुहोस |',color:'#92d050'},
                {id:2,level:'१९.४ – २४.५',text1:'COVID-19 को सम्भावना देखिन्छ ',text2:'थप सजगताको लागि तपाई अलग्गै बस्नुहोस (Self - Quarantine) र दिनको ३ पटक आफ्ना लक्षणहरु नियमितरुपमा  अपडेट गर्नुहोस |',color:'#ffff00'},
                {id:3,level:'२४.६ – ३१.३',text1:'COVID-19 को सम्भावना धेरै देखियो',text2:'घाँटी / नाकको स्वाबको नमुना परिक्षणको लागि अस्पतालमा पठाउन तयार रहनुहोस | यसका लागि तपाईलाई सम्बन्धित निकायले फोन सम्पर्क गर्नेछ |',color:'#ff0000'},

            ],
        }
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.getHistory()
        });
        this._subscription = NetInfo.addEventListener(
            this._handleConnectionInfoChange,
        );
    }

    _handleConnectionInfoChange = (connectionInfo: NetInfoState) => {
        // alert(JSON.stringify(connectionInfo))
        this.setState({connectionInfo:connectionInfo.isInternetReachable});
    };

    getHistory = () => {
        let url=Url.baseUrl+'client-histories?phoneNum='+this.state.number+'&pin='+this.state.pin+'&name='+this.state.name;
        fetch(url, {
            headers: {

            }
        })
            .then((response) => {
                if(!response.ok) {
                    alert('An error occurred (Error Code: '+response.status + ')')
                }
                else {
                    response.json()
                        .then((responseJson) => {
                            if(responseJson.success) {
                                // alert(JSON.stringify(responseJson));return;

                                    this.setState({
                                        data: responseJson.data.client_histories
                                    });

                            }
                            else{

                                this.setState({
                                    showEmptyView: true,
                                    error:'Something went wrong...',})
                                if (responseJson.errors.token == "token_invalid") {

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
                                else if(responseJson.errors.version){

                                }
                                else {
                                    alert(Object.values(responseJson.errors).join('\n'));
                                }
                            }

                        })
                }
            })
            .catch((error) => {
                this.setState({
                    error:'Something went wrong...',
                })
                // alert('An error occurred');
            })
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

            </View>
        </View>);

    }

    renderItemCountries = (item) => {
        return (
            <View style={[styles.fontwrapper,{backgroundColor:item.color}]}>
                <View style={{flexDirection:'row',}}>
                    <View style={styles.leftBox1}>
                        <Text style={styles.font1}>{item.level}</Text>
                    </View>
                    <View style={[styles.rightBox1]}>
                        <Text style={styles.font2}>{item.text1}</Text>
                    </View>
                </View>
                {/*<View style={[styles.bottomBox]}>*/}
                {/*    <Text style={styles.font2}>{item.text2}</Text>*/}
                {/*</View>*/}
            </View>

        );
    }

    renderItems = (item) => {
        let color='#fff';
        if(item.total_score<=15.5){
            color='#9cc2e5';

        }
        else if(item.total_score <19.4 ){
            color='#92d050';

        }
        else if(item.total_score <24.6 ){
            color='#ffff00';

        }
        else if(item.total_score >24.5 ){
            color='#ff0000';

        }
        return (
            <View style={[styles.fontwrapper]}>
                <View style={{flexDirection:'row'}}>
                    <View style={[styles.leftBox]}>
                        <Text style={styles.font2}>{item.created_at}</Text>
                    </View>
                    <View style={[styles.rightBox,{backgroundColor:color}]}>
                        <Text style={styles.font2}>{item.total_score}</Text>
                    </View>
                </View>

            </View>

        );
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
                    <View style={{elevation:1,position:'relative',width:'95%',paddingHorizontal:5,paddingTop:5,alignItems:'center',justifyContent:'center',backgroundColor:'#fff',borderRadius:5}}>
                        <View style={[styles.fontwrapper]}>

                            <View style={{flexDirection:'row'}}>
                                <View style={styles.leftBox}>
                                    <Text style={styles.font1}>दर्ता गरेको समय </Text>
                                </View>
                                <View style={[styles.rightBox]}>
                                    <Text style={styles.font1}>अंक</Text>
                                </View>
                            </View>

                        </View>
                        <FlatList
                            ListEmptyComponent={this.renderEmptyView()}
                            data={this.state.data}
                            maxToRenderPerBatch={10}
                            windowSize={10}
                            initialNumToRender={5}
                            style={{width:'100%'}}
                            // extraData={this.state.data}
                            keyExtractor={item => '' + item.id}
                            renderItem={({item}) => this.renderItems(item)
                            }
                        />
                        {/*<TouchableHighlight onPress={()=>this.props.navigation.navigate('ChangePassword')} style={{position:'absolute',backgroundColor:'#1bb601',bottom:0,right:0,alignItems:'center',justifyContent:'center',borderBottomRightRadius:5}}>*/}

                           {/*<Text style={{color:'#fff',padding:4,fontSize:12}}>Change Password</Text>*/}
                        {/*</TouchableHighlight>*/}
                    </View>
                    <View style={{elevation:1, width:'100%',alignItems:'center',justifyContent:'center',}}>
                        <View style={{marginVertical: 10}}>
                            <Text style={{fontSize:16,fontWeight:'bold', borderBottomWidth:1}}>स्केल</Text>
                        </View>
                        <View style={{elevation:1,position:'relative',width:'95%',paddingHorizontal:5,paddingTop:5,backgroundColor:'#fff',borderRadius:5}}>


                        <FlatList
                            ListEmptyComponent={this.renderEmptyView()}
                            data={this.state.chart}
                            maxToRenderPerBatch={10}
                            windowSize={10}
                            initialNumToRender={5}
                            // extraData={this.state.data}
                            keyExtractor={item => '' + item.id}
                            renderItem={({item}) => this.renderItemCountries(item)
                            }
                        />
                        </View>
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
        width:'100%',
        padding:5,
        alignItems:'center',
        marginBottom:5,
        borderColor:'#292929',
        borderWidth:1,

    },
    font1:{
        fontWeight:'bold',

    },
    font2:{
        color:'#262626',
    },

    leftBox:{
        width:'70%',alignItems:'center',justifyContent:'center',paddingVertical:5,borderColor:'#292929',
        borderRightWidth:1
    },
    rightBox:{
        width:'30%',alignItems:'center',justifyContent:'center',
    },

    leftBox1:{
        width:'40%',alignItems:'center',justifyContent:'center',paddingVertical:5,borderColor:'#292929',
        borderRightWidth:1
    },
    rightBox1:{
        width:'60%',alignItems:'center',justifyContent:'center',
    }


});
