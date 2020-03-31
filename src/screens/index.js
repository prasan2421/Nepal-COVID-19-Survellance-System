import {createStackNavigator,createSwitchNavigator,createAppContainer } from 'react-navigation'
import React, {Component} from 'react';
// import { Box,} from 'react-native-design-utility';

import {Image,Text,View,TouchableOpacity,  Animated,
    Easing} from 'react-native';
import { Transition } from 'react-native-reanimated';

import navTabs from "./AppYeti.js";
import Icon from 'react-native-vector-icons/Ionicons'
import LoginScreen from '../screens/LoginScreen'
import Feedback from '../navTabs/Feedback'
import FeedbackEnglish from '../navTabs/FeedbackEnglish'
import UpdateFeedback from '../navTabs/UpdateFeedback'
import UpdateFeedbackEnglish from '../navTabs/UpdateFeedbackEnglish'
import Result from '../navTabs/Result'
import CheckRegistered from '../navTabs/CheckRegistered'
import CheckRegisteredEnglish from '../navTabs/CheckRegisteredEnglish'
import NumberRegister from '../navTabs/NumberRegister'
import NumberRegisterEnglish from '../navTabs/NumberRegisterEnglish'
import ResultEnglish from '../navTabs/ResultEnglish'
import UpdatedResult from '../navTabs/UpdatedResult'
import UpdatedResultEnglish from '../navTabs/UpdatedResultEnglish'
import Register from '../navTabs/Register'
import RegisterEnglish from '../navTabs/RegisterEnglish'
import Emergency from '../navTabs/Emergency'
import EmergencyEnglish from '../navTabs/EmergencyEnglish'
import UpdateRegister from '../navTabs/UpdateRegister'
import UpdateRegisterEnglish from '../navTabs/UpdateRegisterEnglish'
import RecordHistory from '../navTabs/RecordHistory'
import RecordHistoryEnglish from '../navTabs/RecordHistoryEnglish'
import SuccessRegistered from '../navTabs/SuccessRegistered'
import SuccessRegisteredEnglish from '../navTabs/SuccessRegisteredEnglish'
import SuccessEmergency from '../navTabs/SuccessEmergency'
import SuccessEmergencyEnglish from '../navTabs/SuccessEmergencyEnglish'
import ShowHistory from '../navTabs/ShowHistory'
import ShowHistoryEnglish from '../navTabs/ShowHistoryEnglish'
import SuccessUpdated from '../navTabs/SuccessUpdated'
import ForgotPin from '../navTabs/ForgotPin'
import ForgotPinEnglish from '../navTabs/ForgotPinEnglish'
import SuccessForgotPin from '../navTabs/SuccessForgotPin'
import SuccessForgotPinEnglish from '../navTabs/SuccessForgotPinEnglish'
import Settings from '../navTabs/Settings'
import Swiper from '../navTabs/Swiper'
import SuccessUpdatedEnglish from '../navTabs/SuccessUpdatedEnglish'

let SlideFromRight = (index, position, width) => {
    const inputRange = [index - 1, index, index + 1];
    const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [width, 0, 0]
    })
    const slideFromRight = { transform: [{ translateX }] }
    return slideFromRight
};



//Transition configurations for createStackNavigator
const TransitionConfiguration = () => {
    return {
        transitionSpec: {
            duration: 550,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: (sceneProps) => {
            const { layout, position, scene } = sceneProps;
            const width = layout.initWidth;
            const { index } = scene
            return SlideFromRight(index, position, width);
        },
    }
}

const AuthNavigator = createStackNavigator(
    {
        Swiper: {screen:Swiper,
            navigationOptions: {
                header: null,

            }} ,
    });

const BrideNavigator =  createStackNavigator({

    navTabs: {screen:navTabs,
        navigationOptions: {
            header: null,
            gesturesEnabled: true,
        }
    } ,

    Result:{
        screen: Result,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>परीक्षण परिणाम</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    ResultEnglish:{
        screen: ResultEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Test Result</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },

    Emergency:{
        screen: Emergency,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>आपतकालिन नोट</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    EmergencyEnglish:{
        screen: EmergencyEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Emergency Note</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    CheckRegistered:{
        screen: CheckRegistered,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>नम्बर दर्ता</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    CheckRegisteredEnglish:{
        screen: CheckRegisteredEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Number Registration</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    NumberRegister:{
        screen: NumberRegister,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>दर्ता</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })

    },
    ForgotPin:{
        screen: ForgotPin,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>पिन न. बिर्सनुभयो</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })

    },
    ForgotPinEnglish:{
        screen: ForgotPinEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Forgot Pin no.</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })

    },
    SuccessForgotPinEnglish:{
        screen: SuccessForgotPinEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Request to Change Pin</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })

    },
    SuccessForgotPin:{
        screen: SuccessForgotPin,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>पिन परिवर्तन अनुरोध</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })

    },
    SuccessEmergency:{
        screen: SuccessEmergency,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>आपतकालिन नोट</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })

    },
    SuccessEmergencyEnglish:{
        screen: SuccessEmergencyEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Emergency Note</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })

    },
    Settings:{
        screen: Settings,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    NumberRegisterEnglish:{
        screen: NumberRegisterEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>New Number Registration</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    UpdatedResult:{
        screen: UpdatedResult,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>अपडेट</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    UpdatedResultEnglish:{
        screen: UpdatedResultEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Updated</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    SuccessRegistered:{
        screen: SuccessRegistered,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>दर्ता</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    SuccessRegisteredEnglish:{
        screen: SuccessRegisteredEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Registration</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    ShowHistory:{
        screen: ShowHistory,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>दर्ता इतिहास</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    ShowHistoryEnglish:{
        screen: ShowHistoryEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Record History</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    SuccessUpdated:{
        screen: SuccessUpdated,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>अपडेट</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    SuccessUpdatedEnglish:{
        screen: SuccessUpdatedEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Updated</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    Register:{
        screen: Register,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>नया दर्ता</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    RegisterEnglish:{
        screen: RegisterEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>New Register</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    UpdateRegister:{
        screen: UpdateRegister,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>पुरानो दर्ता अपडेट गर्नुहोस</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    UpdateRegisterEnglish:{
        screen: UpdateRegisterEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Update Triage Status</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    RecordHistory:{
        screen: RecordHistory,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>पुरानो दर्ताको विवरण</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    RecordHistoryEnglish:{
        screen: RecordHistoryEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Check Triage History</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    UpdateFeedback:{
        screen: UpdateFeedback,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>पुरानो दर्ता अपडेट गर्नुहोस</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    UpdateFeedbackEnglish:{
        screen: UpdateFeedbackEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Update Existing Register</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    Feedback:{
        screen: Feedback,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>त्रियाज परिक्षण  गर्नुहोस</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },
    FeedbackEnglish:{
        screen: FeedbackEnglish,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerTintColor: 'white',
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Triage Test</Text>,
            gesturesEnabled: true,
            headerRight:<View></View>
        })
    },


},{
    transitionConfig: TransitionConfiguration
});

const AppNavigator =  createSwitchNavigator(
    {
        Splash: {
            getScreen: () => require('./SplashScreen').default,

        },
        Auth: AuthNavigator,
        Bride:BrideNavigator


    },{
initialRouteName: 'Splash',
    });
const AppContainer = createAppContainer(AppNavigator);

class Navigation extends React.Component{
    state = {};
    render(){
        return <AppContainer/>
    }
}

export default Navigation;
