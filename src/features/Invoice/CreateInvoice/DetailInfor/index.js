import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react'
import ListInvoice from './ListInvoiceLine'
import DetailedInvoice from './DetailedInvoiceLine'

console.disableYellowBox = true;

const AppNavigator = createStackNavigator(
  {
    ListInvoice: {
      screen: (props) => {
        // console.log(props)
        return (<ListInvoice navigation={props.navigation} dataInvoice={props.screenProps} />)
      }
    },
    DetailedInvoice: { screen: DetailedInvoice }
  },
  {
    initialRouteName: 'ListInvoice',
    headerMode: 'none'
  }
)
export default createAppContainer(AppNavigator);
