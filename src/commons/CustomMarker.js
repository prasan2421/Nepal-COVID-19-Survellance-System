import React from 'react';
import { StyleSheet, Image } from 'react-native';

import {images} from "../constants/images";
class CustomMarker extends React.Component {
    render() {
        return (
            <Image
                style={styles.image}
                source={
                    this.props.pressed ? images.slider : images.slider
                }
                resizeMode="contain"
            />
        );
    }
}

const styles = StyleSheet.create({
    image: {
        height: 40,
        width: 40,
    },
});

export default CustomMarker;