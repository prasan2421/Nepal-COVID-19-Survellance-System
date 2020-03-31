import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

const OuterDrawerItem = ({ label, onPress }) => (

    <TouchableOpacity
        onPress={onPress}
        style={{
            paddingTop: 21,
            paddingBottom: 16,
            paddingLeft: 15,
            paddingRight: 10,
        }}
    >
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
            }}
        >
            <View  style={{
                flexDirection: 'row',

            }}>
                <Icon name="md-list-box" size={22} color="#000" style={{}}/>
                <Text style={{  marginLeft: 20,color:'#494949',fontWeight:'bold'}}>{label}</Text>
            </View>

            <Icon name="md-arrow-round-forward" size={25} color="#494949" style={{  marginRight: 10}}/>
        </View>
    </TouchableOpacity>
);

export default OuterDrawerItem;