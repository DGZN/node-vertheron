import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import hosts from './hosts';

const rootReducer = combineReducers({
  hosts,
  counter,
  routing
});

export default rootReducer;
