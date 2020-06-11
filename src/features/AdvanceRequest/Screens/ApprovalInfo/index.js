import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react'
import ListApproval from './ListApproval'
import Detail from './Details'


const AppNavigator = createStackNavigator(
  {
    ListApproval: {
      screen: (screenProps) => <ListApproval
        navigation={screenProps.navigation}
        id={screenProps.screenProps.id}
        color={screenProps.screenProps.color}
        returnData={screenProps.screenProps.returnData}
      />
    },
    ItemDetail: {
      screen: (screenProps) => <Detail
        navigation={screenProps.navigation}
        id={screenProps.screenProps.id}
        icPressMenu={screenProps.screenProps.icPressMenu}
        isPressMenu={screenProps.screenProps.isPressMenu}
        tabActive={screenProps.screenProps.tabActive}
        returnData={screenProps.screenProps.returnData}
      />
    },
  },
  {
    initialRouteName: 'ListApproval',
    headerMode: 'none'
  }
)
export default createAppContainer(AppNavigator);
