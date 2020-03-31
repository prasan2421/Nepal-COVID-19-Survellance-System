import React, { Component } from 'react';
import {
     View,
      Modal,
    ActivityIndicator,
    StyleSheet, Text,
} from 'react-native';


export default class ActivityIconLoad extends Component {
    render() {
        return (

            <View>

                    <View style={styles.mainContainer}>
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator
                                size="large"
                                color={this.props.indicatorColor}
                                style={styles.loadingIndicator}
                            />
                            <Text style={{color: this.props.messageColor}}>{this.props.message}</Text>
                        </View>
                    </View>

            </View>



        );
    }
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '85%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 3
    },
    loadingIndicator: {
        marginRight: 20
    }
});