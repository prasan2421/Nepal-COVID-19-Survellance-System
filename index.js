/**
 * @format
 * * @lint-ignore-every XPLATJSCOPYRIGHT1
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
// import Attendance from './Attendance';
import App from './App';
import {name as appName} from './app.json';


AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerHeadlessTask('Attendance', () => require('./Attendance'));
