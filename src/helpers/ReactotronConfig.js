import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';

// eslint-disable-next-line no-undef
const dev = __DEV__;

function configure() {
  Reactotron.configure(
    {
      name: 'AIS Network',
      host: '192.168.1.177'
    }
  ) // controls connection & communication settings
    .useReactNative() // add all built-in react native plugins
    .use(sagaPlugin())
    .use(reactotronRedux());

  connectConsoleToReactotron();
  return Reactotron.connect();
}

function connectConsoleToReactotron() {
  if (!dev) return;
}

export default {
  configure,
};
