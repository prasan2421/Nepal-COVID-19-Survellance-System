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
            data:JSON.parse(this.props.navigation.getParam('data', 0)),
            travelled:this.props.navigation.getParam('travelled', 0),
            infected_contact:this.props.navigation.getParam('contact', 0),
            countries:JSON.parse(this.props.navigation.getParam('countries', 0)),
            pinNumber:this.props.navigation.getParam('pin', 0),

            fever:'',
            dry_cough:'',
            exhaustion:'',
            productive_cough:'',
            shortness_of_breath:'',
            sore_throat:'',
            headache:'',
            myalgia:'',
            chills:'',
            nausea_vomiting:'',
            stuffy_nose:'',
            dairrhoea:'',
            running_nose:'',
            recorded:'',
            name:'',

            age:'',
            sex:'',
            number:this.props.navigation.getParam('number', 0)?''+this.props.navigation.getParam('number', 0):'',
            secondary_number:'',
            province:'3',
            district:'Kathmandu',
            municipality:'Kathmandu',
            ward:'',
            contact:'',
            health:'',
            specify_health:'',
            nationality:'',
            pin:this.props.navigation.getParam('pin', 0)?''+this.props.navigation.getParam('pin', 0):'',

            name_Error:'',
            age_Error:'',
            sex_Error:'',
            number_Error:'',
            secondary_number_Error:'',
            province_Error:'',
            district_Error:'',
            municipality_Error:'',
            ward_Error:'',
            contact_Error:'',
            health_Error:'',
            specify_heath_Error:'',
            nationality_Error:'',
            pin_Error:'',
            locationError:'',

            connectionInfo: null,
            refreshing:false,
            dataProvinces:[],
            dataDistricts:[],
            dataMunicipalities:[],
            dataWards:[],
            gps:'',
            longitude:'',
            latitude:'',
            isLoading:false,

            diseases:[
                {id:0,name:'क्यान्सर',name2:'Cancer',checked:false},
                {id:1,name:'मधुमेह',name2:'Diabetes',checked:false},
                {id:2,name:'ब्लड प्रेसर',name2:'Blood pressure',checked:false},
                {id:3,name:'फोक्सो सम्बन्धि',name2:'Lung diseases',checked:false},
                {id:4,name:'लिवर सम्बन्धि',name2:'Liver diseases',checked:false},
                {id:5,name:'अन्य',name2:'Others',checked:false},
            ],
            ifDiseases:false,
            count:[],
            beatmodalvisible:false,
        }
    }
    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.checkInternet()

            // alert(JSON.stringify(this.state.number))
        });
        this._subscription = NetInfo.addEventListener(
            this._handleConnectionInfoChange,
        );
    }
    _handleConnectionInfoChange = (connectionInfo: NetInfoState) => {
        // alert(JSON.stringify(connectionInfo.isInternetReachable));return;
        this.setState({connectionInfo:connectionInfo.isInternetReachable});
    };

    checkInternet(){
        NetInfo.fetch().then(state => {
            if(state.isInternetReachable){
                this.getData();
                this.getWardsFromAsyncStorage();
                this.requestLocationPermission()
            }
            else{
                alert('No Internet Connection.')
            }
        });
    }

    getData(){
        // let dataList= (this.state.data.filter(cat=>cat.id===1)).length>0?true:false;
        this.setState({

            running_nose:(this.state.data.filter(cat=>cat.id===0)).length>0?1:0,
            fever:(this.state.data.filter(cat=>cat.id===1)).length>0?1:0,
            dry_cough:(this.state.data.filter(cat=>cat.id===2)).length>0?1:0,
            exhaustion:(this.state.data.filter(cat=>cat.id===3)).length>0?1:0,
            productive_cough:(this.state.data.filter(cat=>cat.id===4)).length>0?1:0,
            shortness_of_breath:(this.state.data.filter(cat=>cat.id===5)).length>0?1:0,
            sore_throat:(this.state.data.filter(cat=>cat.id===6)).length>0?1:0,
            headache:(this.state.data.filter(cat=>cat.id===7)).length>0?1:0,
            myalgia:(this.state.data.filter(cat=>cat.id===8)).length>0?1:0,
            chills:(this.state.data.filter(cat=>cat.id===9)).length>0?1:0,
            nausea_vomiting:(this.state.data.filter(cat=>cat.id===10)).length>0?1:0,
            stuffy_nose:(this.state.data.filter(cat=>cat.id===11)).length>0?1:0,
            dairrhoea:(this.state.data.filter(cat=>cat.id===12)).length>0?1:0,

        })

        // alert(JSON.stringify(this.state.data))
    }

    getProvincesFromAsyncStorage = async () => {

        let url=Url.baseUrl+'options/provinces';
        fetch(url, {
            headers: {
            }
        })
            .then((response) => {
                if(!response.ok) {
                    alert('An error occurred (Error Code: '+response.status + ')')

                }
                else {
                response.json().then((responseJson) => {
                    // alert(JSON.stringify(responseJson));return;

                    if(responseJson.success) {
                        this.setState({
                            dataProvinces: responseJson.data.provinces,
                        });
                    }
                    else{
                        // alert(JSON.stringify(responseJson))
                        if (responseJson.errors.token == "token_invalid") {
                            alert('You have logged in from another device.');
                            this.signOutAsync();
                        }
                        else {
                            alert(JSON.stringify(responseJson.errors));
                        }
                    }
                })}})

            .catch((error) => {
                alert(error);
            })

    };
    getDistrictsFromAsyncStorage = async () => {
        let url=Url.baseUrl+'options/districts?province='+this.state.province;
        // alert(url); return;
        fetch(url, {
            headers: {

            }
        })
            .then((response) => {
                if(!response.ok) {
                    alert('An error occurred (Error Code: '+response.status + ')')

                }
                else {
                    response.json().then((responseJson) => {
                        // alert(JSON.stringify(responseJson));return;

                        if(responseJson.success) {
                            alert(JSON.stringify(responseJson))
                            this.setState({
                                district: '',
                                municipality: '',
                                ward:'',
                            }, () => {
                                this.setState({
                                    dataDistricts: responseJson.data.districts,
                                    dataMunicipalities: [],
                                    dataWards:[]
                                });
                            } );
                        }
                        else{
                            // alert(JSON.stringify(responseJson))
                            if (responseJson.errors.token == "token_invalid") {

                                alert('You have logged in from another device.');
                                this.signOutAsync();
                            }
                            else {
                                alert(JSON.stringify(responseJson.errors));
                            }
                        }
                    })}})

            .catch((error) => {
                alert(error);
            })

    };
    getMunicipalitiesFromAsyncStorage = async () => {

            let url=Url.baseUrl+'options/municipalities?district='+this.state.district;
        // alert(url); return;
            fetch(url, {
                headers: {

                }
            })
                .then((response) => {
                    if(!response.ok) {
                        alert('An error occurred (Error Code: '+response.status + ')')

                    }
                    else {
                        response.json().then((responseJson) => {
                            alert(JSON.stringify(responseJson));return;

                            if(responseJson.success) {
                                this.setState({
                                    municipality: '',
                                    ward:''
                                }, () => {
                                    this.setState({
                                        dataMunicipalities: responseJson.data.municipalities,
                                        dataWards:[]
                                    });
                                });

                            }
                            else{
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
                                    alert(JSON.stringify(responseJson.errors));
                                }
                            }
                        })}})

                .catch((error) => {
                    alert(error);
                })

        // }

    };
    getWardsFromAsyncStorage = async () => {

        let url=Url.baseUrl+'options/wards?district='+this.state.district+'&municipality='+this.state.municipality;
        // alert(url); return;
        fetch(url, {
            headers: {

            }
        })
            .then((response) => {
                if(!response.ok) {
                    alert('An error occurred (Error Code: '+response.status + ')')

                }
                else {
                    response.json().then((responseJson) => {
                        // alert(JSON.stringify(responseJson));return;

                        if(responseJson.success) {
                            this.setState({
                                ward: ''
                            }, () => {
                                this.setState({
                                    dataWards: responseJson.data.wards,
                                });
                            });

                        }
                        else{
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
                                alert(JSON.stringify(responseJson.errors));
                            }
                        }
                    })}})

            .catch((error) => {
                alert(error);
            })

        // }

    };

    next = async() =>  {
        let finalHealth=[];
        let specify_heath = this.state.count;
        specify_heath.map((item) => {
                finalHealth.push(item.name2)
            return item;
        });

        let finalCountries=[];
        let countries_visited =this.state.countries;
        countries_visited.map((item) => {
            finalCountries.push(item.name2)
            return item;
        });

// alert(JSON.stringify(finalCountries.join(',')));return;

        let name = this.state.name;
        let age = this.state.age;
        let sex = this.state.sex;
        let pin = this.state.pin;
        let number = this.state.number;
        let secondary_number = this.state.secondary_number;
        let province = this.state.province;
        let district = this.state.district;
        let municipality = this.state.municipality;
        let ward = this.state.ward;
        let contact = this.state.contact;
        let health = this.state.health;
        let nationality = this.state.nationality;

        let location = this.state.gps;

        let name_Error = '';
        let age_Error = '';
        let pin_Error = '';
        let sex_Error='';
        let number_Error='';
        let secondary_number_Error='';
        let province_Error = '';
        let district_Error = '';
        let municipality_Error='';
        let ward_Error='';
        let contact_Error='';
        let health_Error='';
        let nationality_Error='';
        let locationError = '';

        if(name==""){
            name_Error = 'कृपया नाम लेख्नु होस्';
        }
        if(age==""){
            age_Error = 'कृपया उमेर लेख्नु होस्';
        }
        if(sex==""){
            sex_Error = 'कृपया लिंग छान्नु होस्';
        }
        if(number.length<10){
            number_Error = 'मोबाइल न. को लम्बाइ पुगेन ';
        }
        if(number==""){
            number_Error = 'कृपया मोबाइल न. लेख्नु होस्';
        }
        if(pin==""){
            pin_Error = 'कृपया पिन न. लेख्नु होस्';
        }
        if(province==""){
            province_Error = 'कृपया प्रदेश छान्नु होस्';
        }
        if(district==""){
            district_Error = 'कृपया जिल्ला छान्नु होस्';
        }
        if(municipality==""){
            municipality_Error = 'कृपया नगरपालिका / गाउँपालिका छान्नु होस्';
        }

        if(ward==""){
            ward_Error = 'कृपया वार्ड न. लेख्नु होस्';
        }
        if(nationality==""){
            nationality_Error = 'कृपया राष्ट्रियता लेख्नु होस्';
        }
        if(contact==""){
            contact_Error = 'कृपया सम्पर्कमा आएका व्यक्तिहरुको संख्या लेख्नु होस्';
        }
        if(health==""){
            health_Error = 'Please enter the health issue';
        }

        if(location==""){
            locationError = 'कृपया लोकेशन हाल्नु होस्';
        }

        this.setState({
            name_Error:name_Error,
            age_Error: age_Error,
            sex_Error: sex_Error,
            pin_Error: pin_Error,
            number_Error: number_Error,
            // secondary_number_Error:secondary_number_Error,
            province_Error: province_Error,
            district_Error: district_Error,
            municipality_Error: municipality_Error,
            ward_Error:ward_Error,
            contact_Error: contact_Error,
            locationError: locationError,
            nationality_Error:nationality_Error,
            // health_Error: health_Error,
            // specify_heath_Error: specify_heath_Error,
        });

        if(name_Error || age_Error || sex_Error ||  number_Error || province_Error || district_Error || municipality_Error  ||  pin_Error ||  ward_Error || contact_Error ||  locationError || nationality_Error) {
            return;
        }
        this.showLoader();

        let data=new FormData();

        data.append('name', name);
        data.append('phoneNum', number);
        data.append('age', age);
        data.append('sex', sex);
        data.append('secondaryPhoneNum', secondary_number);
        data.append('nationality', nationality);
        data.append('district', district);
        data.append('municipality', municipality);
        data.append('pin', pin);
        data.append('province', province);
        data.append('wardNum', ward);
        data.append('numContact', contact);
        data.append('prevHealthIssue', health);
        data.append('prevHealthIssueData', finalHealth.join(','));
        data.append('latitude', this.state.latitude);
        data.append('longitude', this.state.longitude);
        data.append('fever', this.state.fever);
        data.append('dry_cough', this.state.dry_cough);
        data.append('exhaustion', this.state.exhaustion);
        data.append('productive_cough', this.state.productive_cough);
        data.append('shortness_of_breath', this.state.shortness_of_breath);
        data.append('sore_throat', this.state.sore_throat);
        data.append('headache', this.state.headache);
        data.append('myalgia', this.state.myalgia);
        data.append('chills', this.state.chills);
        data.append('nausea_vomiting', this.state.nausea_vomiting);
        data.append('stuffy_nose', this.state.stuffy_nose);
        data.append('dairrhoea', this.state.dairrhoea);
        data.append('infected_contact', this.state.infected_contact?1:0);
        data.append('running_nose', this.state.running_nose);
        data.append('countries_visited', finalCountries.join(','));

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
            body: data
        })
            .then((response)=> {
                if(!response.ok) {
                    this.hideLoader();
                    alert('An error occurred (Error Code: '+response.status + ')')
                }
                else {
                    this.hideLoader();
                    //

                    response.json()
                        .then ((responseJson) => {
                            if(responseJson.success){
// this.hideLoader();
                                this.props.navigation.navigate('SuccessRegistered',{
                                    name:this.state.pin,
                                    number:number
                                });
                                // Alert.alert('Success','Registered successfully.')
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
    pinned(){
        if(this.state.pinNumber){
            return(
                <View style={{marginBottom:10,elevation:2,position:'relative',width:'95%',flexDirection: 'row',alignItems:'center',justifyContent:'center',backgroundColor:'#eae98f',padding:10,borderRadius:5}}>
                    <View style={{paddingVertical:4,paddingHorizontal:15,borderRadius:5}}>
                        <Text style={{color:'#333333',fontSize:14}}><Text style={{fontWeight:'bold'}}>पिन न.</Text>: {this.state.pinNumber}</Text>
                    </View>
                </View>
            )
        }
        else return null;
    }
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
    updateCheckCountries = (id) => {
        // alert(_id);return;
        let list = this.state.diseases.map((item) => {
            if(item.id == id) {
                item.checked = !item.checked;
            }
            return item;
        });

        let filteredList=list.filter(cat=>cat.checked===true)

        this.setState({
            diseases:list,
            count:filteredList
        });
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
    toggleDiseases(){
        this.setState({
            beatmodalvisible:true,
        })

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
    closeModal(){
        if((this.state.diseases.filter(cat=>cat.checked===true)).length<=0){
            this.setState({
                ifDiseases:false,
                health:'n'
            })
        }

        this.setState({
            beatmodalvisible:false,
        })
    }
    renderItemSelectedDiseases(item){
        return(
            <View>
                <Text>{item.name}</Text>
            </View>
        )
    }
    diseasesList(){
        if(this.state.count.length>0){
            return(
                <FlatList
                    ListEmptyComponent={this.renderEmptyView()}
                    data={this.state.count}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    initialNumToRender={5}
                    contentContainerStyle={{alignItems:'center'}}
                    // extraData={this.state.data}
                    keyExtractor={item => '' + item.id}
                    renderItem={({item}) => this.renderItemSelectedDiseases(item)
                    }
                />
            )
        }
        else return null;
    }

    render() {
        return (
            <ScrollView style={{backgroundColor:'#ebeef3'}}
                        removeClippedSubviews={false}
                        keyboardShouldPersistTaps={'handled'}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={async () => {
                                    await this.checkInternet()}}
                            />
                        }
            >
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor='#1B7ED5'
                />
                <ActivityIcon visible={this.state.isLoading}
                              indicatorColor={'#333333'}
                              messageColor={'#afafaf'}
                              message='Please wait, Saving data...'
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
                                    <Text style={{fontWeight:'bold',marginBottom:10}}>दिर्घ रोग (हरु) छान्नु होस् :</Text>

                                    <FlatList
                                        ListEmptyComponent={this.renderEmptyView()}
                                        data={this.state.diseases}
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

                <View style={{width:'100%',marginBottom:10,alignItems: 'center',marginTop:10}}>
                    {this.pinned()}
                    <View
                        removeClippedSubviews={true}
                        style={{flexDirection:'row',justifyContent:'space-between',width:'95%',backgroundColor:'#fff',borderRadius:5,elevation: 1}}>
                        <TextInput style={{paddingLeft:10,width:'100%'}}
                                   placeholder="मोबाइल न. (१० अंक)"
                                   returnKeyType='done'
                                   maxLength={10}
                                   keyboardType={'numeric'}
                                   value={this.state.number}
                                   onSubmitEditing={Keyboard.dismiss}
                                   onChangeText={(number) => this.setState({number})}
                        />
                    </View>
                    <ErrorText text={this.state.number_Error} />
                </View>
                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>
                    <View
                        removeClippedSubviews={true}
                        style={{flexDirection:'row',justifyContent:'space-between',width:'95%',backgroundColor:'#fff',borderRadius:5,elevation: 1}}>
                        <TextInput style={{paddingLeft:10,width:'100%'}}
                                   placeholder="पिन न."
                                   returnKeyType='done'
                                   value={this.state.pin}
                                   keyboardType={'numeric'}
                                   onSubmitEditing={Keyboard.dismiss}
                                   onChangeText={(pin) => this.setState({pin})}
                        />
                    </View>
                    <ErrorText text={this.state.pin_Error} />
                </View>

                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>

                    <View
                        removeClippedSubviews={true}
                        style={{flexDirection:'row',justifyContent:'space-between',width:'95%',backgroundColor:'#fff',borderRadius:5,elevation: 1}}>
                        <TextInput style={{paddingLeft:10,width:'100%'}}
                                   placeholder="नाम"
                                   returnKeyType='done'
                                   onSubmitEditing={Keyboard.dismiss}
                                   onChangeText={(name) => this.setState({name})}
                        />
                    </View>
                    <ErrorText text={this.state.name_Error} />
                </View>
                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>
                    <View
                        removeClippedSubviews={true}
                        style={{flexDirection:'row',justifyContent:'space-between',width:'95%',backgroundColor:'#fff',borderRadius:5,elevation: 1}}>
                        <TextInput style={{paddingLeft:10,width:'100%'}}
                                   placeholder="उमेर"
                                   returnKeyType='done'
                                   keyboardType={'numeric'}
                                   onSubmitEditing={Keyboard.dismiss}
                                   onChangeText={(age) => this.setState({age})}
                        />
                    </View>
                    <ErrorText text={this.state.age_Error} />
                </View>
                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:'95%',backgroundColor:'#fff',borderRadius:5,elevation: 1}}>
                        <Picker
                            selectedValue={this.state.sex}
                            style={{width: '100%',}}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({sex: itemValue})
                            }>
                            <Picker.Item label="लिंग" value="" />
                            <Picker.Item label="पुरुष" value="male" />
                            <Picker.Item label="महिला" value="female" />
                            <Picker.Item label="अरु " value="other" />
                        </Picker>
                    </View>
                    <ErrorText text={this.state.sex_Error} />
                </View>

                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>
                    <View
                        removeClippedSubviews={true}
                        style={{flexDirection:'row',justifyContent:'space-between',width:'95%',backgroundColor:'#fff',borderRadius:5,elevation: 1}}>
                        <TextInput style={{paddingLeft:10,width:'100%'}}
                                   placeholder="अर्को सम्पर्क न."
                                   returnKeyType='done'
                                   maxLength={10}
                                   keyboardType={'numeric'}
                                   onSubmitEditing={Keyboard.dismiss}
                                   onChangeText={(secondary_number) => this.setState({secondary_number})}
                        />
                    </View>
                    <ErrorText text={this.state.secondary_number_Error} />
                </View>



                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>
                    <View
                        removeClippedSubviews={true}
                        style={{flexDirection:'row',justifyContent:'space-between',width:'95%',backgroundColor:'#fff',borderRadius:5,elevation: 1}}>
                        <TextInput style={{paddingLeft:10,width:'100%'}}
                                   placeholder="राष्ट्रियता"
                                   returnKeyType='done'
                                   onSubmitEditing={Keyboard.dismiss}
                                   onChangeText={(nationality) => this.setState({nationality})}
                        />
                    </View>
                    <ErrorText text={this.state.nationality_Error} />
                </View>
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
                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>
                    <View style={{flexDirection:'row',height:48,justifyContent:'space-between',alignItems:'center',width:'95%',backgroundColor:'#fff',borderRadius:5,elevation: 1}}>
                        {/*<TextInput style={{paddingLeft:10,width:'100%'}}*/}
                        {/*           value={this.state.province}*/}
                        {/*           // placeholder="लोकेशन डाटा"*/}
                        {/*           returnKeyType='done'*/}
                        {/*           editable={false}*/}
                        {/*           onSubmitEditing={Keyboard.dismiss}*/}
                        {/*           onChangeText={(gps) => this.setState({gps})}*/}
                        {/*/>*/}
                        <Text style={{paddingLeft:10,width:'100%',color:'#b1b1b1'}}>प्रदेश : 3</Text>
                        {/*<Picker*/}
                        {/*    selectedValue={this.state.province}*/}
                        {/*    style={{width: '100%',}}*/}
                        {/*    // value={this.state.province}*/}
                        {/*    onValueChange={(itemValue, itemIndex) =>*/}
                        {/*        this.setState({province: itemValue},()=>this.getDistrictsFromAsyncStorage())*/}
                        {/*    }>*/}
                        {/*    <Picker.Item label="प्रदेश छान्नु होस् " value="" />*/}
                        {/*    {this.state.dataProvinces.length > 0 ? this.state.dataProvinces.map(item => (<Picker.Item key={'' + item} label={'' + item} value={item} />)):null}*/}
                        {/*</Picker>*/}
                    </View>
                    <ErrorText text={this.state.province_Error} />
                </View>
                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>
                    <View style={{flexDirection:'row',height:48,alignItems:'center',justifyContent:'space-between',width:'95%',backgroundColor:'#fff',borderRadius:5,elevation: 1,marginVertical:0}}>
                        {/*<TextInput style={{paddingLeft:10,width:'100%'}}*/}
                        {/*           value={this.state.district}*/}
                        {/*    // placeholder="लोकेशन डाटा"*/}
                        {/*           returnKeyType='done'*/}
                        {/*           editable={false}*/}
                        {/*           onSubmitEditing={Keyboard.dismiss}*/}
                        {/*           onChangeText={(gps) => this.setState({gps})}*/}
                        {/*/>*/}
                        <Text style={{paddingLeft:10,width:'100%',color:'#b1b1b1'}}>जिल्ला : Kathmandu</Text>
                        {/*<Picker*/}
                        {/*    selectedValue={this.state.district}*/}
                        {/*    style={{width: '100%'}}*/}
                        {/*    // value={this.state.district}*/}
                        {/*    onValueChange={(itemValue, itemIndex) =>*/}
                        {/*        this.setState({district: itemValue},()=>this.getMunicipalitiesFromAsyncStorage())*/}
                        {/*    }>*/}
                        {/*    <Picker.Item label="जिल्ला छान्नु होस्" value="" />*/}
                        {/*    {this.state.dataDistricts.length > 0 ? this.state.dataDistricts.map(item => (<Picker.Item key={'' + item} label={'' + item} value={item} />)):null}*/}
                        {/*</Picker>*/}
                    </View>
                    <ErrorText text={this.state.district_Error} />
                </View>
                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>
                    <View style={{flexDirection:'row',height:48,alignItems:'center',justifyContent:'space-between',width:'95%',backgroundColor:'#fff',borderRadius:5,elevation: 1}}>
                        {/*<TextInput style={{paddingLeft:10,width:'100%'}}*/}
                        {/*           value={this.state.municipality}*/}
                        {/*    // placeholder="लोकेशन डाटा"*/}
                        {/*           returnKeyType='done'*/}
                        {/*           editable={false}*/}
                        {/*           onSubmitEditing={Keyboard.dismiss}*/}
                        {/*           onChangeText={(gps) => this.setState({gps})}*/}
                        {/*/>*/}
                        <Text style={{paddingLeft:10,width:'100%',color:'#b1b1b1'}}>नगरपालिका / गाउँपालिका : Kathmandu</Text>

                        {/*<Picker*/}
                        {/*    selectedValue={this.state.municipality}*/}
                        {/*    style={{width: '100%',}}*/}
                        {/*    // value={this.state.municipality}*/}
                        {/*    onValueChange={(itemValue, itemIndex) =>*/}
                        {/*        this.setState({municipality: itemValue},()=>this.getWardsFromAsyncStorage())*/}
                        {/*    }>*/}
                        {/*    <Picker.Item label="नगरपालिका / गाउँपालिका छान्नु होस्" value="" />*/}
                        {/*    {this.state.dataMunicipalities.length > 0 ? this.state.dataMunicipalities.map(item => (<Picker.Item key={'' + item} label={'' + item} value={item} />)):null}*/}
                        {/*</Picker>*/}
                    </View>
                    <ErrorText text={this.state.municipality_Error} />
                </View>
                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:'95%',backgroundColor:'#fff',borderRadius:5,elevation: 1}}>
                        <Picker
                            selectedValue={this.state.ward}
                            style={{width: '100%',}}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ward: itemValue})
                            }>
                            <Picker.Item label="वार्ड न. छान्नु होस्" value="" />
                            {this.state.dataWards.length > 0 ? this.state.dataWards.map(item => (<Picker.Item key={'' + item} label={'' + item} value={item} />)):null}
                        </Picker>
                    </View>

                    <ErrorText text={this.state.ward_Error} />
                </View>
                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>
                    <View
                        removeClippedSubviews={true}
                        style={{flexDirection:'row',justifyContent:'space-between',width:'95%',backgroundColor:'#fff',borderRadius:5,elevation: 1}}>
                        <TextInput style={{paddingLeft:10,width:'100%'}}
                                   placeholder="हाल नजिक सम्पर्कमा रहेका व्यक्तिहरुको संख्या"
                                   returnKeyType='done'
                                   keyboardType={'numeric'}
                                   onSubmitEditing={Keyboard.dismiss}
                                   onChangeText={(contact) => this.setState({contact})}
                        />
                    </View>
                    <ErrorText text={this.state.contact_Error} />
                </View>
                <View style={{width:'100%',marginBottom:10,alignItems: 'center'}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:'95%',backgroundColor:'#fff',borderRadius:5,elevation: 1}}>
                        <Picker
                            selectedValue={this.state.health}
                            style={{width: '100%',}}
                            onValueChange={(itemValue, itemIndex) =>{
                                if(itemValue=='Yes'){ this.toggleDiseases()}
                                else if(itemValue=='No'){
                                    this.state.diseases.map((item) => {
                                        item.checked = false;
                                        return item;
                                    });
                                    this.setState({
                                        count:[],
                                    })
                                }
                                else if(itemValue==''){
                                    this.state.diseases.map((item) => {
                                        item.checked = false;
                                        return item;
                                    });
                                    this.setState({
                                        count:[],
                                    })
                                }
                                this.setState({health: itemValue})
                            }
                            }>
                            <Picker.Item label="कुनै दिर्घ रोग छ ?" value="" />
                            <Picker.Item label="छ" value="Yes" />
                            <Picker.Item label="छैन" value="No" />
                        </Picker>
                    </View>
                    <ErrorText text={this.state.health_Error} />
                </View>

                {this.diseasesList()}


                <View style={{alignItems:'flex-end'}}>
                    <View style={{width:'100%',backgroundColor:'#fff', padding:5}}>
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
