import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react'
import Home from './index'
import SoLieuChiTiet from './SoLieuChiTiet'

console.disableYellowBox = true;

const AppNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    SoLieuChiTiet: { screen: SoLieuChiTiet }
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
)
export default createAppContainer(AppNavigator);
