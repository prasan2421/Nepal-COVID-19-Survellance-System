module.exports = {
    dependencies: {

        'react-native-firebase': {
            platforms: {
                android: null, // disable Android platform, other platforms will still autolink if provided
            },
        },

        // 'react-native-background-job': {
        //     platforms: {
        //         android: null, // disable Android platform, other platforms will still autolink if provided
        //     },
        // },
    },
    assets: ['./assets/fonts/'], // stays the same
};
