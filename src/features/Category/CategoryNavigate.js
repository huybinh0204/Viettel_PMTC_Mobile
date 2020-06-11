import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react'
import CategoryScreen from './index'
import Profile from '../Profile/index'


const AppNavigator = createStackNavigator(
  {
    Category: {
      screen: (screenProps) =>{
        console.log(screenProps);
        return <CategoryScreen
        navigation={screenProps.navigation}
        {...propscreenPropss}
        />}
    },
    Profile: {
      screen: (props) => <Profile
        navigation={props.navigation}
        {...props}
        />
    },
  },
  {
    initialRouteName: 'Category',
    headerMode: 'none'
  }
)
export default createAppContainer(AppNavigator);
