import { createStackNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import ListAttachment from './ListAttachment';
import AttachmentInfo from './AttachmentInfo';

console.disableYellowBox = true;

const Attachments = createStackNavigator(
  {
    ListAttachment: {
      screen: props => {
        // console.log(props)
        return (
          <ListAttachment
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
    initialRouteName: 'ListAttachment',
    headerMode: 'none'
  }
);
export default createAppContainer(Attachments);
