import React, { Component } from 'react';
import {StyleSheet, Text, View, Alert, AsyncStorage} from 'react-native';
import { WebView } from 'react-native-webview';

import Url from '../constants/Url';

import SessionHelper from '../helpers/SessionHelper';
import VersionNumber from "react-native-version-number";
import ErrorHelper from "../commons/ErrorHelper";
import ContentLoader, {Rect} from "react-content-loader/native";
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
export default class FAQsScreen extends Component {
    static navigationOptions  = ({ navigation }) => {
        return {
            headerTitle: <Text style={{color:"#fff",width:"100%",textAlign:'center',fontSize:16,justifyContent:'center'}}>{navigation.getParam('Count')}</Text>,
            headerRight: <View/>
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            showWebView: false,
            html: '',
            refreshing:true,
            language:''
        };
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener(
            'didFocus',
            () => {
                this.checkLanguage()
                this.loadFAQs();
            }
        );

        SessionHelper.getAboutHtml().then(aboutHtml => {
            let html = '';

            if (aboutHtml) {
                html = aboutHtml;
            }

            this.setState({
                showWebView: true,
                html
            });
        });
    }
    checkLanguage= async () =>{
        let language = await AsyncStorage.getItem('language');
        // alert(language)

        if (language){
            this.props.navigation.setParams({ Count: language=='en'?'About Us':'हाम्रो बारेमा' });
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

    componentWillUnmount() {
        this.focusListener.remove();
    }

    loadFAQs = () => {


        let url=Url.baseUrl+'contents/about'
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
                                // alert(JSON.stringify(responseJson.data.customers));return;
                                SessionHelper.saveAboutHtml(
                                    responseJson.result
                                ).then(() => {
                                    this.setState({
                                        refreshing:false,
                                        html: responseJson.data.body
                                    });
                                });
                            }
                            else{

                                this.setState({
                                    refreshing:false,
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
                    refreshing:false,
                    error:'Something went wrong...',
                })
                // alert('An error occurred');
            })
    };

    renderWebView() {
        if(!this.state.showWebView) {
            return null;
        }

        if(!this.state.html) {
            return (
                <Text>No About us to display</Text>
            );
        }

        return (
            <WebView
                originWhitelist={['*']}
                source={{ html: this.state.html }}
            />
        );
    }

    render() {
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
                <View
                    colors={['#eeeeee', '#ffffff']}
                    style={styles.faqsContainer}
                >
                    {this.renderWebView()}
                </View>
            );
        }

    }
}

const styles = StyleSheet.create({
    faqsContainer: {
        flex: 1
    }
});