import { combineReducers } from 'redux';
import { userReducers } from './userReducers';
import { locationReducers } from './locationReducers';
import { invoiceReducer } from './invoiceReducer';
import { advanceRequestReducer } from './advanceRequestReducer';
import { statementRuducer } from './statementRuducer';
import { vOfficeReducer } from './vOfficeReducer';
import { invoiceGroupReducer } from './invoiceGroupReducer';

const rootReducers = combineReducers({
  userReducers,
  locationReducers,
  invoiceReducer,
  advanceRequestReducer,
  statementRuducer,
  vOfficeReducer,
  invoiceGroupReducer
});

export default rootReducers;
