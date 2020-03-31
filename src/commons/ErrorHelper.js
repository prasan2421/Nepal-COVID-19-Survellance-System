import VersionNumber from "react-native-version-number";import Url from "../constants/Url";


export default {
    logError: (response1,url1,method1,access_token) => {
        response1.text()
        .then(responseText => {
            fetch(Url.baseUrl+'error-logs', {
                method:'POST',
                headers: {
                    'x-auth': access_token,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({

                    url: url1,
                    method: method1,
                    status_code: response1.status,
                    body: responseText
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                // alert(JSON.stringify(responseJson));
            })
            .catch((error) => {
                // alert(error);
            })
        })
    },

};
