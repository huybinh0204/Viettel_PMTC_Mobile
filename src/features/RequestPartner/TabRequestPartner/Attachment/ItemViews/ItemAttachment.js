import React from 'react';
import { View, StyleSheet, Text, } from 'react-native';
import R from 'assets/R';
import FastImage from 'react-native-fast-image';
import { WIDTHXD, HEIGHTXD, getFontXD } from '../../../../../config';


const listIcon = [
  { name: 'delete', bgrColor: '#DB1104', color: '#fff' }
]

export default (props) => {
  const { title, type } = props
  return (
    <View style={styles.mainContainer}>
      <View style={styles.containerItem}>
        <FastImage source={R.strings.fileTypeIcon[type].icon} style={styles.icon} resizeMode={FastImage.resizeMode.stretch} />
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  )
};
const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
    marginTop: HEIGHTXD(30),
  },
  containerItem: {
    width: WIDTHXD(1065),
    backgroundColor: R.colors.white,
    borderRadius: WIDTHXD(20),
    paddingLeft: WIDTHXD(30),
    paddingVertical: HEIGHTXD(25),
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: getFontXD(42),
    fontFamily: R.fonts.RobotoRegular,
    marginLeft: WIDTHXD(26),
  },
  icon: {
    width: WIDTHXD(56),
    height: HEIGHTXD(69)
  }
})
