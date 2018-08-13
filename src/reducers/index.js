import {combineReducers} from 'redux';
import {userState} from './userState'
import {recipienState} from './wmsState.js'
import {systemState} from './systemState.js'
export default combineReducers({
    userState,
    recipienState,
    systemState
})
