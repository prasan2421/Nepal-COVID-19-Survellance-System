import React, { Component} from 'react';
import {AsyncComponent,AsyncStorage, Alert,View} from 'react-native';

import {Image} from 'react-native';
import {images} from '../constants/images';
import OnboardingLogo from '../commons/OnboardingLogo';



class SplashScreen extends Component{
    state = { };
    componentDidMount(){
        this.checkAuth()
    }
    checkAuth = () => {
        setTimeout(() => {
            this.props.navigation.navigate('Swiper');
            // this.props.navigation.navigate('SuccessEmergencyEnglish');
        },2000);

    };
    render(){
        return(
<View style={{flex:1,justifyContent:'center',backgroundColor:'#1B7ED5'}}>
   <OnboardingLogo/>

</View>

        );
    }
}
export default SplashScreen;