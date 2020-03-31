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
import NetInfo, {NetInfoState, NetInfoSubscription} from '../components/src';
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

class New extends React.Component<{}, State>  {
    _subscription: NetInfoSubscription | null = null;
    constructor(props) {
        super(props);
        this.state = {
            value:0.0,
            data:JSON.parse(this.props.navigation.getParam('data', 0)),
            connectionInfo: null,
            refreshing:true,
            contact:this.props.navigation.getParam('contact', 0),
            travelled:this.props.navigation.getParam('travelled', 0),
            countries:this.props.navigation.getParam('countries', 0),
            chart:[
                {id:0,level:'0 - 15.5',text1:'Least Likely Chance of COVID-19',text2:'Running nose can be a symptom of other Flu',color:'#9cc2e5'},
                {id:1,level:'15.6 - 19.3',text1:'Less Likely Chance of COVID-19',text2:'You should stay in Self - Quarantine and update your symptoms 3 times a day regularly',color:'#92d050'},
                {id:2,level:'19.4 - 24.5',text1:'Likely Chance of COVID-19',text2:'You should stay alert and in Self - Quarantine and update your symptoms 3 times a day regularly',color:'#ffff00'},
                {id:3,level:'24.6 - 31.3',text1:'High Chance of COVID-19',text2:'Be prepared to send a sample of a neck / nose swab to the hospital for examination You will be contacted by the local government for further support.',color:'#ff0000'},

            ],
        }
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.calculateValue()
        });
        this._subscription = NetInfo.addEventListener(
            this._handleConnectionInfoChange,
        );
    }

    _handleConnectionInfoChange = (connectionInfo: NetInfoState) => {
        // alert(JSON.stringify(connectionInfo))
        this.setState({connectionInfo:connectionInfo.isInternetReachable});

    };
    calculateValue(){
        const sum=this.state.data
            .map(item=>(item.value))
            .reduce((prev,curr)=>prev+curr,0)
        // alert(sum);return;
        // alert(sum.toFixed(1))

        this.setState({
            value:sum.toFixed(1),
            refreshing:false,
        })
    }

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
    travelled(){
        if(this.state.travelled){
            return(
                <View style={{marginBottom:20,elevation:2,position:'relative',width:'95%',flexDirection: 'row',alignItems:'center',justifyContent:'center',backgroundColor:'#eae98f',padding:10,borderRadius:5}}>

                    <View style={{paddingVertical:4,paddingHorizontal:15,borderRadius:5}}>
                        <Text style={{color:'#333333',fontSize:14}}><Text style={{fontWeight:'bold'}}>Note </Text>: If you have travelled abroad in the last 14 days then please stay in self-quarantine and consult with medical doctor.
                        </Text>
                    </View>
                </View>
            )
        }
        else return null;
    }
    contact(){
        if(this.state.contact || this.state.travelled){
            return(
                <View style={{marginBottom:20,elevation:2,position:'relative',width:'95%',flexDirection: 'row',alignItems:'center',justifyContent:'center',backgroundColor:'#eae98f',padding:10,borderRadius:5}}>

                    <View style={{paddingVertical:4,paddingHorizontal:15,borderRadius:5}}>
                        <Text style={{color:'#333333',fontSize:14}}><Text style={{fontWeight:'bold'}}>Note </Text>: If you have returned from overseas or come in contact with a person who has returned from abroad or Corona infected person in the last 14 days, please stay in self-quarantine and consult a Physician.</Text>
                    </View>
                </View>
            )
        }
        else return null;
    }
    bottomButton(){
        // if(this.state.value>15.5){
            return(
                <View style={{alignItems:'flex-end'}}>
                    <View style={{width:'100%',backgroundColor:'#fff', padding:5}}>
                        <View style={{
                            width:'100%',
                            borderRadius:3,
                            overflow:'hidden',
                            backgroundColor:'#059200'}}>
                            {/*<TouchableNativeFeedback*/}
                            {/*    background={TouchableNativeFeedback.Ripple('#c3c3c3')}*/}
                            {/*    onPress={()=>this.props.navigation.navigate('RegisterEnglish'*/}
                            {/*        ,{*/}
                            {/*        data:JSON.stringify(this.state.data),*/}
                            {/*            travelled:this.state.travelled,*/}
                            {/*            countries:this.state.countries*/}
                            {/*    }*/}
                            {/*    )}*/}
                            {/*>*/}
                            {/*    <View style={{alignItems:'center'}}>*/}
                            {/*        <View style={{padding:15,}}>*/}
                            {/*            <Text style={{color:'#fff'}}>New registration</Text>*/}
                            {/*        </View>*/}

                            {/*    </View>*/}
                            {/*</TouchableNativeFeedback>*/}

                            <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple('#c3c3c3')}
                                onPress={()=>this.props.navigation.navigate('CheckRegisteredEnglish'
                                    ,{
                                        data:JSON.stringify(this.state.data),
                                        travelled:this.state.travelled,
                                        countries:this.state.countries,
                                        contact:this.state.contact
                                    }
                                )}
                            >
                                <View style={{alignItems:'center'}}>
                                    <View style={{padding:15,}}>
                                        <Text style={{color:'#fff'}}>Register</Text>
                                    </View>

                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                </View>
            )
        // }
        // else return null;
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

    renderItemCountries = (item) => {
        return (
            <View style={[styles.fontwrapper,{backgroundColor:item.color}]}>
                <View style={{flexDirection:'row',borderColor:'#292929',
                    borderBottomWidth:1}}>
                    <View style={styles.leftBox}>
                        <Text style={styles.font1}>{item.level}</Text>
                    </View>
                    <View style={[styles.rightBox]}>
                        <Text style={styles.font2}>{item.text1}</Text>
                    </View>
                </View>
                <View style={[styles.bottomBox]}>
                    <Text style={styles.font2}>{item.text2}</Text>
                </View>
            </View>

        );
    }

    resultChart(){

        let id='';
        if(this.state.value<=15.5){
            id=0
        }
        else if(this.state.value <19.4 ){
            id=1
        }
        else if(this.state.value <24.6 ){
            id=2
        }
        else if(this.state.value >24.5 ){
            id=3
        }
        let item=this.state.chart.filter(cat=>cat.id===id);
        return(
                <View style={[styles.fontwrapper,{backgroundColor:item[0].color}]}>
                    <View style={{flexDirection:'row',borderColor:'#292929',
                        borderBottomWidth:1}}>
                        <View style={styles.leftBox1}>
                            <Text style={styles.font1}>Level</Text>
                        </View>
                        <View style={[styles.rightBox1]}>
                            <Text style={styles.font2}>Probability</Text>
                        </View>

                    </View>
                    <View style={{flexDirection:'row',borderColor:'#292929',
                        borderBottomWidth:1}}>
                        <View style={styles.leftBox}>
                            <Text style={styles.font1}>{item[0].level}</Text>
                        </View>
                        <View style={[styles.rightBox]}>
                            <Text style={styles.font2}>{item[0].text1}</Text>
                        </View>
                    </View>
                    <View style={[styles.bottomBox]}>
                        <Text style={styles.font2}>{item[0].text2}</Text>
                    </View>
                </View>
        )
    }

    render() {
        let idNew='';
        let color='#fff';
            if(this.state.value<=15.5){
                color='#9cc2e5';
                    idNew=0
                }
            else if(this.state.value <19.4 ){
                color='#92d050';
                idNew=1
            }
            else if(this.state.value <24.6 ){
                color='#ffff00';
                idNew=2
            }
            else if(this.state.value >24.5 ){
                color='#ff0000';
                idNew=3
            }
        if(this.state.refreshing){
            return(<View style={{width:'100%',alignItems:'center'}}>
                <View style={{width:'95%',paddingTop:20}}>
                    <MyListLoader/>
                    <MyListLoader/>
                    <MyListLoader/>
                    <MyListLoader/>
                </View>
            </View>)
        }
        else{
            return (
                <View style={{flex:1}}>
                    <ScrollView
                        // refreshControl={
                        //     <RefreshControl
                        //         refreshing={this.state.refreshing}
                        //         onRefresh={()=>this.checkInternet()}
                        //     />
                        // }
                        contentContainerStyle={{backgroundColor:'#fff'}}>
                        <View>
                            <StatusBar
                                barStyle="dark-content"
                                backgroundColor='#1B7ED5'
                            />
                            {this.netStatus()}
                            <View style={{width:'100%',alignItems: 'center'}}>
                                <View style={{marginVertical:20,elevation:2,position:'relative',width:'95%',flexDirection: 'row',alignItems:'center',justifyContent:'center',backgroundColor:color,padding:20,borderRadius:5}}>
                                    <Icon name="md-arrow-dropright-circle" size={28}  color="#333333" style={{marginRight: 10}} />
                                    <View style={{paddingVertical:4,paddingHorizontal:15,borderRadius:5}}>
                                        <Text style={{color:'#333333',fontSize:16}}>Test result : <Text style={{fontSize:28,fontWeight:'bold'}}>{this.state.value}</Text></Text>
                                    </View>
                                </View>
                                {this.resultChart()}
                                {/*{this.travelled()}*/}
                                {this.contact()}
                                {/*<View style={{marginBottom: 10}}>*/}
                                {/*    <Text style={{fontSize:16,fontWeight:'bold', borderBottomWidth:1}}>Others</Text>*/}
                                {/*</View>*/}
                                {/*<View style={{elevation:1, width:'100%',backgroundColor:'#fff'}}>*/}
                                {/*    <FlatList*/}
                                {/*        ListEmptyComponent={this.renderEmptyView()}*/}
                                {/*        data={this.state.chart.filter(cat=>cat.id!==idNew)}*/}
                                {/*        maxToRenderPerBatch={10}*/}
                                {/*        windowSize={10}*/}
                                {/*        initialNumToRender={5}*/}
                                {/*        // extraData={this.state.data}*/}
                                {/*        keyExtractor={item => '' + item.id}*/}
                                {/*        renderItem={({item}) => this.renderItemCountries(item)*/}
                                {/*        }*/}
                                {/*    />*/}

                                {/*</View>*/}
                                <View style={{marginTop:15,marginBottom:15,width:'100%',alignItems:'center'}}>
                                    <View style={{width:'95%',backgroundColor:'#fff',borderWidth: 1,borderColor:'#353535',padding:10}}>
                                        <Text>Currently, the registration facility is available for Kathmandu Metropolitan City only.</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                    </ScrollView>
                    {this.bottomButton()}
                </View>

            );
        }

    }
}

export default New;
const styles = StyleSheet.create({
   fontwrapper:{
       padding:5,
       alignItems:'center',
       marginBottom:10,
       borderColor:'#292929',
       borderWidth:1
   },
    font1:{
        color:'#262626',
    },
    font2:{
        color:'#262626',
    },
    leftBox:{
        width:'30%',alignItems:'center',justifyContent:'center',paddingVertical:5,borderColor:'#292929',
        borderRightWidth:1
    },
    rightBox:{
        width:'70%',alignItems:'center',justifyContent:'center',
    }
    ,
    bottomBox:{
        width:'90%',alignItems:'center',justifyContent:'center',paddingVertical:5
    },
    leftBox1:{
        width:'30%',alignItems:'center',justifyContent:'center',paddingVertical:4,borderColor:'#292929',
        borderRightWidth:1
    },
    rightBox1:{
        width:'70%',alignItems:'center',justifyContent:'center',
    }

});
