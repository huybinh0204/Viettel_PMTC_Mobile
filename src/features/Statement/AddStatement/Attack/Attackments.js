import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import ListFileAttackment from './ListFileAttackment';
import AttackmentInfo from './AttackmentInfo';
import AddStatementLine from '../../AddStatement/DetailStatementLine';

console.disableYellowBox = true;

const AppNavigator = createStackNavigator(
  {
    ListFileAttackment: {
      screen: screenProps => (
        <ListFileAttackment
          navigation={screenProps.navigation}
          setIsShowBtnSearch={screenProps.screenProps}
        />
      )
    },
    AttackmentInfo: { screen: AttackmentInfo }
  },
  {
    initialRouteName: 'ListFileAttackment',
    headerMode: 'none'
  }
);
export default createAppContainer(AppNavigator);
