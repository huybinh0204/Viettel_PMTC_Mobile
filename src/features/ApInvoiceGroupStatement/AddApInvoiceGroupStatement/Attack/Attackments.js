import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import ListFileAttackment from './ListFileAttackment';
import AttachmentInfo from './AttachmentInfo';

console.disableYellowBox = true;

const AppNavigator = createStackNavigator(
  {
    ListFileAttackment: {
      screen: screenProps => (
        <ListFileAttackment
          recordId={screenProps.screenProps.id}
          isReadOnly={screenProps.screenProps.isReadOnly}
          refreshAttackList={screenProps.screenProps.refreshAttackList}
          onAttachmentTabChange={screenProps.screenProps.onAttachmentTabChange}
          navigation={screenProps.navigation}
          setIsShowBtnSearch={screenProps.screenProps}
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
