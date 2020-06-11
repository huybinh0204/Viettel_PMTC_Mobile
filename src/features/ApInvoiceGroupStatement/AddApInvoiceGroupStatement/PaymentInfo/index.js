import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react'
import ListPayInfo from './ListPayInfo'
import Detail from './Detail'


const AppNavigator = createStackNavigator(
  {
    ListPayInfo: {
      screen: (screenProps) => <ListPayInfo
        navigation={screenProps.navigation}
        id={screenProps.screenProps.id}
        cDocumentTypeId={screenProps.screenProps.cDocumentTypeId}
        description={screenProps.screenProps.description}
        documentNo={screenProps.screenProps.documentNo}
        returnData={screenProps.screenProps.returnData}
      />
    },
    DetailedPayInfo: {
      screen: (screenProps) => <Detail
        navigation={screenProps.navigation}
        returnData={screenProps.screenProps.returnData}
      />
    },
  },
  {
    initialRouteName: 'ListPayInfo',
    headerMode: 'none'
  }
)
export default createAppContainer(AppNavigator);
