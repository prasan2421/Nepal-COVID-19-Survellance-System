import React, { Component } from 'react';
import {
    Alert,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView, AsyncStorage, Image, PermissionsAndroid,
} from 'react-native';
import { DrawerItems } from 'react-navigation';
import MyDrawerItem from '../commons/MyDrawerItem';
import Icon from 'react-native-vector-icons/Ionicons'
import { evaluateOuterDrawerListItems } from '../utils';
import OuterDrawerItem from '../components/OuterDrawerItem';
import NetInfo, {NetInfoState, NetInfoSubscription} from '../components/src';
interface State {
    connectionInfo: NetInfoState | null;
}

const styles = StyleSheet.create({
    customDrawerTouch: {
        paddingLeft: 13,
        paddingTop: 15,
    },
    customDrawerIcon: { paddingRight: 10 },
    backButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 17,
        paddingLeft: 3,
        borderBottomColor: '#7f7f7f',
        borderBottomWidth: 1,
    },
});

class MainDrawer extends React.Component<{}, State> {
    _subscription: NetInfoSubscription | null = null;
    constructor(props) {
        super(props);
        this.state = {
            mainDrawer: true,
            connectionInfo: null,
            language:''
        };
    }
    componentDidMount() {

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.checkLanguage()

        });
        this._subscription = NetInfo.addEventListener(
            this._handleConnectionInfoChange,
        );
    }
    _handleConnectionInfoChange = (connectionInfo: NetInfoState) => {
        // alert(JSON.stringify(connectionInfo))
        this.setState({connectionInfo:connectionInfo.isInternetReachable});

    };

    checkLanguage= async () =>{
        let language = await AsyncStorage.getItem('language');
        // alert(language)

        if (language){
            this.setState({
                language: language
            })
        }
        else{
            this.setState({
                language:'np'
            })

        }

    }

    toggleMainDrawer = () =>
        this.setState(prevState => ({ mainDrawer: !prevState.mainDrawer }));

    renderMainDrawerComponents = mainDrawerItems =>
        Object.keys(mainDrawerItems).map(item => (

            <OuterDrawerItem
                key={item}
                label={'Reports'}
                onPress={() => {
                    this.setState({
                        currentComponent: item,
                        mainDrawer: false,
                    });
                }}
            />


        ));


    logout=()=>{
        Alert.alert(
            'Confirm',
            'Do you want to Logout from this account ?',
            [
                {text: 'OK', onPress: ()=>this.checkAttendance()},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
        )
    };

    render() {

        const { items, ...restProps } = this.props;
        const { mainDrawer, currentComponent } = this.state;
        const { routeName } = this.props.navigation.state.routes[this.props.navigation.state.index];
        // get items objects with unique items and indexes
        const scopedItemsObject = evaluateOuterDrawerListItems(items);

        if (mainDrawer) {
            return (
                <ScrollView
                    contentContainerStyle={{flexGrow:1,backgroundColor:'#2e90e9', flexDirection: 'column', justifyContent: 'space-between'}}>

                {/*style={{flex:1,backgroundColor:'#2e90e9'}}>*/}
                    {/*drawer header*/}
                    {/*<View style={{backgroundColor:'#fff',justifyContent:'center',alignItems:'center',paddingTop:5,paddingBottom:15}}>*/}
                    {/*    <Image style={{height:60,width:127,marginBottom:10}}  source={images.logo}/>*/}

                    {/*    <View style={{height:90,width:90,backgroundColor:'#aa3f00',borderRadius:90,justifyContent:'center',borderColor:'#298ade',borderWidth:3}}>*/}
                    {/*        <Image style={{height:84,width:84,backgroundColor:'#aa3f00',borderRadius:84,justifyContent:'center',borderColor:'#f3f7ec',borderWidth:2}}  source={images.face}/>*/}
                    {/*    </View>*/}


                    {/*    <View>*/}
                    {/*        <Text style={{fontSize:14,color:'#298ade',/*fontWeight:'bold',width:'100%'*!/}>{this.state.name}</Text>*/}

                    {/*    </View>*/}
                    {/*</View>*/}
                    <View style={{marginTop:20}}>

                        <MyDrawerItem
                            onPress={() => {
                                this.props.navigation.navigate('Home');
                                this.props.navigation.closeDrawer();
                            }}
                            style={{
                                marginLeft: 20,
                                color: '#fff'}}
                            iconColor={'#fff'}
                            active={routeName == 'Home'}
                            icon="md-home"
                            text={this.state.language=='en'?"Home":"घर"}
                        />
                        <MyDrawerItem
                            onPress={() => {
                                this.props.navigation.navigate('Information');
                                this.props.navigation.closeDrawer();
                            }}
                            style={{
                                marginLeft: 20,
                                color: '#fff'}}
                            iconColor={'#fff'}
                            active={routeName == 'Information'}
                            text={this.state.language=='en'?"Information":"जानकारी"}
                            icon="md-information-circle-outline"
                        />
                        <MyDrawerItem
                            onPress={() => {
                                this.props.navigation.navigate('About');
                                this.props.navigation.closeDrawer();
                            }}
                            style={{
                                marginLeft: 20,
                                color: '#fff'}}
                            iconColor={'#fff'}
                            active={routeName == 'About'}
                            text={this.state.language=='en'?"About Us":"हाम्रो बारेमा"}
                            icon="md-person"
                        />
                        <MyDrawerItem
                            onPress={() => {
                                this.props.navigation.navigate('faqs');
                                this.props.navigation.closeDrawer();
                            }}
                            style={{
                                marginLeft: 20,
                                color: '#fff'}}
                            iconColor={'#fff'}
                            active={routeName == 'faqs'}
                            text={this.state.language=='en'?"FAQs":"धेरै सोधिएका प्रश्नहरू"}
                            icon="md-bookmarks"
                        />
                        <MyDrawerItem
                            onPress={() => {
                                this.props.navigation.navigate(this.state.language=='en'?'ForgotPinEnglish':'ForgotPin');
                                this.props.navigation.closeDrawer();
                            }}
                            style={{
                                marginLeft: 20,
                                color: '#fff'}}
                            iconColor={'#fff'}
                            active={routeName == 'ForgotPin'}
                            text={this.state.language=='en'?"Forgot Pin":"पिन न. बिर्सनुभयो"}
                            icon="md-key"
                        />

                        {/*{this.renderMainDrawerComponents(scopedItemsObject)}*/}

                    </View>
                    <View>

                    <Text style={{paddingLeft: 15,marginTop:20,marginBottom:20}}>Version 1.0.0</Text>

                    </View>
                </ScrollView>
            );
        }
        const index = scopedItemsObject[currentComponent];

        const scopedItemsArr = items.slice(index.start, index.end);

        return (
            <ScrollView style={{backgroundColor:'#f5f5f5'}}>
                <View style={{backgroundColor:'rgba(3,155,229 ,1)',height:130,justifyContent:'center',}}>
                    <View  style={{justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
                        <View style={{height:70,width:70,backgroundColor:'#aa3f00',borderRadius:70,justifyContent:'center'}}>
                            <Text style={{textAlign:'center',fontSize:22,color:'#e4e4e4',fontWeight:'bold'}}>R</Text>
                        </View>
                        <View style={{marginLeft:10}}>
                            <Text style={{fontSize:16,color:'#e4e4e4',/*fontWeight:'bold',width:'100%'*/}}>Ripl International</Text>
                            <Text style={{fontSize:12,color:'#aaaaaa'}}>Dillibazar, Kathmandu</Text></View>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={this.toggleMainDrawer}
                    style={styles.customDrawerTouch}
                >
                    <View style={styles.backButtonRow}>
                        <Icon name="md-arrow-round-back" size={25} color="#494949"/>
                        <Text style={{ color: '#494949',marginLeft:20 ,fontWeight:'bold'}}>Back</Text>
                    </View>
                </TouchableOpacity>
                <DrawerItems
                    items={scopedItemsArr} {...restProps} />
            </ScrollView>
        );
    }
}

export default MainDrawer;
