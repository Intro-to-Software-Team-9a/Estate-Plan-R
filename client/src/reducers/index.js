import { combineReducers } from 'redux';
import count from './count';
import accounts from './accounts';
import profiles from './profiles';
import templates from './templates';
import purchase from './purchase';

export default combineReducers({
  count,
  accounts,
  profiles,
  templates,
  purchase,
});
