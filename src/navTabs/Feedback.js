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
            checkout_type:this.props.navigation.getParam('checkout_type', 0),
            connectionInfo: true,
            refreshing:false,
            showEmptyView: false,
            travelled:false,
            data:[
                {id:0,name:'नाकबाट सिंगान बगिरहेको छ ?',checked:false,value1:0,value2:0},
                {id:1,name:'ज्वरो आएको छ ? (१०० F +)',checked:false,value1:8.8,value2:0},
                {id:2,name:'सुख्खा खोकी लागेको छ ?',checked:false,value1:6.8,value2:0.5},
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
            countries:[
                {id:0,name:'चीन',name2:'China',checked:false},
                {id:1,name:'जापान',name2:'Japan',checked:false},
                {id:2,name:'अमेरिका',name2:'America',checked:false},
                {id:3,name:'इटाली',name2:'Italy',checked:false},
                {id:4,name:'स्पेन',name2:'Spain',checked:false},
                {id:5,name:'द. कोरिया',name2:'South Korea',checked:false},
                {id:6,name:'भारत',name2:'India',checked:false},
                {id:7,name:'इरान',name2:'Iran',checked:false},
                {id:8,name:'इंगलैंड',name2:'England',checked:false},
                {id:9,name:'अन्य',name2:'Others',checked:false},
            ],
            showSearch:false,
            isLoadingcheckin:false,
            beatmodalvisible:false,
            place:'',
            contact:false,
            count:[]
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
    renderItemCountries = (item) => {
        return (
            <View
                style={{width:'100%',alignItems:'center',marginBottom:7,}}
            >
                <TouchableOpacity
                    onPress={()=>this.updateCheckCountries( item.id)}
                >
                    <View style={{width:'100%',justifyContent: 'center',alignItems:'center',flexDirection: 'row'}}>

                        <View
                            style={{
                                width: '90%',
                                padding: 5,
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
        if((this.state.data.filter(cat=>cat.checked===true)).length===0  && !this.state.travelled && !this.state.contact) {
            Alert.alert('एलर्ट','कृपया कुनै एक छनोट गर्नुहोस !')
            return;
        }
        this.showLoader();

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

        this.hideLoader();
        // alert(JSON.stringify(this.state.count));return;
        this.props.navigation.navigate('Result',{
            data:JSON.stringify(FinalList),
            travelled:this.state.travelled,
            countries:JSON.stringify(this.state.count),
            contact:this.state.contact
        });
        // alert(JSON.stringify(FinalList));return;

    };
    renderItemSelectedCountries(item){
        return(
            <View>
                <Text>{item.name}</Text>
            </View>
        )
    }
    travelled(){
        if(this.state.count.length>0){
            return(
                <FlatList
                    ListEmptyComponent={this.renderEmptyView()}
                    data={this.state.count}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    initialNumToRender={5}
                    // extraData={this.state.data}
                    keyExtractor={item => '' + item.id}
                    renderItem={({item}) => this.renderItemSelectedCountries(item)
                    }
                />
            )
        }
        else return null;
    }
    toggleContact(){
        this.setState({
            contact:!this.state.contact}
        )
    }
    toggleCountries(){
        this.setState({
            travelled:!this.state.travelled},()=>{
            if(this.state.travelled){
                this.setState({
                    beatmodalvisible:true,
                })
            }
            else{
                this.state.countries.map((item) => {
                    item.checked = false;
                    return item;
                });
                this.setState({
                    count:[],
                })
            }}
        )
    }
    closeModal(){
        if((this.state.countries.filter(cat=>cat.checked===true)).length<=0){
            this.setState({
                travelled:false
            })
        }

        this.setState({
            beatmodalvisible:false,
        })
    }

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
                    <Modal
                        // onRequestClose={()=>this.setState({
                        //     // cancelbeatid :this.state.beatId,
                        //     beatId :this.state.cancelbeatid,
                        //     beatmodalvisible:false,
                        // })}
                        visible={this.state.beatmodalvisible}
                        transparent={true}
                    >

                        <View style={{backgroundColor:'rgba(52, 52, 52, 0.4)',flex:1,alignItems:'center',justifyContent:'center'}}>
                            <TouchableWithoutFeedback onPress={()=>''}>
                                <View
                                    style={{marginVertical:10,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',width:'95%',borderRadius:5}}>
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        style={{marginVertical:10,width:'90%'}}>
                                        <Text style={{fontWeight:'bold',marginBottom:10}}>राष्ट्र (हरु) को नाम छान्नु होस् :</Text>

                                        <FlatList
                                            ListEmptyComponent={this.renderEmptyView()}
                                            data={this.state.countries}
                                            maxToRenderPerBatch={10}
                                            windowSize={10}
                                            initialNumToRender={5}
                                            // extraData={this.state.data}
                                            keyExtractor={item => '' + item.id}
                                            renderItem={({item}) => this.renderItemCountries(item)
                                            }
                                        />
                                        <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:15}}>

                                            <TouchableOpacity style={{paddingHorizontal:10,backgroundColor:'#ff1f77',borderRadius:3}}
                                                              onPress={()=>{this.closeModal()
                                                                 }}>
                                                <Text style={styles.modalButton}>Ok</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </Modal>
                    {this.netStatus()}
                    <ActivityIcon visible={this.state.isLoadingcheckin}
                                  indicatorColor={'#333333'}
                                  messageColor={'#afafaf'}
                                  message='Please wait...'
                    />
                    <View style={{width:'100%',paddingTop: 10,alignItems:'center'}}>
                        {this.approvalList()}
                        <View
                            style={{width:'100%',alignItems:'center',marginBottom:7,}}
                        >
                            <TouchableOpacity onPress={()=>this.toggleContact()
                            }>
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
                                            <Text style={{fontSize: 16,color:'#2a8ee5'}}>विदेशबाट फर्केको वा कोरोना संक्रमित व्यक्तिसंग सम्पर्कमा आउनुभएको छ?</Text>
                                        </View>
                                    </View>
                                    <View style={{width: '10%',alignItems:'center',}}>
                                        <Icon
                                            name={this.state.contact ? 'md-checkbox' : 'md-square-outline'}
                                            size={28}
                                            color={'#ff1f77'}
                                            // onPress={navigation.getParam('checkBox')}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{width:'100%',alignItems:'center',marginBottom:7,}}
                        >
                            <TouchableOpacity onPress={()=>this.toggleCountries()
                            }>
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
                                            <Text style={{fontSize: 16,color:'#2a8ee5'}}>पछिल्ला १४ दिनमा विदेश भ्रमण गर्नुभएको छ ?</Text>
                                        </View>
                                    </View>
                                    <View style={{width: '10%',alignItems:'center',}}>
                                        <Icon
                                            name={this.state.travelled ? 'md-checkbox' : 'md-square-outline'}
                                            size={28}
                                            color={'#ff1f77'}
                                            // onPress={navigation.getParam('checkBox')}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {this.travelled()}
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
