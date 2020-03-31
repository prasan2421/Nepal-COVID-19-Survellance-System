import React, {Component} from 'react';
import {Image, StatusBar, StyleSheet, View,Text} from 'react-native';

import {images} from "../constants/images";

const OnboardingLogo = () => (
    <View style={styles.container}>
        <StatusBar
            barStyle="dark-content"
            backgroundColor='#1B7ED5'
        />
        <View style={styles.box}>
            <Image style={{width:120,height:120}}  style={{marginBottom:30}} source={images.kmc}/>
            <Text style={{color:'#fff',fontSize:18,marginBottom:5}}>काठमाडौँ महानगरपालिका</Text>
            <Text style={{color:'#fff',fontSize:18,marginBottom:5}}>यें महानगरपालिका</Text>
            <Text style={{color:'#fff',fontSize:18,marginBottom:30}}>Kathmandu Metropolitan City</Text>

            <Text style={{color:'#fff',fontSize:18,marginBottom:5}}>नेपाल COVID-19 निगरानी प्रणाली</Text>
            <Text style={{color:'#fff',fontSize:18,marginBottom:30}}>Nepal COVID-19 Surveillance System</Text>
        </View>
    </View>
    );

export default OnboardingLogo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1B7ED5',
    },

    box:{
        flexDirection: 'column',
        width:'90%',
        alignItems:'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    text:{
        color:'#db3b08'
    },

    containerBox:{
        padding: 10,
        paddingBottom:20,
        paddingTop:20,
        position:'absolute',
        top:'30%',
        justifyContent:'center',
        width: '90%',
        backgroundColor: '#fff',
        elevation: 4,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'black',
        shadowOpacity: 0.8,
        shadowRadius:10,
    },
    inputIcon:{
        width:30,
        height:30,
        marginLeft:15,

        alignSelf: 'flex-end'
    },
    buttonContainer: {
        height:60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:200,

    },
    loginButton: {
        position: 'absolute',
        top:0,
        left:0,
        backgroundColor: "#ff4b98",
    },
    forgotText:{
        position: 'absolute',
        bottom:20,



    },
    loginText: {
        color: 'white',
    },

});
