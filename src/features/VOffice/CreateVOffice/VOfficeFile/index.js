import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react'
import ListFile from './ListFile'
import DetailedInvoice from './DetailedInvoiceLine'
import AttachmentInfo from '../../../Invoice/CreateInvoice/Attachment/AttachmentInfo';

console.disableYellowBox = true;

const AppNavigator = createStackNavigator(
  {
    ListFile: { screen: (screenProps) => <ListFile navigation={screenProps.navigation} {...screenProps.screenProps} /> },
    AttachmentInfo: { screen: (screenProps) => <AttachmentInfo navigation={screenProps.navigation} {...screenProps.screenProps} /> }
  },
  {
    initialRouteName: 'ListFile',
    headerMode: 'none'
  }
)
export default createAppContainer(AppNavigator);
