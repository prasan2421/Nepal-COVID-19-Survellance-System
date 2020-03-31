import React, { Component } from 'react';
import {StyleSheet, Text, TextInput, TouchableHighlight, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ErrorText from "./ErrorText";

export default class NumberPicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value ? this.props.value : 0
		};
	}

	increaseValue = () => {
		this.setState({
			value: this.state.value + 1
		}, () => {
			if(this.props.onValueChange) {
				this.props.onValueChange(this.state.value);
			}
		});
	}
    updateValue=(text)=>{
		if (!isNaN(text)){
            this.setState({
                value: + text
            }, () => {
                if(this.props.onValueChange) {
                    this.props.onValueChange(this.state.value);
                }
            });
		}


	}

	decreaseValue = () => {
		if(this.state.value > 0) {
			this.setState({
				value: this.state.value - 1
			}, () => {
				if(this.props.onValueChange) {
					this.props.onValueChange(this.state.value);
				}
			});
		}
	}

	render() {
		let buttonColor = this.props.buttonColor ? this.props.buttonColor : '#d7d7d7';
		let iconColor = this.props.iconColor ? this.props.iconColor :'#9aff5e';
		let textColor = this.props.textColor ? this.props.textColor : '#000';

		return (
			<View style={[styles.container, this.props.style]}>
				<View style={[styles.touchableContainer, { backgroundColor: buttonColor }]}>
					<TouchableHighlight
						onPress={this.decreaseValue}
						activeOpacity={1}
		                underlayColor="rgba(0, 0, 0, 0.1)"
						style={styles.touchable}
					>
						<Icon
							name="md-remove-circle"
							size={24}
							color={iconColor}
						/>
					</TouchableHighlight>
				</View>

                <TextInput style={[styles.valueText, { color: textColor,borderWidth:1,borderColor:'#a9a9a9',padding:0 ,width:50}]}

						   value={''+this.state.value}
                           returnKeyType='done'
                           keyboardType={'numeric'}
                           autoCapitalize = 'none'
                           onChangeText={(text) => this.updateValue(text,'cell_number')}
				/>

                {/*<ErrorText text={this.state.cell_number_Error} />*/}

				{/*<Text style={[styles.valueText, { color: textColor }]}>{this.state.value}</Text>*/}

				<View style={[styles.touchableContainer, { backgroundColor: buttonColor }]}>
					<TouchableHighlight
						onPress={this.increaseValue}
						activeOpacity={1}
		                underlayColor="rgba(0, 0, 0, 0.1)"
						style={styles.touchable}
					>
						<Icon
							name="md-add-circle"
							size={24}
							color={iconColor}
						/>
					</TouchableHighlight>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		padding:5,

	},
	touchableContainer: {
		width: 30,
		height: 30,
		borderRadius: 15,
		overflow: 'hidden'
	},
	touchable: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	valueText: {

		textAlign: 'center'
	}
})