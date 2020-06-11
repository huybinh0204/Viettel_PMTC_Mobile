import { applyMiddleware, createStore } from 'redux';
import rootReducer from '../reducers';

export default function configureStore(reactotron, sagaMiddleware) {
  return createStore(rootReducer, applyMiddleware(sagaMiddleware));
}
