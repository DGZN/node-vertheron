import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import hosts from './hosts';
import proxy from './proxy';

const rootReducer = combineReducers({
  hosts,
  proxy,
  routing
});

export default rootReducer;
