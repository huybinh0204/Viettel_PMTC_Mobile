import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import ListStatementLine from './ListStatementLine';
import AddStatementLine from './DetailStatementLine';
import DetailStatementLine from '../DetailStatement/DetailStatementLine';

console.disableYellowBox = true;

const AppNavigator = createStackNavigator(
  {
    ListStatementLine: {
      screen: screenProps => (
        <ListStatementLine
          navigation={screenProps.navigation}
          setIsShowBtnSearch={screenProps.screenProps}
        />
      )
    },
    AddStatementLine: { screen: AddStatementLine },
    DetailStatementLine: {
      screen: screenProps => (
        <DetailStatementLine
          navigation={screenProps.navigation}
          onSumitStatusStatement={screenProps.screenProps}
        />
      )
    }
    // DetailStatementLine: { screen: DetailStatementLine }
  },
  {
    initialRouteName: 'ListStatementLine',
    headerMode: 'none'
  }
);
export default createAppContainer(AppNavigator);
