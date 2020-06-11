/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format

 */

import React, { Component } from 'react';
import { View } from 'react-native'
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import Reactotron from 'reactotron-react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { Root } from 'native-base';

import MainNavigation from 'routers/MainNavigation';
import R from 'assets/R';
import { WIDTHXD, HEIGHTXD } from './src/config';
import DropdownManager from './src/common/DropdownAlert/DropdownManager';
import LoadingModal from './src/common/Loading/LoadingModal';
import LoadingManager from './src/common/Loading/LoadingManager';
import NavigationService from './src/routers/NavigationService';
import RootView from './src/RootView';

import configureStore from './src/stores/configureStore';
import rootSaga from './src/sagas';
import ReactotronConfig from './src/helpers/ReactotronConfig';


const reactotron = ReactotronConfig.configure();

const sagaMonitor = Reactotron.createSagaMonitor();
const sagaMiddleware = createSagaMiddleware({ sagaMonitor });

const store = configureStore(reactotron, sagaMiddleware);
Reactotron.clear();

sagaMiddleware.run(rootSaga);

export default class App extends Component {
  // componentDidMount() {
  //   LoadingManager.register(this.loadingRef);
  //   DropdownManager.register(this.dropDownAlertRef);
  // }

  // componentWillUnmount() {
  //   LoadingManager.unregister(this.loadingRef);
  //   DropdownManager.unregister(this.dropDownAlertRef);
  // }

  render() {
    return (
      <Provider store={store}>
        <Root>
          <RootView>
            <MainNavigation
              ref={navigatorRef => NavigationService.setTopLevelNavigator(navigatorRef)}
            />
            {/* <LoadingModal
              ref={ref => {
                this.loadingRef = ref;
              }}
            />
            <DropdownAlert
              inactiveStatusBarBackgroundColor={R.colors.colorMain}
              activeStatusBarBackgroundColor={R.colors.colorMain}
              successImageSrc={R.images.iconSuccess}
              titleStyle={{ color: '#fff' }}
              messageStyle={{ color: '#fff' }}
              warnImageSrc={R.images.warnIcon}
              errorImageSrc={R.images.iconError}
              infoImageSrc={R.images.iconNotification}
              closeInterval={1000}
              ref={ref => {
                this.dropDownAlertRef = ref;
              }}
              warnColor={R.colors.orange400}
              defaultContainer={{
                borderBottomRightRadius: WIDTHXD(30),
                borderBottomLeftRadius: WIDTHXD(30),
                paddingTop: HEIGHTXD(30),
                paddingVertical: HEIGHTXD(30),
                paddingHorizontal: WIDTHXD(20)
              }}
            /> */}
          </RootView>
        </Root>
      </Provider>
    );
  }
}
