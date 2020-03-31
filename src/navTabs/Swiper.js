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
import ErrorText from "../commons/ErrorText";
import EmptyProducts from "../svg/EmptyProducts";
import ActivityIcon from "../commons/ActivityIcon";

import moment from "moment";
import NetInfo, {NetInfoState, NetInfoSubscription} from '../components/src';
import VersionNumber from "react-native-version-number";
import Url from "../constants/Url";
import Swiper from 'react-native-swiper';
import {images} from "../constants/images";

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
            chart1:[
                {id:0,level:'० - १५.५',text1:'COVID-19 को सम्भावना देखिदैन',text2:'नाकबाट सिंगान बगिरहेमा अरु फ्लु (Flu) को  लक्षण हुन सक्ने | पछिल्लो १४ दिनमा विदेस भ्रमण गर्नु भएको वा सम्भावित संक्रमित व्यक्ति संग नजिकमा रहनु भएको छ भने आफु अलग्गै बसी चिकित्सक संग सल्लाह गर्ने |',color:'#9cc2e5'},
                {id:1,level:'१५.६ – १९.३',text1:'COVID-19 को सम्भावना कम छ',text2:'सजगताको लागि अलग्गै बस्ने र दिनको तीनपटक आफ्ना लक्षणहरु नियमित रुमपा अपडेट गर्ने |',color:'#92d050'},
                {id:2,level:'१९.४ – २४.५',text1:'COVID-19 को सम्भावना देखिन्छ ',text2:'थप सजगताको लागि अलग्गै बस्ने र दिनको तीनपटक आफ्ना लक्षणहरु नियमित रुमपा अपडेट गर्ने |',color:'#ffff00'},
                {id:3,level:'२४.६ – ३१.३',text1:'COVID-19 को सम्भावना धेरै देखियो',text2:'घाँटी / नाकको स्वाबको नमूना परिक्षणको लागि तुरन्त अस्पताल गइहाल्नु पर्ने |',color:'#ff0000'},

            ],
            chart2:[
                {id:0,level:'0 - 15.5',text1:'Least Likely Chance of COVID-19',text2:'Running nose can be a symptom of other Flu. If you returned from overseas or came in contact with a person who returned from aboard or corona infected person in last 14 days, pls. stay in self-quarantine and consult a physician.',color:'#9cc2e5'},
                {id:1,level:'15.6 - 19.3',text1:'Less Likely Chance of COVID-19',text2:'You should stay in Self-Quarantine and update your symptoms 3 times a day regularly',color:'#92d050'},
                {id:2,level:'19.4 - 24.5',text1:'Likely Chance of COVID-19',text2:'You should stay alert and in Self-Quarantine and update your symptoms 3 times a day regularly',color:'#ffff00'},
                {id:3,level:'24.6 - 31.3',text1:'High Chance of COVID-19',text2:'Please rush to the hospital to test your nose/throat swap specimen',color:'#ff0000'},

            ],
        }
    }


    componentDidMount() {

        this.focusListener = this.props.navigation.addListener('didFocus', () => {

        });
        this._subscription = NetInfo.addEventListener(
            this._handleConnectionInfoChange,
        );
    }

    _handleConnectionInfoChange = (connectionInfo: NetInfoState) => {
        this.setState({connectionInfo:connectionInfo.isInternetReachable});
    };

    showLoader = () => {
        this.setState({ isLoadingcheckin: true });
    };
    hideLoader = () => {
        this.setState({ isLoadingcheckin: false });
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
    renderItem1 = (item) => {
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
    renderItem2 = (item) => {
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
    render() {

        return (
            <View style={{flex:1}}>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor='#1B7ED5'
                />

                {this.netStatus()}
                <Swiper
                    onIndexChanged={index => {
                        if (index == 4) {
                            this.props.navigation.navigate("navTabs");
                        }
                    }}
                        activeDotColor='#ff4b98'
                        loop={false}
                    style={{marginBottom:0,paddingBottom:0}}
                >
                    <View style={{flex:1}}>
                        <ScrollView
                            contentContainerStyle={{backgroundColor:'#e8e8e8',flexGrow:1, justifyContent : 'center',}}
                            removeClippedSubviews={false}>
                            <View style={{width:'100%',alignItems:'center',marginBottom: 10}}>
                                <View style={{width:'90%',paddingVertical:30}}>
                                    {/*<Text style={{fontWeight:'bold',fontSize:20,marginBottom: 20,color:'#1B7ED5',textAlign:'center'}}>Emergency Healthcare Covid 19 Triage Scale</Text>*/}
                                    <Text style={{fontSize:16,textAlign:'justify',marginBottom:10,color:'#1B7ED5',lineHeight:22}}><Text style={{fontWeight:'bold'}}>COVID-19</Text> महामारीको वारेमा हामीहरु सवै जानकार नै छौ । यस विषम परिस्थितिमा हामी सवैले राष्ट्र प्रतिको जिम्मेवारी सम्झी सवै व्यक्तिहरुले आफूले जो सकेको सुरक्षा अपनाउनु आवश्यक छ ।</Text>
                                    <Text style={{fontSize:16,textAlign:'justify',marginBottom:10,color:'#1B7ED5',lineHeight:22}}>नेपालमा <Text style={{fontWeight:'bold'}}>COVID-19</Text> को सम्भावित महामारीलाइ रोकथाम गर्ने उद्देश्यका साथ विभिन्न संस्थाहरुसँगको सहकार्यमा यो निगरानी प्रणाली विकसित गरिएको हो ।</Text>
                                    <Text style={{fontSize:16,textAlign:'justify',marginBottom:10,color:'#1B7ED5',lineHeight:22}}>विभिन्न संस्थाहरुको सहकार्यमा कोरोना भाईरसको स्वमूल्यांकन गर्न र आवश्यक उपायहरु अवलम्बन गर्न नेपाल COVID-19 निगरानी प्रणालीको विकास गरिएको हो ।</Text>
                                    <Text style={{fontSize:16,textAlign:'justify',marginBottom:10,color:'#1B7ED5',lineHeight:22}}>यदि अरुको मोवाइल वा अरुको सहयोगवाट नयाँ दर्ता गर्नुपर्ने भएमा दर्ता गरिदिने व्यक्तिले सम्बन्धित व्यक्ति वस्ने स्थानमा पुगेर दर्ता गरिदिनु हुन अनुरोध गरिन्छ जसले गर्दा व्यक्तिको वास्तवीक स्थानको भौगोलिक निर्देशांक (Geographic Coordinate) प्राप्त गर्न सम्बन्धित निकायलाइ सहज हुनेछ ।</Text>
                                    {/*<Text style={{fontSize:16,textAlign:'justify',marginBottom:10,color:'#1B7ED5',lineHeight:22}}>तपाईका सम्पुर्ण सूचनाहरु पुर्ण रुपमा गोप्य रहने जानकारी गराउँदछौ ।</Text>*/}
                                    <Text style={{fontSize:16,textAlign:'justify',marginBottom:10,color:'#1B7ED5',lineHeight:22}}>तपाईले सम्प्रेषित गर्नुभएका लक्षणहरुका आधारमा आवश्यक पर्दा हाम्रा चिकित्सकहरुले तपाईलाइ आवश्यक सल्लाह प्रदान गर्नुहुनेछ । यस जटिल परिस्थितिमा अनावश्यक तनाव नलिइ तपाई जहाँ हुनुहुन्छ त्यही सचेत तरिकाले रहनुहुन अनुरोध गर्दछौ ।</Text>
                                    <Text style={{fontSize:16,textAlign:'justify',marginBottom:10,color:'#1B7ED5',lineHeight:22}}>यसमा दर्ता भएका सबै ब्यक्तिहरुको सम्पूर्ण सुचनाहरु गोपनिएयता सम्मान का साथ राखिने छ, आबश्यक ब्यक्ति तथा संस्थालाई मात्र यस बारे जानकारि हुनेछ ।</Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    <View style={{flex:1}}>
                        <ScrollView contentContainerStyle={{flexGrow: 1,justifyContent : 'center',backgroundColor:'#e8e8e8'}}>
                            <View style={{width:'100%',alignItems:'center'}}>
                                <View style={{width:'90%',paddingVertical:15}}>
                                    <Text style={{fontWeight:'bold',fontSize:16,textAlign:'justify',color:'#1B7ED5',lineHeight:22}}>त्रियाज स्केल र यसका अंकहरुको अर्थ तपसिलको तालिकामा प्रस्तुत गरिएको छ |</Text>
                                </View>
                            </View>
                            <View style={{elevation:2, width:'100%',backgroundColor:'#fff',alignItems:'center',}}>
                                <View style={{flexDirection:'row',borderColor:'#292929',width:'95%',
                                    borderWidth:1,marginVertical: 10}}>

                                    <View style={styles.leftBox1}>
                                        <Text style={styles.font1}>अंक</Text>
                                    </View>
                                    <View style={[styles.rightBox1]}>
                                        <Text style={styles.font2}>सम्भावना</Text>
                                    </View>
                                </View>
                                <FlatList

                                    data={this.state.chart1}
                                    maxToRenderPerBatch={10}
                                    windowSize={10}
                                    initialNumToRender={5}
                                    style={{width:'95%'}}
                                    // extraData={this.state.data}
                                    keyExtractor={item => '' + item.id}
                                    renderItem={({item}) => this.renderItem1(item)
                                    }
                                />
                            </View>
                        </ScrollView>
                    </View>
                    <View style={{flex:1}}>
                        <ScrollView contentContainerStyle={{flexGrow: 1,justifyContent : 'center',backgroundColor:'#e8e8e8'}}>
                            <View style={{width:'100%',alignItems:'center'}}>
                                <View style={{width:'90%',paddingVertical:15}}>
                                    <Text style={{fontWeight:'bold',fontSize:16,textAlign:'justify',color:'#1B7ED5',lineHeight:22}}>The Triage Scale and its respective definitions are detailed in the Table.</Text>
                                </View>
                            </View>
                            <View style={{elevation:2, width:'100%',backgroundColor:'#fff',alignItems:'center'}}>

                                <View style={{flexDirection:'row',borderColor:'#292929',width:'95%',
                                    borderWidth:1,marginVertical: 10}}>
                                    <View style={styles.leftBox1}>
                                        <Text style={styles.font1}>Level</Text>
                                    </View>
                                    <View style={[styles.rightBox1]}>
                                        <Text style={styles.font2}>Probability</Text>
                                    </View>
                                </View>
                                <FlatList

                                    data={this.state.chart2}
                                    maxToRenderPerBatch={10}
                                    windowSize={10}
                                    initialNumToRender={5}
                                    style={{width:'95%'}}
                                    // extraData={this.state.data}
                                    keyExtractor={item => '' + item.id}
                                    renderItem={({item}) => this.renderItem2(item)
                                    }
                                />
                            </View>

                        </ScrollView>
                    </View>
                    <View style={{flex:1}}>
                        <ScrollView
                            contentContainerStyle={{backgroundColor:'#e8e8e8',flexGrow:1, justifyContent : 'center',alignItems:'center'}}
                            removeClippedSubviews={false}>
                            <View>
                                <Text style={{marginTop:15,paddingHorizontal:20,paddingBottom:35,fontSize:20,lineHeight:22,color:'#1B7ED5',fontWeight:'bold',textAlign:'center'}}>विशेष अनुरोध</Text>
                                <Text style={{marginTop:15,paddingHorizontal:20,paddingBottom:35,fontSize:18,lineHeight:22,color:'#1B7ED5'}}>यस निगरानी प्रणाली विपद व्यवस्थापनका लागि भएकाले यसको समुचित प्रयोग गर्नुहुन हार्दिक अनुरोध गर्दछौ । यस निगरानी प्रणालीको दुरुपयोग गरिएको पाइएमा प्रचलित कानुन वमोजिम कडा सजाय हुनेछ ।</Text>
                                <Text style={{marginTop:15,paddingHorizontal:20,paddingBottom:35,fontSize:18,color:'#1B7ED5'}}>The Surveillance System is for disaster management, hence you are strongly recommended to use it properly. Improper data update in the system will result in severe penalties as per the Prevailing Laws.</Text>
                            </View>
                            <View style={{marginTop:15,marginBottom:15,width:'100%',alignItems:'center'}}>
                                <View style={{width:'95%',backgroundColor:'#fff',borderWidth: 1,borderColor:'#353535',padding:10}}>
                                <Text>यो प्रणाली कोभिड १९ संक्रमण रोकथाम र नियन्त्रण गर्न नागरिक सचेतनाको लागि तयार गरिएको  स्व–मूल्यांकन (self-assessment) प्रणाली मात्र हो, निदान होइन । यो प्रणालीमा दर्ता हुने नगरवासीलाई सहयोग गर्न महानगरपालिकाले सक्दो प्रयत्न गर्ने भएता पनि आफ्नो सुविधा अनुसार नजिकको स्वास्थ्य संस्था, स्वास्थ्यकर्मी, वा संघीय सरकारको सूचना अनुसार अन्यत्र स्वास्थ्य सेवा खोज्न सक्नुहुनेछ ।</Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    <View style={{flex:1}}>
                        <ScrollView
                            contentContainerStyle={{backgroundColor:'#e8e8e8',flexGrow:1, justifyContent : 'center',alignItems:'center'}}
                            removeClippedSubviews={false}>
                            <Image style={{width:120,height:120}}  style={{marginBottom:30}} source={images.kmc}/>
                            <Text style={{color:'#303030',fontSize:18,marginBottom:5}}>काठमाडौँ महानगरपालिका</Text>
                            <Text style={{color:'#303030',fontSize:18,marginBottom:5}}>यें महानगरपालिका</Text>
                            <Text style={{color:'#303030',fontSize:18,marginBottom:30}}>Kathmandu Metropolitan City</Text>

                            <Text style={{color:'#303030',fontSize:18,marginBottom:5}}>नेपाल COVID-19 निगरानी प्रणाली</Text>
                            <Text style={{color:'#303030',fontSize:18,marginBottom:30}}>Nepal COVID-19 Surveillance System</Text>
                        </ScrollView>
                    </View>


                </Swiper>

            </View>
        );

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
