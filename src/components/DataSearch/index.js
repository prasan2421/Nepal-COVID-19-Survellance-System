import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';

// import DataSearch from './DataSearchView';
import { DEFAULT_COLORS } from './../helpers';

const styles = StyleSheet.create({
    headerSpacer: {
        paddingTop: StatusBar.currentHeight,
        backgroundColor: DEFAULT_COLORS.primary,
    },
});

export const Basic = ({ navigation }) => (
    <View style={{ flex: 1 }}>
        <View style={styles.headerSpacer} />
        <Text>dummy1</Text>
    </View>
);

export const WithIconPosition = ({ navigation }) => (
    <View style={{ flex: 1 }}>
        <View style={styles.headerSpacer} />
        <Text>dummy2</Text>
    </View>
);

