import React from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import ListAttack from './ListAttack'

const AppNavigator = createStackNavigator(
  {
    ListAttack: {
      screen: (screenProps) => <ListAttack
        navigation={screenProps.navigation}
        id={screenProps.screenProps.id}
      />
    },
  },
  {
    initialRouteName: 'ListAttack',
    headerMode: 'none'
  }
)

export default createAppContainer(AppNavigator)
