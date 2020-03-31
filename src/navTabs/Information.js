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
            refreshing:false,
            showEmptyView: false,
            data:[],
            isLoadingcheckin:false,
            cancelbeatid:'',
            language:''
        }
    }


    componentDidMount() {

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.checkInternet()
            this.checkLanguage()
        });
        this._subscription = NetInfo.addEventListener(
            this._handleConnectionInfoChange,
        );
    }

    checkLanguage= async () =>{
        let language = await AsyncStorage.getItem('language');
        // alert(language)

        if (language){
            this.props.navigation.setParams({ Count: language=='en'?'Information':'जानकारी' });
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

    _showSearch12 = () => {
        // alert('asd');
        this.setState({ showSearch: this.state.showSearch==true?false:true });
    };

    checkInternet(){
        NetInfo.fetch().then(state => {
            if(state.isInternetReachable){
                this.getDataFromAsyncStorage();
            }
            else{
                alert('No Internet Connection.')
            }
        });
    }
    _handleConnectionInfoChange = (connectionInfo: NetInfoState) => {
        this.setState({connectionInfo:connectionInfo.isInternetReachable});
    };
    componentWillUnmount() {
        this.focusListener.remove();
    }

    getDataFromAsyncStorage = async () => {
        const access_token = await AsyncStorage.getItem('access_token');
        let url=Url.baseUrl+'informations'
        fetch(url, {
            headers: {
                'version':VersionNumber.buildVersion,
                'x-auth': access_token
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                // alert(JSON.stringify(responseJson));return;
                if(responseJson.success='true') {
                    // alert(JSON.stringify(responseJson));
                    this.setState({
                        data: responseJson.data.informations,
                    });
                }
                else{
                    if (responseJson.errors.token == "token_invalid") {

                    }
                    else if(responseJson.errors.version){

                    }
                    else {
                        alert(Object.values(responseJson.errors).join('\n'));
                    }
                }
            })
            .catch((error) => {

                // alert('An error occurred');
            })
    };

    showLoader = () => {
        this.setState({ isLoadingcheckin: true });
    };
    hideLoader = () => {
        this.setState({ isLoadingcheckin: false });
    };

    renderEmptyView() {
        if(this.state.showEmptyView) {
            return (
                <View style={{alignItems:'center',justifyContent:'center'}}>
                    <EmptyProducts style={{width:200,height:200}}/>
                    <Text style={{fontSize:24}}>No Items..</Text>
                </View>
            )
        }
        else {
            return (<View style={{width:'100%',alignItems:'center'}}>
                <View style={{width:'95%',paddingTop:20}}>
                    <MyListLoader/>
                    <MyListLoader/>
                    <MyListLoader/>
                    <MyListLoader/>
                </View>
            </View>);
        }
    }

    approvalList(){
        return(
            <FlatList
                style={{paddingTop:5}}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={()=>this.checkInternet()}
                    />
                }
                ListEmptyComponent={this.renderEmptyView()}
                data={this.state.data}
                maxToRenderPerBatch={10}
                windowSize={10}

                initialNumToRender={5}
                // extraData={this.state.data}
                keyExtractor={item => '' + item.id}
                renderItem={({item}) => this.renderItem(item)}
            />
        )
    }
    renderItem = (item) => {
        return (
            <View
                style={{marginBottom: 5, marginTop: 1, alignItems: 'center',}}
            >
                <TouchableOpacity
                    underlayColor={'#c3c3c3'}
                    style={{
                        width: '95%',
                        backgroundColor:'#fff',
                        elevation: 1,
                        padding: 10,
                        borderRadius: 5
                    }}
                    onPress={()=>Linking.openURL(item.link)}
                >
                    <View style={{justifyContent:'space-between',flexDirection:'row',width:'100%',alignItems:'center'}}>
                        <View style={{width:'70%'}}>
                            <Text style={{fontSize: 14,color:'#2a8ee5'}}>{item.title}</Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center',width:'30%'}}>
                            <TouchableOpacity  style={{backgroundColor:'#74b360',borderRadius:5,padding:5,marginRight:5}}>
                                <Icon name="md-open" color={"#fff"} size={20} style={{ paddingHorizontal: 20 }} />
                            </TouchableOpacity>
                            {/*<Icon name="md-arrow-dropright" size={22} color="#000"/>*/}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    check(item){
        if(this.state.beatId==item._id){
            return(
                this.setState({
                    beatId: '',
                    beat:'Select the beat.'
                })
            )
        }
        else{
            return(
                this.setState({
                    cancelbeatid:this.state.beatId,
                    beatId: item._id,
                    beat:item.name,
                })
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
            <View style={{flex:1,backgroundColor:'#ebeef3'}}>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor='#1B7ED5'
                />

                {this.netStatus()}

                <ActivityIcon visible={this.state.isLoadingcheckin}
                              indicatorColor={'#333333'}
                              messageColor={'#afafaf'}
                              message='Please wait...'
                />

                <View style={{flex:1,width:'100%',}}>
                    {this.approvalList()}
                </View>
            </View>
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

        marginTop:30,
        alignItems:'center',
    },
    buttonText: {
        justifyContent:'center',
        color: '#fff',
        backgroundColor:'#ff1f77',
        paddingLeft:40,
        paddingRight:40,
        paddingTop:10,
        borderRadius:20,
        paddingBottom:10

    },
    modalButton:{
        fontSize:18,fontWeight:'bold',color:'#4B4B4B'
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
