import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import ListStatementLine from './ListStatementLine';
import DetailStatementLine from './DetailStatementLine';
import AddStatementLine from '../AddStatement/DetailStatementLine';

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
    DetailStatementLine: { screen: DetailStatementLine },
    AddStatementLine: { screen: AddStatementLine }
  },
  {
    initialRouteName: 'ListStatementLine',
    headerMode: 'none'
  }
);
export default createAppContainer(AppNavigator);
