import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import ListPayment from './ListPayment';
import DetailPayment from './DetailPayment';

console.disableYellowBox = true;

const AppNavigator = createStackNavigator(
  {
    ListPayment: {
      screen: (screenProps) => <ListPayment
        navigation={screenProps.navigation}
        id={screenProps.screenProps.statementId}
      />
    },
    DetailPayment: {
      screen: (screenProps) => <DetailPayment
        navigation={screenProps.navigation}
        returnData={screenProps.screenProps.returnData}
      />
    },
  },
  {
    initialRouteName: 'ListPayment',
    headerMode: 'none'
  }
);
export default createAppContainer(AppNavigator);
