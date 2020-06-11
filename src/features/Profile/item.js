import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFontXD, WIDTHXD, HEIGHTXD, getLineHeightXD } from '../../config';
import R from '../../assets/R';

export default ({ item, index }) => (
  <View
    style={styles.itemContainer}
    key={index}
  >
    <View style={styles.viewTxtTitle}>
      <Text style={styles.title}>
        {item.title}
      </Text>
    </View>
    <Text style={[styles.title, styles.infor]}>
      {item.value}
    </Text>
  </View>
)
const styles = StyleSheet.create({
  itemContainer: {
    width: WIDTHXD(1065),
    paddingVertical: HEIGHTXD(39),
    backgroundColor: R.colors.white,
    borderTopWidth: 0.5,
    borderTopColor: '#E6E6E6',
    flexDirection: 'row',
    paddingHorizontal: WIDTHXD(30),
    alignItems: 'center'
  },
  title: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(51),
    color: R.colors.grey400,
    fontFamily: R.fonts.RobotoRegular
  },
  viewTxtTitle: {
    width: WIDTHXD(300)
  },
  infor: {
    color: R.colors.black0,
    marginLeft: WIDTHXD(30),
    flex: 1
  }
});
