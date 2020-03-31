import React, { Component } from 'react';
import {StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SessionHelper from "./SessionHelper";

export default class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count:''
        };
    }
    componentDidMount() {
        // this.loadCart();
    }

    loadCart = () => {
        SessionHelper.getCartJson()
            .then(cartJson => {
                let cart = '';
                // let total = 0;

                if(cartJson) {
                    try {
                        cart = JSON.parse(cartJson).length;
                    }
                    catch(e) {
                    }
                }
                this.setState({
                    cart,
                    // total
                });
            });
    }

    render() {
        return (

            <View style={{
                backgroundColor: '#ff0b00',
                height: 15,
                width: 15,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
                right: -8,
                zIndex: 1
            }}><Text style={{color: '#fff', fontSize: 10}}>
                {this.props.cart}
                {/*{this.props.onPress}*/}
            </Text></View>
        );
    }
}

const styles = StyleSheet.create({

});