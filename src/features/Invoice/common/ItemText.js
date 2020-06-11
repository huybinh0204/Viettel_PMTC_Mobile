import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import R from 'assets/R';
import { WIDTHXD, getFontXD, getLineHeightXD, HEIGHTXD } from '../../../config';

const ItemText = (props) => {
  const { title, label, width, paddingHorizontal } = props
  return (
    <View style={[styles.container, paddingHorizontal && { paddingHorizontal }]}>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.containerLabel, width && { width }]}>
        <Text style={[styles.label]}>{label}</Text>
      </View>
    </View>
  )
};

export default ItemText

const styles = StyleSheet.create({
  container: {
  },
  title: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(51),
    fontFamily: R.fonts.RobotoRegular,
    color: R.colors.label,
    marginBottom: HEIGHTXD(11),
    marginTop: HEIGHTXD(30),
  },
  label: {
    fontSize: getFontXD(42),
    lineHeight: getLineHeightXD(51),
    fontFamily: R.fonts.RobotoRegular
  },
  containerLabel: {
    height: HEIGHTXD(99),
    borderWidth: 0.3,
    borderColor: R.colors.iconGray,
    borderRadius: WIDTHXD(20),
    justifyContent: 'center',
    paddingHorizontal: WIDTHXD(36),
  }
})
