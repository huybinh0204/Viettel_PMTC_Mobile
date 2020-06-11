import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react'
import ListDetail from './ListDetail'
import Detail from './Detail'


const AppNavigator = createStackNavigator(
  {
    ListDetail: {
      screen: (screenProps) => <ListDetail
        navigation={screenProps.navigation}
        id={screenProps.screenProps.id}
        color={screenProps.screenProps.color}
        returnData={screenProps.screenProps.returnData}
      />
    },
    DetailedInvoice: {
      screen: (screenProps) => <Detail
        id={screenProps.screenProps.id}
        transDate={screenProps.screenProps.transDate}
        docstatus={screenProps.screenProps.docstatus}
        cDepartmentId={screenProps.screenProps.cDepartmentId}
        documentNo={screenProps.screenProps.documentNo}
        isFinish={screenProps.screenProps.isFinish}
        cBpartnerId={screenProps.screenProps.cBpartnerId}
        icPressMenu={screenProps.screenProps.icPressMenu}
        isPressMenu={screenProps.screenProps.isPressMenu}
        tabActive={screenProps.screenProps.tabActive}
        navigation={screenProps.navigation}
        returnData={screenProps.screenProps.returnData}
      />
    },
  },
  {
    initialRouteName: 'ListDetail',
    headerMode: 'none'
  }
)
export default createAppContainer(AppNavigator);
