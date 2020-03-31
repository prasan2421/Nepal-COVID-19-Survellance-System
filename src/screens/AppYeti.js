import React from 'react';
import {StatusBar,Platform,StyleSheet, Text, View, Image, Dimensions, ScrollView, Alert, AsyncStorage,TouchableOpacity} from 'react-native';

import { createDrawerNavigator, createStackNavigator } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import { DrawerItems, SafeAreaView, } from 'react-navigation';

import Choice from '../navTabs/Choice'
import faqs from '../navTabs/faqs'
import Information from '../navTabs/Information'
import About from '../navTabs/About'
import Settings from '../navTabs/Settings'
import MainDrawer from '../drawers/MainDrawer';
import Notification from '../commons/Notification';
import {images} from "../constants/images";




// const CustomDrawerContentComponent = (props) => (
//     <ScrollView>
//         <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
//             <View>
//                 <HeaderContents/>
//             </View>
//             <DrawerItems {...props} />
//         </SafeAreaView>
//     </ScrollView>
// );

const HomeTab = createStackNavigator({
    Choice:{
        screen: Choice,
        navigationOptions: ({navigation}) => ({
            headerTransparent: true,
            topBarElevationShadowEnabled: false,
            headerStyle:{
                // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            marginTop:1,
                backgroundColor: 'transparent',
                elevation: 0,
            },


            headerLeft: <View>
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()} >

                    <Icon name="md-list" color={"#fff"} size={24} style={{ padding: 20 }} />
                </TouchableOpacity>
            </View>,
            // headerRight:<View>
            //    <Notification
            //        onPress={() => navigation.navigate('AddOrderEnd')}
            //    />
            // </View>

        })
    },


});

const SupportedTab = createStackNavigator({
    faqs:{
        screen: faqs,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerStyle:{
                // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
                // height: 56 + Platform.select({'android': StatusBar.currentHeight, 'ios': 0}),
                backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            // headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>FAQs</Text>,
            headerLeft: <View>
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()} >

                    <Icon name="md-list" color={"#fff"} size={24} style={{ padding: 20 }} />
                </TouchableOpacity>
            </View>,
            headerRight:<View/>

        })
    },
});

const InformationTab = createStackNavigator({
    Information:{
        screen: Information,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerStyle:{
                // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
                // height: 56 + Platform.select({'android': StatusBar.currentHeight, 'ios': 0}),
                backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            // headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Information</Text>,
            headerLeft: <View>
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()} >

                    <Icon name="md-list" color={"#fff"} size={24} style={{ padding: 20 }} />
                </TouchableOpacity>
            </View>,
            headerRight:<View/>

        })
    },
});
const AboutTab = createStackNavigator({
    About:{
        screen: About,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            // headerTitle: <Text style={{color:"#fff", width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>About</Text>,
            headerLeft: <View>
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()} >

                    <Icon name="md-list" color={"#fff"} size={24} style={{ padding: 20 }} />
                </TouchableOpacity>
            </View>,
            headerRight:<View></View>
        })
    },
});
const SettingsTab = createStackNavigator({
    Settings:{
        screen: Settings,
        navigationOptions: ({navigation}) => ({
            topBarElevationShadowEnabled: false,
            headerStyle:{backgroundColor: '#1B7ED5',
                elevation: 0,
            },
            headerTitle: <Text style={{color:"#fff", width:"100%",textAlign:'center',fontSize:18,justifyContent:'center'}}>Settings</Text>,
            headerLeft: <View>
                <TouchableOpacity
                    onPress={() => navigation.openDrawer()} >

                    <Icon name="md-list" color={"#fff"} size={24} style={{ padding: 20 }} />
                </TouchableOpacity>
            </View>,
            headerRight:<View></View>
        })
    },

});

export default createDrawerNavigator({
        Home: {screen: HomeTab},
        About: {screen: AboutTab},
        Supported: {screen: SupportedTab},
        Information: {screen: InformationTab},
        // Settings: {screen: SettingsTab},

},
    {
    contentComponent: MainDrawer /*CustomDrawerContentComponent*/,
        drawerWidth:300
    },

)
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header:{
        backgroundColor:'#04009f',
        height:50
    }
})

;
