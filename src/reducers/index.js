import {combineReducers} from 'redux';
import {userState} from './userState'
import {recipienState} from './wmsState.js'
export default combineReducers({
    userState,
    recipienState
})
