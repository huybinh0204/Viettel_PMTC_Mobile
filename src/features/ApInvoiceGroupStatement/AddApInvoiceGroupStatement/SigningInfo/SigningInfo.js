import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import SigningInfo from './index';
import AttachmentInfo from '../Attack/AttachmentInfo';

console.disableYellowBox = true;

const AppNavigator = createStackNavigator(
  {
    ListFileAttackment: {
      screen: screenProps => (
        <SigningInfo
          id={screenProps.screenProps.id}
          navigation={screenProps.navigation}
          onViewAttackInSigningInfo={screenProps.screenProps.onViewAttackInSigningInfo}
        />
      )
    },
    AttachmentInfo: {
      screen: props => (
        <AttachmentInfo
          navigation={props.navigation}
          {...props}
        />)
    }
  },
  {
    initialRouteName: 'ListFileAttackment',
    headerMode: 'none'
  }
);
export default createAppContainer(AppNavigator);
