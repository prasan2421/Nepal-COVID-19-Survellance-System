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
    ActivityIndicator, Keyboard, StatusBar, Linking, PermissionsAndroid, Animated, TouchableNativeFeedback
} from 'react-native';
import ContentLoader, { Facebook,List, Rect, Circle } from 'react-content-loader/native'
// import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons'
import EmptyProducts from "../svg/EmptyProducts";
import ActivityIcon from "../commons/ActivityIcon";

import NetInfo, {NetInfoState, NetInfoSubscription} from '../components/src';
import VersionNumber from "react-native-version-number";import Url from "../constants/Url";
import ErrorHelper from "../commons/ErrorHelper";
import RadioButton from "../commons/RadioButton";

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

    constructor(props) {
        super(props);
        this.state = {
            name:this.props.navigation.getParam('name', 0),
            number:this.props.navigation.getParam('number', 0),
            pin:this.props.navigation.getParam('pin', 0),
            latitude:this.props.navigation.getParam('latitude', 0),
            longitude:this.props.navigation.getParam('longitude', 0),

            connectionInfo: true,
            refreshing:false,
            showEmptyView: false,
            travelled:false,
            data:[
                {id:0,name:'नाकबाट सिंगान बगिरहेको छ ?',checked:false,value1:0,value2:0},
                {id:1,name:'ज्वरो आएको छ ? (१०० F +)',checked:false,value1:8.8,value2:0},
                {id:2,name:'ससुख्खा खोकी लागेको छ ?',checked:false,value1:6.8,value2:0.5},
                {id:3,name:'धेरै थकाइ लागेको छ ?',checked:false,value1:3.8,value2:0.5},
                {id:4,name:'खोक्दा खकार आउँछ ?',checked:false,value1:3.3,value2:0.5},
                {id:5,name:'सास फेर्न गार्हो भइरहेको छ ?',checked:false,value1:1.8,value2:1.1},
                {id:6,name:'घाँटी दुखेको छ ?',checked:false,value1:1.4,value2:1.4},
                {id:7,name:'टाउको दुखेको छ ?',checked:false,value1:1.4,value2:1.4},
                {id:8,name:'जिउ दुखेको छ ?',checked:false,value1:1.4,value2:1.4},
                {id:9,name:'जिउ सिरिंग सिरिंग भएको छ ?',checked:false,value1:1.1,value2:1.8},
                {id:10,name:'वाकवाकी तथा बान्ता भएको छ ?',checked:false,value1:0.5,value2:3.3},
                {id:11,name:'नाक थुनीएको छ ?',checked:false,value1:0.5,value2:3.8},
                {id:12,name:'पखाला लागेको छ ?',checked:false,value1:0.5,value2:0},
                ],

            showSearch:false,
            isLoadingcheckin:false,
            beatmodalvisible:false,
            place:'',
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({ showSearch: this._showSearch12, checkBox:this.updateCheck });
        // this.props.navigation.setParams({ Count: 15 });
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            // this.checkInternet()
        });
        this._subscription = NetInfo.addEventListener(
            this._handleConnectionInfoChange,
        );
    }

    _showSearch12 = () => {
        // alert('asd');
        this.setState({ showSearch: this.state.showSearch==true?false:true });
    };

    checkInternet(){
        this.getCustomers();
    }

    _handleConnectionInfoChange = (connectionInfo: NetInfoState) => {
        // alert(JSON.stringify(connectionInfo))
        this.setState({connectionInfo:connectionInfo.isInternetReachable});

    };
    componentWillUnmount() {
        this.focusListener.remove();
    }

    getCustomers = async () => {

        const access_token = await AsyncStorage.getItem('access_token');
        let url=Url.baseUrl+'customer-visits/predefined-feedbacks'
        fetch(url, {
            headers: {
                'version':VersionNumber.buildVersion,
                'x-auth': access_token
            }
        })
            .then((response) => {
                if(!response.ok) {
                    alert('An error occurred (Error Code: '+response.status + ')')
                    ErrorHelper.logError(response, url, 'GET',access_token);
                }
                else {
                    response.json()
                        .then((responseJson) => {
                            if(responseJson.success) {
                                // alert(JSON.stringify(responseJson.data.customers));return;

                                let data = responseJson.data.feedbacks.map(feedbacks=> ({ ...feedbacks, checked : false }))

                                // alert(JSON.stringify(data));return;

                                this.setState({
                                    showEmptyView: true,
                                    data: data,
                                    datafull:data,
                                    count:data.length,

                                    // vchrno:responseJson.result.VCHRNO?responseJson.result.VCHRNO:'New'
                                });
                            }
                            else{

                                this.setState({
                                    showEmptyView: true,
                                    error:'Something went wrong...',})
                                if (responseJson.errors.token == "token_invalid") {

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
    updateValue(id){
        if(id==''){
            this.setState({
                data:this.state.datafull,
            })
        }
        else{
            let dataList= this.state.datafull.filter(cat=>cat.route_id===id);
            // alert(JSON.stringify(dataList));
            // alert(JSON.stringify(dataList));
            this.setState({
                data:dataList,
            })
        }
    }

    showLoader = () => {
        this.setState({ isLoadingcheckin: true });
    };
    hideLoader = () => {
        this.setState({ isLoadingcheckin: false });
    };

    signOutAsync = async (navigation) => {
        await AsyncStorage.clear();
        navigation.navigate('Auth');
    };
    toggle(){
        this.props.navigation.toggleDrawer();
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
                style={{width:'100%',marginTop:6}}
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
                style={{width:'100%',alignItems:'center',marginBottom:7,}}
            >
                <TouchableOpacity onPress={()=>this.updateCheck( item.id)}>
                    <View style={{width:'95%',justifyContent: 'center',alignItems:'center',flexDirection: 'row'}}>
                        <View
                            style={{
                                width: '90%',
                                backgroundColor:'#fff',
                                elevation: 1,
                                padding: 10,
                                borderRadius: 5
                            }}
                            // onPress={this.props.onPress}
                        >
                            <View style={{width:'100%'}}>
                                <Text style={{fontSize: 16,color:'#2a8ee5'}}>{item.name}</Text>
                            </View>
                        </View>
                        <View style={{width: '10%',alignItems:'center',}}>
                            <Icon
                                name={item.checked ? 'md-checkbox' : 'md-square-outline'}
                                size={28}
                                color={'#ff1f77'}

                                // onPress={navigation.getParam('checkBox')}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

        );
    }

    check(item){
        if(this.state.beatId==item.id){
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
                    beatId: item.id,
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

    updateCheck = (id) => {
        // alert(_id);return;
        let list = this.state.data.map((item) => {
            if(item.id == id) {
                item.checked = !item.checked;
            }
            return item;
        });

        this.setState({
            data:list
        });
    }
    updateCheckCountries = (id) => {
        // alert(_id);return;
        let list = this.state.countries.map((item) => {
            if(item.id == id) {
                item.checked = !item.checked;
            }
            return item;
        });

        let filteredList=list.filter(cat=>cat.checked===true)

        this.setState({
            countries:list,
            count:filteredList
        });
    }

    saveFeedback = async() => {
        if((this.state.data.filter(cat=>cat.checked===true)).length===0  && !this.state.travelled ) {
            Alert.alert('एलर्ट','कृपया कुनै एक छनोट गर्नुहोस !')
            return;
        }


        let FinalList=[];
        let dataList= this.state.data.filter(cat=>cat.checked===true);

        // alert(JSON.stringify(dataList));return
        if(dataList.some(ele => ele.id === 0)) {
            // alert('yes');return;
            dataList.map((item) => {
                FinalList.push({id:item.id,name:item.name,value:item.value2});
            });
        }
        else{
            // alert('no');return;
            dataList.map((item) => {
                FinalList.push({id:item.id,name:item.name,value:item.value1});
            });
        }

       this.next(FinalList);
        // alert(JSON.stringify(this.state.count));return;

        // alert(JSON.stringify(FinalList));return;

    };

    next = async(data) =>  {

            let running_nose= (data.filter(cat=>cat.id===0)).length>0?1:0;
            let fever=(data.filter(cat=>cat.id===1)).length>0?1:0;
            let dry_cough=(data.filter(cat=>cat.id===2)).length>0?1:0;
            let exhaustion=(data.filter(cat=>cat.id===3)).length>0?1:0;
            let productive_cough=(data.filter(cat=>cat.id===4)).length>0?1:0;
            let shortness_of_breath=(data.filter(cat=>cat.id===5)).length>0?1:0;
            let sore_throat=(data.filter(cat=>cat.id===6)).length>0?1:0;
            let headache=(data.filter(cat=>cat.id===7)).length>0?1:0;
            let myalgia=(data.filter(cat=>cat.id===8)).length>0?1:0;
            let chills=(data.filter(cat=>cat.id===9)).length>0?1:0;
            let nausea_vomiting=(data.filter(cat=>cat.id===10)).length>0?1:0;
            let stuffy_nose=(data.filter(cat=>cat.id===11)).length>0?1:0;
            let dairrhoea=(data.filter(cat=>cat.id===12)).length>0?1:0;

// alert(JSON.stringify(finalCountries.join(',')));return;

        let name = this.state.name;
        let number = this.state.number;

        this.showLoader();

        let dataList=new FormData();

        dataList.append('name', name);
        dataList.append('phoneNum', number);
        dataList.append('latitude', this.state.latitude);
        dataList.append('longitude', this.state.longitude);
        dataList.append('pin', this.state.pin);
        dataList.append('fever',fever);
        dataList.append('dry_cough', dry_cough);
        dataList.append('exhaustion',exhaustion);
        dataList.append('productive_cough', productive_cough);
        dataList.append('shortness_of_breath', shortness_of_breath);
        dataList.append('sore_throat', sore_throat);
        dataList.append('headache', headache);
        dataList.append('myalgia', myalgia);
        dataList.append('chills', chills);
        dataList.append('nausea_vomiting', nausea_vomiting);
        dataList.append('stuffy_nose', stuffy_nose);
        dataList.append('dairrhoea', dairrhoea);
        dataList.append('running_nose', running_nose);



        // this.hideLoader();
        // alert(dataSave);return;

        let url=Url.baseUrl+'clients'
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
                                this.props.navigation.navigate('UpdatedResult',{
                                    data:JSON.stringify(data),
                                });
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


    render() {
        if(this.state.error){
            return(
                <View style={{flex:1,}}>
                    {this.netStatus()}
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:18,marginBottom:10}}>{this.state.error}</Text>
                        <TouchableOpacity
                            onPress={()=>this.checkInternet()}
                            style={{backgroundColor:'#059200',alignItems:'center',borderRadius:5}}>
                            <Text style={{color:'#fff',padding:10}}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else{
            return (
                <ScrollView
                    contentContainerStyle={{backgroundColor:'#ebeef3',flexGrow:1, flexDirection: 'column', justifyContent: 'space-between'}}>
<View>
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
                    <View style={{width:'100%',paddingTop: 10,alignItems:'center'}}>
                        {this.approvalList()}

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
                                    onPress={()=>this.saveFeedback()}
                                >
                                    <View style={{alignItems:'center'}}>
                                        <View style={{padding:15,}}>
                                            <Text style={{color:'#fff'}}>{'पेश गर्नुहोस'}</Text>
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
        fontSize:18,fontWeight:'bold',color:'#fff'
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
