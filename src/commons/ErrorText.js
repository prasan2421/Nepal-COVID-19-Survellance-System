import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';

export default class ErrorText extends Component {
	render() {
		if(this.props.text && this.props.text.trim()) {
			return (
				<Text style={[styles.text, this.props.style]}>{this.props.text}</Text>
			);
		}
		else {
			return null;
		}
	}
}

const styles = StyleSheet.create({
	text: {
		color: '#a94442',
		fontWeight: 'bold'
	}
});