import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import ListFileAttachment from './ListFileAttachment';
import AttachmentInfo from './AttachmentInfo';

console.disableYellowBox = true;

const Attachments = createStackNavigator(
  {
    ListFileAttachment: {
      screen: props => {
        return (
          <ListFileAttachment
            navigation={props.navigation}
            {...props}
          />
        )
      }
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
    initialRouteName: 'ListFileAttachment',
    headerMode: 'none'
  }
);
export default createAppContainer(Attachments);
