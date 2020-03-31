import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class CheckBox extends Component {
    render() {
        let color = '#000';

        if(this.props.checked && this.props.checkedColor) {
            color = this.props.checkedColor;
        }
        else if(!this.props.checked && this.props.uncheckedColor) {
            color = this.props.uncheckedColor;
        }

        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={styles.touchable}
            >
                <View style={styles.container}>
                    <Icon
                        name={this.props.checked ? 'md-checkbox' : 'md-square-outline'}
                        size={28}
                        color={color}
                        style={styles.icon}
                    />
                    <Text>{this.props.text}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    touchable: {
        marginTop: 5,
        marginBottom: 5
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginRight: 5
    }
});