import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { getFont, WIDTH, HEIGHT } from '../../config';


export default class Search extends React.PureComponent {
  render() {
    return (
      <View style={{ flex: 1, paddingHorizontal: WIDTH(20), paddingTop: HEIGHT(10), alignItems: 'center' }}>
        <Text style={styles.title}>
          Tìm kiếm
        </Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: getFont(17)
  },
})
